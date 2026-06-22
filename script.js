/* ============================================================
   SCRIPT.JS — Portfolio de Bahati Kamina
   Toute l'interactivité du site, organisée en fonctions claires.
   Chaque fonctionnalité est indépendante et commentée.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ==========================================================
     ✅ 1. LOADER AU CHARGEMENT
     ========================================================== */
  function gererLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    window.addEventListener('load', function () {
      setTimeout(function () {
        loader.classList.add('loader-hidden');
      }, 400);
    });

    // Sécurité : si "load" ne se déclenche jamais (rare), on masque après 3s max
    setTimeout(function () {
      loader.classList.add('loader-hidden');
    }, 3000);
  }

  gererLoader();


  /* ==========================================================
     ✅ 2. MODE SOMBRE / CLAIR
     localStorage retient le choix de l'utilisateur entre visites.
     ========================================================== */
  function gererTheme() {
    const bouton = document.getElementById('theme-toggle');
    const racine = document.documentElement; // <html>
    if (!bouton) return;

    const THEME_KEY = 'portfolio-theme';

    // Récupérer le thème déjà choisi, sinon utiliser la préférence système
    let themeActuel = localStorage.getItem(THEME_KEY);
    if (!themeActuel) {
      const preferesClair = window.matchMedia('(prefers-color-scheme: light)').matches;
      themeActuel = preferesClair ? 'light' : 'dark';
    }

    appliquerTheme(themeActuel);

    function appliquerTheme(theme) {
      if (theme === 'light') {
        racine.setAttribute('data-theme', 'light');
        bouton.setAttribute('aria-pressed', 'true');
      } else {
        racine.removeAttribute('data-theme');
        bouton.setAttribute('aria-pressed', 'false');
      }
      localStorage.setItem(THEME_KEY, theme);
    }

    bouton.addEventListener('click', function () {
      const themeSuivant = racine.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      appliquerTheme(themeSuivant);
    });
  }

  gererTheme();


  /* ==========================================================
     ✅ 3. CURSEUR PERSONNALISÉ (desktop uniquement)
     ========================================================== */
  function gererCurseur() {
    const estTactile = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (estTactile) return;

    const point = document.querySelector('.cursor-dot');
    const anneau = document.querySelector('.cursor-ring');
    if (!point || !anneau) return;

    let anneauX = 0, anneauY = 0;
    let cibleX = 0, cibleY = 0;

    document.addEventListener('mousemove', function (e) {
      cibleX = e.clientX;
      cibleY = e.clientY;

      point.style.left = cibleX + 'px';
      point.style.top  = cibleY + 'px';
    });

    // L'anneau suit avec un léger retard (effet fluide)
    function animerAnneau() {
      anneauX += (cibleX - anneauX) * 0.18;
      anneauY += (cibleY - anneauY) * 0.18;
      anneau.style.left = anneauX + 'px';
      anneau.style.top  = anneauY + 'px';
      requestAnimationFrame(animerAnneau);
    }
    animerAnneau();

    // L'anneau grossit sur les éléments cliquables
    const elementsInteractifs = document.querySelectorAll('a, button, input, textarea, .card, .project-card');
    elementsInteractifs.forEach(function (el) {
      el.addEventListener('mouseenter', () => anneau.classList.add('ring-active'));
      el.addEventListener('mouseleave', () => anneau.classList.remove('ring-active'));
    });
  }

  gererCurseur();


  /* ==========================================================
     ✅ 4. EFFET TYPING SUR LE TITRE D'ACCUEIL
     ========================================================== */
  function effetTyping() {
    const cible = document.getElementById('typing-text');
    if (!cible) return;

    const phrases = ['Bahati Kamina', 'Développeur Web Junior'];
    const reduireAnimations = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduireAnimations) {
      cible.textContent = phrases[0];
      return;
    }

    let indexPhrase = 0;
    let indexLettre = 0;
    let enSuppression = false;

    function etape() {
      const phrase = phrases[indexPhrase];

      if (!enSuppression) {
        indexLettre++;
        cible.textContent = phrase.slice(0, indexLettre);

        if (indexLettre === phrase.length) {
          enSuppression = true;
          setTimeout(etape, 1800);
          return;
        }
      } else {
        indexLettre--;
        cible.textContent = phrase.slice(0, indexLettre);

        if (indexLettre === 0) {
          enSuppression = false;
          indexPhrase = (indexPhrase + 1) % phrases.length;
        }
      }

      setTimeout(etape, enSuppression ? 45 : 90);
    }

    etape();
  }

  effetTyping();


  /* ==========================================================
     ✅ 5. PARTICULES EN ARRIÈRE-PLAN (canvas léger)
     ========================================================== */
  function gererParticules() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;

    const reduireAnimations = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduireAnimations) return;

    const ctx = canvas.getContext('2d');
    const header = canvas.closest('header');
    let particules = [];
    let largeur, hauteur;

    function dimensionner() {
      largeur  = canvas.width  = header.offsetWidth;
      hauteur  = canvas.height = header.offsetHeight;
    }

    function creerParticules() {
      const nombre = Math.min(60, Math.floor((largeur * hauteur) / 18000));
      particules = [];
      for (let i = 0; i < nombre; i++) {
        particules.push({
          x: Math.random() * largeur,
          y: Math.random() * hauteur,
          rayon: Math.random() * 1.6 + 0.6,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          opacite: Math.random() * 0.5 + 0.2,
        });
      }
    }

    function dessiner() {
      ctx.clearRect(0, 0, largeur, hauteur);

      particules.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;

        // Rebond sur les bords
        if (p.x < 0 || p.x > largeur) p.vx *= -1;
        if (p.y < 0 || p.y > hauteur) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.rayon, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(77, 163, 255, ${p.opacite})`;
        ctx.fill();
      });

      requestAnimationFrame(dessiner);
    }

    dimensionner();
    creerParticules();
    dessiner();

    let redimensionTimeout;
    window.addEventListener('resize', function () {
      clearTimeout(redimensionTimeout);
      redimensionTimeout = setTimeout(function () {
        dimensionner();
        creerParticules();
      }, 200);
    });
  }

  gererParticules();


  /* ==========================================================
     ✅ 6. ANIMATIONS D'APPARITION AU SCROLL (reveal)
     Un seul IntersectionObserver pour toutes les apparitions
     (fade-up / slide-left / slide-right gérés en CSS via
     l'attribut data-reveal).
     ========================================================== */
  function activerRevealAuScroll() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    elements.forEach(el => observer.observe(el));
  }

  activerRevealAuScroll();


  /* ==========================================================
     ✅ 7. BARRES DE COMPÉTENCES ANIMÉES (cartes .card)
     Quand une carte de compétence devient visible, sa classe
     "show" déclenche en CSS l'animation de la largeur (--w).
     ========================================================== */
  function activerCartesCompetences() {
    const cartes = document.querySelectorAll('.skills-grid .card');
    if (!cartes.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    cartes.forEach(carte => observer.observe(carte));
  }

  activerCartesCompetences();


  /* ==========================================================
     ✅ 8. COMPTEURS ANIMÉS (projets, compétences, motivation)
     Chaque élément avec [data-counter] compte de 0 jusqu'à
     data-target, une seule fois, quand il devient visible.
     ========================================================== */
  function activerCompteurs() {
    const compteurs = document.querySelectorAll('[data-counter]');
    if (!compteurs.length) return;

    const reduireAnimations = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function lancerCompteur(element) {
      const cible  = parseInt(element.getAttribute('data-target'), 10) || 0;
      const suffixe = element.getAttribute('data-suffix') || '';

      if (reduireAnimations) {
        element.textContent = cible + suffixe;
        return;
      }

      const duree = 1400; // ms
      const debut = performance.now();

      function etape(maintenant) {
        const progres = Math.min((maintenant - debut) / duree, 1);
        // easing simple pour un effet plus naturel
        const valeur = Math.floor(progres * cible);
        element.textContent = valeur + suffixe;

        if (progres < 1) {
          requestAnimationFrame(etape);
        } else {
          element.textContent = cible + suffixe;
        }
      }

      requestAnimationFrame(etape);
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          lancerCompteur(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    compteurs.forEach(c => observer.observe(c));
  }

  activerCompteurs();


  /* ==========================================================
     ✅ 9. BOUTON RETOUR EN HAUT
     ========================================================== */
  function gererBoutonHaut() {
    const bouton = document.getElementById('btn-top');
    if (!bouton) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        bouton.classList.add('visible');
      } else {
        bouton.classList.remove('visible');
      }
    });

    bouton.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  gererBoutonHaut();


  /* ==========================================================
     ✅ 10. NAVIGATION ACTIVE PENDANT LE SCROLL
     ========================================================== */
  function gererNavigationActive() {
    const liens    = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id], header[id]');

    if (!sections.length || !liens.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const idVisible = entry.target.id;

          liens.forEach(lien => lien.classList.remove('active'));

          const lienActif = document.querySelector('.nav-link[href="#' + idVisible + '"]');
          if (lienActif) lienActif.classList.add('active');
        }
      });
    }, {
      rootMargin: '-20% 0px -70% 0px',
    });

    sections.forEach(section => observer.observe(section));
  }

  gererNavigationActive();


  /* ==========================================================
     ✅ 11. MENU HAMBURGER (mobile)
     ========================================================== */
  function gererMenuMobile() {
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('nav-links');

    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      const estOuvert = navLinks.classList.contains('open');
      hamburger.setAttribute('aria-expanded', String(estOuvert));
    });

    navLinks.querySelectorAll('.nav-link').forEach(function (lien) {
      lien.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    // Fermer le menu avec la touche Échap (accessibilité clavier)
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.focus();
      }
    });
  }

  gererMenuMobile();


  /* ==========================================================
     ✅ 12. EFFETS 3D SUR LES CARTES AU SURVOL (desktop)
     ========================================================== */
  function effetsCartes() {
    const estTactile = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (estTactile) return;

    const cartes = document.querySelectorAll('.card, .project-card');

    cartes.forEach(function (carte) {
      carte.addEventListener('mousemove', function (e) {
        const rect = carte.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top)  / rect.height;

        const rotateX = (y - 0.5) * -6;
        const rotateY = (x - 0.5) *  6;

        carte.style.transform =
          `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      carte.addEventListener('mouseleave', function () {
        carte.style.transform = '';
        carte.style.transition = 'transform 0.4s ease';
      });

      carte.addEventListener('mouseenter', function () {
        carte.style.transition = 'none';
      });
    });
  }

  effetsCartes();

  

   /* ============================================================
   🔌 CONFIGURATION EMAILJS
   Remplace les 3 valeurs ci-dessous par les tiennes :

   1. SERVICE_ID  → Email Services (dans ton dashboard EmailJS)
   2. TEMPLATE_ID → Email Templates
   3. PUBLIC_KEY  → Account > General > Public Key
   ============================================================ */
