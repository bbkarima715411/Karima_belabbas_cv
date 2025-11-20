/* =========================================================
    app.js — Gestion du mode sombre, intro et fond animé
   ========================================================= */

/* ===== MODE SOMBRE / CLAIR ===== */
const toggle = document.querySelector(".theme-toggle");

function applyAriaThemeState(btn) {
    if (!btn) return;
    const isDark = document.body.classList.contains("dark");
    btn.setAttribute("aria-checked", isDark ? "true" : "false");
    btn.setAttribute(
        "aria-label",
        isDark ? "Basculer en mode clair" : "Basculer en mode sombre"
    );
}

// Appliquer le thème enregistré au chargement
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}
applyAriaThemeState(toggle);

if (toggle) {
    toggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        const mode = document.body.classList.contains("dark") ? "dark" : "light";
        localStorage.setItem("theme", mode);
        applyAriaThemeState(toggle);
    });
}

/* Révèle les éléments marqués data-reveal au chargement */
document.addEventListener("DOMContentLoaded", () => {
    document
        .querySelectorAll("[data-reveal]")
        .forEach((el) => el.classList.add("is-in"));
});

/* =========================================================
    INTRO : affichage progressif (nom -> fond animé)
   ========================================================= */
(() => {
    const nameEl = document.getElementById("typing-name");
    const hero = document.querySelector(".home-hero");
    if (!nameEl || !hero) return;

    // Si l'utilisateur préfère réduire les animations, on saute l'intro
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
        hero.classList.add("intro-done");
        return;
    }

    // Quand l'animation "typing" se termine
    nameEl.addEventListener("animationend", (e) => {
        if (e.animationName === "typing") {
            // On enlève le curseur et on déclenche le fondu du canvas
            nameEl.style.borderRightColor = "transparent";
            hero.classList.add("intro-done");
        }
    });
})();

/* =========================================================
    Bouton flottant K. — Haut / Contact
   ========================================================= */
(() => {
    const btn = document.querySelector('.k-fab');
    if (!btn) return;

    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const showAt = 240; // px

    function onScroll() {
        const y = window.scrollY || document.documentElement.scrollTop;
        if (y > showAt) btn.classList.add('show', 'is-up');
        else btn.classList.remove('is-up');
        if (y > showAt / 2) btn.classList.add('show');
        else btn.classList.remove('show');
    }

    btn.addEventListener('click', () => {
        const y = window.scrollY || document.documentElement.scrollTop;
        if (y > showAt) {
            window.scrollTo({
                top: 0,
                behavior: reduce ? 'auto' : 'smooth'
            });
        } else {
            const contact = document.querySelector('#contact');
            if (contact) {
                contact.scrollIntoView({
                    behavior: reduce ? 'auto' : 'smooth'
                });
            }
        }
    });

    window.addEventListener('scroll', onScroll, {
        passive: true
    });
    onScroll();
})();

/* =========================================================
    Marque K. (header) — tooltip accessible
   ========================================================= */
(() => {
    const brand = document.querySelector('.brand');
    if (!brand) return;
    brand.setAttribute('title', 'Revenir en haut');
})();

/* =========================================================
    Titres accroche (morphing de mots)
   ========================================================= */
(() => {
    const items = Array.from(document.querySelectorAll('h1 .morph'));
    if (!items.length) return;

    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const INTERVAL = 3200;

    function setup(el) {
        const list = (el.getAttribute('data-words') || '').split('|').map(s => s.trim()).filter(Boolean);
        if (list.length <= 1) return null;
        let i = 0,
            timer = null;

        function next() {
            el.classList.add('is-out');
            el.classList.add('is-swap');
            const word = list[(i + 1) % list.length];
            setTimeout(() => {
                el.textContent = word;
                el.classList.remove('is-out');
                // retire l'effet underline/scale après un court délai
                setTimeout(() => el.classList.remove('is-swap'), 300);
                i = (i + 1) % list.length;
            }, 400);
        }

        function start() {
            if (timer || reduce) return;
            timer = setInterval(next, INTERVAL);
        }

        function stop() {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        }
        return {
            start,
            stop
        };
    }

    const controllers = new Map();
    items.forEach(el => {
        const c = setup(el);
        if (c) controllers.set(el, c);
    });
    if (!controllers.size) return;

    if (!('IntersectionObserver' in window)) {
        // fallback: démarrer tout si pas d'observer
        controllers.forEach(c => c.start());
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            const ctrl = controllers.get(e.target);
            if (!ctrl) return;
            if (e.isIntersecting) ctrl.start();
            else ctrl.stop();
        });
    }, {
        threshold: 0.3
    });

    controllers.forEach((_, el) => io.observe(el));
})();

