// Register GSAP Plugins
if (typeof gsap !== "undefined") {
    const plugins = [];
    if (typeof ScrollTrigger !== "undefined") plugins.push(ScrollTrigger);
    if (typeof SplitText !== "undefined") plugins.push(SplitText);
    gsap.registerPlugin(...plugins);
}

// Initialize Lenis Smooth Scroll
function initLenis() {
    const LenisLib = window.Lenis || (typeof Lenis !== "undefined" ? Lenis : null);
    if (!LenisLib) return;

    const lenis = new LenisLib({
        lerp: 0.1,
        smoothWheel: true,
        smoothTouch: false
    });

    lenis.on('scroll', () => {
        if (typeof ScrollTrigger !== "undefined") {
            ScrollTrigger.update();
        }
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    window.lenis = lenis;
}

// Hero Animation
function initHeroAnimation() {
    const title = document.getElementById("hero-title");
    const tagline = document.getElementById("hero-tagline");
    const description = document.getElementById("hero-description");

    if (!title || !tagline || !description) return;

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    if (typeof SplitText !== "undefined") {
        const split = new SplitText(title, { type: "chars" });
        gsap.set(split.chars, { opacity: 0, y: 20 });
        tl.to(split.chars, {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.05
        });
    } else {
        gsap.set(title, { opacity: 0, y: 20 });
        tl.to(title, {
            opacity: 1,
            y: 0,
            duration: 1
        });
    }

    gsap.set([tagline, description], { opacity: 0, y: 20 });

    tl.to([tagline, description], {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.05
    }, 0.6);
}

// Dashboard Animation
function initDashboardAnimation() {
    const track = document.getElementById("dashboard-track");
    const toggleBtn = document.getElementById("slider-toggle");
    const toggleIcon = document.getElementById("toggle-icon");
    const toggleText = document.getElementById("toggle-text");
    const prevBtn = document.getElementById("prev-slide");
    const nextBtn = document.getElementById("next-slide");

    if (!track) return;

    const slides = track.querySelectorAll('.dashboard-slide');
    if (!slides.length) return;

    let currentIndex = 0;
    let isInteracting = false;
    let autoPlayEnabled = true;

    // Optimized Visual Update
    const updateVisuals = () => {
        const trackCenter = track.scrollLeft + (track.offsetWidth / 2);
        const maxDistance = track.offsetWidth / 1.5;
        
        slides.forEach((slide) => {
            const slideCenter = slide.offsetLeft + (slide.offsetWidth / 2);
            const distanceFromCenter = Math.abs(trackCenter - slideCenter);
            
            const scale = Math.max(0.9, 1 - (distanceFromCenter / maxDistance) * 0.1);
            const opacity = Math.max(0.3, 1 - (distanceFromCenter / maxDistance) * 0.7);
            
            // Use set for immediate, performant updates during scroll
            gsap.set(slide.firstElementChild, {
                scale: scale,
                opacity: opacity,
                force3D: true // Enable hardware acceleration
            });
        });
    };

    const goToSlide = (index) => {
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;
        currentIndex = index;
        
        const slide = slides[currentIndex];
        const targetOffset = slide.offsetLeft - (track.offsetWidth / 2) + (slide.offsetWidth / 2);
        
        // Use a high-performance ease for sliding
        gsap.to(track, {
            scrollLeft: targetOffset,
            duration: 1.2,
            ease: "expo.inOut",
            onUpdate: updateVisuals,
            overwrite: true
        });
    };

    // Auto-advance - ONLY ON DESKTOP
    if (window.innerWidth >= 1024) {
        const interval = setInterval(() => {
            if (!isInteracting && autoPlayEnabled) {
                goToSlide(currentIndex + 1);
            }
        }, 5000);
    }

    // Toggle logic
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            autoPlayEnabled = !autoPlayEnabled;
            if (autoPlayEnabled) {
                toggleText.textContent = "Auto-Play On";
                toggleIcon.classList.remove('bg-slate-400');
                toggleIcon.classList.add('bg-green-500', 'animate-pulse');
            } else {
                toggleText.textContent = "Auto-Play Off";
                toggleIcon.classList.remove('bg-green-500', 'animate-pulse');
                toggleIcon.classList.add('bg-slate-400');
            }
        });
    }

    // Navigation logic
    const handleNav = (dir) => {
        isInteracting = true;
        goToSlide(currentIndex + dir);
        // Resume auto-play check after a delay
        setTimeout(() => { if (!track.matches(':active')) isInteracting = false; }, 4000);
    };

    if (prevBtn) prevBtn.addEventListener('click', () => handleNav(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => handleNav(1));

    // Manual Interaction Handling
    track.addEventListener('mouseenter', () => isInteracting = true);
    track.addEventListener('mouseleave', () => isInteracting = false);
    track.addEventListener('mousedown', () => isInteracting = true);
    window.addEventListener('mouseup', () => isInteracting = false);
    
    // Touch interaction
    track.addEventListener('touchstart', () => isInteracting = true, { passive: true });
    track.addEventListener('touchend', () => isInteracting = false, { passive: true });

    // Ensure visuals stay in sync during manual scroll
    track.addEventListener('scroll', () => {
        updateVisuals();
        if (isInteracting) {
            const scrollLeft = track.scrollLeft;
            const slideWidth = slides[0].offsetWidth + 24;
            currentIndex = Math.round((scrollLeft + (track.offsetWidth / 2) - (slides[0].offsetWidth / 2)) / slideWidth);
        }
    }, { passive: true });

    // Initial sync
    updateVisuals();
}

