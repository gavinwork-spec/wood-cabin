/**
 * Gallery Manager - V9 Wooden Cabin Website
 *
 * Comprehensive image gallery system including:
 * - Image lightbox functionality
 * - Touch gesture support
 * - Thumbnail navigation
 * - Keyboard navigation
 * - Zoom capabilities
 * - Lazy loading
 * - Gallery transitions
 * - Mobile-responsive design
 *
 * @version 1.0.0
 * @author Wooden Cabin Website Team
 */

class GalleryManager {
    constructor() {
        this.galleries = [];
        this.lightbox = null;
        this.currentGallery = null;
        this.currentImageIndex = 0;
        this.images = [];
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.isZoomed = false;
        this.zoomLevel = 1;
        this.isLoading = false;

        this.defaultOptions = {
            enableLightbox: true,
            enableThumbnails: true,
            enableKeyboard: true,
            enableTouch: true,
            enableZoom: true,
            lazyLoad: true,
            transitionDuration: 300,
            preloadCount: 2,
            showCaptions: true,
            showCounter: true,
            closeOnOverlay: true,
            animationType: 'fade'
        };

        this.init();
    }

    init() {
        this.createLightbox();
        this.cacheGalleries();
        this.setupGalleryEvents();
        this.setupKeyboardNavigation();
        this.setupTouchGestures();
        this.setupLazyLoading();

        console.log('Gallery Manager initialized successfully');
    }

    createLightbox() {
        // Create lightbox HTML structure
        const lightboxHTML = `
            <div class="lightbox" id="gallery-lightbox" style="display: none;">
                <div class="lightbox-overlay"></div>
                <div class="lightbox-container">
                    <button class="lightbox-close" aria-label="Close lightbox">&times;</button>

                    <div class="lightbox-content">
                        <div class="lightbox-image-wrapper">
                            <img class="lightbox-image" src="" alt="" />
                            <div class="lightbox-loading">
                                <div class="spinner"></div>
                            </div>
                        </div>

                        <div class="lightbox-caption"></div>
                        <div class="lightbox-counter"></div>
                    </div>

                    <button class="lightbox-prev" aria-label="Previous image">&lsaquo;</button>
                    <button class="lightbox-next" aria-label="Next image">&rsaquo;</button>

                    <div class="lightbox-thumbnails">
                        <div class="thumbnails-container"></div>
                    </div>

                    <div class="lightbox-zoom-controls">
                        <button class="zoom-in" aria-label="Zoom in">+</button>
                        <button class="zoom-out" aria-label="Zoom out">-</button>
                        <button class="zoom-reset" aria-label="Reset zoom">⟲</button>
                    </div>
                </div>
            </div>
        `;

        // Add to DOM
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        this.lightbox = document.getElementById('gallery-lightbox');

        // Cache lightbox elements
        this.lightboxElements = {
            overlay: this.lightbox.querySelector('.lightbox-overlay'),
            container: this.lightbox.querySelector('.lightbox-container'),
            image: this.lightbox.querySelector('.lightbox-image'),
            imageWrapper: this.lightbox.querySelector('.lightbox-image-wrapper'),
            caption: this.lightbox.querySelector('.lightbox-caption'),
            counter: this.lightbox.querySelector('.lightbox-counter'),
            closeBtn: this.lightbox.querySelector('.lightbox-close'),
            prevBtn: this.lightbox.querySelector('.lightbox-prev'),
            nextBtn: this.lightbox.querySelector('.lightbox-next'),
            thumbnails: this.lightbox.querySelector('.thumbnails-container'),
            loading: this.lightbox.querySelector('.lightbox-loading'),
            zoomIn: this.lightbox.querySelector('.zoom-in'),
            zoomOut: this.lightbox.querySelector('.zoom-out'),
            zoomReset: this.lightbox.querySelector('.zoom-reset')
        };

        // Add lightbox styles
        this.addLightboxStyles();
    }

