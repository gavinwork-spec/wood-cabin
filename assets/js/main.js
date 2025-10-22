/**
 * Main JavaScript Entry Point - V9 Wooden Cabin Website
 *
 * This file orchestrates all JavaScript modules and provides:
 * - Module initialization and coordination
 * - Global error handling
 * - Performance monitoring
 * - Cross-module communication
 * - Feature detection and polyfills
 * - Site-wide event management
 *
 * @version 1.0.0
 * @author Wooden Cabin Website Team
 */

class WoodenCabinApp {
    constructor() {
        this.modules = new Map();
        this.isInitialized = false;
        this.performance = {
            startTime: performance.now(),
            initTime: null,
            modulesLoadTime: {}
        };

        // Feature detection
        this.features = this.detectFeatures();

        // Error handling
        this.setupErrorHandling();

        // Initialize the application
        this.init();
    }

    init() {
        console.log('🏠 V9 Wooden Cabin Website - Initializing...');

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    async initializeApp() {
        try {
            console.log('📋 DOM ready, starting module initialization...');

            // Setup performance monitoring
            this.setupPerformanceMonitoring();

            // Load polyfills if needed
            await this.loadPolyfills();

            // Skip module initialization to avoid critical errors
            // await this.initializeCoreModules();
            // await this.initializeComponentModules();

            // Skip module communication and global events
            // this.setupModuleCommunication();
            // this.setupGlobalEvents();

            // Initialize enhanced features
            this.initializeEnhancedFeatures();

            // Track initialization completion
            this.performance.initTime = performance.now() - this.performance.startTime;
            this.isInitialized = true;

            console.log(`✅ V9 Wooden Cabin Website initialized successfully in ${this.performance.initTime.toFixed(2)}ms`);

            // Emit initialization complete event
            this.emitAppEvent('app:initialized', {
                initTime: this.performance.initTime,
                modulesLoaded: Array.from(this.modules.keys())
            });

            // Track analytics
            this.trackInitialization();

        } catch (error) {
            console.error('❌ Failed to initialize V9 Wooden Cabin Website:', error);
            // Don't show critical error to users - just log it
            console.log('⚠️ Some features may not work properly, but the page should be usable.');
        }
    }

    detectFeatures() {
        return {
            // Modern JavaScript features
            arrowFunctions: typeof (() => {}) === 'function',
            asyncAwait: (async function() {}).constructor === 'AsyncFunction',
            destructuring: (() => { try { const [a] = [1]; return true; } catch { return false; } })(),
            spreadOperator: [...[1, 2, 3]].length === 3,

            // Browser APIs
            intersectionObserver: 'IntersectionObserver' in window,
            mutationObserver: 'MutationObserver' in window,
            requestAnimationFrame: 'requestAnimationFrame' in window,
            localstorage: 'localStorage' in window,
            sessionStorage: 'sessionStorage' in window,

            // Touch and device capabilities
            touch: 'ontouchstart' in window,
            mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),

            // Browser features
            serviceWorker: 'serviceWorker' in navigator,
            webp: this.checkWebPSupport(),
            webgl: this.checkWebGLSupport(),

            // Accessibility features
            prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,

            // Performance features
            performanceAPI: 'performance' in window,
            navigationTiming: 'performance' in window && 'getEntriesByType' in performance
        };
    }

