// Gallery functionality for APAM Data Hub
// Fetches images from Cloudinary by tag and displays them in a carousel

(function() {
  'use strict';

  // Configuration
  const CLOUDINARY_CLOUD_NAME = 'dobdjgonp';
  const CLOUDINARY_TAG = 'for-landing';
  const IMAGES_PER_SLIDE = 3; // Number of images visible at once on desktop
  const AUTO_PLAY_INTERVAL = 5000; // 5 seconds in milliseconds

  // State
  let allImages = [];
  let currentSlide = 0;
  let currentLightboxIndex = 0;
  let isLoading = false;
  let autoPlayTimer = null;

  // DOM Elements
  let sliderTrack;
  let sliderPrev;
  let sliderNext;
  let paginationCurrent;
  let paginationTotal;
  let lightbox;
  let lightboxImage;
  let lightboxCounter;
  let lightboxCounterCurrent;
  let lightboxCounterTotal;

  // Initialize gallery
  document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    fetchImages();
    attachEventListeners();
  });

  function initializeElements() {
    sliderTrack = document.querySelector('.slider-track');
    sliderPrev = document.querySelector('.slider-prev');
    sliderNext = document.querySelector('.slider-next');
    paginationCurrent = document.querySelector('.pagination-current');
    paginationTotal = document.querySelector('.pagination-total');
    lightbox = document.querySelector('.lightbox');
    lightboxImage = document.querySelector('.lightbox-image');
    lightboxCounter = document.querySelector('.lightbox-counter');
    lightboxCounterCurrent = document.querySelector('.lightbox-counter-current');
    lightboxCounterTotal = document.querySelector('.lightbox-counter-total');
  }

  // Fetch images from Cloudinary by tag
  async function fetchImages() {
    if (isLoading) return;
    isLoading = true;

    try {
      // Fetch images tagged with 'for-landing'
      const response = await fetch(
        `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/list/${CLOUDINARY_TAG}.json`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.resources || data.resources.length === 0) {
        console.warn('No images found with tag:', CLOUDINARY_TAG);
        displayNoImagesMessage();
        return;
      }

      // Transform Cloudinary response to our image format
      allImages = data.resources.map(resource => ({
        public_id: resource.public_id,
        // Small preview for slider - optimized for speed
        // w_400 for mobile, w_600 for desktop, q_60 for faster loading
        urlSmall: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_400,h_267,q_60,f_webp/${resource.public_id}`,
        url: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_600,h_400,q_60,f_webp/${resource.public_id}`,
        // Full quality for lightbox
        fullUrl: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/q_auto,f_auto/${resource.public_id}`,
        width: resource.width,
        height: resource.height,
        created_at: resource.created_at
      }));

      // Sort by creation date (newest first)
      allImages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      renderSlider();
      updatePagination();
      startAutoPlay();
      preloadSliderNeighbors();
    } catch (error) {
      console.error('Error fetching images:', error);
      displayErrorMessage();
    } finally {
      isLoading = false;
    }
  }

  // Render slider with images
  function renderSlider() {
    if (!sliderTrack) return;

    sliderTrack.innerHTML = '';

    allImages.forEach((image, index) => {
      const slide = document.createElement('div');
      slide.className = 'slider-slide';
      slide.setAttribute('data-index', index);

      const img = document.createElement('img');
      // Use smaller image for faster initial load, then upgrade quality
      img.src = image.urlSmall;
      img.alt = `Conference Photo ${index + 1}`;
      img.loading = index < getVisibleSlidesCount() + 1 ? 'eager' : 'lazy';
      
      // Add loaded class when image finishes loading
      img.onload = function() {
        img.classList.add('loaded');
        
        // After small image loads, preload higher quality version
        if (img.src === image.urlSmall) {
          const highQualityImg = new Image();
          highQualityImg.src = image.url;
          highQualityImg.onload = function() {
            img.src = image.url;
          };
        }
      };
      
      // Handle cached images that load instantly
      if (img.complete) {
        img.classList.add('loaded');
      }

      slide.appendChild(img);
      slide.addEventListener('click', () => openLightbox(index));

      sliderTrack.appendChild(slide);
    });

    updateSliderPosition();
  }

  // Update slider position
  function updateSliderPosition() {
    if (!sliderTrack) return;

    const slideWidth = getSlideWidth();
    const offset = -currentSlide * (slideWidth + 16); // 16px is the gap
    sliderTrack.style.transform = `translateX(${offset}px)`;

    // Buttons always enabled for infinite scroll
  }

  // Get slide width based on viewport
  function getSlideWidth() {
    const slide = document.querySelector('.slider-slide');
    return slide ? slide.offsetWidth : 300;
  }

  // Get number of visible slides
  function getVisibleSlidesCount() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 1024) return 2;
    return IMAGES_PER_SLIDE;
  }

  // Update pagination display
  function updatePagination() {
    if (paginationCurrent) {
      paginationCurrent.textContent = currentSlide + 1;
    }
    if (paginationTotal) {
      paginationTotal.textContent = allImages.length;
    }
  }

  // Navigate slider
  function goToSlide(slideIndex) {
    const maxSlide = Math.max(0, allImages.length - getVisibleSlidesCount());
    currentSlide = Math.max(0, Math.min(slideIndex, maxSlide));
    updateSliderPosition();
    updatePagination();
    preloadSliderNeighbors();
  }

  function nextSlide() {
    const maxSlide = Math.max(0, allImages.length - getVisibleSlidesCount());
    if (currentSlide >= maxSlide) {
      // Loop back to the beginning
      goToSlide(0);
    } else {
      goToSlide(currentSlide + 1);
    }
    preloadSliderNeighbors();
  }

  function prevSlide() {
    const maxSlide = Math.max(0, allImages.length - getVisibleSlidesCount());
    if (currentSlide <= 0) {
      goToSlide(maxSlide);
    } else {
      goToSlide(currentSlide - 1);
    }
    preloadSliderNeighbors();
  }

  // Auto-play functions
  function startAutoPlay() {
    if (autoPlayTimer) return;
    // Only start auto-play if lightbox is not active
    if (lightbox && lightbox.classList.contains('active')) return;
    autoPlayTimer = setInterval(() => {
      nextSlide();
    }, AUTO_PLAY_INTERVAL);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  function resetAutoPlayTimer() {
    stopAutoPlay();
    startAutoPlay();
  }

  // Lightbox functions
  function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightboxImage();
    preloadLightboxNeighbors();

    if (lightbox) {
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      stopAutoPlay();
    }
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      startAutoPlay();
    }
  }

  function updateLightboxImage() {
    if (!lightboxImage || allImages.length === 0) return;

    const image = allImages[currentLightboxIndex];
    
    // Remove loaded class while loading new image
    lightboxImage.classList.remove('loaded');
    
    // Clear any previous onload handlers
    lightboxImage.onload = null;
    
    // Use medium quality for initial display, then upgrade to full
    const mediumQualityUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/w_1200,q_60,f_webp/${image.public_id}`;
    
    // Create a temporary image to preload
    const tempImg = new Image();
    tempImg.src = mediumQualityUrl;
    
    tempImg.onload = function() {
      // Only update if we're still on the same image
      if (currentLightboxIndex === allImages.indexOf(image)) {
        lightboxImage.src = mediumQualityUrl;
        lightboxImage.alt = `Conference Photo ${currentLightboxIndex + 1}`;
        lightboxImage.classList.add('loaded');
        
        // Preload full quality version in background
        const fullQualityImg = new Image();
        fullQualityImg.src = image.fullUrl;
        fullQualityImg.onload = function() {
          // Only update if we're still on the same image
          if (currentLightboxIndex === allImages.indexOf(image) && lightboxImage.src === mediumQualityUrl) {
            lightboxImage.src = image.fullUrl;
          }
        };
      }
    };
    
    tempImg.onerror = function() {
      // If medium quality fails, try full quality
      lightboxImage.src = image.fullUrl;
      lightboxImage.alt = `Conference Photo ${currentLightboxIndex + 1}`;
      lightboxImage.onload = function() {
        lightboxImage.classList.add('loaded');
      };
    };

    if (lightboxCounterCurrent) {
      lightboxCounterCurrent.textContent = currentLightboxIndex + 1;
    }
    if (lightboxCounterTotal) {
      lightboxCounterTotal.textContent = allImages.length;
    }
  }

  function nextLightboxImage() {
    currentLightboxIndex = (currentLightboxIndex + 1) % allImages.length;
    updateLightboxImage();
    preloadLightboxNeighbors();
  }

  function prevLightboxImage() {
    currentLightboxIndex = (currentLightboxIndex - 1 + allImages.length) % allImages.length;
    updateLightboxImage();
    preloadLightboxNeighbors();
  }

  // Preload next and previous images in lightbox
  function preloadLightboxNeighbors() {
    const prevIndex = (currentLightboxIndex - 1 + allImages.length) % allImages.length;
    const nextIndex = (currentLightboxIndex + 1) % allImages.length;
    
    [prevIndex, nextIndex].forEach(index => {
      const image = allImages[index];
      const preloadImg = new Image();
      preloadImg.src = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/w_1200,q_60,f_webp/${image.public_id}`;
    });
  }

  // Preload visible slides and next batch of images
  function preloadSliderNeighbors() {
    const visibleCount = getVisibleSlidesCount();
    const startIndex = currentSlide;
    const endIndex = Math.min(allImages.length, currentSlide + visibleCount + 2);
    
    for (let i = startIndex; i < endIndex; i++) {
      if (allImages[i]) {
        const preloadImg = new Image();
        preloadImg.src = allImages[i].url;
      }
    }
  }

  // Event listeners
  function attachEventListeners() {
    // Slider navigation
    if (sliderPrev) {
      sliderPrev.addEventListener('click', function() {
        prevSlide();
        resetAutoPlayTimer();
      });
    }
    if (sliderNext) {
      sliderNext.addEventListener('click', function() {
        nextSlide();
        resetAutoPlayTimer();
      });
    }

    // Lightbox navigation
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrevButtons = document.querySelectorAll('.lightbox-prev');
    const lightboxNextButtons = document.querySelectorAll('.lightbox-next');

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }
    
    // Attach click handlers to all prev buttons (desktop and mobile)
    lightboxPrevButtons.forEach(button => {
      button.addEventListener('click', prevLightboxImage);
    });
    
    // Attach click handlers to all next buttons (desktop and mobile)
    lightboxNextButtons.forEach(button => {
      button.addEventListener('click', nextLightboxImage);
    });

    // Close lightbox on background click
    if (lightbox) {
      lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
          closeLightbox();
        }
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (!lightbox || !lightbox.classList.contains('active')) return;

      switch(e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          prevLightboxImage();
          break;
        case 'ArrowRight':
          nextLightboxImage();
          break;
      }
    });

    // Pause auto-play on hover
    if (sliderTrack) {
      sliderTrack.addEventListener('mouseenter', stopAutoPlay);
      sliderTrack.addEventListener('mouseleave', startAutoPlay);
    }

    // Window resize handler
    window.addEventListener('resize', function() {
      updateSliderPosition();
      updatePagination();
    });

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    if (sliderTrack) {
      sliderTrack.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      sliderTrack.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });
    }

    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        resetAutoPlayTimer();
      }
    }
  }

  // Display message when no images found
  function displayNoImagesMessage() {
    if (sliderTrack) {
      sliderTrack.innerHTML = '<div class="gallery-message">Photos coming soon</div>';
    }
  }

  // Display error message
  function displayErrorMessage() {
    if (sliderTrack) {
      sliderTrack.innerHTML = '<div class="gallery-message gallery-error">Unable to load photos. Please try again later.</div>';
    }
  }
})();
