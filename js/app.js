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
    const cards = document.querySelectorAll(".bento-card, .glass-bento");
    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);

            const xc = rect.width / 2;
            const yc = rect.height / 2;
            const tiltX = (yc - y) / 15; // subtle tilt angle
            const tiltY = (x - xc) / 15;

            gsap.to(card, {
                rotateX: tiltX,
                rotateY: tiltY,
                duration: 0.35,
                ease: "power2.out",
                overwrite: "auto"
            });
        });

        card.addEventListener("mouseleave", () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
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
    const mockup = document.querySelector(".browser-container");

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
        gsap.set(mockup, { opacity: 0, scale: 0.95, y: 30 });
        tl.to(mockup, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out"
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
    let autoScrollTimer = null;

    const updateVisuals = () => {
        const trackCenter = track.scrollLeft + (track.offsetWidth / 2);
        const maxDistance = track.offsetWidth / 1.5;
        
        slides.forEach((slide) => {
            const slideInner = slide.firstElementChild;
            if (!slideInner) return;
            
            const slideCenter = slide.offsetLeft + (slide.offsetWidth / 2);
            const distanceFromCenter = Math.abs(trackCenter - slideCenter);
            
            const scale = Math.max(0.92, 1 - (distanceFromCenter / maxDistance) * 0.08);
            const opacity = Math.max(0.5, 1 - (distanceFromCenter / maxDistance) * 0.5);
            
            gsap.set(slideInner, {
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

    const startAutoScroll = () => {
        stopAutoScroll();
        autoScrollTimer = setInterval(() => {
            if (!isInteracting) {
                goToSlide(currentIndex + 1);
            }
        }, 3000);
    };

    const stopAutoScroll = () => {
        if (autoScrollTimer) {
            clearInterval(autoScrollTimer);
            autoScrollTimer = null;
        }
    };

    const handleNav = (dir) => {
        isInteracting = true;
        goToSlide(currentIndex + dir);
        startAutoScroll();
        setTimeout(() => { isInteracting = false; }, 3000);
    };

    if (prevBtn) prevBtn.addEventListener('click', () => handleNav(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => handleNav(1));

    track.addEventListener('scroll', () => {
        updateVisuals();
        if (!isInteracting) {
            const scrollLeft = track.scrollLeft;
            const slideWidth = slides[0].offsetWidth + 32; // adjusted gap spacing
            currentIndex = Math.round((scrollLeft + (track.offsetWidth / 2) - (slides[0].offsetWidth / 2)) / slideWidth);
        }
    }, { passive: true });

    track.addEventListener("mouseenter", stopAutoScroll);
    track.addEventListener("mouseleave", startAutoScroll);
    track.addEventListener("touchstart", stopAutoScroll, { passive: true });
    track.addEventListener("touchend", startAutoScroll, { passive: true });

    updateVisuals();
    startAutoScroll();
}

// 8. Interactive Tab Panel Switcher (Work With Section)
function initWorkWithAnimation() {
    const tabs = document.querySelectorAll("[data-workwith-card-ref]");
    const screens = [
        document.getElementById("phone-screen-1"),
        document.getElementById("phone-screen-2"),
        document.getElementById("phone-screen-3")
    ];

    if (!tabs.length || !screens[0]) return;

    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => {
            const isCurrentlyActive = tab.classList.contains("active-split-nav");
            const checklistGrid = tab.querySelector(".checklist-grid");
            const chevron = tab.querySelector(".active-chevron");
            const hint = tab.querySelector(".toggle-hint");
            
            // Check if the clicked tab's checklist is currently expanded
            let isChecklistOpen = false;
            if (checklistGrid) {
                const heightVal = checklistGrid.style.height;
                isChecklistOpen = (heightVal !== "0px" && checklistGrid.getBoundingClientRect().height > 0);
            }

            if (isCurrentlyActive) {
                // If clicked the already active tab, toggle its collapsed state
                if (isChecklistOpen) {
                    // Collapse checklist
                    gsap.to(checklistGrid, {
                        height: 0,
                        opacity: 0,
                        marginTop: 0,
                        paddingTop: 0,
                        borderTopWidth: 0,
                        duration: 0.4,
                        ease: "power2.inOut"
                    });
                    if (chevron) {
                        gsap.to(chevron, { rotation: 0, duration: 0.3 });
                    }
                    if (hint) {
                        hint.textContent = "Expand";
                        hint.classList.remove("text-emerald-600");
                        hint.classList.add("text-zinc-400");
                    }
                } else {
                    // Expand checklist
                    gsap.to(checklistGrid, {
                        height: "auto",
                        opacity: 1,
                        marginTop: 24,
                        paddingTop: 24,
                        borderTopWidth: 1,
                        duration: 0.4,
                        ease: "power2.inOut"
                    });
                    if (chevron) {
                        gsap.to(chevron, { rotation: 180, duration: 0.3 });
                    }
                    if (hint) {
                        hint.textContent = "Collapse";
                        hint.classList.remove("text-zinc-400");
                        hint.classList.add("text-emerald-600");
                    }
                }
            } else {
                // Clicking a different tab:
                // 1. Deactivate all other tabs and collapse their checklists
                tabs.forEach((t) => {
                    if (t !== tab) {
                        t.classList.remove("active-split-nav", "border-emerald-500");
                        t.classList.add("border-transparent");
                        
                        const otherGrid = t.querySelector(".checklist-grid");
                        const otherChevron = t.querySelector(".active-chevron");
                        const otherHint = t.querySelector(".toggle-hint");
                        
                        if (otherGrid) {
                            gsap.to(otherGrid, {
                                height: 0,
                                opacity: 0,
                                marginTop: 0,
                                paddingTop: 0,
                                borderTopWidth: 0,
                                duration: 0.4,
                                ease: "power2.inOut"
                            });
                        }
                        if (otherChevron) {
                            gsap.to(otherChevron, { rotation: 0, duration: 0.3 });
                        }
                        if (otherHint) {
                            otherHint.textContent = "Expand";
                            otherHint.classList.remove("text-emerald-600");
                            otherHint.classList.add("text-zinc-400");
                        }
                    }
                });

                // 2. Activate the clicked tab
                tab.classList.add("active-split-nav", "border-emerald-500");
                tab.classList.remove("border-transparent");

                // 3. Expand the clicked tab's checklist
                if (checklistGrid) {
                    gsap.to(checklistGrid, {
                        height: "auto",
                        opacity: 1,
                        marginTop: 24,
                        paddingTop: 24,
                        borderTopWidth: 1,
                        duration: 0.4,
                        ease: "power2.inOut"
                    });
                }
                if (chevron) {
                    gsap.to(chevron, { rotation: 180, duration: 0.3 });
                }
                if (hint) {
                    hint.textContent = "Collapse";
                    hint.classList.remove("text-zinc-400");
                    hint.classList.add("text-emerald-600");
                }

                // 4. Swap dynamic screen mockups on the left
                screens.forEach((screen, i) => {
                    if (i === index) {
                        gsap.to(screen, { opacity: 1, duration: 0.45, ease: "power2.out" });
                    } else {
                        gsap.to(screen, { opacity: 0, duration: 0.45, ease: "power2.out" });
                    }
                });
            }
        });
    });
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

// 10. About Section animations
function initAboutAnimations() {
    const section = document.getElementById("about-section");
    const title = document.getElementById("about-title");
    const lead = document.getElementById("about-lead");
    const cards = gsap.utils.toArray("[data-about-card]");

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
                subscribeButton.classList.remove("from-emerald-600", "to-teal-500");
                subscribeButton.classList.add("bg-emerald-600");
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
                captchaBox.classList.add("border-emerald-500", "bg-emerald-50");
            } else {
                captchaCheck.classList.add("hidden");
                captchaBox.classList.remove("border-emerald-500", "bg-emerald-50");
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
                submitBtn.classList.add("bg-emerald-600");

                setTimeout(() => {
                    closeModal();
                    setTimeout(() => {
                        form.reset();
                        isCaptchaVerified = false;
                        captchaCheck.classList.add("hidden");
                        captchaBox.classList.remove("border-emerald-500", "bg-emerald-50");
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                        submitBtn.classList.remove("bg-emerald-600", "opacity-70");
                    }, 500);
                }, 1500);
            }, 1500);
        });
    }
}