const EMAILJS_CONFIG = {
  SERVICE_ID:  'TON_SERVICE_ID',   // ex : 'service_abc1234'
  TEMPLATE_ID: 'TON_TEMPLATE_ID',  // ex : 'template_xyz5678'
  PUBLIC_KEY:  'TA_PUBLIC_KEY',    // ex : 'AbCdEfGhIjKlMnOp'
};

   /* ==========================================================
   ✅ VALIDATION + ENVOI RÉEL DU FORMULAIRE (EmailJS)
   ========================================================== */
function validerFormulaire() {
  const formulaire   = document.getElementById('contact-form');
  const champNom     = document.getElementById('name');
  const champEmail   = document.getElementById('email');
  const champMessage = document.getElementById('message');
  const champPiege   = document.getElementById('website'); // honeypot anti-spam
  const divSucces    = document.getElementById('form-success');
  const divErreur    = document.getElementById('form-error');
  const btnEnvoyer   = document.getElementById('submit-btn');

  if (!formulaire) return;

  // Initialiser EmailJS avec ta clé publique
  if (window.emailjs) {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }

  function afficherErreurChamp(champId, message) {
    const erreur = document.getElementById(champId + '-error');
    const champ  = document.getElementById(champId);
    if (erreur) erreur.textContent = message;
    if (champ) { champ.classList.add('invalid'); champ.classList.remove('valid'); }
  }

  function effacerErreurChamp(champId) {
    const erreur = document.getElementById(champId + '-error');
    const champ  = document.getElementById(champId);
    if (erreur) erreur.textContent = '';
    if (champ) { champ.classList.remove('invalid'); champ.classList.add('valid'); }
  }

  function masquerMessages() {
    if (divSucces) divSucces.classList.remove('show-msg');
    if (divErreur) divErreur.classList.remove('show-msg');
  }

  [champNom, champEmail, champMessage].forEach(function (champ) {
    if (!champ) return;
    champ.addEventListener('input', function () {
      effacerErreurChamp(champ.id);
    });
  });

  formulaire.addEventListener('submit', function (e) {
    e.preventDefault();
    masquerMessages();

    // Honeypot : si rempli, c'est un bot → on ignore silencieusement
    if (champPiege && champPiege.value.trim() !== '') {
      formulaire.reset();
      return;
    }

    const nom     = champNom.value.trim();
    const email   = champEmail.value.trim();
    const message = champMessage.value.trim();

    let nbErreurs = 0;

    if (nom.length < 2) {
      afficherErreurChamp('name', '⚠️ Le nom doit contenir au moins 2 caractères.');
      nbErreurs++;
    } else {
      effacerErreurChamp('name');
    }

    const emailValide = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValide) {
      afficherErreurChamp('email', '⚠️ Veuillez entrer une adresse email valide.');
      nbErreurs++;
    } else {
      effacerErreurChamp('email');
    }

    if (message.length < 10) {
      afficherErreurChamp('message', '⚠️ Le message doit contenir au moins 10 caractères.');
      nbErreurs++;
    } else {
      effacerErreurChamp('message');
    }

    if (nbErreurs > 0) return; // on s'arrête si la validation échoue

    // ── Envoi réel via EmailJS ──
    btnEnvoyer.disabled = true;
    const texteOriginal = btnEnvoyer.querySelector('.btn-text').textContent;
    btnEnvoyer.querySelector('.btn-text').textContent = 'Envoi en cours...';

    emailjs.sendForm(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, formulaire)
      .then(function () {
        if (divSucces) {
          divSucces.textContent = '✅ Message envoyé avec succès ! Je vous réponds bientôt.';
          divSucces.classList.add('show-msg');
        }
        formulaire.reset();
        [champNom, champEmail, champMessage].forEach(c => c.classList.remove('valid', 'invalid'));
      })
      .catch(function (erreur) {
        console.error('Erreur EmailJS :', erreur);
        if (divErreur) {
          divErreur.textContent = '❌ Une erreur est survenue. Réessayez plus tard ou contactez-moi directement par email.';
          divErreur.classList.add('show-msg');
        }
      })
      .finally(function () {
        btnEnvoyer.disabled = false;
        btnEnvoyer.querySelector('.btn-text').textContent = texteOriginal;
        setTimeout(masquerMessages, 6000);
      });
  });
}

