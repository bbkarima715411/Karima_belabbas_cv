/* =========================================================
    app.js — Gestion du mode sombre, intro et fond animé
   ========================================================= */

/* ===== MODE SOMBRE / CLAIR ===== */
const toggle = document.querySelector(".theme-toggle");
if (toggle) {
  toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      document.body.classList.contains("dark") ? "dark" : "light"
    );
  });
}

// Appliquer le thème enregistré
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
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
  const reduce = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)"
  )?.matches;
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
    FOND ANIMÉ : "code qui défile" (canvas)
   ========================================================= */
(() => {
  const canvas = document.getElementById("codebg");
  if (!canvas) return;

  // Respect des préférences utilisateur
  const reduce = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)"
  )?.matches;
  if (reduce) return;

  const ctx = canvas.getContext("2d");
  const accent =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--accent")
      .trim() || "#9C27B0";
  const CHARS = "01<>/{}[]();=:+-*".split("");
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
    const isDark = document.body.classList.contains("dark");
    ctx.fillStyle = isDark ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = accent;
    ctx.textBaseline = "top";

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
  window.addEventListener("resize", resize, { passive: true });
  requestAnimationFrame(step);
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
    // boutons (état visuel + ARIA)
    buttons.forEach((b) => {
      const isActive = b.dataset.t === tag;
      b.classList.toggle("is-active", isActive);
      b.setAttribute("aria-selected", isActive ? "true" : "false");
    });
    // cartes
    cards.forEach((card) => {
      const tags = (card.dataset.t || "").split(/\s+/);
      const show = tag === "all" || tags.includes(tag);
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
    },
    { threshold: 0.2 }
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
    },
    { threshold: 0.3 }
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
  window.addEventListener("scroll", updateAll, { passive: true });
  window.addEventListener("resize", updateAll, { passive: true });
})();
/* =========================================================
   Timelines HORIZONTALES : auto-position + "barre de rechargement"
   ========================================================= */
(() => {
  const timelines = document.querySelectorAll(".htl");
  if (!timelines.length) return;

  const reduce = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)"
  )?.matches;

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
      },
      { threshold: 0.25 }
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
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  if (reduce) return;

  containers.forEach(container => {
    let rafId = null;
    let dir = 1;                // 1 = droite, -1 = gauche
    let paused = false;
    const pxPerFrame = 0.6;     // vitesse (~px/frame) → ajuste si tu veux
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
      idleTimer = setTimeout(() => { paused = false; }, 2000);
    };

    // Écoutes : tout ce qui signifie “l’utilisateur prend la main”
    container.addEventListener('mouseenter', pause);
    container.addEventListener('pointerdown', pause);
    container.addEventListener('wheel', pause, { passive: true });
    container.addEventListener('touchstart', pause, { passive: true });
    container.addEventListener('scroll', pause, { passive: true }); // met aussi à jour la progress bar existante

    // Démarrage
    step();

    // Nettoyage si jamais tu navigues en SPA
    window.addEventListener('beforeunload', () => cancelAnimationFrame(rafId));
  });
})();

