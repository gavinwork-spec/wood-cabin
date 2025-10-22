// 性能监控脚本 - Web Vitals和Core Web Vitals监控

class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        // 监控页面加载性能
        if ('PerformanceObserver' in window) {
            this.observeWebVitals();
            this.observeNavigationTiming();
        }

        // 页面加载完成后的综合分析
        window.addEventListener('load', () => {
            setTimeout(() => this.analyzePageLoad(), 1000);
        });
    }

    observeWebVitals() {
        // LCP (Largest Contentful Paint)
        const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log(`LCP: ${lastEntry.startTime.toFixed(2)}ms`);

            // 如果LCP > 2.5s，记录警告
            if (lastEntry.startTime > 2500) {
                console.warn('⚠️ LCP 超过2.5s，影响用户体验');
            }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // FID (First Input Delay)
        const fidObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (entry.name === 'first-input') {
                    console.log(`FID: ${entry.processingStart - entry.startTime.toFixed(2)}ms`);
                }
            });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // CLS (Cumulative Layout Shift)
        let clsScore = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
            entryList.getEntries().forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsScore += entry.value;
                    console.log(`CLS: ${clsScore.toFixed(3)}`);
                }
            });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
    }

    observeNavigationTiming() {
        const navObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const navEntry = entries[0];

            if (navEntry) {
                const metrics = {
                    dns: navEntry.domainLookupEnd - navEntry.domainLookupStart,
                    connect: navEntry.connectEnd - navEntry.connectStart,
                    ssl: navEntry.secureConnectionStart ? navEntry.connectEnd - navEntry.secureConnectionStart : 0,
                    ttfb: navEntry.responseStart - navEntry.requestStart,
                    download: navEntry.responseEnd - navEntry.responseStart,
                    total: navEntry.loadEventEnd - navEntry.navigationStart
                };

                console.log('📊 Navigation Timing:', metrics);
            }
        });
        navObserver.observe({ entryTypes: ['navigation'] });
    }

    analyzePageLoad() {
        // 综合页面加载分析
        const perfData = performance.getEntriesByType('navigation')[0];

        if (perfData) {
            const loadTime = perfData.loadEventEnd - perfData.startTime;
            const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.startTime;

            console.log('📈 页面性能分析:');
            console.log(`   Total Load Time: ${loadTime.toFixed(0)}ms`);
            console.log(`   DOM Content Loaded: ${domContentLoaded.toFixed(0)}ms`);

            // 性能评级
            if (loadTime < 2000) {
                console.log('   ✅ 页面加载速度优秀');
            } else if (loadTime < 3000) {
                console.log('   ⚠️ 页面加载速度良好');
            } else {
                console.log('   ❌ 页面加载速度需要优化');
            }

            // 资源加载统计
            const resources = performance.getEntriesByType('resource');
            console.log(`   📦 加载资源数量: ${resources.length}`);

            // 按类型分组统计
            const resourceTypes = {};
            resources.forEach(resource => {
                const type = resource.initiatorType || 'other';
                resourceTypes[type] = (resourceTypes[type] || 0) + 1;
            });

            console.log('   📋 资源类型分布:');
            Object.entries(resourceTypes).forEach(([type, count]) => {
                console.log(`      ${type}: ${count}`);
            });
        }
    }
}

// 初始化性能监控
const performanceMonitor = new PerformanceMonitor();
