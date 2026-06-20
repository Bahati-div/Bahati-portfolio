
/* ============================================================
   SCRIPT.JS — Portfolio de Bahati Kamina
   
   Ce fichier ajoute TOUTE l'interactivité du portfolio.
   Chaque fonctionnalité est clairement séparée et expliquée.
   ============================================================ */

/* ----------------------------------------------------------
   🔒 RÈGLE D'OR : Tout notre code est dans cette fonction.
   
   "DOMContentLoaded" = "attendre que la page soit entièrement
   chargée AVANT d'exécuter le code JavaScript".
   
   Sans ça, JS essaierait de trouver des éléments HTML qui
   n'existent pas encore → erreurs !
   ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {

  /* ==========================================================
     ✅ FONCTIONNALITÉ 1 : ALERTE DE BIENVENUE
     
     On affiche un message de bienvenue la PREMIÈRE FOIS que
     l'utilisateur visite le site.
     
     sessionStorage = stockage temporaire (effacé à la fermeture
     de l'onglet). Parfait pour "une fois par visite".
     ========================================================== */
  function afficherBienvenue() {
    // On vérifie si l'utilisateur a déjà vu le message cette session
    const dejaVisite = sessionStorage.getItem('bienvenue_affiche');

    if (!dejaVisite) {
      // Petite attente (800ms) avant d'afficher, pour laisser la page charger
      setTimeout(function () {
        // On marque que l'utilisateur a vu le message
        sessionStorage.setItem('bienvenue_affiche', 'oui');

        // On crée un div stylisé (plus joli qu'un alert() basique)
        const toast = document.createElement('div');
        toast.innerHTML = '👋 Bienvenue sur mon portfolio !';

        // Style en ligne (directement dans JS pour ce toast)
        Object.assign(toast.style, {
          position:       'fixed',
          bottom:         '24px',
          left:           '24px',
          background:     '#0d6efd',
          color:          'white',
          padding:        '14px 22px',
          borderRadius:   '10px',
          fontFamily:     "'DM Sans', sans-serif",
          fontWeight:     '500',
          fontSize:       '0.95rem',
          zIndex:         '9999',
          boxShadow:      '0 8px 30px rgba(13,110,253,0.4)',
          opacity:        '0',
          transform:      'translateY(20px)',
          transition:     'all 0.4s ease',
        });

        document.body.appendChild(toast);

        // Déclencher l'animation d'apparition
        // (on utilise requestAnimationFrame pour forcer le navigateur à "voir" le style initial)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            toast.style.opacity   = '1';
            toast.style.transform = 'translateY(0)';
          });
        });

        // Le message disparaît automatiquement après 4 secondes
        setTimeout(function () {
          toast.style.opacity   = '0';
          toast.style.transform = 'translateY(20px)';

          // On supprime le div du HTML après la disparition (0.4s)
          setTimeout(() => toast.remove(), 400);
        }, 4000);

      }, 800);
    }
  }

  // On appelle la fonction
  afficherBienvenue();


  /* ==========================================================
     ✅ FONCTIONNALITÉ 2 : EFFET "TYPING" SUR LE TITRE
     
     On affiche le nom lettre par lettre, comme si quelqu'un
     tapait au clavier. Crée une première impression forte !
     ========================================================== */
  function effetTyping() {
    // Le texte à "taper"
    const texte     = 'Bahati Kamina';
    // L'élément HTML où on va écrire
    const element   = document.getElementById('typing-text');

    // Si l'élément n'existe pas, on sort (sécurité)
    if (!element) return;

    let index = 0; // Indice de la lettre actuelle

    // setInterval = "répéter une action toutes les X millisecondes"
    const intervalle = setInterval(function () {
      // On ajoute une lettre à chaque fois
      element.textContent += texte[index];
      index++;

      // Quand on a affiché toutes les lettres, on arrête
      if (index >= texte.length) {
        clearInterval(intervalle); // Arrêter la répétition
      }
    }, 90); // 90ms entre chaque lettre = vitesse naturelle
  }

  effetTyping();


  /* ==========================================================
     ✅ FONCTIONNALITÉ 3 : BOUTON RETOUR EN HAUT
     
     Le bouton "↑" apparaît quand on scroll vers le bas,
     et remonte en haut de la page au clic.
     ========================================================== */
  function gererBoutonHaut() {
    const bouton = document.getElementById('btn-top');
    if (!bouton) return;

    // Écouter le scroll de la fenêtre
    window.addEventListener('scroll', function () {
      // Si on est à plus de 400px du haut de la page...
      if (window.scrollY > 400) {
        bouton.classList.add('visible');    // ...on affiche le bouton
      } else {
        bouton.classList.remove('visible'); // ...sinon on le cache
      }
    });

    // Au clic, remonter tout en haut
    bouton.addEventListener('click', function () {
      window.scrollTo({
        top:      0,
        behavior: 'smooth' // Animation douce
      });
    });
  }

  gererBoutonHaut();


  /* ==========================================================
     ✅ FONCTIONNALITÉ 4 : NAVIGATION ACTIVE PENDANT LE SCROLL
     
     Quand l'utilisateur scrolle vers une section, le lien
     correspondant dans la navigation se surligne.
     
     On utilise IntersectionObserver (voir fonctionnalité 5)
     pour détecter quelle section est visible.
     ========================================================== */
  function gererNavigationActive() {
    const liens    = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id], header[id]');

    if (!sections.length || !liens.length) return;

    // On observe chaque section
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // La section est visible : récupérer son id
          const idVisible = entry.target.id;

          // Retirer "active" de tous les liens
          liens.forEach(lien => lien.classList.remove('active'));

          // Ajouter "active" au lien correspondant
          const lienActif = document.querySelector('.nav-link[href="#' + idVisible + '"]');
          if (lienActif) {
            lienActif.classList.add('active');
          }
        }
      });
    }, {
      // rootMargin : la section est "active" quand elle entre dans la zone
      // de -20% à -70% = environ le centre de l'écran
      rootMargin: '-20% 0px -70% 0px',
    });

    sections.forEach(section => observer.observe(section));
  }

  gererNavigationActive();


  /* ==========================================================
     ✅ FONCTIONNALITÉ 5 : SCROLL ANIMATION (Intersection Observer)
     
     C'est la fonctionnalité principale des animations.
     
     📖 Explication simple de l'Intersection Observer :
     C'est comme un "détecteur" invisible. On lui dit :
     "Surveille ces éléments. Quand l'un d'eux devient visible
     à l'écran, préviens-moi !"
     
     Avantage vs l'ancienne méthode (window.addEventListener('scroll')):
     - Plus performant (pas de calcul à chaque pixel de scroll)
     - Plus simple à écrire
     ========================================================== */
  function activerScrollAnimations() {
    // On sélectionne TOUS les éléments avec la classe "hidden"
    const elementsAnimes = document.querySelectorAll('.hidden');

    if (!elementsAnimes.length) return;

    // Créer l'observateur
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        // entry.isIntersecting = true si l'élément est visible à l'écran
        if (entry.isIntersecting) {
          // Remplacer "hidden" par "show" → déclenche la transition CSS
          entry.target.classList.add('show');

          // ✅ BONNE PRATIQUE : Une fois animé, on arrête d'observer
          // (inutile de continuer, économise de la mémoire)
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1, // 10% de l'élément doit être visible pour déclencher
    });

    // Observer chaque élément
    elementsAnimes.forEach(function (element) {
      observer.observe(element);
    });
  }

  activerScrollAnimations();


  /* ==========================================================
     ✅ FONCTIONNALITÉ 6 : MENU HAMBURGER (Mobile)
     
     Sur mobile, on affiche un bouton ☰ qui ouvre/ferme
     le menu de navigation.
     ========================================================== */
  function gererMenuMobile() {
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.querySelector('.nav-links');

    if (!hamburger || !navLinks) return;

    // Clic sur le bouton hamburger
    hamburger.addEventListener('click', function () {
      // toggle = "ajouter si absent, supprimer si présent"
      navLinks.classList.toggle('open');

      // Mettre à jour l'attribut aria pour l'accessibilité
      const estOuvert = navLinks.classList.contains('open');
      hamburger.setAttribute('aria-expanded', estOuvert);
    });

    // Fermer le menu quand on clique sur un lien
    navLinks.querySelectorAll('.nav-link').forEach(function (lien) {
      lien.addEventListener('click', function () {
        navLinks.classList.remove('open');
      });
    });

    // Fermer si on clique en dehors du menu
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });
  }

  gererMenuMobile();


  /* ==========================================================
     ✅ FONCTIONNALITÉ 7 : EFFETS DYNAMIQUES SUR LES CARTES
     
     Effet "parallax" 3D subtil quand on survole une carte.
     La carte "suit" légèrement le curseur.
     ========================================================== */
  function effetsCartes() {
    const cartes = document.querySelectorAll('.card, .project-card');

    cartes.forEach(function (carte) {

      carte.addEventListener('mousemove', function (e) {
        // Récupérer la position de la carte
        const rect = carte.getBoundingClientRect();

        // Calculer la position du curseur DANS la carte (de 0 à 1)
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top)  / rect.height;

        // Calculer la rotation (max ±6 degrés)
        const rotateX = (y - 0.5) * -6; // Haut/bas
        const rotateY = (x - 0.5) *  6; // Gauche/droite

        carte.style.transform =
          `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      // Réinitialiser quand le curseur quitte la carte
      carte.addEventListener('mouseleave', function () {
        carte.style.transform = '';
        carte.style.transition = 'transform 0.4s ease';
      });

      // Retirer la transition pendant le mouvement (fluidité)
      carte.addEventListener('mouseenter', function () {
        carte.style.transition = 'none';
      });
    });
  }

  effetsCartes();

   


  /* ==========================================================
     ✅ FONCTIONNALITÉ 8 : VALIDATION DU FORMULAIRE
     
     Avant d'envoyer le formulaire, on vérifie que :
     - Le nom fait au moins 2 caractères
     - L'email est valide (contient @)
     - Le message fait au moins 10 caractères
     
     Si une erreur est détectée, on l'affiche sous le champ
     concerné SANS recharger la page.
     ========================================================== */
  function validerFormulaire() {
    const formulaire   = document.getElementById('contact-form');
    const champNom     = document.getElementById('name');
    const champEmail   = document.getElementById('email');
    const champMessage = document.getElementById('message');
    const divSucces    = document.getElementById('form-success');
    const btnEnvoyer   = document.getElementById('submit-btn');

    // Si le formulaire n'existe pas sur la page, on sort
    if (!formulaire) return;

    /* -- Fonction utilitaire : afficher une erreur sous un champ -- */
    function afficherErreur(champId, message) {
      const erreur = document.getElementById(champId + '-error');
      const champ  = document.getElementById(champId);
      if (erreur) erreur.textContent = message;
      if (champ)  champ.classList.add('invalid');
    }

    /* -- Fonction utilitaire : effacer une erreur -- */
    function effacerErreur(champId) {
      const erreur = document.getElementById(champId + '-error');
      const champ  = document.getElementById(champId);
      if (erreur) erreur.textContent = '';
      if (champ)  champ.classList.remove('invalid');
    }

    /* -- Effacement en temps réel pendant la saisie -- */
    [champNom, champEmail, champMessage].forEach(function (champ) {
      if (!champ) return;
      champ.addEventListener('input', function () {
        effacerErreur(champ.id);
      });
    });
     
// ================================
// ANIMATION AU SCROLL
// ================================

const hiddenElements = document.querySelectorAll(".hidden");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {

        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }

    });
});

hiddenElements.forEach(el => {
    observer.observe(el);
});

// ================================
// BARRES DE COMPÉTENCES
// ================================

const skills = document.querySelectorAll(".skill-fill");

const skillObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            const width = entry.target.style.getPropertyValue("--w");

            entry.target.style.width = width;
        }

    });

});

skills.forEach(skill => {
    skillObserver.observe(skill);
});

// ================================
// BOUTON RETOUR EN HAUT
// ================================

const btnTop = document.getElementById("btn-top");

window.addEventListener("scroll", () => {

    if (window.scrollY > 300) {
        btnTop.style.display = "block";
    } else {
        btnTop.style.display = "none";
    }

});

btnTop.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});

// ================================
// MENU MOBILE
// ================================

const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {

    navLinks.classList.toggle("active");

});

// ================================
// FORMULAIRE
// ================================

const form = document.getElementById("contact-form");

form.addEventListener("submit", (e) => {

    e.preventDefault();

    document.getElementById("form-success").textContent =
        "Votre message a été envoyé avec succès !";

    form.reset();

});

    /* -- Soumission du formulaire -- */
    formulaire.addEventListener('submit', function (e) {
      // ✅ preventDefault = empêcher le rechargement de la page
      e.preventDefault();

      // Récupérer les valeurs (trim() enlève les espaces avant/après)
      const nom     = champNom     ? champNom.value.trim()     : '';
      const email   = champEmail   ? champEmail.value.trim()   : '';
      const message = champMessage ? champMessage.value.trim() : '';

      // Compteur d'erreurs
      let nbErreurs = 0;

      // ── Validation du nom ──
      if (nom.length < 2) {
        afficherErreur('name', '⚠️ Le nom doit contenir au moins 2 caractères.');
        nbErreurs++;
      } else {
        effacerErreur('name');
      }

      // ── Validation de l'email ──
      // On teste avec une expression régulière (regex) simple
      const emailValide = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailValide) {
        afficherErreur('email', '⚠️ Veuillez entrer une adresse email valide.');
        nbErreurs++;
      } else {
        effacerErreur('email');
      }

      // ── Validation du message ──
      if (message.length < 10) {
        afficherErreur('message', '⚠️ Le message doit contenir au moins 10 caractères.');
        nbErreurs++;
      } else {
        effacerErreur('message');
      }

      // ── Si aucune erreur, simuler l'envoi ──
      if (nbErreurs === 0) {

        // Désactiver le bouton pendant "l'envoi"
        btnEnvoyer.disabled    = true;
        btnEnvoyer.textContent = 'Envoi en cours...';

        // Simulation d'un délai réseau (1.5 secondes)
        setTimeout(function () {

          // Afficher le message de succès
          if (divSucces) {
            divSucces.textContent = '✅ Message envoyé avec succès ! Je vous réponds bientôt.';
            divSucces.style.display = 'block';
          }

          // Réinitialiser le formulaire
          formulaire.reset();
          btnEnvoyer.disabled    = false;
          btnEnvoyer.textContent = 'Envoyer le message';

          // Cacher le message de succès après 5 secondes
          setTimeout(function () {
            if (divSucces) divSucces.style.display = 'none';
          }, 5000);

        }, 1500);
      }
    });
  }

  validerFormulaire();


  /* ==========================================================
     ✅ FONCTIONNALITÉ 9 : SMOOTH SCROLL pour les liens de nav
     
     Quand on clique sur un lien "#section", le scroll est
     animé de façon douce.
     
     Note : scroll-behavior: smooth; dans CSS gère déjà ça
     pour la plupart des navigateurs modernes. Ce code JS
     assure la compatibilité avec les plus anciens.
     ========================================================== */
  function smoothScroll() {
    const liens = document.querySelectorAll('a[href^="#"]');

    liens.forEach(function (lien) {
      lien.addEventListener('click', function (e) {
        const cibleId = lien.getAttribute('href');

        // On ignore les href="#" vides
        if (cibleId === '#') return;

        const cible = document.querySelector(cibleId);

        if (cible) {
          e.preventDefault(); // Empêcher le saut brusque par défaut

          // Calculer la position en tenant compte de la navbar
          const hauteurNavbar = 70;
          const positionCible = cible.getBoundingClientRect().top + window.scrollY - hauteurNavbar;

          window.scrollTo({
            top:      positionCible,
            behavior: 'smooth',
          });
        }
      });
    });
  }

  smoothScroll();


  /* ==========================================================
     ✅ FONCTIONNALITÉ 10 : GESTION DES ERREURS JAVASCRIPT
     
     Ce bloc "attrape" les erreurs imprévues et les affiche
     proprement dans la console, sans crasher le site.
     
     window.onerror = gestionnaire d'erreurs global
     ========================================================== */
  window.onerror = function (message, source, ligne, colonne, erreur) {
    // On log l'erreur de façon lisible dans la console
    console.error('🔴 Erreur JavaScript détectée :');
    console.error('   Message :', message);
    console.error('   Fichier  :', source);
    console.error('   Ligne    :', ligne, '| Colonne :', colonne);
    if (erreur) console.error('   Détail  :', erreur.stack);

    // On retourne true pour éviter que l'erreur s'affiche en rouge
    // dans la console de façon non formatée
    return true;
  };

  // Attraper aussi les Promises rejetées sans .catch()
  window.addEventListener('unhandledrejection', function (event) {
    console.error('🔴 Promesse rejetée non gérée :', event.reason);
  });


  /* ==========================================================
     ✅ BONUS : APPARITION PROGRESSIVE — déjà gérée par la
     fonctionnalité 5 (Intersection Observer). Ici on s'assure
     que les éléments dans le viewport initial s'animent dès
     le chargement.
     ========================================================== */
  function animerElementsInitiaux() {
    // Petite pause pour laisser le CSS s'initialiser
    setTimeout(function () {
      const elementsVisibles = document.querySelectorAll('.hidden');
      elementsVisibles.forEach(function (el) {
        const rect = el.getBoundingClientRect();
        // Si l'élément est dans la zone visible de l'écran
        if (rect.top < window.innerHeight) {
          el.classList.add('show');
        }
      });
    }, 100);
  }
   const hiddenElements = document.querySelectorAll(".hidden");

const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            entry.target.classList.add("show");
        }
    });
});

   
hiddenElements.forEach(el=>{
    observer.observe(el);
});

  animerElementsInitiaux();


  /* ----------------------------------------------------------
     📋 RÉCAPITULATIF DE CE QUI EST CHARGÉ :
     
     1.  ✅ Alert de bienvenue (toast personnalisé)
     2.  ✅ Effet typing sur le titre
     3.  ✅ Bouton retour en haut
     4.  ✅ Navigation active pendant le scroll
     5.  ✅ Scroll animation (Intersection Observer)
     6.  ✅ Menu hamburger mobile
     7.  ✅ Effets 3D dynamiques sur les cartes
     8.  ✅ Validation du formulaire avec messages d'erreur
     9.  ✅ Smooth scroll pour tous les liens ancres
     10. ✅ Gestion globale des erreurs JavaScript
     
     💡 CONSEIL POUR DÉBUTER :
     Utilise F12 dans ton navigateur pour ouvrir les outils
     développeurs. L'onglet "Console" affiche les messages
     console.log() et les erreurs. C'est ton meilleur ami !
     ---------------------------------------------------------- */

}); // Fin du DOMContentLoaded
