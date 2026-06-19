(function () {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: true });
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false };
    const particles = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationId = 0;

    canvas.className = 'ion-background';
    canvas.setAttribute('aria-hidden', 'true');

    const style = document.createElement('style');
    style.textContent =
        '.ion-background {' +
        'position: fixed; inset: 0; width: 100vw; height: 100vh;' +
        'z-index: 0; pointer-events: none; opacity: .9;' +
        '}' +
        'body > :not(.ion-background) { position: relative; z-index: 1; }';

    function isDark() {
        return document.documentElement.classList.contains('dark');
    }

    function particleCount() {
        const area = window.innerWidth * window.innerHeight;
        return Math.max(42, Math.min(86, Math.floor(area / 17000)));
    }

    function createParticle() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            size: 0.9 + Math.random() * 1.8,
            phase: Math.random() * Math.PI * 2
        };
    }

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const target = particleCount();
        while (particles.length < target) particles.push(createParticle());
        while (particles.length > target) particles.pop();
    }

    function paintSurface(dark) {
        if (!pointer.active) return;

        const radius = 300;
        const surface = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, radius);
        surface.addColorStop(0, dark ? 'rgba(226, 232, 240, 0.055)' : 'rgba(15, 23, 42, 0.035)');
        surface.addColorStop(0.55, dark ? 'rgba(148, 163, 184, 0.028)' : 'rgba(100, 116, 139, 0.018)');
        surface.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = surface;
        ctx.fillRect(0, 0, width, height);
    }

    function updateParticle(p, index) {
        const dx = pointer.x - p.x;
        const dy = pointer.y - p.y;
        const distance = Math.max(Math.hypot(dx, dy), 1);
        const radius = pointer.active ? 245 : 0;

        if (distance < radius) {
            const force = Math.pow(1 - distance / radius, 2) * 0.08;
            p.vx += (dx / distance) * force + (-dy / distance) * force * 0.26;
            p.vy += (dy / distance) * force + (dx / distance) * force * 0.26;
        }

        p.phase += 0.012 + index * 0.00003;
        p.vx += Math.cos(p.phase) * 0.004;
        p.vy += Math.sin(p.phase * 0.9) * 0.004;
        p.vx *= 0.965;
        p.vy *= 0.965;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;
    }

    function draw() {
        const dark = isDark();
        ctx.clearRect(0, 0, width, height);
        paintSurface(dark);

        for (let i = 0; i < particles.length; i += 1) {
            const a = particles[i];
            if (!prefersReducedMotion) updateParticle(a, i);

            for (let j = i + 1; j < particles.length; j += 1) {
                const b = particles[j];
                const dist = Math.hypot(a.x - b.x, a.y - b.y);
                if (dist < 118) {
                    const alpha = (1 - dist / 118) * (dark ? 0.12 : 0.085);
                    ctx.strokeStyle = dark ? 'rgba(203, 213, 225, ' + alpha + ')' : 'rgba(71, 85, 105, ' + alpha + ')';
                    ctx.lineWidth = 0.65;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        for (const p of particles) {
            ctx.fillStyle = dark ? 'rgba(226, 232, 240, 0.64)' : 'rgba(51, 65, 85, 0.45)';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }

        if (!prefersReducedMotion) animationId = requestAnimationFrame(draw);
    }

    function movePointer(event) {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        pointer.active = true;
    }

    function init() {
        document.head.appendChild(style);
        document.body.prepend(canvas);
        resize();
        draw();
        window.addEventListener('resize', resize, { passive: true });
        window.addEventListener('pointermove', movePointer, { passive: true });
        window.addEventListener('pointerleave', () => { pointer.active = false; }, { passive: true });
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) cancelAnimationFrame(animationId);
            else if (!prefersReducedMotion) draw();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
}());
