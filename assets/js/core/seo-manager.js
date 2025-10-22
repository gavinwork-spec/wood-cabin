/**
 * SEO Manager - V9 Wooden Cabin Website
 *
 * Comprehensive SEO management system including:
 * - Dynamic meta tag updates
 * - Structured data enhancement
 * - Page performance monitoring
 * - Open Graph and Twitter Cards
 * - JSON-LD structured data
 * - SEO analytics tracking
 * - Sitemap and robots.txt management
 *
 * @version 1.0.0
 * @author Wooden Cabin Website Team
 */

class SEOManager {
    constructor() {
        this.performanceMetrics = {
            navigationStart: 0,
            loadComplete: 0,
            domContentLoaded: 0,
            firstPaint: 0,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            cumulativeLayoutShift: 0,
            firstInputDelay: 0
        };

        this.currentStructuredData = [];
        this.defaultMeta = {
            title: 'V9 Wooden Cabin - Premium Wooden Structures',
            description: 'Discover our handcrafted wooden cabins and structures. Quality craftsmanship meets modern design.',
            keywords: 'wooden cabin, timber structure, cabin design, wooden home',
            author: 'Wooden Cabin Team',
            robots: 'index, follow',
            canonical: window.location.href
        };

        this.init();
    }

    init() {
        this.setupMetaTags();
        this.setupStructuredData();
        this.setupPerformanceMonitoring();
        this.setupSocialMediaTags();
        this.setupSEOTagging();
        this.setupAnalyticsIntegration();
        this.setupLanguageAndRegion();
        this.trackPageView();

        console.log('SEO Manager initialized successfully');
    }

