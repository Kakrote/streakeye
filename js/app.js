// Register GSAP Plugins
if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// 1. Interactive spotlight follower tracking cursor
function initSpotlightFollower() {
    const spotlight = document.getElementById("spotlight");
    if (!spotlight) return;

    window.addEventListener("mousemove", (e) => {
        gsap.to(spotlight, {
            x: e.clientX,
            y: e.clientY,
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
            overwrite: "auto"
        });
    });

    document.addEventListener("mouseleave", () => {
        gsap.to(spotlight, {
            opacity: 0,
            duration: 0.8
        });
    });
}

// 2. 3D Bento Card Tilt hover effect and border coordinates tracking
function initCardTiltGlows() {
    const cards = document.querySelectorAll(".glass-bento");
    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);

            const xc = rect.width / 2;
            const yc = rect.height / 2;
            const tiltX = (yc - y) / 10; // tilt angle
            const tiltY = (x - xc) / 10;

            gsap.to(card, {
                rotateX: tiltX,
                rotateY: tiltY,
                scale: 1.02,
                duration: 0.35,
                ease: "power2.out",
                overwrite: "auto"
            });
        });

        card.addEventListener("mouseleave", () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                duration: 0.65,
                ease: "power3.out",
                overwrite: "auto"
            });
        });
    });
}

// 3. Magnetic pull animation for CTA buttons
function initMagneticButtons() {
    const btns = document.querySelectorAll(".magnetic-btn");
    btns.forEach(btn => {
        btn.addEventListener("mousemove", (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: x * 0.35,
                y: y * 0.35,
                scale: 1.02,
                duration: 0.3,
                ease: "power2.out",
                overwrite: "auto"
            });
        });

        btn.addEventListener("mouseleave", () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                scale: 1,
                duration: 0.6,
                ease: "elastic.out(1.1, 0.35)",
                overwrite: "auto"
            });
        });
    });
}

// 4. Animated GPS connection path drawing & tracking marker
function initGpsRouteAnimation() {
    const route = document.getElementById("route-path");
    const marker = document.getElementById("gps-marker");
    if (!route || !marker) return;

    gsap.set(route, { strokeDashoffset: 1000, strokeDasharray: 1000 });

    gsap.to(route, {
        strokeDashoffset: 0,
        duration: 3,
        ease: "power2.out"
    });

    const pathLength = route.getTotalLength();
    const trackerObj = { progress: 0 };

    gsap.to(trackerObj, {
        progress: 1,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        onUpdate: () => {
            const point = route.getPointAtLength(trackerObj.progress * pathLength);
            gsap.set(marker, {
                x: point.x,
                y: point.y
            });
        }
    });
}

// 5. About section connected nodes laser line pulsing connection
function initAboutLaserPulses() {
    const lasers = ["#laser-1", "#laser-2", "#laser-3"];
    lasers.forEach(laserId => {
        const path = document.querySelector(laserId);
        if (!path) return;

        const length = path.getTotalLength();
        gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length
        });

        gsap.to(path, {
            strokeDashoffset: 0,
            duration: 2.2 + Math.random() * 1.2,
            repeat: -1,
            ease: "power1.inOut",
            delay: Math.random() * 0.5
        });
    });
}

// 6. Text stagger reveals on hero section on load
function initHeroAnimation() {
    const title = document.getElementById("hero-title");
    const tagline = document.getElementById("hero-tagline");
    const desc = document.getElementById("hero-description");
    const btns = document.querySelectorAll(".magnetic-btn");
    const mockup = document.querySelector(".browser-mockup");

    if (!title || !tagline) return;

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.to(title, {
        y: 0,
        duration: 1.2
    });

    tl.to(tagline, {
        y: 0,
        duration: 1.0
    }, "-=0.8");

    if (desc) {
        gsap.set(desc, { opacity: 0, y: 15 });
        tl.to(desc, {
            opacity: 1,
            y: 0,
            duration: 0.8
        }, "-=0.7");
    }

    if (btns.length) {
        gsap.set(btns, { opacity: 0, y: 15 });
        tl.to(btns, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1
        }, "-=0.7");
    }

    if (mockup) {
        gsap.set(mockup, { opacity: 0, scale: 0.96, rotateY: -15 });
        tl.to(mockup, {
            opacity: 1,
            scale: 1,
            rotateY: -12,
            duration: 1.2,
            ease: "back.out(1.1)"
        }, "-=0.9");
    }
}

