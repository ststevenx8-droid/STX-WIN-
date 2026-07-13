// GSAP Motion and Smooth Transition Layer for STX WIN

document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap !== "undefined") {
        // Hero entry elements sequence
        gsap.from(".hero-content > *", {
            opacity: 0,
            y: 35,
            duration: 1.2,
            stagger: 0.15,
            ease: "power4.out"
        });

        // Hero Art element load 
        gsap.from(".hero-banner-art", {
            opacity: 0,
            scale: 0.85,
            duration: 1.5,
            ease: "elastic.out(1, 0.75)"
        });

        // Smooth Game Cards loading sequence
        gsap.from(".game-card", {
            opacity: 0,
            y: 20,
            duration: 0.8,
            stagger: 0.08,
            ease: "power2.out",
            delay: 0.3
        });
    }
});
