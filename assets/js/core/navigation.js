/**
 * Navigation Manager - V9 Wooden Cabin Website
 *
 * Core navigation functionality including:
 * - Mobile hamburger menu
 * - Smooth scrolling navigation
 * - Active navigation state management
 * - Dropdown menu functionality
 * - Responsive navigation behavior
 *
 * @version 1.0.0
 * @author Wooden Cabin Website Team
 */

class NavigationManager {
    constructor() {
        this.mobileMenuToggle = null;
        this.mobileMenu = null;
        this.navLinks = [];
        this.dropdownToggles = [];
        this.isMenuOpen = false;
        this.lastScrollY = window.scrollY;
        this.headerHeight = 0;

        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.setupSmoothScrolling();
        this.setupDropdownMenus();
        this.setupScrollHeader();
        this.setupActiveNavigation();

        // Initialize accessibility features
        this.setupAccessibility();

        console.log('Navigation Manager initialized successfully');
    }

    cacheElements() {
        this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle, .hamburger-menu, .menu-toggle');
        this.mobileMenu = document.querySelector('.mobile-menu, .mobile-nav, .nav-menu');
        this.header = document.querySelector('header, .header, .site-header');

        // Cache all navigation links
        this.navLinks = document.querySelectorAll('a[href^="#"], .nav-link, .navigation-link');

        // Cache dropdown toggles
        this.dropdownToggles = document.querySelectorAll('.dropdown-toggle, .has-dropdown > a');

        // Cache dropdown menus
        this.dropdownMenus = document.querySelectorAll('.dropdown-menu, .sub-menu');
    }

    bindEvents() {
        // Mobile menu toggle
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen &&
                !this.mobileMenu?.contains(e.target) &&
                !this.mobileMenuToggle?.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        if (!this.mobileMenu || !this.mobileMenuToggle) return;

        this.isMenuOpen = true;

        // Add active classes
        this.mobileMenu.classList.add('active', 'open');
        this.mobileMenuToggle.classList.add('active', 'open');

        // Update ARIA attributes
        this.mobileMenuToggle.setAttribute('aria-expanded', 'true');
        this.mobileMenu.setAttribute('aria-hidden', 'false');

        // Prevent body scroll
        document.body.classList.add('no-scroll');

        // Focus first menu item
        const firstMenuItem = this.mobileMenu.querySelector('a, button');
        if (firstMenuItem) {
            setTimeout(() => firstMenuItem.focus(), 100);
        }

        // Emit custom event
        this.emitEvent('mobileMenuOpened');
    }

    closeMobileMenu() {
        if (!this.mobileMenu || !this.mobileMenuToggle) return;

        this.isMenuOpen = false;

        // Remove active classes
        this.mobileMenu.classList.remove('active', 'open');
        this.mobileMenuToggle.classList.remove('active', 'open');

        // Update ARIA attributes
        this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
        this.mobileMenu.setAttribute('aria-hidden', 'true');

        // Restore body scroll
        document.body.classList.remove('no-scroll');

        // Return focus to menu toggle
        this.mobileMenuToggle.focus();

        // Emit custom event
        this.emitEvent('mobileMenuClosed');
    }

    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');

            // Check if it's an anchor link
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.smoothScrollTo(targetElement);

                        // Close mobile menu if open
                        if (this.isMenuOpen) {
                            this.closeMobileMenu();
                        }