/* =========================================================
    Scrollspy: lien de navigation actif selon la section visible
   ========================================================= */
(() => {
    const nav = document.querySelector('.site-nav');
    if (!nav || !('IntersectionObserver' in window)) return;

    const links = Array.from(nav.querySelectorAll('a[href^="#"]'));
    if (!links.length) return;

    const byId = new Map();
    links.forEach(a => {
        const id = a.getAttribute('href').slice(1);
        const sec = document.getElementById(id);
        if (sec) byId.set(id, {
            link: a,
            sec
        });
    });
    if (!byId.size) return;

    function setActive(id) {
        links.forEach(l => l.classList.remove('is-active'));
        const entry = byId.get(id);
        if (entry) entry.link.classList.add('is-active');
    }

    const observer = new IntersectionObserver((entries) => {
        // choisir la section la plus visible
        let best = null;
        let bestRatio = 0;
        entries.forEach(e => {
            if (e.isIntersecting && e.intersectionRatio > bestRatio) {
                best = e;
                bestRatio = e.intersectionRatio;
            }
        });
        if (best) setActive(best.target.id);
    }, {
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0.2, 0.5, 0.8]
    });

    byId.forEach(({
        sec
    }) => observer.observe(sec));

    // état initial: activer #accueil si présent
    if (document.getElementById('accueil')) setActive('accueil');
})();

/* =========================================================
    Menu hamburger (mobile) — ouverture/fermeture nav
   ========================================================= */
