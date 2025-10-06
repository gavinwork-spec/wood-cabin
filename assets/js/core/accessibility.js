/**
 * Accessibility Manager - V9 Wooden Cabin Website
 *
 * Comprehensive accessibility features including:
 * - Keyboard navigation support
 * - Focus management
 * - ARIA label enhancement
 * - Skip links functionality
 * - Screen reader support
 * - Focus trapping for modals
 * - High contrast mode toggle
 *
 * WCAG 2.1 AA compliant
 *
 * @version 1.0.0
 * @author Wooden Cabin Website Team
 */

class AccessibilityManager {
    constructor() {
        this.focusableElements = [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
            'details summary',
            'iframe',
            'embed',
            'object'
        ].join(', ');

        this.currentFocus = null;
        this.trapElements = [];
        this.skipLinks = [];
        this.announcements = [];
        this.lastFocusedElement = null;
        this.keyboardUser = false;

        this.init();
    }

    init() {
        this.setupSkipLinks();
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupARIAEnhancements();
        this.setupScreenReaderSupport();
        this.setupFocusTrap();
        this.setupHighContrastMode();
        this.setupReducedMotion();

        console.log('Accessibility Manager initialized successfully');
    }

    setupSkipLinks() {
        // Create skip links if they don't exist
        if (!document.querySelector('.skip-links')) {
            const skipLinksContainer = document.createElement('div');
            skipLinksContainer.className = 'skip-links';
            skipLinksContainer.setAttribute('role', 'navigation');
            skipLinksContainer.setAttribute('aria-label', 'Skip navigation links');

            // Add skip to main content
            const skipToMain = document.createElement('a');
            skipToMain.href = '#main';
            skipToMain.className = 'skip-link';
            skipToMain.textContent = 'Skip to main content';
            skipToMain.setAttribute('aria-label', 'Skip to main content');

            // Add skip to navigation
            const skipToNav = document.createElement('a');
            skipToNav.href = '#navigation';
            skipToNav.className = 'skip-link';
            skipToNav.textContent = 'Skip to navigation';
            skipToNav.setAttribute('aria-label', 'Skip to navigation');

            skipLinksContainer.appendChild(skipToMain);
            skipLinksContainer.appendChild(skipToNav);
            document.body.insertBefore(skipLinksContainer, document.body.firstChild);

            this.skipLinks = [skipToMain, skipToNav];
        }

        // Handle skip link clicks
        document.querySelectorAll('.skip-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    // Make target element focusable if it's not
                    if (!targetElement.hasAttribute('tabindex')) {
                        targetElement.setAttribute('tabindex', '-1');
                    }

                    targetElement.focus();
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupKeyboardNavigation() {
        // Detect keyboard user
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.keyboardUser = true;
                document.body.classList.add('keyboard-user');
            }

            // Handle escape key
            if (e.key === 'Escape') {
                this.handleEscapeKey(e);
            }

            // Handle arrow key navigation in menus
            this.handleArrowKeys(e);
        });

        // Detect mouse user
        document.addEventListener('mousedown', () => {
            this.keyboardUser = false;
            document.body.classList.remove('keyboard-user');
        });