validerFormulaire();


  /* ==========================================================
     ✅ 13. VALIDATION DU FORMULAIRE DE CONTACT
     - Validation en JS (et HTML natif en secours si JS désactivé)
     - Messages d'erreur personnalisés sous chaque champ
     - Anti-spam basique : honeypot + limite de fréquence d'envoi
     - Préparé pour EmailJS (voir bloc EMAILJS plus bas)
     ========================================================== */
  function validerFormulaire() {
    const formulaire   = document.getElementById('contact-form');
    const champNom     = document.getElementById('name');
    const champEmail   = document.getElementById('email');
    const champMessage = document.getElementById('message');
    const champPiege   = document.getElementById('website'); // honeypot
    const divSucces    = document.getElementById('form-success');
    const btnEnvoyer   = document.getElementById('submit-btn');

    if (!formulaire) return;

    function afficherErreur(champId, message) {
      const erreur = document.getElementById(champId + '-error');
      const champ  = document.getElementById(champId);
      if (erreur) erreur.textContent = message;
      if (champ) {
        champ.classList.add('invalid');
        champ.classList.remove('valid');
      }
    }

    function effacerErreur(champId) {
      const erreur = document.getElementById(champId + '-error');
      const champ  = document.getElementById(champId);
      if (erreur) erreur.textContent = '';
      if (champ) {
        champ.classList.remove('invalid');
        champ.classList.add('valid');
      }
    }

    /* -- Nettoyage basique des entrées : on retire les caractères
          potentiellement dangereux pour un affichage HTML brut.
          ⚠️ Cette protection est côté client uniquement : elle
          améliore l'expérience utilisateur, mais le VRAI rempart
          contre les injections doit toujours être côté serveur
          (échappement HTML, requêtes préparées, etc.) si un jour
          ce formulaire est branché à un backend. -- */
    function nettoyerTexte(valeur) {
      return valeur
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .trim();
    }

    [champNom, champEmail, champMessage].forEach(function (champ) {
      if (!champ) return;
      champ.addEventListener('input', function () {
        effacerErreur(champ.id);
      });
    });

    formulaire.addEventListener('submit', function (e) {
      e.preventDefault();

      // ── Honeypot : si ce champ caché est rempli, c'est un bot ──
      if (champPiege && champPiege.value.trim() !== '') {
        // On ne donne aucun indice au bot : on affiche un faux succès
        formulaire.reset();
        return;
      }

      // ── Anti-spam simple : empêcher l'envoi répété en moins de 20s ──
      const maintenant = Date.now();
      const dernierEnvoi = Number(sessionStorage.getItem('dernier-envoi-form') || 0);
      if (maintenant - dernierEnvoi < 20000) {
        if (divSucces) {
          divSucces.textContent = '⏳ Merci de patienter quelques secondes avant de renvoyer un message.';
          divSucces.classList.add('show-msg');
        }
        return;
      }

      const nom     = champNom     ? nettoyerTexte(champNom.value)     : '';
      const email   = champEmail   ? champEmail.value.trim()           : '';
      const message = champMessage ? nettoyerTexte(champMessage.value) : '';

      let nbErreurs = 0;

      if (nom.length < 2) {
        afficherErreur('name', '⚠️ Le nom doit contenir au moins 2 caractères.');
        nbErreurs++;
      } else {
        effacerErreur('name');
      }

      const emailValide = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailValide) {
        afficherErreur('email', '⚠️ Veuillez entrer une adresse email valide.');
        nbErreurs++;
      } else {
        effacerErreur('email');
      }

      if (message.length < 10) {
        afficherErreur('message', '⚠️ Le message doit contenir au moins 10 caractères.');
        nbErreurs++;
      } else {
        effacerErreur('message');
      }

      if (nbErreurs > 0) return;

      btnEnvoyer.disabled = true;
      const texteOriginal = btnEnvoyer.querySelector('.btn-text').textContent;
      btnEnvoyer.querySelector('.btn-text').textContent = 'Envoi en cours...';

      /* ==========================================================
         🔌 EMAILJS — Pour activer un envoi réel d'email :
         1. Crée un compte sur https://www.emailjs.com/
         2. Décommente le <script> EmailJS dans index.html
         3. Remplace les valeurs ci-dessous par les tiennes
         4. Décommente le bloc emailjs.send(...) et supprime
            le setTimeout de simulation juste après.
         ========================================================== */
      /*
      emailjs.send('TON_SERVICE_ID', 'TON_TEMPLATE_ID', {
        from_name:  nom,
        from_email: email,
        message:    message,
      }, 'TA_PUBLIC_KEY')
        .then(function () {
          afficherSucces();
        })
        .catch(function (erreur) {
          console.error('Erreur EmailJS :', erreur);
          if (divSucces) {
            divSucces.textContent = '❌ Une erreur est survenue. Réessayez plus tard.';
            divSucces.classList.add('show-msg');
          }
          btnEnvoyer.disabled = false;
          btnEnvoyer.querySelector('.btn-text').textContent = texteOriginal;
        });
      */

      // Simulation d'envoi (à supprimer une fois EmailJS branché ci-dessus)
      setTimeout(afficherSucces, 1200);

      function afficherSucces() {
        sessionStorage.setItem('dernier-envoi-form', String(Date.now()));

        if (divSucces) {
          divSucces.textContent = '✅ Message envoyé avec succès ! Je vous réponds bientôt.';
          divSucces.classList.add('show-msg');
        }

        formulaire.reset();
        [champNom, champEmail, champMessage].forEach(function (champ) {
          if (champ) champ.classList.remove('valid', 'invalid');
        });

        btnEnvoyer.disabled = false;
        btnEnvoyer.querySelector('.btn-text').textContent = texteOriginal;

        setTimeout(function () {
          if (divSucces) divSucces.classList.remove('show-msg');
        }, 5000);
      }
    });
  }

  validerFormulaire();


  /* ==========================================================
     ✅ 14. SMOOTH SCROLL POUR LES LIENS D'ANCRE
     ========================================================== */
  function smoothScroll() {
    const liens = document.querySelectorAll('a[href^="#"]');

    liens.forEach(function (lien) {
      lien.addEventListener('click', function (e) {
        const cibleId = lien.getAttribute('href');
        if (cibleId === '#') return;

        const cible = document.querySelector(cibleId);
        if (cible) {
          e.preventDefault();

          const hauteurNavbar = 70;
          const positionCible = cible.getBoundingClientRect().top + window.scrollY - hauteurNavbar;

          window.scrollTo({ top: positionCible, behavior: 'smooth' });
        }
      });
    });
  }

  smoothScroll();

   /* Échappement complet des caractères dangereux pour l'affichage HTML.
   Couvre les 5 caractères qui permettent de casser le HTML ou injecter
   des attributs/scripts : < > & " ' */
