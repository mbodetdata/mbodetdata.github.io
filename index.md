---
layout: default
title: "Consultant Data pour PME — Connectez vos logiciels, pilotez vos chiffres | BM Data"
description: "Vous perdez du temps à ressaisir des données entre vos logiciels ou cherchez vos chiffres dans des fichiers Excel éparpillés ? Je connecte vos outils, automatise vos flux et construis vos tableaux de bord. Consultant data freelance pour TPE/PME. Résultats concrets, sans jargon."
keywords_groups:
  - services
  - local
  - competences
permalink: /
bandeau:
  hide_photo: true
---

<!-- H1 accessible (améliore le SEO sans changer le design) -->
<h1 class="sr-only">Consultant data freelance pour PME : automatisez vos données, pilotez votre activité avec des tableaux de bord clairs</h1>

<!-- BANDEAU -->
<style>
  #bandeau .about-hero__canvas{
    max-width:min(1400px, 96vw);
    padding:clamp(1.3rem, 4vw, 2.8rem);
  }
  #bandeau .about-hero__inner{
    grid-template-columns:1fr;
    align-items:stretch;
    justify-items:stretch;
    gap:0;
  }
  #bandeau .about-hero__media{
    display:none;
  }
  #bandeau .about-hero__content{
    width:100%;
    max-width:min(1120px, 100%);
    margin-inline:auto;
    display:grid;
    grid-template-columns:minmax(0, 1.18fr) minmax(0, .92fr);
    grid-template-areas:
      "eyebrow panel"
      "title panel"
      "text panel";
    align-items:start;
    column-gap:clamp(1.2rem, 3vw, 2.6rem);
    row-gap:clamp(.55rem, 1.6vw, 1rem);
  }
  #bandeau .about-hero__eyebrow{
    grid-area:eyebrow;
    margin:0;
  }
  #bandeau .about-hero__title{
    grid-area:title;
    max-width:18ch;
  }
  #bandeau .about-hero__text{
    grid-area:text;
    max-width:58ch;
    margin:0;
  }
  #bandeau .hero-benefits-panel{
    grid-area:panel;
    margin:0;
    align-self:stretch;
    display:grid;
    gap:clamp(.55rem, 1.2vw, .9rem);
  }
  #bandeau .hero-benefits-panel__label{
    color:color-mix(in oklab, #fff 80%, transparent);
  }
  #bandeau .hero-benefits{
    margin:0;
    border:1px solid color-mix(in oklab, var(--border) 64%, var(--brand-2) 36%);
    background:linear-gradient(148deg,
      rgba(8, 14, 42, .9),
      color-mix(in oklab, rgba(8, 14, 42, .82) 68%, var(--brand-2) 32%));
    box-shadow:0 14px 34px rgba(0, 0, 0, .3), inset 0 1px 0 rgba(255, 255, 255, .08);
  }
  #bandeau .hero-benefit{
    align-items:flex-start;
    padding:clamp(.78rem, 1.9vw, 1rem) clamp(.95rem, 2.2vw, 1.25rem);
  }
  #bandeau .hero-benefit__desc{
    color:color-mix(in oklab, #eef4ff 82%, rgba(168, 186, 220, .45) 18%);
  }
  #bandeau .about-hero__canvas::before,
  #bandeau .about-hero__canvas::after{
    content:none;
  }
  @media (max-width: 980px){
    #bandeau .about-hero__content{
      grid-template-columns:1fr;
      grid-template-areas:
        "eyebrow"
        "title"
        "text"
        "panel";
      row-gap:clamp(.8rem, 2.8vw, 1.2rem);
    }
    #bandeau .about-hero__title,
    #bandeau .about-hero__text{
      max-width:none;
    }
  }
</style>
{% include bandeau.html %}

<!-- SERVICES -->
{% include services.html %}

  <div class="services-footer">
    <div class="services-divider" role="presentation"></div>
  </div>

<!-- REALISATIONS -->
{% include realisation_recentes.html %}


  <div class="services-footer">
    <div class="services-divider" role="presentation"></div>
  </div>

<!-- BLOG -->
{% include blog-latest.html %}

  <div class="services-footer">
    <div class="services-divider" role="presentation"></div>
  </div>

<!-- CONTACTS -->
{% include contact.html %}


<!-- Modal Booking -->
<div id="calendly-modal" class="modal modal--booking" hidden>
  <div class="modal__dialog booking-modal" role="dialog" aria-modal="true" aria-labelledby="calendlyTitle" aria-describedby="calendlySubtitle">
    <div class="booking-modal__glow" aria-hidden="true"></div>
    <header class="booking-modal__header">
      <div class="booking-modal__intro">
        <p class="booking-modal__eyebrow">Session d&eacute;couverte</p>
        <div class="booking-modal__titles">
          <h3 id="calendlyTitle">Planifiez votre rendez-vous</h3>
          <p id="calendlySubtitle">Choisissez un cr&eacute;neau de 30&nbsp;minutes pour &eacute;changer avec un expert Power&nbsp;BI &amp; Talend.</p>
        </div>
        <div class="booking-modal__meta" aria-label="Informations de rendez-vous">
          <span class="booking-modal__meta-item">30&nbsp;min</span>
          <span class="booking-modal__meta-item">Visio</span>
          <span class="booking-modal__meta-item">Sans engagement</span>
        </div>
      </div>
      <button class="modal__close booking-modal__close" type="button" aria-label="Fermer">
        <span aria-hidden="true">&times;</span>
      </button>
    </header>
    <div class="booking-modal__content">
      <ul class="booking-modal__trust" aria-label="Informations de r&eacute;servation">
        <li>Confirmation instantan&eacute;e</li>
        <li>Lien visio automatique</li>
        <li>Vos donn&eacute;es restent confidentielles</li>
      </ul>
      <div class="booking-modal__frame">
        <div id="calendly-inline"
             class="calendly-inline booking-modal__iframe"
             data-booking-url="{{ site.author.cal_url | default: site.author.calendly_url }}">
          <div class="calendly-skeleton booking-modal__skeleton" aria-hidden="true">
            <div class="booking-modal__loader" role="presentation">
              <span class="booking-modal__dot"></span>
              <span class="booking-modal__dot"></span>
              <span class="booking-modal__dot"></span>
            </div>
            <p>Chargement de votre espace de r&eacute;servation&hellip;</p>
          </div>
          <iframe
            src="{{ site.author.cal_url | default: site.author.calendly_url }}"
            title="R&eacute;server un cr&eacute;neau"
            loading="lazy"
            allowtransparency="true"></iframe>
        </div>
      </div>
    </div>
  </div>
</div>
