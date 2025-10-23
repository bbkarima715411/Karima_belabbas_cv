Cahier des charges – Mon CV en ligne



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


