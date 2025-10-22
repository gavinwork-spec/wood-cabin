// 延迟加载优化脚本 - 智能图片和资源加载

class LazyLoadingOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // 图片延迟加载
        this.setupImageLazyLoading();

        // 视口内图片预加载
        this.setupViewportImagePreloading();

        // 背景图片延迟加载
        this.setupBackgroundLazyLoading();
    }

    setupImageLazyLoading() {
        // Intersection Observer for lazy loading
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;

                        // 如果有data-src属性，设置真实src
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                        }

                        // 添加加载完成事件
                        img.addEventListener('load', () => {
                            img.classList.add('loaded');
                        });

                        img.addEventListener('error', () => {
                            img.classList.add('error');
                            // 尝试加载备用图片
                            if (img.dataset.fallback) {
                                img.src = img.dataset.fallback;
                            }
                        });

                        // 停止观察已加载的图片
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px', // 提前50px开始加载
                threshold: 0.1
            });

            // 观察所有带有lazy-load类的图片
            document.querySelectorAll('img.lazy-load').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    setupViewportImagePreloading() {
        // 预加载首屏图片
        const viewportImages = document.querySelectorAll('img[loading="eager"]');

        viewportImages.forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
            }
        });
    }

    setupBackgroundLazyLoading() {
        // 背景图片延迟加载
        if ('IntersectionObserver' in window) {
            const bgObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;

                        if (element.dataset.bgImage) {
                            element.style.backgroundImage = \`url(\${element.dataset.bgImage})\`;
                            element.classList.add('bg-loaded');
                        }

                        observer.unobserve(element);
                    }
                });
            }, {
                rootMargin: '50px',
                threshold: 0.1
            });

            // 观察带有lazy-bg类的元素
            document.querySelectorAll('.lazy-bg').forEach(element => {
                bgObserver.observe(element);
            });
        }
    }
}

// 初始化延迟加载优化
document.addEventListener('DOMContentLoaded', () => {
    new LazyLoadingOptimizer();
});