// 7. Product slideshow track sliding and scale carousel animations
function initDashboardAnimation() {
    const track = document.getElementById("dashboard-track");
    const prevBtn = document.getElementById("prev-slide");
    const nextBtn = document.getElementById("next-slide");

    if (!track) return;

    const slides = track.querySelectorAll('.dashboard-slide');
    if (!slides.length) return;

    let currentIndex = 0;
    let isInteracting = false;

    const updateVisuals = () => {
        const trackCenter = track.scrollLeft + (track.offsetWidth / 2);
        const maxDistance = track.offsetWidth / 1.5;
        
        slides.forEach((slide) => {
            const slideCenter = slide.offsetLeft + (slide.offsetWidth / 2);
            const distanceFromCenter = Math.abs(trackCenter - slideCenter);
            
            const scale = Math.max(0.92, 1 - (distanceFromCenter / maxDistance) * 0.08);
            const opacity = Math.max(0.5, 1 - (distanceFromCenter / maxDistance) * 0.5);
            
            gsap.set(slide.firstElementChild, {
                scale: scale,
                opacity: opacity,
                force3D: true
            });
        });
    };

    const goToSlide = (index) => {
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;
        currentIndex = index;
        
        const slide = slides[currentIndex];
        const targetOffset = slide.offsetLeft - (track.offsetWidth / 2) + (slide.offsetWidth / 2);
        
        gsap.to(track, {
            scrollLeft: targetOffset,
            duration: 0.85,
            ease: "power3.inOut",
            onUpdate: updateVisuals,
            overwrite: true
        });
    };

    const handleNav = (dir) => {
        isInteracting = true;
        goToSlide(currentIndex + dir);
        setTimeout(() => { isInteracting = false; }, 2500);
    };

    if (prevBtn) prevBtn.addEventListener('click', () => handleNav(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => handleNav(1));

    track.addEventListener('scroll', () => {
        updateVisuals();
        if (!isInteracting) {
            const scrollLeft = track.scrollLeft;
            const slideWidth = slides[0].offsetWidth + 24;
            currentIndex = Math.round((scrollLeft + (track.offsetWidth / 2) - (slides[0].offsetWidth / 2)) / slideWidth);
        }
    }, { passive: true });

    updateVisuals();
}

// 8. Interactive Split-screen device mockup scrolling triggers (Work With Section)
function initWorkWithAnimation() {
    const cards = gsap.utils.toArray("[data-workwith-card-ref]");
    const screens = [
        document.getElementById("phone-screen-1"),
        document.getElementById("phone-screen-2"),
        document.getElementById("phone-screen-3")
    ];

    if (!cards.length || !screens[0]) return;

    if (window.innerWidth < 1024) {
        // Safe fallback for mobile: make progress borders filled statically
        cards.forEach(card => {
            const bar = card.querySelector(".card-progress-bar");
            if (bar) gsap.set(bar, { height: "100%" });
        });
        return;
    }

    cards.forEach((card, index) => {
        const ref = parseInt(card.dataset.workwithCardRef);
        const progressBar = card.querySelector(".card-progress-bar");
        
        ScrollTrigger.create({
            trigger: card,
            start: "top 60%",
            end: "bottom 40%",
            scrub: true,
            onUpdate: (self) => {
                if (progressBar) {
                    gsap.set(progressBar, { height: `${self.progress * 100}%` });
                }
            },
            onToggle: (self) => {
                if (self.isActive) {
                    activateScreen(ref - 1);
                    card.classList.add("active-split-nav", "shadow-md", "border-blue-200");
                    card.classList.remove("border-slate-200");
                } else {
                    card.classList.remove("active-split-nav", "shadow-md", "border-blue-200");
                    card.classList.add("border-slate-200");
                    if (progressBar) {
                        gsap.set(progressBar, { height: "0%" });
                    }
                }
            }
        });
    });

    function activateScreen(index) {
        screens.forEach((screen, i) => {
            if (i === index) {
                gsap.to(screen, { opacity: 1, duration: 0.45, ease: "power2.out" });
            } else {
                gsap.to(screen, { opacity: 0, duration: 0.45, ease: "power2.out" });
            }
        });
    }
}

// 9. Viewport enter counting stats animation
function initCounterAnimation() {
    const stats = document.querySelectorAll(".stat-number");
    const container = document.getElementById("about-kpis");

    if (!stats.length || !container || typeof ScrollTrigger === "undefined") return;

    ScrollTrigger.create({
        trigger: container,
        start: "top 85%",
        once: true,
        onEnter: () => {
            stats.forEach(stat => {
                const target = parseFloat(stat.getAttribute("data-target"));
                const suffix = stat.getAttribute("data-suffix") || "";
                const obj = { value: 0 };

                gsap.to(obj, {
                    value: target,
                    duration: 2.0,
                    ease: "power3.out",
                    onUpdate: () => {
                        const val = Math.floor(obj.value * 10) / 10;
                        const formatted = (val % 1 === 0) ? Math.floor(val) : val;
                        stat.textContent = formatted + suffix;
                    }
                });
            });
        }
    });
}

// 10. Shapes float effects loop float triggers
function initAboutAnimations() {
    const section = document.getElementById("about-section");
    const title = document.getElementById("about-title");
    const lead = document.getElementById("about-lead");
    const cards = gsap.utils.toArray("[data-about-card]");
    const shapes = gsap.utils.toArray(".about-shape");

    if (!section) return;

    gsap.set([title, lead, cards], { opacity: 0, y: 20 });

    if (typeof ScrollTrigger !== "undefined") {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 80%"
            }
        });

        tl.to(title, { opacity: 1, y: 0, duration: 0.8 });
        tl.to(lead, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4");
        tl.to(cards, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, "-=0.3");
    }

    shapes.forEach((shape, index) => {
        gsap.to(shape, {
            rotate: index % 2 ? -12 : 12,
            y: "+=8",
            duration: 5 + index,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    });
}

// 11. Mobile hamburger menu drawer navigation toggles
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
                mobileMenu.classList.remove("hidden");
                gsap.to(bar1, { top: "6px", rotation: 45, duration: 0.25 });
                gsap.to(bar2, { opacity: 0, x: -10, duration: 0.25 });
                gsap.to(bar3, { top: "6px", rotation: -45, duration: 0.25 });
            } else {
                mobileMenu.classList.add("hidden");
                gsap.to(bar1, { top: "0", rotation: 0, duration: 0.25 });
                gsap.to(bar2, { opacity: 1, x: 0, duration: 0.25 });
                gsap.to(bar3, { top: "12px", rotation: 0, duration: 0.25 });
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
                subscribeButton.classList.remove("from-blue-600", "to-sky-500");
                subscribeButton.classList.add("bg-green-600");
            }
        });
    }
}