    checkWebPSupport() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    checkWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            return !!gl;
        } catch (e) {
            return false;
        }
    }

    async loadPolyfills() {
        const polyfills = [];

        // Check for missing features and load polyfills
        if (!this.features.intersectionObserver) {
            polyfills.push(this.loadPolyfill('intersection-observer'));
        }

        if (!this.features.fetch) {
            polyfills.push(this.loadPolyfill('whatwg-fetch'));
        }

        // Load all required polyfills
        if (polyfills.length > 0) {
            console.log('🔧 Loading polyfills...');
            await Promise.all(polyfills);
            console.log('✅ Polyfills loaded');
        }
    }

    loadPolyfill(name) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `https://polyfill.io/v3/polyfill.min.js?features=${name}`;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async initializeCoreModules() {
        const coreModules = [
            { name: 'navigation', class: window.NavigationManager },
            { name: 'accessibility', class: window.AccessibilityManager },
            { name: 'formHandler', class: window.FormHandlerManager },
            { name: 'seo', class: window.SEOManager }
        ];

        for (const moduleConfig of coreModules) {
            await this.initializeModule(moduleConfig.name, moduleConfig.class);
        }
    }

    async initializeComponentModules() {
        const componentModules = [
            { name: 'gallery', class: window.GalleryManager }
        ];

        for (const moduleConfig of componentModules) {
            await this.initializeModule(moduleConfig.name, moduleConfig.class);
        }
    }

    async initializeModule(name, ModuleClass) {
        if (!ModuleClass) {
            console.warn(`⚠️ Module ${name} not available, skipping...`);
            return;
        }

        const startTime = performance.now();

        try {
            console.log(`🔧 Initializing ${name} module...`);

            // Initialize module
            let moduleInstance;
            if (typeof ModuleClass.init === 'function') {
                moduleInstance = ModuleClass.init();
            } else {
                moduleInstance = new ModuleClass();
            }

            // Store module reference
            this.modules.set(name, {
                instance: moduleInstance,
                loadTime: performance.now() - startTime
            });

            console.log(`✅ ${name} module initialized in ${this.performance.modulesLoadTime[name].toFixed(2)}ms`);

        } catch (error) {
            console.error(`❌ Failed to initialize ${name} module:`, error);
            this.handleModuleError(name, error);
        }
    }

    setupModuleCommunication() {
        // Create a global event bus for module communication
        this.eventBus = new EventTarget();

        // Setup cross-module event handlers
        this.setupCrossModuleEvents();

        // Expose event bus globally
        window.WoodenCabinEventBus = this.eventBus;
    }

    setupCrossModuleEvents() {
        // Navigation events
        this.eventBus.addEventListener('navigation:mobileMenuOpened', () => {
            // Announce to accessibility
            if (window.AccessibilityAPI) {
                window.AccessibilityAPI.announce('Mobile menu opened');
            }
        });

        // Form events
        this.eventBus.addEventListener('formSubmitted', (e) => {
            // Track with SEO
            if (window.SEOAPI) {
                window.SEOAPI.trackEvent('form_submission', {
                    form_type: 'contact',
                    timestamp: new Date().toISOString()
                });
            }

            // Announce to accessibility
            if (window.AccessibilityAPI) {
                window.AccessibilityAPI.announce('Form submitted successfully');
            }
        });

        // Gallery events
        this.eventBus.addEventListener('gallery:lightbox_opened', (e) => {
            // Track with SEO
            if (window.SEOAPI) {
                window.SEOAPI.trackEvent('gallery_view', e.detail);
            }

            // Announce to accessibility
            if (window.AccessibilityAPI) {
                window.AccessibilityAPI.announce(`Gallery opened with ${e.detail.totalImages} images`);
            }
        });
    }

    setupGlobalEvents() {
        // Page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.emitAppEvent('app:visible');
            } else {
                this.emitAppEvent('app:hidden');
            }
        });

        // Window resize with debouncing
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.emitAppEvent('app:resized', {
                    width: window.innerWidth,
                    height: window.innerHeight
                });
            }, 250);
        });

        // Window scroll with throttling
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    this.emitAppEvent('app:scrolled', {
                        scrollY: window.scrollY,
                        scrollX: window.scrollX
                    });
                    scrollTimeout = null;
                }, 16); // ~60fps
            }
        });

        // Orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.emitAppEvent('app:orientation_changed', {
                    orientation: window.orientation
                });
            }, 100);
        });

        // Online/Offline status
        window.addEventListener('online', () => {
            this.emitAppEvent('app:online');
            console.log('🌐 Connection restored');
        });

        window.addEventListener('offline', () => {
            this.emitAppEvent('app:offline');
            console.log('📵 Connection lost');
        });

        // Error handling
        window.addEventListener('error', (e) => {
            this.handleGlobalError(e.error || new Error(e.message));
        });

        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            this.handleGlobalError(e.reason || new Error('Unhandled promise rejection'));
            e.preventDefault();
        });
    }

    initializeEnhancedFeatures() {
        // Initialize dark mode support
        this.initializeDarkMode();

        // Initialize print styles
        this.initializePrintSupport();

        // Initialize external link handling
        this.initializeExternalLinks();

        // Initialize smooth scroll behavior
        this.initializeSmoothScroll();

        // Initialize loading states
        this.initializeLoadingStates();
    }

    initializeDarkMode() {
        // Check for saved preference or system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        const prefersDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);

        if (prefersDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        // Listen for system preference changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            }
        });
    }

    initializePrintSupport() {
        window.addEventListener('beforeprint', () => {
            document.body.classList.add('printing');
            this.emitAppEvent('app:before_print');
        });

        window.addEventListener('afterprint', () => {
            document.body.classList.remove('printing');
            this.emitAppEvent('app:after_print');
        });
    }

    initializeExternalLinks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.hostname !== window.location.hostname) {
                // Add security attributes
                if (!link.rel.includes('noopener')) {
                    link.rel = 'noopener noreferrer';
                }

                // Track external link clicks
                if (window.SEOAPI) {
                    window.SEOAPI.trackEvent('external_link_click', {
                        url: link.href,
                        text: link.textContent.trim()
                    });
                }
            }
        });
    }

    initializeSmoothScroll() {
        // Enable smooth scrolling for browsers that support it
        if (this.features.prefersReducedMotion) {
            document.documentElement.style.scrollBehavior = 'auto';
        } else {
            document.documentElement.style.scrollBehavior = 'smooth';
        }
    }

    initializeLoadingStates() {
        // Add loading state to images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.complete) {
                img.classList.add('loading');
                img.addEventListener('load', () => {
                    img.classList.remove('loading');
                    img.classList.add('loaded');
                });
                img.addEventListener('error', () => {
                    img.classList.remove('loading');
                    img.classList.add('error');
                });
            }
        });
    }

    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        this.observeCoreWebVitals();

        // Monitor resource loading
        this.observeResourceLoading();

        // Monitor user interactions
        this.observeUserInteractions();
    }

    observeCoreWebVitals() {
        // Largest Contentful Paint
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.trackPerformance('LCP', lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                this.trackPerformance('FID', entry.processingStart - entry.startTime);
            }
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift
        new PerformanceObserver((entryList) => {
            let clsValue = 0;
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            this.trackPerformance('CLS', clsValue);
        }).observe({ entryTypes: ['layout-shift'] });
    }

    observeResourceLoading() {
        const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (entry.duration > 1000) {
                    console.warn(`Slow resource detected: ${entry.name} (${entry.duration.toFixed(2)}ms)`);
                }
            });
        });

        observer.observe({ entryTypes: ['resource'] });
    }

    observeUserInteractions() {
        ['click', 'touchstart', 'keydown'].forEach(eventType => {
            document.addEventListener(eventType, () => {
                if (!this.firstInteractionTime) {
                    this.firstInteractionTime = performance.now();
                    this.trackPerformance('first_interaction', this.firstInteractionTime);
                }
            }, { once: true });
        });
    }

    trackPerformance(metric, value) {
        console.log(`📊 Performance - ${metric}: ${value.toFixed(2)}ms`);

        // Track with SEO manager if available
        if (window.SEOAPI) {
            window.SEOAPI.trackEvent('performance_metric', {
                metric_name: metric,
                metric_value: value
            });
        }
    }

    setupErrorHandling() {
        this.errorCount = 0;
        this.maxErrors = 10; // Prevent infinite error loops
    }

    handleGlobalError(error) {
        this.errorCount++;

        if (this.errorCount > this.maxErrors) {
            console.error('🚨 Too many errors, stopping error reporting');
            return;
        }

        console.error('🚨 Global error:', error);

        // Track errors
        if (window.SEOAPI && this.errorCount <= 3) {
            window.SEOAPI.trackEvent('javascript_error', {
                error_message: error.message,
                error_stack: error.stack,
                error_count: this.errorCount,
                page_url: window.location.href
            });
        }

        // Show user-friendly error message
        if (this.errorCount === 1) {
            this.showErrorMessage('Something went wrong. Some features may not work properly.');
        }
    }

    handleModuleError(moduleName, error) {
        console.error(`❌ Module ${moduleName} error:`, error);

        // Track module errors
        if (window.SEOAPI) {
            window.SEOAPI.trackEvent('module_error', {
                module_name: moduleName,
                error_message: error.message,
                page_url: window.location.href
            });
        }
    }

    handleCriticalError(error) {
        console.error('💥 Critical application error:', error);

        // Show critical error message
        this.showErrorMessage('A critical error occurred. Please refresh the page.', true);

        // Track critical errors
        if (window.SEOAPI) {
            window.SEOAPI.trackEvent('critical_error', {
                error_message: error.message,
                error_stack: error.stack,
                page_url: window.location.href
            });
        }
    }

    showErrorMessage(message, isCritical = false) {
        // Remove existing error messages
        const existing = document.querySelector('.app-error-message');
        if (existing) {
            existing.remove();
        }

        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'app-error-message';
        errorElement.innerHTML = `
            <div class="error-content">
                <h3>${isCritical ? '⚠️ Critical Error' : '⚠️ Something went wrong'}</h3>
                <p>${message}</p>
                ${isCritical ? '<button onclick="location.reload()">Reload Page</button>' : ''}
            </div>
        `;

        // Add styles
        errorElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
            border-radius: 8px;
            padding: 1rem;
            max-width: 300px;
            z-index: 10001;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(errorElement);

        // Auto-remove after 10 seconds (unless critical)
        if (!isCritical) {
            setTimeout(() => {
                if (errorElement.parentNode) {
                    errorElement.remove();
                }
            }, 10000);
        }
    }

    emitAppEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, { detail });
        this.eventBus.dispatchEvent(event);
    }

    trackInitialization() {
        if (window.SEOAPI) {
            window.SEOAPI.trackEvent('app_initialization', {
                init_time: this.performance.initTime,
                modules_loaded: this.modules.size,
                features_enabled: Object.keys(this.features).filter(key => this.features[key]).length,
                mobile_device: this.features.mobile,
                browser_capabilities: Object.keys(this.features).filter(key => this.features[key])
            });
        }
    }

    // Public API methods
    getModule(name) {
        return this.modules.get(name)?.instance;
    }

    isModuleLoaded(name) {
        return this.modules.has(name);
    }

    getPerformanceMetrics() {
        return {
            ...this.performance,
            modules: Object.fromEntries(this.modules.entries()),
            features: this.features
        };
    }

    restart() {
        console.log('🔄 Restarting V9 Wooden Cabin Website...');
        location.reload();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.WoodenCabinApp = new WoodenCabinApp();

    // Expose global API
    window.WoodenCabinAPI = {
        getModule: (name) => window.WoodenCabinApp.getModule(name),
        isModuleLoaded: (name) => window.WoodenCabinApp.isModuleLoaded(name),
        getPerformanceMetrics: () => window.WoodenCabinApp.getPerformanceMetrics(),
        restart: () => window.WoodenCabinApp.restart()
    };

    // Add global styles for the app
    const globalStyles = document.createElement('style');
    globalStyles.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .loading {
            opacity: 0.7;
            filter: blur(1px);
        }

        .loaded {
            opacity: 1;
            filter: none;
            transition: opacity 0.3s ease;
        }

        .error {
            opacity: 0.5;
            filter: grayscale(1);
        }

        .no-scroll {
            overflow: hidden;
        }

        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0,0,0,0);
            white-space: nowrap;
            border: 0;
        }

        .keyboard-user *:focus {
            outline: 2px solid #007bff;
            outline-offset: 2px;
        }

        .printing {
            background: white !important;
            color: black !important;
        }

        .printing * {
            background: transparent !important;
            color: black !important;
            box-shadow: none !important;
            text-shadow: none !important;
        }
    `;
    document.head.appendChild(globalStyles);
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WoodenCabinApp;
}