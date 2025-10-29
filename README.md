Cahier des charges – Mon CV en ligne


## Derniers changements

- **[Timeline verticale]** Remplacement des frises horizontales par une timeline verticale en 2 colonnes (`Expériences` | `Formations`) avec ligne/pastille alignées. Fichiers: `index.html`, `assets/css/experiences.css`.
- **[Titres renforcés]** `h1`, `.section-title`, `.vtl-title` plus grands et soulignement plus visible. Fichier: `assets/css/experiences.css`.
- **[Accueil bleu + animation]** Fond d’accueil bleu plus foncé en mode clair, bleu‑gris en sombre. Animation "code qui tombe" en bleu foncé (clair) et violet (sombre). Fichiers: `assets/css/base.css`, `assets/css/index.css`, `assets/app.js`.
- **[K. cliquable]**
  - Logo `K.` (header) → lien `#accueil` + tooltip.
  - Lettre `K` du nom → lien de téléchargement du CV PDF.
  - Bouton flottant `K.` (bas‑droite) → remonter en haut (si scroll) sinon aller à `#contact`. Fichiers: `index.html`, `assets/css/base.css`, `assets/app.js`.
- **[Cartes Projets]**
  - Suppression des liens "Démo" pour plus de clarté; GitHub uniquement.
  - Alignement visuel des titres/descriptions et liens calés en bas. Fichier: `assets/css/projets.css`.
  - Liens GitHub mis à jour:
    - Jeu JS: `https://github.com/bbkarima715411/Jeu_F-e_Js.git`
    - E‑commerce: `https://github.com/bbkarima715411/E_commerce_bougie.git`
    - Taxi (Django): `https://github.com/bbkarima715411/Projet_Taxi_Bxl.git`
    - Enchères (Symfony): `https://github.com/bbkarima715411/ProjetFinal-Karima.git`

Date: Oct 2025

1. Contexte et objectif
Je souhaite créer mon CV en ligne en utilisant uniquement HTML, CSS et JavaScript.
L’objectif est de présenter mon parcours, mes compétences et mes projets de manière claire et moderne, afin de faciliter ma recherche de stage en développement web.
Je veux un site qui soit :
 	Sobre et professionnel (noir et blanc, violet, bleu).
	un thème sombre/clair avec persistance  et **dégradés de titres lisibles**.
 	Responsive (adapté au mobile et au PC).
 	Facile à lire pour un recruteur.
 	Open source.

2. Public visé
Mon site s’adresse principalement :
 	Aux recruteurs d’entreprises qui recherchent des stagiaires en développement web ou des futurs développeurs junior.
Je veux donner une image sérieuse et moderne, tout en restant accessible et claire dans ma présentation.

3. Structure du site
Le site est désormais en **one‑page** (une seule page `index.html`) avec navigation par ancres :
	Accueil (`#accueil`) : nom, rôle (« Full‑stack developer junior »), liens LinkedIn et GitHub, fond animé.
	Profil (`#profil`) : présentation, parcours, motivations.
	Compétences (`#competences`) : barres de progression techniques (HTML, CSS, JS, React, Node.js, PHP, Symfony, MySQL, etc.) en **grille 2 colonnes** (desktop) et compétences transversales centrées en dessous.
	Expériences (`#experiences`) : timeline expériences/formations avec progression.
	Projets (`#projets`) : portfolio avec filtres multi‑tags — boutons « JavaScript », « Django/Python », « Symfony/PHP ».
	Contact (`#contact`) : bouton e‑mail `mailto:` avec **sujet et corps pré‑remplis**.

4. Charte graphique
 	Couleurs : uniquement noir, blanc et nuances de gris, violet, bleu.
 	Typographie : police Inter (Google Fonts, open source).
 	Style : minimaliste, élégant, avec des effets sobres (hover noir/blanc).
 	Images :
	Page d’accueil → une photo/illustration sobre (moi ou une illustration libre de droits).
	Projets → vignettes (images grises ou captures d’écran des projets).

5. Fonctionnalités principales
	Navigation one‑page avec ancrage + état actif (scrollspy).
	Mode sombre/clair avec persistance et **dégradés de titres lisibles**.
	Fond animé (canvas) et animations d’apparition (reveal) respectant `prefers-reduced-motion`.
	Compétences : barres animées, **2 colonnes** sur desktop, transversales centrées.
	Projets : filtres **multi‑tags** (JavaScript · Django/Python · Symfony/PHP), cartes avec images dédiées.
	Contact : lien `mailto:` avec **sujet et corps pré‑remplis**.
	Liens GitHub/LinkedIn et **téléchargement du CV PDF**.
	Accessibilité de base (contraste, sémantique, navigation clavier) et responsive.


