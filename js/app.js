// STX WIN Global Context UI Controller

document.addEventListener("DOMContentLoaded", () => {
    // Dropdown Trigger Action
    const avatarBtn = document.getElementById("user-dropdown-btn");
    const dropdownMenu = document.getElementById("header-dropdown");

    if (avatarBtn && dropdownMenu) {
        avatarBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle("show");
        });

        document.addEventListener("click", () => {
            dropdownMenu.classList.remove("show");
        });
    }

    // Toggle Mobile Sidebar Drawer
    const mobileBtn = document.getElementById("mobile-menu-toggle");
    const sidebar = document.getElementById("sidebar");

    if (mobileBtn && sidebar) {
        mobileBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            sidebar.classList.toggle("open");
        });

        document.addEventListener("click", () => {
            sidebar.classList.remove("open");
        });
    }

    // Luxury Ambient Canvas Particles
    initAmbientParticles();
});

function initAmbientParticles() {
    const canvas = document.getElementById("particles-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let particlesArray = [];

    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = Math.random() * -0.6 - 0.1; // Float Upward
            this.color = Math.random() > 0.5 ? "rgba(223, 183, 108, 0.25)" : "rgba(0, 240, 255, 0.15)";
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.y < 0) {
                this.y = canvas.height;
                this.x = Math.random() * canvas.width;
            }
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        particlesArray = [];
        for (let i = 0; i < 45; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesArray.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    init();
    animate();
}