    setupMetaTags() {
        this.updateMetaTags(this.defaultMeta);

        // Track page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.trackPageView();
            }
        });

        // Track route changes for SPAs
        window.addEventListener('popstate', () => {
            this.updatePageMetadata();
            this.trackPageView();
        });
    }

    updateMetaTags(metaData) {
        // Update title
        if (metaData.title) {
            document.title = metaData.title;
            this.updateOrCreateMetaTag('og:title', metaData.title, 'property');
            this.updateOrCreateMetaTag('twitter:title', metaData.title, 'name');
        }

        // Update description
        if (metaData.description) {
            this.updateOrCreateMetaTag('description', metaData.description);
            this.updateOrCreateMetaTag('og:description', metaData.description, 'property');
            this.updateOrCreateMetaTag('twitter:description', metaData.description, 'name');
        }

        // Update keywords
        if (metaData.keywords) {
            this.updateOrCreateMetaTag('keywords', metaData.keywords);
        }

        // Update author
        if (metaData.author) {
            this.updateOrCreateMetaTag('author', metaData.author);
        }

        // Update robots
        if (metaData.robots) {
            this.updateOrCreateMetaTag('robots', metaData.robots);
        }

        // Update canonical URL
        if (metaData.canonical) {
            this.updateCanonicalURL(metaData.canonical);
        }

        // Update viewport
        this.updateOrCreateMetaTag('viewport', 'width=device-width, initial-scale=1.0');

        // Update theme-color for mobile browsers
        this.updateOrCreateMetaTag('theme-color', '#8B4513', 'name');

        // Update language
        this.updateOrCreateMetaTag('language', 'en', 'http-equiv');
    }

    updateOrCreateMetaTag(name, content, attribute = 'name') {
        let metaTag = document.querySelector(`meta[${attribute}="${name}"]`);

        if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.setAttribute(attribute, name);
            document.head.appendChild(metaTag);
        }

        metaTag.content = content;
    }

    updateCanonicalURL(url) {
        let canonicalLink = document.querySelector('link[rel="canonical"]');

        if (!canonicalLink) {
            canonicalLink = document.createElement('link');
            canonicalLink.rel = 'canonical';
            document.head.appendChild(canonicalLink);
        }

        canonicalLink.href = url;
    }

    setupStructuredData() {
        this.addWebsiteStructuredData();
        this.addOrganizationStructuredData();
        this.addBreadcrumbStructuredData();
        this.addProductStructuredData();
        this.addLocalBusinessStructuredData();
    }

    addWebsiteStructuredData() {
        const websiteData = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "V9 Wooden Cabin",
            "url": window.location.origin,
            "description": "Premium wooden cabins and structures",
            "potentialAction": {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${window.location.origin}/search?q={search_term_string}`
                },
                "query-input": "required name=search_term_string"
            }
        };

        this.addStructuredData(websiteData, 'website');
    }

    addOrganizationStructuredData() {
        const organizationData = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "V9 Wooden Cabin",
            "url": window.location.origin,
            "logo": `${window.location.origin}/assets/images/logo.png`,
            "description": "Expert craftsmen of premium wooden cabins and structures",
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-555-0123",
                "contactType": "customer service",
                "availableLanguage": ["English"]
            },
            "sameAs": [
                "https://www.facebook.com/woodencabin",
                "https://www.instagram.com/woodencabin",
                "https://www.twitter.com/woodencabin"
            ]
        };

        this.addStructuredData(organizationData, 'organization');
    }

    addBreadcrumbStructuredData() {
        const breadcrumbs = document.querySelectorAll('.breadcrumb li, .breadcrumb a');
        if (breadcrumbs.length === 0) return;

        const breadcrumbList = [];
        breadcrumbs.forEach((crumb, index) => {
            const text = crumb.textContent.trim();
            const url = crumb.href || window.location.href;

            breadcrumbList.push({
                "@type": "ListItem",
                "position": index + 1,
                "name": text,
                "item": url
            });
        });

        const breadcrumbData = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbList
        };

        this.addStructuredData(breadcrumbData, 'breadcrumb');
    }

    addProductStructuredData() {
        const products = document.querySelectorAll('[data-product], .product-card, .cabin-design');

        products.forEach((product, index) => {
            const productData = {
                "@context": "https://schema.org",
                "@type": "Product",
                "name": product.dataset.name || product.querySelector('.product-title, .cabin-name')?.textContent || `Wooden Cabin ${index + 1}`,
                "description": product.dataset.description || product.querySelector('.product-description, .cabin-description')?.textContent || 'High-quality wooden cabin',
                "image": product.dataset.image || product.querySelector('img')?.src || '',
                "brand": {
                    "@type": "Brand",
                    "name": "V9 Wooden Cabin"
                },
                "offers": {
                    "@type": "Offer",
                    "price": product.dataset.price || '0',
                    "priceCurrency": "USD",
                    "availability": product.dataset.availability || "https://schema.org/InStock"
                }
            };

            this.addStructuredData(productData, `product-${index}`);
        });
    }

    addLocalBusinessStructuredData() {
        const localBusinessData = {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "V9 Wooden Cabin",
            "description": "Premium wooden cabin manufacturing and design",
            "url": window.location.origin,
            "telephone": "+1-555-0123",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "123 Craftsmanship Lane",
                "addressLocality": "Woodsville",
                "addressRegion": "CA",
                "postalCode": "94025",
                "addressCountry": "US"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": "37.7749",
                "longitude": "-122.4194"
            },
            "openingHours": "Mo-Fr 09:00-17:00",
            "sameAs": [
                "https://www.facebook.com/woodencabin",
                "https://www.instagram.com/woodencabin"
            ]
        };

        this.addStructuredData(localBusinessData, 'local-business');
    }

    addStructuredData(data, id) {
        // Remove existing structured data with same ID
        this.removeStructuredData(id);

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = `structured-data-${id}`;
        script.textContent = JSON.stringify(data, null, 2);

        document.head.appendChild(script);
        this.currentStructuredData.push({ id, data });
    }

    removeStructuredData(id) {
        const existingScript = document.getElementById(`structured-data-${id}`);
        if (existingScript) {
            existingScript.remove();
        }

        this.currentStructuredData = this.currentStructuredData.filter(item => item.id !== id);
    }

    setupSocialMediaTags() {
        // Open Graph tags
        this.updateOrCreateMetaTag('og:type', 'website', 'property');
        this.updateOrCreateMetaTag('og:url', window.location.href, 'property');
        this.updateOrCreateMetaTag('og:site_name', 'V9 Wooden Cabin', 'property');
        this.updateOrCreateMetaTag('og:image', `${window.location.origin}/assets/images/og-image.jpg`, 'property');
        this.updateOrCreateMetaTag('og:image:width', '1200', 'property');
        this.updateOrCreateMetaTag('og:image:height', '630', 'property');
        this.updateOrCreateMetaTag('og:locale', 'en_US', 'property');

        // Twitter Card tags
        this.updateOrCreateMetaTag('twitter:card', 'summary_large_image', 'name');
        this.updateOrCreateMetaTag('twitter:site', '@woodencabin', 'name');
        this.updateOrCreateMetaTag('twitter:creator', '@woodencabin', 'name');
        this.updateOrCreateMetaTag('twitter:image', `${window.location.origin}/assets/images/twitter-image.jpg`, 'name');
    }

    setupSEOTagging() {
        // Add SEO-friendly class names and attributes
        this.addSEOFriendlyAttributes();
        this.optimizeImages();
        this.optimizeLinks();
        this.setupInternalLinking();
    }

    addSEOFriendlyAttributes() {
        // Add semantic markup
        const main = document.querySelector('main, .main-content');
        if (main && !main.hasAttribute('role')) {
            main.setAttribute('role', 'main');
        }

        // Add heading hierarchy validation
        this.validateHeadingHierarchy();

        // Add lang attribute to html if missing
        if (!document.documentElement.hasAttribute('lang')) {
            document.documentElement.setAttribute('lang', 'en');
        }
    }

    validateHeadingHierarchy() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let previousLevel = 0;
        let h1Count = 0;

        headings.forEach(heading => {
            const currentLevel = parseInt(heading.tagName.substring(1));

            // Count H1 tags
            if (currentLevel === 1) {
                h1Count++;
                if (h1Count > 1) {
                    console.warn('Multiple H1 tags detected. Consider using only one H1 per page.');
                }
            }

            // Check for skipped heading levels
            if (previousLevel > 0 && currentLevel > previousLevel + 1) {
                console.warn(`Skipped heading level detected: H${previousLevel} to H${currentLevel}`);
            }

            previousLevel = currentLevel;
        });
    }

    optimizeImages() {
        const images = document.querySelectorAll('img');

        images.forEach(img => {
            // Add alt text if missing
            if (!img.hasAttribute('alt')) {
                img.setAttribute('alt', img.getAttribute('title') || 'Wooden cabin image');
            }

            // Add loading attribute
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }

            // Add width and height attributes
            if (!img.hasAttribute('width') && img.naturalWidth) {
                img.setAttribute('width', img.naturalWidth);
            }
            if (!img.hasAttribute('height') && img.naturalHeight) {
                img.setAttribute('height', img.naturalHeight);
            }

            // Add SEO-friendly filename suggestion
            const src = img.src || img.getAttribute('src') || '';
            if (src && !src.includes('optimized')) {
                console.log('Consider optimizing image:', src);
            }
        });
    }

    optimizeLinks() {
        const links = document.querySelectorAll('a');

        links.forEach(link => {
            // Add rel attributes for external links
            if (link.hostname !== window.location.hostname) {
                if (!link.hasAttribute('rel')) {
                    link.setAttribute('rel', 'noopener noreferrer');
                }
            }

            // Add title attribute if missing and text is short
            const text = link.textContent.trim();
            if (!link.hasAttribute('title') && text.length < 50) {
                link.setAttribute('title', text);
            }
        });
    }

    setupInternalLinking() {
        // Auto-generate related links based on content
        const content = document.querySelector('main, .main-content');
        if (!content) return;

        const keywords = ['wooden cabin', 'timber structure', 'cabin design', 'wooden home', 'log cabin'];
        const internalLinks = {
            'wooden cabin': '/products',
            'timber structure': '/projects',
            'cabin design': '/ai-3d-design',
            'wooden home': '/about',
            'log cabin': '/products'
        };

        keywords.forEach(keyword => {
            if (content.textContent.toLowerCase().includes(keyword) && internalLinks[keyword]) {
                // Could auto-link keywords to relevant pages
                console.log(`Keyword found: "${keyword}" - Consider linking to: ${internalLinks[keyword]}`);
            }
        });
    }

    setupPerformanceMonitoring() {
        // Core Web Vitals monitoring
        this.measureCoreWebVitals();
        this.trackPageLoadTime();
        this.trackResourceLoading();
        this.trackUserInteractions();
    }

    measureCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.performanceMetrics.largestContentfulPaint = lastEntry.startTime;

            // Send to analytics
            this.trackPerformanceMetric('LCP', lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                this.performanceMetrics.firstInputDelay = entry.processingStart - entry.startTime;
                this.trackPerformanceMetric('FID', this.performanceMetrics.firstInputDelay);
            }
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        new PerformanceObserver((entryList) => {
            let clsValue = 0;
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            this.performanceMetrics.cumulativeLayoutShift = clsValue;
            this.trackPerformanceMetric('CLS', clsValue);
        }).observe({ entryTypes: ['layout-shift'] });
    }

    trackPageLoadTime() {
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];

            this.performanceMetrics.navigationStart = navigation.navigationStart;
            this.performanceMetrics.loadComplete = navigation.loadEventEnd - navigation.navigationStart;
            this.performanceMetrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.navigationStart;

            this.trackPerformanceMetric('page_load_time', this.performanceMetrics.loadComplete);
            this.trackPerformanceMetric('dom_content_loaded', this.performanceMetrics.domContentLoaded);
        });
    }

    trackResourceLoading() {
        const resources = performance.getEntriesByType('resource');
        let slowResources = [];

        resources.forEach(resource => {
            if (resource.duration > 1000) { // Resources taking more than 1 second
                slowResources.push({
                    name: resource.name,
                    duration: resource.duration,
                    type: resource.initiatorType
                });
            }
        });

        if (slowResources.length > 0) {
            console.warn('Slow resources detected:', slowResources);
            this.trackPerformanceMetric('slow_resources', slowResources);
        }
    }

    trackUserInteractions() {
        // Track time to first interaction
        let firstInteractionTime = null;

        ['click', 'touchstart', 'keydown'].forEach(eventType => {
            document.addEventListener(eventType, () => {
                if (!firstInteractionTime) {
                    firstInteractionTime = performance.now();
                    this.trackPerformanceMetric('first_interaction', firstInteractionTime);
                }
            }, { once: true });
        });
    }

    setupAnalyticsIntegration() {
        // Google Analytics 4 integration
        this.setupGoogleAnalytics();
        this.setupCustomEvents();
        this.trackScrollDepth();
        this.trackEngagement();
    }

    setupGoogleAnalytics() {
        // In production, this would initialize Google Analytics
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() { dataLayer.push(arguments); };

        // Initialize GA4
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID', {
            'anonymize_ip': true,
            'custom_map': {
                'custom_dimension_1': 'page_type',
                'custom_dimension_2': 'user_engagement'
            }
        });

        console.log('Google Analytics initialized');
    }

    setupCustomEvents() {
        // Track form submissions
        document.addEventListener('formSubmitted', (e) => {
            this.trackEvent('form_submission', {
                form_name: e.detail.form.id || 'unknown',
                form_type: 'contact'
            });
        });

        // Track button clicks
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                const button = e.target.tagName === 'BUTTON' ? e.target : e.target.closest('button');
                this.trackEvent('button_click', {
                    button_text: button.textContent.trim(),
                    button_id: button.id || 'no_id'
                });
            }
        });

        // Track outbound links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.hostname !== window.location.hostname) {
                this.trackEvent('outbound_link', {
                    link_url: link.href,
                    link_text: link.textContent.trim()
                });
            }
        });
    }

    trackScrollDepth() {
        let maxScroll = 0;
        const thresholds = [25, 50, 75, 90, 100];

        window.addEventListener('scroll', () => {
            const scrollPercentage = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );

            if (scrollPercentage > maxScroll) {
                maxScroll = scrollPercentage;

                thresholds.forEach(threshold => {
                    if (scrollPercentage >= threshold && !this[`tracked_${threshold}`]) {
                        this[`tracked_${threshold}`] = true;
                        this.trackEvent('scroll_depth', {
                            percentage: threshold
                        });
                    }
                });
            }
        });
    }

    trackEngagement() {
        let engagementTime = 0;
        let startTime = Date.now();

        // Track engagement time
        setInterval(() => {
            if (document.visibilityState === 'visible') {
                engagementTime += 5; // 5 seconds
                this.trackPerformanceMetric('engagement_time', engagementTime);
            }
        }, 5000);

        // Track page unload
        window.addEventListener('beforeunload', () => {
            const totalTime = Date.now() - startTime;
            this.trackPerformanceMetric('total_time_on_page', totalTime);
        });
    }

    setupLanguageAndRegion() {
        // Hreflang tags for international SEO
        this.addHreflangTags();

        // Detect user language preference
        const userLanguage = navigator.language || navigator.userLanguage;
        if (userLanguage && userLanguage.startsWith('en')) {
            document.documentElement.lang = userLanguage;
        }
    }

    addHreflangTags() {
        const languages = ['en', 'es', 'fr', 'de'];

        languages.forEach(lang => {
            const link = document.createElement('link');
            link.rel = 'alternate';
            link.hreflang = lang;
            link.href = `${window.location.origin}/${lang}${window.location.pathname}`;
            document.head.appendChild(link);
        });

        // Add x-default for international targeting
        const defaultLink = document.createElement('link');
        defaultLink.rel = 'alternate';
        defaultLink.hreflang = 'x-default';
        defaultLink.href = window.location.href;
        document.head.appendChild(defaultLink);
    }

    // Public tracking methods
    trackPageView() {
        const pageData = {
            page_title: document.title,
            page_location: window.location.href,
            page_path: window.location.pathname
        };

        this.trackEvent('page_view', pageData);
    }

    trackEvent(eventName, parameters = {}) {
        // Send to Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters);
        }

        // Log for debugging
        console.log('SEO Event:', eventName, parameters);
    }

    trackPerformanceMetric(metricName, value) {
        this.trackEvent('performance_metric', {
            metric_name: metricName,
            metric_value: value,
            page_url: window.location.href
        });
    }

    updatePageMetadata() {
        // Extract page-specific metadata
        const pageTitle = document.querySelector('h1')?.textContent || this.defaultMeta.title;
        const pageDescription = document.querySelector('meta[name="description"]')?.content || this.defaultMeta.description;
        const canonicalUrl = window.location.href;

        this.updateMetaTags({
            title: pageTitle,
            description: pageDescription,
            canonical: canonicalUrl
        });

        // Update structured data for current page
        this.addBreadcrumbStructuredData();
    }

    // Public methods for dynamic updates
    updateStructuredData(id, data) {
        this.addStructuredData(data, id);
    }

    addCustomMetaTag(name, content, attribute = 'name') {
        this.updateOrCreateMetaTag(name, content, attribute);
    }

    getPerformanceMetrics() {
        return this.performanceMetrics;
    }

    // Initialize when DOM is ready
    static init() {
        return new SEOManager();
    }
}

// Initialize SEO manager
document.addEventListener('DOMContentLoaded', () => {
    window.SEOManager = new SEOManager();

    // Expose methods globally
    window.SEOAPI = {
        updateMetaTags: (metaData) => window.SEOManager.updateMetaTags(metaData),
        trackEvent: (name, params) => window.SEOManager.trackEvent(name, params),
        updateStructuredData: (id, data) => window.SEOManager.updateStructuredData(id, data),
        getPerformanceMetrics: () => window.SEOManager.getPerformanceMetrics()
    };
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SEOManager;
}