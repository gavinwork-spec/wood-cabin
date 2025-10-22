// 性能测试脚本
class PerformanceTest {
    constructor() {
        this.results = {};
        this.startTime = performance.now();
        this.init();
    }

    init() {
        // 等待页面完全加载后进行测试
        window.addEventListener('load', () => {
            setTimeout(() => this.runPerformanceTests(), 2000);
        });
    }

    runPerformanceTests() {
        console.log('🚀 开始性能测试...');

        this.testPageLoadTime();
        this.testRenderTime();
        this.testResourceLoading();
        this.testCSSPerformance();
        this.testImageOptimization();
        this.generateReport();
    }

    testPageLoadTime() {
        const navigation = performance.getEntriesByType('navigation')[0];
        const loadTime = navigation.loadEventEnd - navigation.startTime;

        this.results.pageLoadTime = {
            value: loadTime.toFixed(0),
            unit: 'ms',
            rating: this.rateLoadTime(loadTime),
            details: {
                domContentLoaded: (navigation.domContentLoadedEventEnd - navigation.startTime).toFixed(0),
                domComplete: (navigation.domComplete - navigation.startTime).toFixed(0)
            }
        };

        console.log(`📄 页面加载时间: ${loadTime.toFixed(0)}ms ${this.rateLoadTime(loadTime)}`);
    }

    testRenderTime() {
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        const lcp = this.getLCP();

        this.results.renderTime = {
            fcp: fcp ? parseFloat(fcp.startTime.toFixed(0)) : null,
            lcp: lcp ? parseFloat(lcp.toFixed(0)) : null
        };

        console.log(`🎨 首次内容绘制: ${fcp ? fcp.startTime.toFixed(0) + 'ms' : 'N/A'}`);
        console.log(`🖼️ 最大内容绘制: ${lcp ? lcp.toFixed(0) + 'ms' : 'N/A'}`);
    }

    testResourceLoading() {
        const resources = performance.getEntriesByType('resource');
        const cssFiles = resources.filter(r => r.initiatorType === 'link' && r.name.includes('.css'));
        const jsFiles = resources.filter(r => r.initiatorType === 'script');
        const images = resources.filter(r => r.initiatorType === 'img');

        this.results.resources = {
            total: resources.length,
            cssFiles: cssFiles.length,
            jsFiles: jsFiles.length,
            images: images.length,
            cssOptimized: cssFiles.length <= 2, // 优化后应该只有1-2个CSS文件
            totalSize: this.calculateTotalSize(resources)
        };

        console.log(`📦 资源统计: 总计${resources.length}个 (CSS: ${cssFiles.length}, JS: ${jsFiles.length}, 图片: ${images.length})`);
        console.log(`✅ CSS优化: ${cssFiles.length <= 2 ? '通过' : '需要改进'}`);
    }

    testCSSPerformance() {
        // 测试关键CSS是否在首屏
        const criticalCSSLoaded = document.querySelector('link[href*="critical.css"]');
        const combinedCSSLoaded = document.querySelector('link[href*="woodencabin-combined.css"]');

        this.results.cssPerformance = {
            criticalCSS: !!criticalCSSLoaded,
            combinedCSS: !!combinedCSSLoaded,
            optimized: criticalCSSLoaded && combinedCSSLoaded
        };

        console.log(`🎨 CSS性能: 关键CSS ${criticalCSSLoaded ? '✅' : '❌'}, 合并CSS ${combinedCSSLoaded ? '✅' : '❌'}`);
    }

    testImageOptimization() {
        const images = document.querySelectorAll('img');
        const imagesWithAlt = Array.from(images).filter(img => img.alt);
        const imagesWithLoading = Array.from(images).filter(img => img.loading);
        const lazyLoadedImages = Array.from(images).filter(img => img.classList.contains('lazy-load'));

        this.results.imageOptimization = {
            total: images.length,
            withAlt: imagesWithAlt.length,
            withLoading: imagesWithLoading.length,
            lazyLoaded: lazyLoadedImages.length,
            altPercent: ((imagesWithAlt.length / images.length) * 100).toFixed(1),
            loadingOptimized: imagesWithLoading.length > 0
        };

        console.log(`🖼️ 图片优化: ${images.length}张图片, ${imagesWithAlt.length}张有alt属性 (${((imagesWithAlt.length / images.length) * 100).toFixed(1)}%)`);
        console.log(`⚡ 延迟加载: ${lazyLoadedImages.length}张图片设置了延迟加载`);
    }

    getLCP() {
        // 简化的LCP计算
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            return lastEntry.startTime;
        });

        // 如果没有observer支持，返回null
        return null;
    }

    calculateTotalSize(resources) {
        // 简化计算，实际应用中需要从响应头获取大小
        return '估算中...';
    }

    rateLoadTime(time) {
        if (time < 2000) return '优秀 ⭐⭐⭐';
        if (time < 3000) return '良好 ⭐⭐';
        if (time < 5000) return '一般 ⭐';
        return '需要优化 ❌';
    }

    generateReport() {
        console.log('\n📊 性能测试报告');
        console.log('='.repeat(50));

        // 页面性能评分
        const pageScore = this.calculatePageScore();
        console.log(`🏆 总体评分: ${pageScore}/100`);

        // 详细建议
        this.generateRecommendations();

        // 保存结果
        this.saveResults();
    }

    calculatePageScore() {
        let score = 100;

        // 页面加载时间 (40分)
        if (this.results.pageLoadTime) {
            const loadTime = parseFloat(this.results.pageLoadTime.value);
            if (loadTime > 5000) score -= 40;
            else if (loadTime > 3000) score -= 25;
            else if (loadTime > 2000) score -= 10;
        }

        // CSS优化 (20分)
        if (this.results.cssPerformance && !this.results.cssPerformance.optimized) {
            score -= 20;
        }

        // 资源优化 (20分)
        if (this.results.resources) {
            if (this.results.resources.cssFiles > 3) score -= 10;
            if (this.results.resources.total > 50) score -= 10;
        }

        // 图片优化 (20分)
        if (this.results.imageOptimization) {
            const altPercent = parseFloat(this.results.imageOptimization.altPercent);
            if (altPercent < 90) score -= (90 - altPercent) / 4.5; // 最多扣20分
        }

        return Math.max(0, Math.round(score));
    }

    generateRecommendations() {
        console.log('\n💡 优化建议:');

        if (this.results.pageLoadTime && parseFloat(this.results.pageLoadTime.value) > 3000) {
            console.log('⚠️  页面加载时间较长，建议进一步优化资源');
        }

        if (this.results.resources && this.results.resources.cssFiles > 3) {
            console.log('⚠️  CSS文件过多，建议合并CSS文件');
        }

        if (this.results.imageOptimization && parseFloat(this.results.imageOptimization.altPercent) < 100) {
            console.log('⚠️  部分图片缺少alt属性，影响可访问性和SEO');
        }

        if (!this.results.cssPerformance || !this.results.cssPerformance.optimized) {
            console.log('⚠️  CSS性能优化未完全实施');
        }

        console.log('✅ 继续监控Core Web Vitals指标');
    }

    saveResults() {
        const timestamp = new Date().toISOString();
        const reportData = {
            timestamp,
            url: window.location.href,
            userAgent: navigator.userAgent,
            results: this.results,
            score: this.calculatePageScore()
        };

        // 保存到localStorage
        localStorage.setItem('performance_test_report', JSON.stringify(reportData));
        console.log('📋 测试结果已保存到localStorage');
    }
}

// 运行性能测试
const performanceTest = new PerformanceTest();