(() => {
    const nav = document.getElementById('primary-nav');
    const toggle = document.querySelector('.nav-toggle');
    if (!nav || !toggle) return;

    function setOpen(isOpen) {
        nav.classList.toggle('is-open', isOpen);
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    toggle.addEventListener('click', () => {
        const isOpenNow = nav.classList.contains('is-open');
        setOpen(!isOpenNow);
    });

    nav.addEventListener('click', (e) => {
        if (e.target.matches('a[href^="#"]')) {
            setOpen(false);
        }
    });
})();

/* =========================================================
    FOND ANIMÉ : code qui tombe (canvas)
   ========================================================= */
(() => {
    const canvas = document.getElementById("codebg");
    if (!canvas) return;

    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = canvas.getContext("2d");

    const letters = "01<>/{}[]#=+-_&$@"; // caractères affichés
    const fontSize = 14;
    let columns = 0;
    let drops = [];

    function size() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.floor(canvas.width / fontSize);
        drops = Array(columns).fill(1);
    }

    function draw() {
        const isDark = document.body.classList.contains('dark');
        ctx.fillStyle = isDark ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Couleur des caractères: bleu encore plus foncé en thème clair, violet en sombre
        ctx.fillStyle = isDark ? "rgba(187, 134, 252, 0.85)" : "rgba(15, 30, 77, 0.95)"; // ~#0F1E4D
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
            const text = letters[Math.floor(Math.random() * letters.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }

    size();
    window.addEventListener('resize', size, {
        passive: true
    });
    setInterval(draw, 33); // 33ms ≈ 30fps
})();

/* =========================================================
    Filtres Portfolio — accessibilité + état "aucun résultat"
   ========================================================= */
(() => {
    const filterBar = document.querySelector(".filters");
    const buttons = document.querySelectorAll(".filters [data-t]");
    const cards = document.querySelectorAll("#projects .card");
    const emptyEl = document.getElementById("noResults");
    if (!filterBar || !buttons.length || !cards.length) return;

    function applyFilter(tag) {
        let visible = 0;
        const wanted = tag.split(/\s+/).filter(Boolean);
        // boutons (état visuel + ARIA)
        buttons.forEach((b) => {
            const isActive = b.dataset.t === tag;
            b.classList.toggle("is-active", isActive);
            b.setAttribute("aria-selected", isActive ? "true" : "false");
        });
        // cartes
        cards.forEach((card) => {
            const tags = (card.dataset.t || "").split(/\s+/).filter(Boolean);
            const show = tag === "all" || wanted.some((t) => tags.includes(t));
            card.style.display = show ? "" : "none";
            if (show) visible++;
        });
        // état vide
        if (emptyEl) emptyEl.hidden = visible !== 0;
    }

    // clic
    buttons.forEach((btn) => {
        btn.addEventListener("click", () => applyFilter(btn.dataset.t));
    });

    // navigation clavier (gauche/droite)
    filterBar.addEventListener("keydown", (e) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
        e.preventDefault();
        const list = Array.from(buttons);
        const current = list.findIndex((b) => b.classList.contains("is-active"));
        let next = current;
        if (e.key === "ArrowRight") next = (current + 1) % list.length;
        if (e.key === "ArrowLeft") next = (current - 1 + list.length) % list.length;
        if (e.key === "Home") next = 0;
        if (e.key === "End") next = list.length - 1;
        list[next].focus();
        applyFilter(list[next].dataset.t);
    });

    // init
    applyFilter("all");
})();
/* =========================================================
    Apparition progressive des éléments au scroll
   ========================================================= */
(() => {
    const reveals = document.querySelectorAll("[data-reveal]");
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-in");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        }
    );

    reveals.forEach((el) => observer.observe(el));
})();

/* Compétences – remplissage des barres quand visibles */
(() => {
    const skills = document.querySelectorAll(".skill");
    if (!skills.length || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => {
                if (!e.isIntersecting) return;
                e.target.classList.add("is-in"); // déclenche le CSS .skill.is-in .skill-bar-fill
                io.unobserve(e.target);
            });
        }, {
            threshold: 0.3
        }
    );

    skills.forEach((s) => io.observe(s));
})();

/* =========================================================
    Timelines multiples : progression + “regard” (tracker)
   ========================================================= */
(() => {
    const wrappers = document.querySelectorAll(".tl-wrap");
    if (!wrappers.length) return;

    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

    function updateOne(wrap) {
        const tl = wrap.querySelector(".timeline");
        const tracker = wrap.querySelector(".tracker");
        if (!tl || !tracker) return;

        const rect = tl.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;

        // Progress global de la timeline (remplit la barre)
        const total = rect.height || 1;
        const progress = clamp((vh - rect.top) / (total + vh), 0, 1);
        tl.style.setProperty("--prog", (progress * 100).toFixed(1) + "%");

        // Position du tracker : vise le milieu du viewport, borné à la timeline
        const centerInDoc = vh / 2;
        const y = clamp(centerInDoc - rect.top, 0, total);
        wrap.style.setProperty("--track", `${y}px`);

        // Marquer l'item le plus proche du centre
        const items = Array.from(tl.children);
        let best = null,
            bestDist = Infinity;
        items.forEach((li) => {
            const r = li.getBoundingClientRect();
            const mid = (r.top + r.bottom) / 2;
            const dist = Math.abs(mid - vh / 2);
            if (dist < bestDist) {
                best = li;
                bestDist = dist;
            }
        });
        items.forEach((li) => li.classList.toggle("is-active", li === best));
    }

    const updateAll = () => wrappers.forEach(updateOne);

    // Lancer et écouter
    updateAll();
    window.addEventListener("scroll", updateAll, {
        passive: true
    });
    window.addEventListener("resize", updateAll, {
        passive: true
    });
})();
/* =========================================================
    Timelines HORIZONTALES : auto-position + "barre de rechargement"
   ========================================================= */