// Work With Animation
function initWorkWithAnimation() {
    const cards = gsap.utils.toArray("[data-workwith-card]");
    const container = document.getElementById("workwith-cards");
    const logosTrack = document.getElementById("logos-track");

    if (logosTrack && window.innerWidth >= 1024) {
        gsap.to(logosTrack, {
            xPercent: -50,
            repeat: -1,
            duration: 30,
            ease: "none"
        });
    }

    if (!cards.length) return;

    if (window.innerWidth < 1024) {
        gsap.set(cards, { autoAlpha: 1, yPercent: 0, scale: 1 });
        return;
    }

    gsap.set(cards, { autoAlpha: 0, yPercent: 110, scale: 0.96 });
    gsap.set(cards[0], { autoAlpha: 1, yPercent: 0, scale: 1 });

    if (typeof ScrollTrigger === "undefined") return;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: container,
            start: "top 25%",
            end: () => `+=${cards.length * 600}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1
        }
    });

    cards.forEach((card, index) => {
        const chars = card.querySelectorAll("[data-workwith-char]");
        const reveals = card.querySelectorAll("[data-workwith-reveal]");
        const accent = card.dataset.accent;
        const start = index * 0.85;

        gsap.set(chars, { color: "#94a3b8" });

        if (index === 0) {
            gsap.set(chars, { color: accent });
            return;
        }

        const prev = cards[index - 1];

        tl.to(card, { autoAlpha: 1, yPercent: 0, scale: 1 }, start);
        tl.to(prev, { autoAlpha: 0.03, yPercent: -14, scale: 0.9, filter: "blur(16px)" }, start);
        tl.to(chars, { color: accent, stagger: 0.03 }, start + 0.2);
        tl.fromTo(reveals, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, stagger: 0.08 }, start + 0.1);
    });
}

// About Animation
function initAboutAnimations() {
    const section = document.getElementById("about-section");
    const title = document.getElementById("about-title");
    const lead = document.getElementById("about-lead");
    const cards = gsap.utils.toArray("[data-about-card]");
    const orbs = gsap.utils.toArray(".about-orb");
    const shapes = gsap.utils.toArray(".about-shape");

    gsap.set([title, lead, cards], { opacity: 0, y: 28 });

    if (typeof ScrollTrigger !== "undefined") {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 72%"
            }
        });

        tl.to(title, { opacity: 1, y: 0, duration: 0.9 });
        tl.to(lead, { opacity: 1, y: 0, duration: 0.7 }, "-=0.4");
        tl.to(cards, { opacity: 1, y: 0, duration: 0.75, stagger: 0.1 }, "-=0.2");
    }

    // Floating Prop Animation
    const prop = document.querySelector(".about-prop");
    if (prop) {
        gsap.to(prop, {
            y: "+=30",
            x: "+=20",
            rotation: "+=5",
            duration: 8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }

    orbs.forEach((orb, index) => {
        gsap.to(orb, {
            x: index % 2 ? -20 : 20,
            y: index % 2 ? 20 : -20,
            duration: 6 + index,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    });

    shapes.forEach((shape, index) => {
        gsap.to(shape, {
            rotate: index % 2 ? -12 : 12,
            duration: 8 + index,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    });
}

// Counter Animation
function initCounterAnimation() {
    const stats = document.querySelectorAll(".stat-number");
    const container = document.getElementById("about-kpis");

    if (!stats.length || !container || typeof ScrollTrigger === "undefined") return;

    ScrollTrigger.create({
        trigger: container,
        start: "top 95%",
        once: true,
        onEnter: () => {
            stats.forEach(stat => {
                const target = parseInt(stat.getAttribute("data-target"));
                const suffix = stat.getAttribute("data-suffix") || "";
                const obj = { value: 0 };

                gsap.to(obj, {
                    value: target,
                    duration: 2,
                    ease: "power2.out",
                    onUpdate: () => {
                        const val = Math.floor(obj.value);
                        if (stat._prevVal !== val) {
                            stat.textContent = val + suffix;
                            stat._prevVal = val;
                        }
                    }
                });
            });
        }
    });
}

// Header & Navigation Logic
function initNav() {
    const menuToggle = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-navigation");
    const bar1 = document.getElementById("menu-bar-1");
    const bar2 = document.getElementById("menu-bar-2");
    const bar3 = document.getElementById("menu-bar-3");

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener("click", () => {
            const isHidden = mobileMenu.classList.contains("hidden");
            
            if (isHidden) {
                // Open menu
                mobileMenu.classList.remove("hidden");
                // Hamburger to X
                gsap.to(bar1, { top: "6px", rotation: 45, duration: 0.3 });
                gsap.to(bar2, { opacity: 0, x: -10, duration: 0.3 });
                gsap.to(bar3, { top: "6px", rotation: -45, duration: 0.3 });
            } else {
                // Close menu
                mobileMenu.classList.add("hidden");
                // X to Hamburger
                gsap.to(bar1, { top: "0", rotation: 0, duration: 0.3 });
                gsap.to(bar2, { opacity: 1, x: 0, duration: 0.3 });
                gsap.to(bar3, { top: "12px", rotation: 0, duration: 0.3 });
            }
        });
    }

    const subscribeForm = document.getElementById("footer-subscribe-form");
    const subscribeButton = document.getElementById("footer-subscribe-button");

    if (subscribeForm) {
        subscribeForm.addEventListener("submit", event => {
            event.preventDefault();
            if (subscribeButton) {
                subscribeButton.textContent = "Subscribed";
                subscribeButton.classList.add("bg-green-600");
            }
        });
    }
}

// Request a Demo Modal Logic
function initDemoModal() {
    const modal = document.getElementById("demo-modal");
    const openBtn = document.getElementById("request-demo-btn");
    const closeBtn = document.getElementById("close-modal");
    const backdrop = document.getElementById("modal-backdrop");
    const content = document.getElementById("modal-content");
    const form = document.getElementById("demo-form");
    const captchaBox = document.getElementById("captcha-box");
    const captchaCheck = document.getElementById("captcha-check");

    if (!modal || !openBtn || !closeBtn || !content) return;

    let isCaptchaVerified = false;

    const openModal = () => {
        modal.classList.remove("hidden");
        modal.classList.add("flex");
        
        // Disable scroll
        document.body.style.overflow = "hidden";
        if (window.lenis) window.lenis.stop();

        const tl = gsap.timeline();
        tl.to(backdrop, { opacity: 1, duration: 0.4, ease: "power2.out" });
        tl.to(content, { 
            opacity: 1, 
            scale: 1, 
            duration: 0.5, 
            ease: "back.out(1.7)" 
        }, "-=0.2");
    };

    const closeModal = () => {
        const tl = gsap.timeline({
            onComplete: () => {
                modal.classList.add("hidden");
                modal.classList.remove("flex");
                // Re-enable scroll
                document.body.style.overflow = "";
                if (window.lenis) window.lenis.start();
            }
        });

        tl.to(content, { opacity: 0, scale: 0.95, duration: 0.3, ease: "power2.in" });
        tl.to(backdrop, { opacity: 0, duration: 0.3, ease: "power2.in" }, "-=0.1");
    };

    openBtn.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);
    backdrop.addEventListener("click", closeModal);

    // Captcha Logic
    if (captchaBox) {
        captchaBox.addEventListener("click", () => {
            isCaptchaVerified = !isCaptchaVerified;
            if (isCaptchaVerified) {
                captchaCheck.classList.remove("hidden");
                captchaBox.classList.add("border-green-500", "bg-green-50");
            } else {
                captchaCheck.classList.add("hidden");
                captchaBox.classList.remove("border-green-500", "bg-green-50");
            }
        });
    }

    // Form Logic
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            
            if (!isCaptchaVerified) {
                alert("Please verify that you are not a robot.");
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";
            submitBtn.classList.add("opacity-70");

            // Simulate API call
            setTimeout(() => {
                submitBtn.textContent = "Success!";
                submitBtn.classList.remove("bg-[#12324d]");
                submitBtn.classList.add("bg-green-600");

                setTimeout(() => {
                    closeModal();
                    // Reset form after closing
                    setTimeout(() => {
                        form.reset();
                        isCaptchaVerified = false;
                        captchaCheck.classList.add("hidden");
                        captchaBox.classList.remove("border-green-500", "bg-green-50");
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                        submitBtn.classList.remove("bg-green-600", "opacity-70");
                        submitBtn.classList.add("bg-[#12324d]");
                    }, 500);
                }, 1500);
            }, 1500);
        });
    }
}

// Header Scroll Behavior
function initHeaderScroll() {
    const header = document.querySelector("header");
    if (!header) return;

    const handleScroll = () => {
        if (window.scrollY > 20) {
            header.classList.add("header-scrolled");
        } else {
            header.classList.remove("header-scrolled");
        }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
}

// Initialization
function init() {
    initNav();
    initHeaderScroll();
    initDemoModal();
    initCounterAnimation();

    if (typeof gsap !== "undefined") {
        const mm = gsap.matchMedia();

        mm.add("(min-width: 1024px)", () => {
            initLenis();
            initHeroAnimation();
            initDashboardAnimation();
            initWorkWithAnimation();
            initAboutAnimations();
        });

        mm.add("(max-width: 1023px)", () => {
            // Ensure elements are visible on mobile
            gsap.set(["#hero-title", "#hero-tagline", "#hero-description", "[data-about-card]", "[data-workwith-card]"], { 
                opacity: 1, 
                y: 0, 
                autoAlpha: 1, 
                scale: 1,
                visibility: "visible"
            });
            
            // For Work With Section mobile layout
            const workWithMobile = document.getElementById("workwith-mobile");
            if (workWithMobile) {
                gsap.set("[data-workwith-mobile-card]", { opacity: 1, y: 0 });
            }
        });
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}