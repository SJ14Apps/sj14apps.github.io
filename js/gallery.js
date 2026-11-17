/**
 * Screenshot Gallery Modal
 * Pure HTML, CSS, JS gallery view for screenshots
 */

let galleryModal = null;
let currentGalleryIndex = 0;
let galleryItems = [];
let isGalleryOpen = false;
let touchStartX = 0;
let touchStartY = 0;

function createGalleryDOM() {
    if (galleryModal) return galleryModal;

    const existing = document.getElementById('gallery-modal');
    if (existing) {
        galleryModal = existing;
        return galleryModal;
    }

    const modal = document.createElement('div');
    modal.id = 'gallery-modal';
    modal.className = 'gallery-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Screenshot Gallery');
    modal.setAttribute('aria-hidden', 'true');

    modal.innerHTML = `
        <div class="gallery-backdrop" id="gallery-backdrop"></div>
        <div class="gallery-topbar">
            <span class="gallery-counter" id="gallery-counter">1 / 1</span>
            <button class="gallery-close" id="gallery-close-btn" aria-label="Close gallery" title="Close (Esc)">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
        <button class="gallery-nav-btn gallery-prev" id="gallery-prev-btn" aria-label="Previous screenshot" title="Previous (Left Arrow)">
            <svg viewBox="0 0 24 24" width="26" height="26" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
        </button>
        <button class="gallery-nav-btn gallery-next" id="gallery-next-btn" aria-label="Next screenshot" title="Next (Right Arrow)">
            <svg viewBox="0 0 24 24" width="26" height="26" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        </button>
        <div class="gallery-main-view" id="gallery-main-view">
            <div class="gallery-img-container">
                <img id="gallery-main-img" class="gallery-main-img" src="" alt="Screenshot preview">
            </div>
        </div>
        <div class="gallery-thumbs-container" id="gallery-thumbs-container">
            <div class="gallery-thumbs" id="gallery-thumbs"></div>
        </div>
    `;

    document.body.appendChild(modal);
    galleryModal = modal;

    // Event listeners
    document.getElementById('gallery-backdrop').addEventListener('click', closeGallery);
    document.getElementById('gallery-close-btn').addEventListener('click', closeGallery);
    document.getElementById('gallery-prev-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        prevGalleryImage();
    });
    document.getElementById('gallery-next-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        nextGalleryImage();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!isGalleryOpen) return;
        if (e.key === 'Escape') {
            closeGallery();
            e.stopPropagation();
        } else if (e.key === 'ArrowLeft') {
            prevGalleryImage();
            e.stopPropagation();
        } else if (e.key === 'ArrowRight') {
            nextGalleryImage();
            e.stopPropagation();
        }
    });

    // Touch gesture swipe support
    const mainView = document.getElementById('gallery-main-view');
    mainView.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            touchStartX = e.touches[0].screenX;
            touchStartY = e.touches[0].screenY;
        }
    }, { passive: true });

    mainView.addEventListener('touchend', (e) => {
        if (e.changedTouches.length === 1) {
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;

            // Horizontal swipe with minimum distance and dominance over vertical scroll
            if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 0) {
                    prevGalleryImage();
                } else {
                    nextGalleryImage();
                }
            }
        }
    }, { passive: true });

    return galleryModal;
}

function initGallery(items) {
    if (!items || !items.length) return;
    galleryItems = items;
    createGalleryDOM();

    const thumbsContainer = document.getElementById('gallery-thumbs');
    const thumbsWrapper = document.getElementById('gallery-thumbs-container');
    const prevBtn = document.getElementById('gallery-prev-btn');
    const nextBtn = document.getElementById('gallery-next-btn');

    thumbsContainer.innerHTML = '';

    if (galleryItems.length <= 1) {
        if (thumbsWrapper) thumbsWrapper.style.display = 'none';
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
    } else {
        if (thumbsWrapper) thumbsWrapper.style.display = 'flex';
        if (prevBtn) prevBtn.style.display = 'flex';
        if (nextBtn) nextBtn.style.display = 'flex';
    }

    galleryItems.forEach((item, index) => {
        const btn = document.createElement('button');
        btn.className = 'gallery-thumb-btn';
        btn.setAttribute('type', 'button');
        btn.setAttribute('aria-label', `Go to screenshot ${index + 1}`);
        btn.setAttribute('data-index', index);

        const img = document.createElement('img');
        img.src = item.src;
        img.alt = `Thumbnail ${index + 1}`;
        btn.appendChild(img);

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            showGalleryImage(index);
        });

        thumbsContainer.appendChild(btn);
    });
}

function showGalleryImage(index) {
    if (!galleryItems.length) return;

    // Wrap index around
    index = (index + galleryItems.length) % galleryItems.length;
    currentGalleryIndex = index;

    const mainImg = document.getElementById('gallery-main-img');
    const counter = document.getElementById('gallery-counter');
    const item = galleryItems[index];

    if (counter) {
        counter.textContent = `${index + 1} / ${galleryItems.length}`;
    }

    if (mainImg) {
        mainImg.classList.add('fade-out');

        const temp = new Image();
        temp.src = item.src;
        const applyImage = () => {
            mainImg.src = item.src;
            mainImg.alt = item.alt || `Screenshot ${index + 1}`;
            // Force reflow for smooth transition
            void mainImg.offsetWidth;
            mainImg.classList.remove('fade-out');
        };

        if (temp.complete) {
            applyImage();
        } else {
            temp.onload = applyImage;
        }
    }

    // Update active thumbnail
    const thumbs = document.querySelectorAll('.gallery-thumb-btn');
    thumbs.forEach((thumb, i) => {
        if (i === index) {
            thumb.classList.add('active');
            thumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        } else {
            thumb.classList.remove('active');
        }
    });

    // Preload next and previous images
    if (galleryItems.length > 1) {
        const nextIdx = (index + 1) % galleryItems.length;
        const prevIdx = (index - 1 + galleryItems.length) % galleryItems.length;
        new Image().src = galleryItems[nextIdx].src;
        new Image().src = galleryItems[prevIdx].src;
    }
}

function openGallery(index = 0) {
    if (!galleryItems.length && typeof screenshots !== 'undefined' && screenshots) {
        initGallery(screenshots);
    }

    if (!galleryItems.length) return;

    createGalleryDOM();
    isGalleryOpen = true;
    galleryModal.classList.add('active');
    galleryModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('gallery-open');

    showGalleryImage(index);

    // Focus close button for keyboard accessibility
    const closeBtn = document.getElementById('gallery-close-btn');
    if (closeBtn) closeBtn.focus();
}

function closeGallery() {
    if (!isGalleryOpen || !galleryModal) return;

    isGalleryOpen = false;
    galleryModal.classList.remove('active');
    galleryModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('gallery-open');
}

function nextGalleryImage() {
    showGalleryImage(currentGalleryIndex + 1);
}

function prevGalleryImage() {
    showGalleryImage(currentGalleryIndex - 1);
}

// Auto-initialize when screenshots array is available
if (typeof screenshots !== 'undefined' && screenshots) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => initGallery(screenshots));
    } else {
        initGallery(screenshots);
    }
}