function nettoyerTexte(valeur) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return valeur.replace(/[&<>"']/g, (car) => map[car]).trim();
}

   const toast = document.createElement('div');
toast.setAttribute('role', 'status');
toast.textContent = '👋 Bienvenue sur mon portfolio !'; // textContent, jamais innerHTML

   // Nom : interdit les chiffres et caractères spéciaux dangereux, accepte les accents
const nomValide = /^[a-zA-ZÀ-ÿ\s'-]{2,80}$/.test(nom);
if (!nomValide) {
  afficherErreurChamp('name', '⚠️ Le nom ne doit contenir que des lettres (2 à 80 caractères).');
  nbErreurs++;
}

// Email : regex plus stricte qu'auparavant (évite les doubles points, espaces internes, etc.)
const emailValide = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email) && email.length <= 120;
if (!emailValide) {
  afficherErreurChamp('email', '⚠️ Veuillez entrer une adresse email valide.');
  nbErreurs++;
}

// Message : longueur + rejet si le contenu ressemble à une tentative d'injection de balise
const messageValide = message.length >= 10 && message.length <= 2000 && !/<[^>]*>/.test(message);
if (!messageValide) {
  afficherErreurChamp('message', '⚠️ Le message doit contenir 10 à 2000 caractères, sans balises HTML.');
  nbErreurs++;
}

   /* ==========================================================
   ✅ SÉCURITÉ : forcer rel="noopener noreferrer" sur tout lien
   target="_blank", même ajouté plus tard dans le HTML.
   ========================================================== */
function securiserLiensExternes() {
  document.querySelectorAll('a[target="_blank"]').forEach(function (lien) {
    const relActuel = lien.getAttribute('rel') || '';
    const valeurs = new Set(relActuel.split(/\s+/).filter(Boolean));
    valeurs.add('noopener');
    valeurs.add('noreferrer');
    lien.setAttribute('rel', Array.from(valeurs).join(' '));
  });
}

securiserLiensExternes();

  /* ==========================================================
     ✅ 15. ALERTE DE BIENVENUE (une fois par session)
     ========================================================== */
  function afficherBienvenue() {
    const dejaVisite = sessionStorage.getItem('bienvenue_affiche');
    if (dejaVisite) return;

    setTimeout(function () {
      sessionStorage.setItem('bienvenue_affiche', 'oui');

      const toast = document.createElement('div');
      toast.setAttribute('role', 'status');
      toast.textContent = '👋 Bienvenue sur mon portfolio !';

      Object.assign(toast.style, {
        position:     'fixed',
        bottom:       '24px',
        left:         '24px',
        background:   '#0d6efd',
        color:        'white',
        padding:      '14px 22px',
        borderRadius: '10px',
        fontFamily:   "'DM Sans', sans-serif",
        fontWeight:   '500',
        fontSize:     '0.95rem',
        zIndex:       '9999',
        boxShadow:    '0 8px 30px rgba(13,110,253,0.4)',
        opacity:      '0',
        transform:    'translateY(20px)',
        transition:   'all 0.4s ease',
        maxWidth:     'calc(100vw - 48px)',
      });

      document.body.appendChild(toast);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          toast.style.opacity   = '1';
          toast.style.transform = 'translateY(0)';
        });
      });

      setTimeout(function () {
        toast.style.opacity   = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 400);
      }, 4000);

    }, 1200);
  }

  afficherBienvenue();


  /* ==========================================================
     ✅ 16. GESTION GLOBALE DES ERREURS JAVASCRIPT
     ========================================================== */
  window.onerror = function (message, source, ligne, colonne, erreur) {
    console.error('🔴 Erreur JavaScript détectée :');
    console.error('   Message :', message);
    console.error('   Fichier  :', source);
    console.error('   Ligne    :', ligne, '| Colonne :', colonne);
    if (erreur) console.error('   Détail  :', erreur.stack);
    return true;
  };

  window.addEventListener('unhandledrejection', function (event) {
    console.error('🔴 Promesse rejetée non gérée :', event.reason);
  });

  /* ----------------------------------------------------------
     📋 RÉCAPITULATIF DES FONCTIONNALITÉS CHARGÉES :

     1.  Loader au chargement
     2.  Mode sombre / clair (persistant via localStorage)
     3.  Curseur personnalisé (desktop)
     4.  Effet typing sur le titre d'accueil
     5.  Particules animées en arrière-plan (canvas)
     6.  Animations d'apparition au scroll (fade-up/left/right)
     7.  Barres de compétences animées
     8.  Compteurs animés (projets, compétences, motivation)
     9.  Bouton retour en haut
     10. Navigation active pendant le scroll
     11. Menu hamburger mobile (+ fermeture par Échap)
     12. Effets 3D sur les cartes au survol
     13. Validation complète du formulaire + honeypot anti-spam
     14. Smooth scroll pour les liens d'ancre
     15. Toast de bienvenue (une fois par session)
     16. Gestion globale des erreurs JS

     💡 F12 dans le navigateur ouvre les outils développeurs :
     l'onglet "Console" affiche les console.log() et erreurs.
     ---------------------------------------------------------- */

});