(() => {
    const timelines = document.querySelectorAll(".htl");
    if (!timelines.length) return;

    const reduce = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    timelines.forEach((htl) => {
        const items = htl.querySelectorAll(".htl-items > li");
        const track = htl.querySelector(".htl-track");
        if (!items.length || !track) return;

        // 1) Répartir les items automatiquement (de 0% à 100%)
        const n = items.length;
        items.forEach((li, i) => {
            const pos = n === 1 ? 50 : (i / (n - 1)) * 100; // %
            li.style.left = `${pos}%`;
            li.dataset.pos = pos.toFixed(2); // pour l'état actif
        });

        // 2) Animation de rechargement : quand la timeline entre dans le viewport
        const play = () => {
            if (htl.dataset.played === "1") return;
            htl.dataset.played = "1";
            // Remplir la barre à 100% (ou tout de suite si reduce motion)
            if (reduce) {
                htl.style.setProperty("--prog", "100%");
                setActiveByProgress(htl, 100);
            } else {
                // on démarre à 0 puis on anime via CSS (transition)
                htl.style.setProperty("--prog", "0%");
                requestAnimationFrame(() => {
                    htl.style.setProperty("--prog", "100%"); // déclenche la transition
                    setActiveByProgress(htl, 100);
                });
            }
        };

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        play();
                        io.unobserve(e.target);
                    }
                });
            }, {
                threshold: 0.25
            }
        );
        io.observe(htl);

        // 3) Marquer l'item actif en fonction de la progression actuelle
        function setActiveByProgress(container, pct) {
            const lis = container.querySelectorAll(".htl-items > li");
            let best = null,
                bestDiff = Infinity;
            lis.forEach((li) => {
                const p = parseFloat(li.dataset.pos || "0");
                const diff = Math.abs(p - pct);
                if (diff < bestDiff) {
                    bestDiff = diff;
                    best = li;
                }
            });
            lis.forEach((li) => li.classList.toggle("is-active", li === best));
        }

        // 4) Pendant la transition, suivre la progression pour activer le bon item
        //    (optionnel mais précis) — on écoute les "transitionrun" / "transitionend"
        const progressEl = htl.querySelector(".htl-progress");
        if (progressEl) {
            let raf;
            const tick = () => {
                const style = getComputedStyle(htl);
                const w = parseFloat(style.getPropertyValue("--prog")) || 0;
                setActiveByProgress(htl, w);
                raf = requestAnimationFrame(tick);
            };
            progressEl.addEventListener("transitionstart", () => {
                raf = requestAnimationFrame(tick);
            });
            progressEl.addEventListener("transitionend", () => {
                cancelAnimationFrame(raf);
                setActiveByProgress(htl, 100);
            });
        }
    });
})();

/* =========================================================
    Auto-scroll horizontal "lecture guidée" (timeline-cards)
    - Pause à l’interaction, reprise après 2s d’inactivité
    - Ping-pong (gauche ⇄ droite) continu
    - Respecte prefers-reduced-motion
   ========================================================= */