                        // Update URL
                        this.updateURL(href);
                    });
                }
            }
        });
    }

    smoothScrollTo(targetElement, offset = 0) {
        if (!targetElement) return;

        const targetPosition = targetElement.offsetTop - offset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800; // ms
        let start = null;

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = this.easeInOutCubic(timeElapsed, startPosition, distance, duration);

            window.scrollTo(0, run);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            } else {
                // Ensure we end at the exact position
                window.scrollTo(0, targetPosition);

                // Update focus for accessibility
                targetElement.focus({ preventScroll: true });
            }
        };

        requestAnimationFrame(animation);
    }

    easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }

    setupDropdownMenus() {
        this.dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleDropdown(toggle);
            });

            // Handle keyboard navigation
            toggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleDropdown(toggle);
                }
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            this.closeAllDropdowns();
        });
    }

    toggleDropdown(toggle) {
        const dropdown = toggle.nextElementSibling || toggle.parentElement.querySelector('.dropdown-menu, .sub-menu');
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

        // Close all other dropdowns
        this.closeAllDropdowns();

        if (!isExpanded && dropdown) {
            // Open this dropdown
            dropdown.classList.add('open', 'active');
            toggle.classList.add('active');
            toggle.setAttribute('aria-expanded', 'true');
            dropdown.setAttribute('aria-hidden', 'false');

            // Focus first item in dropdown
            const firstItem = dropdown.querySelector('a, button');
            if (firstItem) {
                setTimeout(() => firstItem.focus(), 100);
            }
        }
    }

    closeAllDropdowns() {
        this.dropdownToggles.forEach(toggle => {
            const dropdown = toggle.nextElementSibling || toggle.parentElement.querySelector('.dropdown-menu, .sub-menu');

            if (dropdown && dropdown.classList.contains('open')) {
                dropdown.classList.remove('open', 'active');
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                dropdown.setAttribute('aria-hidden', 'true');
            }
        });
    }

    setupScrollHeader() {
        if (!this.header) return;

        this.headerHeight = this.header.offsetHeight;

        window.addEventListener('scroll', this.debounce(() => {
            const currentScrollY = window.scrollY;

            // Hide/show header on scroll
            if (currentScrollY > this.lastScrollY && currentScrollY > this.headerHeight) {
                this.header.classList.add('header-hidden');
            } else {
                this.header.classList.remove('header-hidden');
            }

            // Add scrolled class for styling
            if (currentScrollY > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }

            this.lastScrollY = currentScrollY;
        }, 16)); // ~60fps
    }

    setupActiveNavigation() {
        const sections = document.querySelectorAll('section[id], [id]');

        const updateActiveNav = () => {
            const scrollY = window.pageYOffset;

            sections.forEach(section => {
                const sectionTop = section.offsetTop - this.headerHeight - 100;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    // Remove active class from all links
                    this.navLinks.forEach(link => {
                        link.classList.remove('active', 'current');
                        link.removeAttribute('aria-current');
                    });

                    // Add active class to current link
                    const activeLink = document.querySelector(`a[href="#${sectionId}"], .nav-link[href="#${sectionId}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active', 'current');
                        activeLink.setAttribute('aria-current', 'page');
                    }
                }
            });
        };

        window.addEventListener('scroll', this.debounce(updateActiveNav, 100));
        updateActiveNav(); // Initial call
    }

    setupAccessibility() {
        // Add ARIA attributes if missing
        if (this.mobileMenuToggle && !this.mobileMenuToggle.hasAttribute('aria-label')) {
            this.mobileMenuToggle.setAttribute('aria-label', 'Toggle navigation menu');
            this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }

        if (this.mobileMenu && !this.mobileMenu.hasAttribute('aria-hidden')) {
            this.mobileMenu.setAttribute('aria-hidden', 'true');
        }

        // Add role to dropdown toggles
        this.dropdownToggles.forEach(toggle => {
            if (!toggle.hasAttribute('aria-expanded')) {
                toggle.setAttribute('aria-expanded', 'false');
            }
            if (!toggle.hasAttribute('aria-haspopup')) {
                toggle.setAttribute('aria-haspopup', 'true');
            }
        });

        // Add role to dropdown menus
        this.dropdownMenus.forEach(menu => {
            if (!menu.hasAttribute('role')) {
                menu.setAttribute('role', 'menu');
            }
            if (!menu.hasAttribute('aria-hidden')) {
                menu.setAttribute('aria-hidden', 'true');
            }
        });
    }

    handleResize() {
        // Close mobile menu on desktop
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.closeMobileMenu();
        }

        // Update header height
        if (this.header) {
            this.headerHeight = this.header.offsetHeight;
        }
    }

    updateURL(hash) {
        if (history.pushState) {
            history.pushState(null, null, hash);
        } else {
            location.hash = hash;
        }
    }

    emitEvent(eventName) {
        const event = new CustomEvent(`navigation:${eventName}`, {
            bubbles: true,
            detail: { navigationManager: this }
        });
        document.dispatchEvent(event);
    }

    // Utility method for debouncing
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Public methods for external use
    publicMethods() {
        return {
            toggleMobileMenu: () => this.toggleMobileMenu(),
            closeMobileMenu: () => this.closeMobileMenu(),
            openMobileMenu: () => this.openMobileMenu(),
            scrollToElement: (element, offset) => this.smoothScrollTo(element, offset),
            isMenuOpen: () => this.isMenuOpen
        };
    }
}

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.NavigationManager = new NavigationManager();

    // Expose methods globally for external use
    window.NavigationAPI = window.NavigationManager.publicMethods();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationManager;
}