        // Focus trap for modals and dropdowns
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.handleTabKey(e);
            }
        });
    }

    setupFocusManagement() {
        // Add focus indicators to interactive elements
        const interactiveElements = document.querySelectorAll(this.focusableElements);

        interactiveElements.forEach(element => {
            // Ensure element has proper focus styling
            if (!element.hasAttribute('data-focus-added')) {
                element.setAttribute('data-focus-added', 'true');

                // Add focus event listeners for visual feedback
                element.addEventListener('focus', () => {
                    element.classList.add('focused');
                });

                element.addEventListener('blur', () => {
                    element.classList.remove('focused');
                });
            }
        });

        // Handle focus within containers
        document.querySelectorAll('[data-focus-container]').forEach(container => {
            container.addEventListener('keydown', (e) => {
                this.handleContainerFocus(e, container);
            });
        });
    }

    setupARIAEnhancements() {
        // Enhance navigation menus
        this.enhanceNavigationAccessibility();

        // Enhance forms
        this.enhanceFormAccessibility();

        // Enhance images
        this.enhanceImageAccessibility();

        // Enhance links
        this.enhanceLinkAccessibility();

        // Add live regions for dynamic content
        this.setupLiveRegions();
    }

    enhanceNavigationAccessibility() {
        // Main navigation
        const mainNav = document.querySelector('nav[role="navigation"], .main-nav, .primary-nav');
        if (mainNav && !mainNav.hasAttribute('aria-label')) {
            mainNav.setAttribute('aria-label', 'Main navigation');
        }

        // Breadcrumb navigation
        const breadcrumb = document.querySelector('.breadcrumb, [role="navigation"].breadcrumb');
        if (breadcrumb && !breadcrumb.hasAttribute('aria-label')) {
            breadcrumb.setAttribute('aria-label', 'Breadcrumb navigation');
        }

        // Navigation lists
        document.querySelectorAll('nav ul, .nav-list').forEach(list => {
            if (!list.hasAttribute('role')) {
                list.setAttribute('role', 'list');
            }
        });

        // Navigation links
        document.querySelectorAll('.nav-link, .navigation-link').forEach(link => {
            if (!link.hasAttribute('aria-label') && link.textContent.trim()) {
                // Use text content as aria-label if not provided
                const text = link.textContent.trim();
                if (text && !link.hasAttribute('aria-label')) {
                    link.setAttribute('aria-label', `Navigate to ${text}`);
                }
            }
        });
    }

    enhanceFormAccessibility() {
        // Form labels
        document.querySelectorAll('input, select, textarea').forEach(field => {
            const id = field.id;
            const label = document.querySelector(`label[for="${id}"]`);

            if (!label && !field.hasAttribute('aria-label') && !field.hasAttribute('aria-labelledby')) {
                // Create or find associated label
                let labelText = field.getAttribute('placeholder') || field.getAttribute('name') || '';

                if (labelText) {
                    field.setAttribute('aria-label', labelText);
                }
            }

            // Add required field indicators
            if (field.hasAttribute('required') && !field.hasAttribute('aria-required')) {
                field.setAttribute('aria-required', 'true');
            }

            // Add field descriptions
            const description = field.getAttribute('title') || field.getAttribute('data-description');
            if (description && !field.hasAttribute('aria-describedby')) {
                const descId = `${field.id || 'field-' + Math.random().toString(36).substr(2, 9)}-desc`;
                field.setAttribute('aria-describedby', descId);

                // Create description element
                const descElement = document.createElement('span');
                descElement.id = descId;
                descElement.className = 'field-description sr-only';
                descElement.textContent = description;
                field.parentNode.insertBefore(descElement, field.nextSibling);
            }
        });

        // Form validation messages
        document.querySelectorAll('.error-message, .validation-error').forEach(error => {
            if (!error.hasAttribute('role')) {
                error.setAttribute('role', 'alert');
                error.setAttribute('aria-live', 'polite');
            }
        });
    }

    enhanceImageAccessibility() {
        document.querySelectorAll('img').forEach(img => {
            // Add alt text if missing
            if (!img.hasAttribute('alt')) {
                img.setAttribute('alt', ''); // Decorative image
            }

            // Check if image is decorative
            if (img.alt === '' && !img.hasAttribute('role')) {
                img.setAttribute('role', 'presentation');
            }

            // Handle image in links
            const parentLink = img.closest('a');
            if (parentLink && !parentLink.hasAttribute('aria-label') && img.alt) {
                parentLink.setAttribute('aria-label', img.alt);
            }
        });
    }

    enhanceLinkAccessibility() {
        document.querySelectorAll('a').forEach(link => {
            // Add external link indicators
            if (link.hostname !== location.hostname && !link.hasAttribute('aria-label')) {
                link.setAttribute('aria-label', `${link.textContent} (external link)`);
                if (!link.hasAttribute('rel')) {
                    link.setAttribute('rel', 'noopener noreferrer');
                }
            }

            // Handle new window links
            if (link.hasAttribute('target') && link.getAttribute('target') === '_blank') {
                if (!link.hasAttribute('aria-label')) {
                    link.setAttribute('aria-label', `${link.textContent} (opens in new window)`);
                }
            }

            // Handle download links
            if (link.hasAttribute('download')) {
                if (!link.hasAttribute('aria-label')) {
                    link.setAttribute('aria-label', `${link.textContent} (download)`);
                }
            }
        });
    }

    setupLiveRegions() {
        // Create announcement container
        if (!document.getElementById('accessibility-announcements')) {
            const announcementContainer = document.createElement('div');
            announcementContainer.id = 'accessibility-announcements';
            announcementContainer.className = 'sr-only';
            announcementContainer.setAttribute('aria-live', 'polite');
            announcementContainer.setAttribute('aria-atomic', 'true');
            document.body.appendChild(announcementContainer);
        }
    }

    setupScreenReaderSupport() {
        // Add landmarks for better navigation
        this.addLandmarks();

        // Enhance heading structure
        this.enhanceHeadingStructure();

        // Add page title announcements
        this.setupPageTitleAnnouncements();
    }

    addLandmarks() {
        // Main content area
        const main = document.querySelector('main, #main, .main-content');
        if (main && !main.hasAttribute('role')) {
            main.setAttribute('role', 'main');
        }

        // Header
        const header = document.querySelector('header, .header, .site-header');
        if (header && !header.hasAttribute('role')) {
            header.setAttribute('role', 'banner');
        }

        // Footer
        const footer = document.querySelector('footer, .footer, .site-footer');
        if (footer && !footer.hasAttribute('role')) {
            footer.setAttribute('role', 'contentinfo');
        }

        // Navigation areas
        document.querySelectorAll('nav').forEach((nav, index) => {
            if (!nav.hasAttribute('role')) {
                nav.setAttribute('role', 'navigation');
                if (!nav.hasAttribute('aria-label')) {
                    nav.setAttribute('aria-label', `Navigation ${index + 1}`);
                }
            }
        });

        // Search area
        const search = document.querySelector('.search, [role="search"]');
        if (search && !search.hasAttribute('role')) {
            search.setAttribute('role', 'search');
        }

        // Complementary content
        document.querySelectorAll('aside, .sidebar').forEach(aside => {
            if (!aside.hasAttribute('role')) {
                aside.setAttribute('role', 'complementary');
            }
        });
    }

    enhanceHeadingStructure() {
        // Ensure proper heading hierarchy
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let lastLevel = 0;

        headings.forEach(heading => {
            const level = parseInt(heading.tagName.substring(1));

            // Check for skipped heading levels
            if (lastLevel > 0 && level > lastLevel + 1) {
                console.warn(`Skipped heading level detected: h${lastLevel} to h${level}`);
            }

            lastLevel = level;
        });
    }

    setupPageTitleAnnouncements() {
        // Announce page changes for screen readers
        let lastTitle = document.title;

        const titleObserver = new MutationObserver(() => {
            if (document.title !== lastTitle) {
                this.announceToScreenReader(`Page changed to: ${document.title}`);
                lastTitle = document.title;
            }
        });

        titleObserver.observe(document.querySelector('title'), {
            childList: true,
            characterData: true
        });
    }

    setupFocusTrap() {
        // Watch for modals and focus traps
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check for modal dialogs
                        if (node.classList && (node.classList.contains('modal') || node.classList.contains('dialog'))) {
                            this.trapFocus(node);
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    trapFocus(container) {
        if (!container) return;

        // Store last focused element
        this.lastFocusedElement = document.activeElement;

        // Get all focusable elements in container
        const focusableElements = container.querySelectorAll(this.focusableElements);
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        // Focus first element
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 100);
        }

        // Add trap functionality
        const trapHandler = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }

            if (e.key === 'Escape') {
                this.removeFocusTrap(container);
            }
        };

        container.addEventListener('keydown', trapHandler);
        container.setAttribute('data-focus-trap', 'true');
    }

    removeFocusTrap(container) {
        if (!container) return;

        // Restore focus
        if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
            this.lastFocusedElement = null;
        }

        // Remove trap
        container.removeEventListener('keydown', this.trapHandler);
        container.removeAttribute('data-focus-trap');
    }

    setupHighContrastMode() {
        // Check for user preference
        const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;

        if (prefersHighContrast) {
            document.body.classList.add('high-contrast');
        }

        // Add toggle button if not exists
        if (!document.querySelector('.contrast-toggle')) {
            const toggle = document.createElement('button');
            toggle.className = 'contrast-toggle';
            toggle.setAttribute('aria-label', 'Toggle high contrast mode');
            toggle.innerHTML = '🔆';
            toggle.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 9999;
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                padding: 5px;
            `;

            toggle.addEventListener('click', () => {
                document.body.classList.toggle('high-contrast');
                const isHighContrast = document.body.classList.contains('high-contrast');
                this.announceToScreenReader(`High contrast mode ${isHighContrast ? 'enabled' : 'disabled'}`);
            });

            document.body.appendChild(toggle);
        }
    }

    setupReducedMotion() {
        // Check for user preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            document.body.classList.add('reduced-motion');
        }

        // Add CSS for reduced motion
        if (!document.querySelector('#accessibility-motion-styles')) {
            const style = document.createElement('style');
            style.id = 'accessibility-motion-styles';
            style.textContent = `
                .reduced-motion *,
                .reduced-motion *::before,
                .reduced-motion *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Event handlers
    handleEscapeKey(e) {
        // Close modals
        const openModal = document.querySelector('.modal.open, .dialog.open');
        if (openModal) {
            this.removeFocusTrap(openModal);
            openModal.classList.remove('open');
            return;
        }

        // Close dropdowns
        const openDropdown = document.querySelector('.dropdown.open, .sub-menu.open');
        if (openDropdown) {
            openDropdown.classList.remove('open');
            return;
        }

        // Close mobile menu
        if (window.NavigationManager && window.NavigationManager.isMenuOpen()) {
            window.NavigationManager.closeMobileMenu();
        }
    }

    handleArrowKeys(e) {
        const focusedElement = document.activeElement;

        // Handle arrow keys in menus
        if (focusedElement.matches('[role="menuitem"]')) {
            const menuItems = Array.from(focusedElement.parentElement.querySelectorAll('[role="menuitem"]'));
            const currentIndex = menuItems.indexOf(focusedElement);

            if (e.key === 'ArrowDown' && currentIndex < menuItems.length - 1) {
                e.preventDefault();
                menuItems[currentIndex + 1].focus();
            } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                e.preventDefault();
                menuItems[currentIndex - 1].focus();
            }
        }
    }

    handleTabKey(e) {
        const trapContainer = document.querySelector('[data-focus-trap="true"]');
        if (!trapContainer) return;

        const focusableElements = trapContainer.querySelectorAll(this.focusableElements);
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
    }

    handleContainerFocus(e, container) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const focusableElements = container.querySelectorAll(this.focusableElements);
            const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);

            let nextIndex;
            if (e.key === 'ArrowDown') {
                nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
            } else {
                nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
            }

            focusableElements[nextIndex].focus();
        }
    }

    // Public methods
    announceToScreenReader(message) {
        const announcementContainer = document.getElementById('accessibility-announcements');
        if (announcementContainer) {
            announcementContainer.textContent = message;

            // Clear after announcement
            setTimeout(() => {
                announcementContainer.textContent = '';
            }, 1000);
        }
    }

    setFocus(element) {
        if (element) {
            element.focus();
            this.announceToScreenReader(`Focused on ${element.textContent || element.getAttribute('aria-label') || 'element'}`);
        }
    }

    removeFocus(element) {
        if (element) {
            element.blur();
        }
    }

    // Utility methods
    getFocusableElements(container = document) {
        return container.querySelectorAll(this.focusableElements);
    }

    isKeyboardUser() {
        return this.keyboardUser;
    }

    // Initialize when DOM is ready
    static init() {
        return new AccessibilityManager();
    }
}

// Initialize accessibility manager
document.addEventListener('DOMContentLoaded', () => {
    window.AccessibilityManager = new AccessibilityManager();

    // Expose methods globally
    window.AccessibilityAPI = {
        announce: (message) => window.AccessibilityManager.announceToScreenReader(message),
        setFocus: (element) => window.AccessibilityManager.setFocus(element),
        removeFocus: (element) => window.AccessibilityManager.removeFocus(element),
        isKeyboardUser: () => window.AccessibilityManager.isKeyboardUser()
    };
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityManager;
}