(() => {
    const containers = document.querySelectorAll('.timeline-cards');
    if (!containers.length) return;

    // Accessibilité : on désactive si l’utilisateur préfère moins d’animations
    const reduce = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    containers.forEach(container => {
        let rafId = null;
        let dir = 1; // 1 = droite, -1 = gauche
        let paused = false;
        const pxPerFrame = 0.6; // vitesse (~px/frame) → ajuste si tu veux
        let idleTimer = null;

        const maxScroll = () => Math.max(0, container.scrollWidth - container.clientWidth);

        function step() {
            const max = maxScroll();
            if (!paused && max > 0) {
                container.scrollLeft += dir * pxPerFrame;

                // Inversion de sens aux extrémités (effet ping-pong)
                if (container.scrollLeft <= 0) dir = 1;
                if (container.scrollLeft >= max) dir = -1;
            }
            rafId = requestAnimationFrame(step);
        }

        // Pause instantanée sur interaction utilisateur
        const pause = () => {
            paused = true;
            if (idleTimer) clearTimeout(idleTimer);
            // Reprise douce après 2s sans interaction
            idleTimer = setTimeout(() => {
                paused = false;
            }, 2000);
        };

        // Écoutes : tout ce qui signifie “l’utilisateur prend la main”
        container.addEventListener('mouseenter', pause);
        container.addEventListener('pointerdown', pause);
        container.addEventListener('wheel', pause, {
            passive: true
        });
        container.addEventListener('touchstart', pause, {
            passive: true
        });
        container.addEventListener('scroll', pause, {
            passive: true
        }); // met aussi à jour la progress bar existante

        // Démarrage
        step();

        // Nettoyage si jamais tu navigues en SPA
        window.addEventListener('beforeunload', () => cancelAnimationFrame(rafId));
    });
})();
/* =========================================================
    Progression par frise : remplit la barre .rail .progress
   ========================================================= */
(() => {
    const groups = document.querySelectorAll('.timeline-group');
    if (!groups.length) return;

    const attach = (group) => {
        const scroller = group.querySelector('.timeline-cards');
        const bar = group.querySelector('.rail .progress');
        if (!scroller || !bar) return;

        const update = () => {
            const max = scroller.scrollWidth - scroller.clientWidth;
            const pct = max > 0 ? (scroller.scrollLeft / max) * 100 : 100;
            bar.style.width = pct.toFixed(1) + '%';
        };

        update();
        scroller.addEventListener('scroll', update, {
            passive: true
        });
        window.addEventListener('resize', update, {
            passive: true
        });
    };

    groups.forEach(attach);
})();

/* =========================================================
    TOOLTIP AUTO (Expériences/Formations)
    - Génère le texte depuis <time> + <h3>
    - Accessibilité : focusable + aria-label
    - Mobile : tap pour afficher/masquer
   ========================================================= */
(() => {
    const cards = document.querySelectorAll('.timeline-cards .card');
    if (!cards.length) return;

    // Construire le texte du tooltip automatiquement
    cards.forEach(card => {
        const timeEl = card.querySelector('time');
        const titleEl = card.querySelector('h3');
        const time = timeEl ? (timeEl.textContent || '').trim() : '';
        const title = titleEl ? (titleEl.textContent || '').trim() : '';
        const tip = [time, title].filter(Boolean).join(' — ');
        card.setAttribute('data-tip', tip);
        card.setAttribute('tabindex', '0'); // focus clavier possible
        card.setAttribute('aria-label', tip);
    });

    // Gestion mobile/tap : toggle .show-tip à la carte cliquée
    let openCard = null;
    const closeOpen = () => {
        if (openCard) {
            openCard.classList.remove('show-tip');
            openCard = null;
        }
    };

    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            // éviter que les clics sur liens à l’intérieur ne togglent la bulle
            if (e.target.closest('a')) return;
            if (openCard && openCard !== card) openCard.classList.remove('show-tip');
            card.classList.toggle('show-tip');
            openCard = card.classList.contains('show-tip') ? card : null;
        });
    });

    // Fermer en cliquant ailleurs / échappe
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.timeline-cards .card')) closeOpen();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeOpen();
    });
})();



/* =========================================================
    Animation de dégradé par section (fond) quand visible
    - Ajoute .bg-anim-on aux sections visibles (sauf #accueil)
    - Respecte prefers-reduced-motion
   ========================================================= */
(() => {
    const sections = ['#profil', '#competences', '#experiences', '#projets', '#contact']
        .map((sel) => document.querySelector(sel))
        .filter(Boolean);
    if (!sections.length) return;

    const reduce = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => {
                e.target.classList.toggle('bg-anim-on', e.isIntersecting);
            });
        }, {
            threshold: 0.25
        }
    );

    sections.forEach((s) => io.observe(s));
})();