    addLightboxStyles() {
        if (document.getElementById('gallery-lightbox-styles')) return;

        const styles = `
            <style id="gallery-lightbox-styles">
                .lightbox {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .lightbox.active {
                    opacity: 1;
                }

                .lightbox-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.95);
                    backdrop-filter: blur(5px);
                }

                .lightbox-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .lightbox-content {
                    position: relative;
                    max-width: 90vw;
                    max-height: 90vh;
                    text-align: center;
                }

                .lightbox-image-wrapper {
                    position: relative;
                    display: inline-block;
                    overflow: hidden;
                    border-radius: 8px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                }

                .lightbox-image {
                    max-width: 100%;
                    max-height: 80vh;
                    display: block;
                    transition: transform 0.3s ease;
                    cursor: grab;
                }

                .lightbox-image.zoomed {
                    cursor: zoom-out;
                }

                .lightbox-loading {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white;
                    font-size: 1.2rem;
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .lightbox-close {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: rgba(0, 0, 0, 0.5);
                    border: none;
                    color: white;
                    font-size: 2rem;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    z-index: 10;
                    transition: background 0.3s ease;
                }

                .lightbox-close:hover {
                    background: rgba(0, 0, 0, 0.8);
                }

                .lightbox-prev,
                .lightbox-next {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(0, 0, 0, 0.5);
                    border: none;
                    color: white;
                    font-size: 2rem;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    cursor: pointer;
                    z-index: 10;
                    transition: background 0.3s ease;
                }

                .lightbox-prev {
                    left: 20px;
                }

                .lightbox-next {
                    right: 20px;
                }

                .lightbox-prev:hover,
                .lightbox-next:hover {
                    background: rgba(0, 0, 0, 0.8);
                }

                .lightbox-caption {
                    margin-top: 1rem;
                    color: white;
                    font-size: 1.1rem;
                    max-width: 800px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .lightbox-counter {
                    position: absolute;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    color: white;
                    background: rgba(0, 0, 0, 0.5);
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-size: 0.9rem;
                }

                .lightbox-thumbnails {
                    position: absolute;
                    bottom: 80px;
                    left: 0;
                    right: 0;
                    display: flex;
                    justify-content: center;
                    padding: 0 20px;
                }

                .thumbnails-container {
                    display: flex;
                    gap: 10px;
                    overflow-x: auto;
                    max-width: 90vw;
                    padding: 10px 0;
                }

                .thumbnail {
                    width: 60px;
                    height: 60px;
                    object-fit: cover;
                    border-radius: 4px;
                    cursor: pointer;
                    opacity: 0.7;
                    transition: opacity 0.3s ease, transform 0.3s ease;
                    border: 2px solid transparent;
                }

                .thumbnail:hover {
                    opacity: 1;
                    transform: scale(1.1);
                }

                .thumbnail.active {
                    opacity: 1;
                    border-color: white;
                }

                .lightbox-zoom-controls {
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .lightbox-zoom-controls button {
                    background: rgba(0, 0, 0, 0.5);
                    border: none;
                    color: white;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 1.2rem;
                    transition: background 0.3s ease;
                }

                .lightbox-zoom-controls button:hover {
                    background: rgba(0, 0, 0, 0.8);
                }

                @media (max-width: 768px) {
                    .lightbox-prev,
                    .lightbox-next {
                        width: 40px;
                        height: 40px;
                        font-size: 1.5rem;
                    }

                    .lightbox-thumbnails {
                        bottom: 60px;
                    }

                    .thumbnail {
                        width: 50px;
                        height: 50px;
                    }

                    .lightbox-zoom-controls {
                        top: 70px;
                    }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    cacheGalleries() {
        const galleryElements = document.querySelectorAll('[data-gallery], .gallery, .image-gallery');

        galleryElements.forEach(gallery => {
            this.registerGallery(gallery);
        });

        // Watch for dynamically added galleries
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const galleries = node.querySelectorAll ? node.querySelectorAll('[data-gallery], .gallery, .image-gallery') : [];
                        galleries.forEach(gallery => this.registerGallery(gallery));

                        if (node.matches && node.matches('[data-gallery], .gallery, .image-gallery')) {
                            this.registerGallery(node);
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

    registerGallery(gallery) {
        if (!gallery || this.galleries.includes(gallery)) return;

        const options = this.parseGalleryOptions(gallery);
        const galleryId = gallery.dataset.gallery || gallery.id || `gallery-${this.galleries.length}`;

        // Extract images from gallery
        const images = this.extractGalleryImages(gallery);

        const galleryData = {
            element: gallery,
            id: galleryId,
            images: images,
            options: options
        };

        this.galleries.push(galleryData);
        this.setupGalleryInteractions(galleryData);

        console.log(`Gallery registered: ${galleryId} with ${images.length} images`);
    }

    parseGalleryOptions(gallery) {
        const dataOptions = gallery.dataset.galleryOptions ? JSON.parse(gallery.dataset.galleryOptions) : {};
        return { ...this.defaultOptions, ...dataOptions };
    }

    extractGalleryImages(gallery) {
        const images = [];
        const imageElements = gallery.querySelectorAll('img, a[href*=".jpg"], a[href*=".jpeg"], a[href*=".png"], a[href*=".gif"], a[href*=".webp"]');

        imageElements.forEach((element, index) => {
            let src, thumb, caption, alt;

            if (element.tagName === 'IMG') {
                src = element.dataset.src || element.src || element.dataset.large;
                thumb = element.src || element.dataset.thumb;
                caption = element.dataset.caption || element.alt || element.title;
                alt = element.alt;
            } else {
                // Link element
                src = element.href;
                const img = element.querySelector('img');
                thumb = img ? img.src : src;
                caption = element.dataset.caption || img?.alt || img?.title || '';
                alt = img?.alt || '';
            }

            if (src) {
                images.push({
                    src: src,
                    thumb: thumb || src,
                    caption: caption,
                    alt: alt,
                    index: index
                });
            }
        });

        return images;
    }

    setupGalleryInteractions(galleryData) {
        const { element, options } = galleryData;

        // Click handlers for gallery images
        element.addEventListener('click', (e) => {
            const target = e.target.closest('img, a[href*=".jpg"], a[href*=".jpeg"], a[href*=".png"], a[href*=".gif"], a[href*=".webp"]');

            if (target && options.enableLightbox) {
                e.preventDefault();
                const imageIndex = this.getImageIndex(target, galleryData.images);
                this.openLightbox(galleryData, imageIndex);
            }
        });

        // Keyboard navigation within gallery
        if (options.enableKeyboard) {
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    const target = e.target;
                    if (target.tagName === 'IMG' || (target.tagName === 'A' && target.href.match(/\.(jpg|jpeg|png|gif|webp)$/i))) {
                        e.preventDefault();
                        const imageIndex = this.getImageIndex(target, galleryData.images);
                        this.openLightbox(galleryData, imageIndex);
                    }
                }
            });
        }
    }

    getImageIndex(target, images) {
        const src = target.tagName === 'IMG' ?
            (target.dataset.src || target.src) :
            target.href;

        return images.findIndex(img => img.src === src);
    }

    openLightbox(galleryData, imageIndex = 0) {
        if (this.isLoading) return;

        this.currentGallery = galleryData;
        this.currentImageIndex = imageIndex;
        this.images = galleryData.images;
        this.isZoomed = false;
        this.zoomLevel = 1;

        // Reset lightbox state
        this.resetLightboxState();

        // Show lightbox
        this.lightbox.style.display = 'block';
        setTimeout(() => {
            this.lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 10);

        // Load initial image
        this.loadImage(imageIndex);

        // Setup event listeners
        this.setupLightboxEvents();

        // Track analytics
        this.trackGalleryEvent('lightbox_opened', {
            gallery_id: galleryData.id,
            image_index: imageIndex
        });
    }

    loadImage(index) {
        if (index < 0 || index >= this.images.length) return;

        this.currentImageIndex = index;
        this.isLoading = true;

        const image = this.images[index];
        const { image: imgElement, loading } = this.lightboxElements;

        // Show loading
        loading.style.display = 'block';
        imgElement.style.opacity = '0';

        // Create new image to preload
        const tempImg = new Image();
        tempImg.onload = () => {
            // Update lightbox image
            imgElement.src = image.src;
            imgElement.alt = image.alt || '';
            imgElement.style.opacity = '1';
            loading.style.display = 'none';
            this.isLoading = false;

            // Update caption
            this.updateCaption(image);

            // Update counter
            this.updateCounter();

            // Update thumbnails
            this.updateThumbnails();

            // Preload adjacent images
            this.preloadAdjacentImages(index);

            // Announce to screen readers
            if (window.AccessibilityAPI) {
                window.AccessibilityAPI.announce(`Showing image ${index + 1} of ${this.images.length}: ${image.caption || 'Image'}`);
            }
        };

        tempImg.onerror = () => {
            loading.style.display = 'none';
            this.isLoading = false;
            console.error('Failed to load image:', image.src);
        };

        tempImg.src = image.src;
    }

    updateCaption(image) {
        const { caption } = this.lightboxElements;
        if (image.caption && this.currentGallery.options.showCaptions) {
            caption.textContent = image.caption;
            caption.style.display = 'block';
        } else {
            caption.style.display = 'none';
        }
    }

    updateCounter() {
        const { counter } = this.lightboxElements;
        if (this.currentGallery.options.showCounter) {
            counter.textContent = `${this.currentImageIndex + 1} / ${this.images.length}`;
            counter.style.display = 'block';
        } else {
            counter.style.display = 'none';
        }
    }

    updateThumbnails() {
        if (!this.currentGallery.options.enableThumbnails) return;

        const { thumbnails } = this.lightboxElements;
        thumbnails.innerHTML = '';

        this.images.forEach((image, index) => {
            const thumb = document.createElement('img');
            thumb.src = image.thumb;
            thumb.alt = image.alt || '';
            thumb.className = 'thumbnail';
            if (index === this.currentImageIndex) {
                thumb.classList.add('active');
            }

            thumb.addEventListener('click', () => {
                this.loadImage(index);
            });

            thumbnails.appendChild(thumb);
        });

        // Scroll active thumbnail into view
        const activeThumb = thumbnails.querySelector('.thumbnail.active');
        if (activeThumb) {
            activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }
    }

    preloadAdjacentImages(currentIndex) {
        const preloadIndexes = [
            currentIndex - 1,
            currentIndex + 1,
            currentIndex - 2,
            currentIndex + 2
        ];

        preloadIndexes.forEach(index => {
            if (index >= 0 && index < this.images.length) {
                const tempImg = new Image();
                tempImg.src = this.images[index].src;
            }
        });
    }

    setupLightboxEvents() {
        const { overlay, closeBtn, prevBtn, nextBtn, image, zoomIn, zoomOut, zoomReset } = this.lightboxElements;

        // Close button
        const closeHandler = () => this.closeLightbox();
        closeBtn.addEventListener('click', closeHandler);

        // Overlay click
        if (this.currentGallery.options.closeOnOverlay) {
            overlay.addEventListener('click', closeHandler);
        }

        // Navigation buttons
        prevBtn.addEventListener('click', () => this.previousImage());
        nextBtn.addEventListener('click', () => this.nextImage());

        // Image click for next
        image.addEventListener('click', () => {
            if (!this.isZoomed) {
                this.nextImage();
            }
        });

        // Zoom controls
        if (this.currentGallery.options.enableZoom) {
            zoomIn.addEventListener('click', () => this.zoomIn());
            zoomOut.addEventListener('click', () => this.zoomOut());
            zoomReset.addEventListener('click', () => this.resetZoom());

            // Mouse wheel zoom
            image.addEventListener('wheel', (e) => {
                e.preventDefault();
                if (e.deltaY < 0) {
                    this.zoomIn();
                } else {
                    this.zoomOut();
                }
            });
        }

        // Store event handlers for cleanup
        this.lightboxEventHandlers = { closeHandler };
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('active')) return;

            switch (e.key) {
                case 'Escape':
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    this.previousImage();
                    break;
                case 'ArrowRight':
                    this.nextImage();
                    break;
                case '+':
                case '=':
                    if (this.currentGallery.options.enableZoom) this.zoomIn();
                    break;
                case '-':
                case '_':
                    if (this.currentGallery.options.enableZoom) this.zoomOut();
                    break;
                case '0':
                    if (this.currentGallery.options.enableZoom) this.resetZoom();
                    break;
            }
        });
    }

    setupTouchGestures() {
        const { image } = this.lightboxElements;

        let touchStartX = 0;
        let touchStartY = 0;

        image.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }
        });

        image.addEventListener('touchend', (e) => {
            if (e.changedTouches.length === 1) {
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;

                const deltaX = touchEndX - touchStartX;
                const deltaY = touchEndY - touchStartY;

                // Determine gesture direction
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    // Horizontal swipe
                    if (Math.abs(deltaX) > 50) {
                        if (deltaX > 0) {
                            this.previousImage();
                        } else {
                            this.nextImage();
                        }
                    }
                } else {
                    // Vertical swipe
                    if (Math.abs(deltaY) > 50 && deltaY > 0) {
                        this.closeLightbox();
                    }
                }
            }
        });
    }

    setupLazyLoading() {
        if (!('IntersectionObserver' in window)) return;

        const lazyImages = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    nextImage() {
        if (this.isLoading) return;

        const nextIndex = (this.currentImageIndex + 1) % this.images.length;
        this.loadImage(nextIndex);

        this.trackGalleryEvent('lightbox_navigation', {
            direction: 'next',
            image_index: nextIndex
        });
    }

    previousImage() {
        if (this.isLoading) return;

        const prevIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
        this.loadImage(prevIndex);

        this.trackGalleryEvent('lightbox_navigation', {
            direction: 'previous',
            image_index: prevIndex
        });
    }

    zoomIn() {
        if (!this.currentGallery.options.enableZoom) return;

        this.zoomLevel = Math.min(this.zoomLevel + 0.5, 3);
        this.applyZoom();
    }

    zoomOut() {
        if (!this.currentGallery.options.enableZoom) return;

        this.zoomLevel = Math.max(this.zoomLevel - 0.5, 1);
        this.applyZoom();
    }

    resetZoom() {
        if (!this.currentGallery.options.enableZoom) return;

        this.zoomLevel = 1;
        this.applyZoom();
    }

    applyZoom() {
        const { image } = this.lightboxElements;
        image.style.transform = `scale(${this.zoomLevel})`;
        image.classList.toggle('zoomed', this.zoomLevel > 1);
        this.isZoomed = this.zoomLevel > 1;
    }

    closeLightbox() {
        if (!this.lightbox.classList.contains('active')) return;

        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';

        setTimeout(() => {
            this.lightbox.style.display = 'none';
            this.cleanupLightbox();
        }, 300);

        this.trackGalleryEvent('lightbox_closed', {
            gallery_id: this.currentGallery.id,
            final_image_index: this.currentImageIndex
        });
    }

    cleanupLightbox() {
        const { closeHandler } = this.lightboxEventHandlers || {};

        if (closeHandler) {
            this.lightboxElements.closeBtn.removeEventListener('click', closeHandler);
            this.lightboxElements.overlay.removeEventListener('click', closeHandler);
        }

        this.currentGallery = null;
        this.images = [];
        this.currentImageIndex = 0;
        this.isZoomed = false;
        this.zoomLevel = 1;
    }

    resetLightboxState() {
        const { image } = this.lightboxElements;
        image.style.transform = 'scale(1)';
        image.classList.remove('zoomed');
    }

    trackGalleryEvent(action, data = {}) {
        if (window.SEOAPI) {
            window.SEOAPI.trackEvent('gallery_interaction', {
                action: action,
                ...data,
                gallery_id: this.currentGallery?.id,
                total_images: this.images.length
            });
        }
    }

    // Public methods
    openGallery(galleryId, imageIndex = 0) {
        const gallery = this.galleries.find(g => g.id === galleryId);
        if (gallery) {
            this.openLightbox(gallery, imageIndex);
        }
    }

    nextGalleryImage() {
        if (this.lightbox.classList.contains('active')) {
            this.nextImage();
        }
    }

    previousGalleryImage() {
        if (this.lightbox.classList.contains('active')) {
            this.previousImage();
        }
    }

    closeGallery() {
        this.closeLightbox();
    }

    // Initialize when DOM is ready
    static init() {
        return new GalleryManager();
    }
}

// Initialize gallery manager
document.addEventListener('DOMContentLoaded', () => {
    window.GalleryManager = new GalleryManager();

    // Expose methods globally
    window.GalleryAPI = {
        openGallery: (galleryId, index) => window.GalleryManager.openGallery(galleryId, index),
        nextImage: () => window.GalleryManager.nextGalleryImage(),
        previousImage: () => window.GalleryManager.previousGalleryImage(),
        closeGallery: () => window.GalleryManager.closeGallery()
    };
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GalleryManager;
}