// 12. Captcha verification simulation and demo request modal trigger
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
        
        document.body.style.overflow = "hidden";
        if (window.lenis) window.lenis.stop();

        const tl = gsap.timeline();
        tl.to(backdrop, { opacity: 1, duration: 0.3, ease: "power2.out" });
        tl.to(content, { 
            opacity: 1, 
            scale: 1, 
            duration: 0.45, 
            ease: "back.out(1.4)" 
        }, "-=0.15");
    };

    const closeModal = () => {
        const tl = gsap.timeline({
            onComplete: () => {
                modal.classList.add("hidden");
                modal.classList.remove("flex");
                document.body.style.overflow = "";
                if (window.lenis) window.lenis.start();
            }
        });

        tl.to(content, { opacity: 0, scale: 0.94, duration: 0.25, ease: "power2.in" });
        tl.to(backdrop, { opacity: 0, duration: 0.25, ease: "power2.in" }, "-=0.1");
    };

    openBtn.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);
    backdrop.addEventListener("click", closeModal);

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

            setTimeout(() => {
                submitBtn.textContent = "Success!";
                submitBtn.classList.add("bg-green-600");

                setTimeout(() => {
                    closeModal();
                    setTimeout(() => {
                        form.reset();
                        isCaptchaVerified = false;
                        captchaCheck.classList.add("hidden");
                        captchaBox.classList.remove("border-green-500", "bg-green-50");
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                        submitBtn.classList.remove("bg-green-600", "opacity-70");
                    }, 500);
                }, 1500);
            }, 1500);
        });
    }
}

// Scrolled trigger style for header scroll effect
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

// Master init loader
function init() {
    initNav();
    initHeaderScroll();
    initDemoModal();
    initCounterAnimation();
    initSpotlightFollower();
    initCardTiltGlows();
    initMagneticButtons();
    initGpsRouteAnimation();
    initAboutLaserPulses();

    if (typeof gsap !== "undefined") {
        const mm = gsap.matchMedia();

        mm.add("(min-width: 1024px)", () => {
            initHeroAnimation();
            initDashboardAnimation();
            initWorkWithAnimation();
            initAboutAnimations();
        });

        mm.add("(max-width: 1023px)", () => {
            gsap.set(["#hero-title", "#hero-tagline", "#hero-description", "[data-about-card]"], { 
                opacity: 1, 
                y: 0, 
                autoAlpha: 1, 
                scale: 1,
                visibility: "visible"
            });
            gsap.set(".card-progress-bar", { height: "100%" });
        });
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}