/* =========================================================
    app.js — Gestion du mode sombre, intro et fond animé
   ========================================================= */

/* ===== MODE SOMBRE / CLAIR ===== */
const toggle = document.querySelector('.theme-toggle');
if (toggle) {
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    });
}

// Appliquer le thème enregistré
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
}

/* Révèle les éléments marqués data-reveal au chargement */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-reveal]')
        .forEach(el => el.classList.add('is-in'));
});

/* =========================================================
    INTRO : affichage progressif (nom -> fond animé)
   ========================================================= */
(() => {
    const nameEl = document.getElementById('typing-name');
    const hero = document.querySelector('.home-hero');
    if (!nameEl || !hero) return;

    // Si l'utilisateur préfère réduire les animations, on saute l'intro
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reduce) {
        hero.classList.add('intro-done');
        return;
    }

    // Quand l'animation "typing" se termine
    nameEl.addEventListener('animationend', (e) => {
        if (e.animationName === 'typing') {
            // On enlève le curseur et on déclenche le fondu du canvas
            nameEl.style.borderRightColor = 'transparent';
            hero.classList.add('intro-done');
        }
    });
})();

/* =========================================================
    FOND ANIMÉ : "code qui défile" (canvas)
   ========================================================= */
(() => {
    const canvas = document.getElementById('codebg');
    if (!canvas) return;

    // Respect des préférences utilisateur
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reduce) return;

    const ctx = canvas.getContext('2d');
    const accent = getComputedStyle(document.documentElement)
        .getPropertyValue('--accent').trim() || '#9C27B0';
    const CHARS = '01<>/{}[]();=:+-*'.split('');
    let w, h, cols, fontSize, drops;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        fontSize = Math.max(14, Math.floor(w / 80));
        cols = Math.floor(w / fontSize);
        drops = new Array(cols).fill(0);
        ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
    }

    function step() {
        const isDark = document.body.classList.contains('dark');
        ctx.fillStyle = isDark ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)';
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = accent;
        ctx.textBaseline = 'top';

        for (let i = 0; i < cols; i++) {
            const char = CHARS[Math.floor(Math.random() * CHARS.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            ctx.fillText(char, x, y);
            if (y > h && Math.random() > 0.975) drops[i] = 0;
            else drops[i]++;
        }
        requestAnimationFrame(step);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });
    requestAnimationFrame(step);
})();

/* =========================================================
    Filtres Portfolio — accessibilité + état "aucun résultat"
   ========================================================= */
(() => {
    const filterBar = document.querySelector('.filters');
    const buttons = document.querySelectorAll('.filters [data-t]');
    const cards = document.querySelectorAll('#projects .card');
    const emptyEl = document.getElementById('noResults');
    if (!filterBar || !buttons.length || !cards.length) return;

    function applyFilter(tag) {
        let visible = 0;
        // boutons (état visuel + ARIA)
        buttons.forEach(b => {
            const isActive = b.dataset.t === tag;
            b.classList.toggle('is-active', isActive);
            b.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        // cartes
        cards.forEach(card => {
            const tags = (card.dataset.t || '').split(/\s+/);
            const show = tag === 'all' || tags.includes(tag);
            card.style.display = show ? '' : 'none';
            if (show) visible++;
        });
        // état vide
        if (emptyEl) emptyEl.hidden = visible !== 0;
    }

    // clic
    buttons.forEach(btn => {
        btn.addEventListener('click', () => applyFilter(btn.dataset.t));
    });

    // navigation clavier (gauche/droite)
    filterBar.addEventListener('keydown', (e) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
        e.preventDefault();
        const list = Array.from(buttons);
        const current = list.findIndex(b => b.classList.contains('is-active'));
        let next = current;
        if (e.key === 'ArrowRight') next = (current + 1) % list.length;
        if (e.key === 'ArrowLeft') next = (current - 1 + list.length) % list.length;
        if (e.key === 'Home') next = 0;
        if (e.key === 'End') next = list.length - 1;
        list[next].focus();
        applyFilter(list[next].dataset.t);
    });

    // init
    applyFilter('all');
})();
/* =========================================================
    Apparition progressive des éléments au scroll
   ========================================================= */
(() => {
    const reveals = document.querySelectorAll('[data-reveal]');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    reveals.forEach(el => observer.observe(el));
})();

/* Compétences – remplissage des barres quand visibles */
(() => {
    const skills = document.querySelectorAll('.skill');
    if (!skills.length || !('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            e.target.classList.add('is-in'); // déclenche le CSS .skill.is-in .skill-bar-fill
            io.unobserve(e.target);
        });
    }, { threshold: 0.3 });

    skills.forEach(s => io.observe(s));
})();