// 13. Parallax scroll animations for sections and cards
function initParallaxAnimations() {
    if (typeof ScrollTrigger === "undefined") return;

    // Hero background parallax
    const heroBg = document.querySelector(".hero-bg-parallax");
    const heroSection = document.getElementById("hero-section");
    if (heroBg && heroSection) {
        gsap.to(heroBg, {
            yPercent: -20,
            ease: "none",
            scrollTrigger: {
                trigger: heroSection,
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
    }

    // Showcase section background parallax
    const showBg = document.querySelector(".dashboard-bg-parallax");
    const showSection = document.getElementById("dashboard-preview");
    if (showBg && showSection) {
        gsap.to(showBg, {
            yPercent: -20,
            ease: "none",
            scrollTrigger: {
                trigger: showSection,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    }

    // Bento card image parallax sliding windows
    const bentoImg1 = document.querySelector(".bento-img-parallax-1");
    if (bentoImg1) {
        gsap.to(bentoImg1, {
            yPercent: -18,
            ease: "none",
            scrollTrigger: {
                trigger: bentoImg1.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    }

    const bentoImg2 = document.querySelector(".bento-img-parallax-2");
    if (bentoImg2) {
        gsap.to(bentoImg2, {
            yPercent: -18,
            ease: "none",
            scrollTrigger: {
                trigger: bentoImg2.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    }

    // Ambient glow parallax movement
    const glows = document.querySelectorAll(".ambient-glow");
    glows.forEach((glow, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        gsap.to(glow, {
            y: 120 * direction,
            x: 60 * -direction,
            ease: "none",
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 1
            }
        });
    });
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

// 14. Scroll-progress line tracking and milestone updates
function initScrollTrackingWidget() {
    const progressLine = document.getElementById("scroll-progress-line");
    const progressNode = document.getElementById("scroll-progress-node");
    const milestones = document.querySelectorAll(".scroll-milestone");

    if (!progressLine || !progressNode) return;

    // Update progress elements based on scroll
    const updateProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;

        // Scale vertical line
        gsap.set(progressLine, { scaleY: progress });
        
        // Move glowing node dot
        gsap.set(progressNode, { top: `${progress * 100}%` });

        // Highlight milestones based on current visible section
        milestones.forEach(milestone => {
            const sectionId = milestone.getAttribute("data-section");
            const section = document.getElementById(sectionId);
            if (!section) return;

            const rect = section.getBoundingClientRect();
            const viewHeight = window.innerHeight;

            // Highlight section if it's currently taking up a substantial portion of the screen
            const isInView = (rect.top <= viewHeight * 0.45 && rect.bottom >= viewHeight * 0.45) ||
                             (rect.top >= 0 && rect.top <= viewHeight * 0.3);

            if (isInView) {
                milestones.forEach(m => m.classList.remove("active-milestone"));
                milestone.classList.add("active-milestone");
            }
        });
    };

    // Add click listeners to milestones for smooth scroll
    milestones.forEach(milestone => {
        milestone.addEventListener("click", () => {
            const sectionId = milestone.getAttribute("data-section");
            const targetSection = document.getElementById(sectionId);
            if (targetSection && window.lenis) {
                window.lenis.scrollTo(targetSection, { offset: -80 });
            }
        });
    });

    window.addEventListener("scroll", updateProgress);
    updateProgress();
}

// 15. Bento card reveals on scroll
function initBentoScrollReveal() {
    const bentoGrid = document.getElementById("features-grid");
    const bentoCards = document.querySelectorAll(".bento-card");
    if (!bentoGrid || !bentoCards.length || typeof ScrollTrigger === "undefined") return;

    gsap.set(bentoCards, { opacity: 0, y: 35 });

    ScrollTrigger.batch(bentoCards, {
        start: "top 85%",
        onEnter: batch => gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            overwrite: "auto"
        }),
        once: true
    });
}

// 16. General scroll reveals for showcase section
function initShowcaseScrollReveal() {
    const section = document.getElementById("dashboard-preview");
    if (!section || typeof ScrollTrigger === "undefined") return;

    const titleBlock = section.querySelector(".container");
    const carouselTrack = section.querySelector(".group");

    if (titleBlock) {
        gsap.set(titleBlock, { opacity: 0, y: 25 });
        gsap.to(titleBlock, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: titleBlock,
                start: "top 85%",
                once: true
            }
        });
    }

    if (carouselTrack) {
        gsap.set(carouselTrack, { opacity: 0, scale: 0.98, y: 30 });
        gsap.to(carouselTrack, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.0,
            ease: "power3.out",
            scrollTrigger: {
                trigger: carouselTrack,
                start: "top 85%",
                once: true
            }
        });
    }
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
    initHeroAnimation();
    initDashboardAnimation();
    initWorkWithAnimation();
    initAboutAnimations();
    initParallaxAnimations();
    initScrollTrackingWidget();
    initBentoScrollReveal();
    initShowcaseScrollReveal();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}

// Recalculate ScrollTrigger positions in production once all images and styles are fully loaded
window.addEventListener("load", () => {
    if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
    }
});