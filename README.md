Cahier des charges CV en ligne


Date : Octobre 2025
Technologies : HTML · CSS · JavaScript (Vanilla)
Type : Projet personnel — CV en ligne (One Page)

 1. Contexte et objectif
Je souhaite créer mon CV en ligne en utilisant uniquement HTML, CSS et JavaScript.
L’objectif est de présenter mon parcours, mes compétences et mes projets de manière claire, fluide et moderne, afin de faciliter ma recherche de stage ou d’emploi en développement web.
Le site doit être :
 	Sobre et professionnel (palette noir, blanc, bleu, violet).
 	Moderne, avec un thème clair/sombre et des dégradés lisibles.
 	Responsive, adapté à toutes les tailles d’écran (mobile, tablette, desktop).
 	Facile à lire pour un recruteur.
 	Open Source, sans framework externe (HTML/CSS/JS uniquement).

 2. Public visé
Le site s’adresse principalement :
 	Aux recruteurs recherchant des stagiaires ou développeurs juniors.
 	Aux formateurs ou évaluateurs souhaitant consulter mon parcours et mes réalisations.
L’objectif est de donner une image sérieuse, moderne et accessible, tout en reflétant ma personnalité et ma progression.

 3. Structure du site
Le site est conçu comme une One Page Application (une seule page index.html) avec navigation par ancres internes.
Sections principales
1.	Accueil (#accueil)
	Nom et prénom, intitulé de poste (« Full-stack Developer Junior »).
	Liens vers GitHub et LinkedIn.
	Animation d’arrière-plan type “code qui tombe” (canvas).
	Téléchargement du CV en PDF.
2.	Profil (#profil)
	Photo centrée et agrandie.
	Présentation personnelle, parcours, motivations.
3.	Compétences (#competences)
	Barres de progression techniques (HTML, CSS, JS, React, Node.js, PHP, Symfony, MySQL, Django, Python, Git).
	Disposition en deux colonnes sur grand écran.
	Compétences transversales (organisation, communication, autonomie) centrées en dessous.
4.	Expériences (#experiences)
	Timeline verticale en deux colonnes :
	Colonne gauche : Expériences professionnelles.
	Colonne droite : Formations.
	Ligne et pastilles alignées, animation de progression au scroll.
5.	Projets (#projets)
	Portfolio interactif avec filtres par technologie (multi-tags) :
	JavaScript · Django/Python · Symfony/PHP.
	Cartes allégées avec image, titre, description, et lien GitHub uniquement.
	Alignement visuel des titres, textes et liens uniformisé.
6.	Contact (#contact)
	Lien mailto: avec sujet et corps pré-remplis.
	Mention “Disponible pour un stage ou un emploi — réponse rapide”.

 4. Charte graphique
•	Palette principale : Noir, blanc, nuances de gris, bleu et violet.
•	Typographie : “Inter” (Google Fonts, open source).
•	Style global : Minimaliste, élégant et contrasté.
•	Effets :
	Hover noir/blanc fluide.
	Dégradés subtils sur les titres.
	Animation d’apparition “reveal” au scroll.
•	Images :
	Accueil : illustration sobre ou portrait.
	Projets : vignettes uniformes (captures d’écran).

 5. Fonctionnalités principales
Fonctionnalité	Description
 Navigation One Page	Menu fixe avec ancres et effet “scrollspy” sur les sections.
 Mode sombre/clair	Basculable via bouton ; persistance en localStorage.
 Fond animé (canvas)	Animation de code en bleu/violet selon le thème.
 Animations d’apparition	Effet “reveal” progressif selon le défilement.
 Compétences animées	Barres de progression avec animation fluide.
Projets filtrables	Filtres multi-tags dynamiques en JavaScript.
 Contact rapide	Lien mailto: avec message pré-formaté.
CV PDF	Téléchargement du CV complet depuis la page d’accueil.
 Accessibilité	Contrastes adaptés, balises sémantiques, navigation clavier.
 Responsive design	Adaptation fluide pour mobile, tablette et desktop.

 6. Détails techniques
•	Fichiers principaux :
	index.html (structure unique, sections ancrées)
	assets/css/ → sous-fichiers par thème (base.css, index.css, experiences.css, projets.css, etc.)
	assets/app.js → fond animé, scrollspy, reveal, mode sombre.
•	Liens GitHub des projets :
	Jeu JavaScript : Jeu_Fee_Js
	E-commerce Django : E_commerce_bougie
	Projet Taxi : Projet_Taxi_Bxl
	Enchères Symfony : ProjetFinal-Karima

