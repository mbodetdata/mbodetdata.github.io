---
layout: default
title: "Consultant Data pour PME — Connectez vos logiciels, pilotez vos chiffres | BM Data"
description: "Vous perdez du temps à ressaisir des données entre vos logiciels ou cherchez vos chiffres dans des fichiers Excel éparpillés ? Je connecte vos outils, automatise vos flux et construis vos tableaux de bord. Consultant data freelance pour TPE/PME à Agen et en Lot-et-Garonne. Résultats concrets, et rapides."
keywords_groups:
  - services
  - local
  - competences
permalink: /
bandeau:
  hide_photo: true
---

<!-- H1 accessible (améliore le SEO sans changer le design) -->
<h1 class="sr-only">Consultant data freelance pour PME à Agen et en Lot-et-Garonne : automatisez vos données, pilotez votre activité avec des tableaux de bord clairs</h1>

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
    margin:0;
    font-size:clamp(2.6rem, 1.7rem + 2.9vw, 4.55rem);
    font-weight:900;
    line-height:1.02;
    letter-spacing:.005em;
    color:#f5f8ff;
    background:linear-gradient(112deg, #f9fbff 14%, #9fb5ff 54%, #4be0af 100%);
    -webkit-background-clip:text;
    background-clip:text;
    -webkit-text-fill-color:transparent;
    text-shadow:
      0 18px 38px rgba(0, 0, 0, .52),
      0 0 24px color-mix(in oklab, var(--brand) 24%, transparent);
    animation:homeHeroHeadlineIn .64s cubic-bezier(.2, .76, .22, 1) both;
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
  #services .section-hook__title{
    position:relative;
    display:inline-block;
    margin:0;
    max-width:26ch;
    font-size:clamp(1.5rem, 1.08rem + 1.72vw, 2.48rem);
    font-weight:900;
    line-height:1.08;
    letter-spacing:.005em;
    color:#f6f9ff;
    background:linear-gradient(114deg, #f9fbff 14%, #abc8ff 56%, #4be0af 100%);
    -webkit-background-clip:text;
    background-clip:text;
    -webkit-text-fill-color:transparent;
    text-shadow:
      0 12px 30px rgba(0, 0, 0, .35),
      0 0 20px color-mix(in oklab, var(--brand-2) 22%, transparent);
    animation:homeHookTitleIn .58s cubic-bezier(.2, .76, .22, 1) both .12s;
  }
  #services .section-hook__title::after{
    content:"";
    position:absolute;
    left:0;
    right:0;
    bottom:-.2em;
    height:.15em;
    border-radius:999px;
    transform-origin:left center;
    background:linear-gradient(90deg,
      color-mix(in oklab, var(--brand) 78%, #fff 22%),
      color-mix(in oklab, var(--brand-2) 82%, #fff 18%));
    box-shadow:0 8px 18px rgba(21, 175, 136, .28);
    animation:homeHookUnderlineIn .62s cubic-bezier(.22, .9, .26, 1) both .22s;
  }
  @keyframes homeHeroHeadlineIn{
    from{
      opacity:0;
      transform:translateY(12px) scale(.985);
      filter:blur(3px);
    }
    to{
      opacity:1;
      transform:translateY(0) scale(1);
      filter:blur(0);
    }
  }
  @keyframes homeHookTitleIn{
    from{
      opacity:0;
      transform:translateY(8px);
      filter:blur(2px);
    }
    to{
      opacity:1;
      transform:translateY(0);
      filter:blur(0);
    }
  }
  @keyframes homeHookUnderlineIn{
    from{
      opacity:0;
      transform:scaleX(.14);
    }
    to{
      opacity:1;
      transform:scaleX(1);
    }
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
  @media (max-width: 580px){
    #bandeau .about-hero__title{
      font-size:clamp(2rem, 1.36rem + 5.1vw, 2.82rem);
      line-height:1.05;
      max-width:14ch;
      overflow-wrap:anywhere;
    }
    #services .section-hook{
      padding:clamp(.95rem, 4vw, 1.25rem);
    }
    #services .section-hook__title{
      font-size:clamp(1.28rem, 1.02rem + 2.5vw, 1.72rem);
      line-height:1.14;
      max-width:100%;
      overflow-wrap:anywhere;
    }
    #services .section-hook__title::after{
      bottom:-.17em;
      height:.12em;
    }
  }
  @media (prefers-reduced-motion: reduce){
    #bandeau .about-hero__title,
    #services .section-hook__title,
    #services .section-hook__title::after{
      animation:none !important;
      transform:none !important;
      filter:none !important;
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

<!-- TÉMOIGNAGE -->
<section class="section testimonials" aria-label="Recommandation professionnelle">
  <style>
    .testimonial-wrap{
      max-width:min(780px,94vw);
      margin-inline:auto;
      padding-block:clamp(1.8rem,4vw,2.8rem);
    }
    .testimonial-head{
      text-align:center;
      margin-bottom:clamp(1.2rem,3vw,1.8rem);
    }
    .testimonial-head__title{
      font-size:clamp(1.25rem,1rem + 1vw,1.7rem);
      font-weight:800;
      color:var(--fg);
      margin:0 0 .35rem;
    }
    .testimonial-head__sub{
      font-size:clamp(.8rem,.74rem + .22vw,.9rem);
      color:var(--muted);
      margin:0;
    }
    .testimonial-card{
      position:relative;
      margin:0;
      padding:clamp(1.4rem,3.5vw,2.2rem) clamp(1.4rem,3.5vw,2.4rem) clamp(1.4rem,3.5vw,2.2rem) clamp(1.8rem,4vw,2.8rem);
      background:linear-gradient(148deg,
        color-mix(in oklab, var(--surface-1) 92%, transparent),
        color-mix(in oklab, var(--surface-2) 76%, var(--brand) 24%));
      border:1px solid color-mix(in oklab, var(--border) 70%, var(--brand) 30%);
      border-left:3px solid var(--brand);
      border-radius:clamp(.9rem,2vw,1.3rem);
      box-shadow:0 12px 40px rgba(0,0,0,.22), inset 0 1px 0 rgba(255,255,255,.06);
    }
    .testimonial-quote-icon{
      position:absolute;
      top:clamp(1rem,2.5vw,1.5rem);
      right:clamp(1rem,2.5vw,1.6rem);
      opacity:.12;
      color:var(--brand);
    }
    .testimonial-body{
      font-size:clamp(.95rem,.88rem + .3vw,1.08rem);
      line-height:1.75;
      color:var(--fg-2);
      font-style:italic;
      margin:0 0 1.6rem;
    }
    .testimonial-footer{
      display:flex;
      align-items:center;
      gap:clamp(.7rem,2vw,1rem);
    }
    .testimonial-avatar{
      display:flex;
      align-items:center;
      justify-content:center;
      width:2.6rem;
      height:2.6rem;
      min-width:2.6rem;
      border-radius:50%;
      background:var(--g-brand);
      color:#fff;
      font-size:.82rem;
      font-weight:700;
      letter-spacing:.04em;
      flex-shrink:0;
    }
    .testimonial-author__name{
      display:block;
      font-size:.95rem;
      font-weight:700;
      color:var(--fg);
      line-height:1.2;
    }
    .testimonial-author__role{
      font-size:.8rem;
      color:var(--muted);
    }
    .testimonial-badge{
      margin-left:auto;
      display:inline-flex;
      align-items:center;
      gap:.35rem;
      font-size:.75rem;
      font-weight:600;
      color:color-mix(in oklab, var(--brand) 80%, #fff 20%);
      background:color-mix(in oklab, var(--brand) 10%, transparent);
      border:1px solid color-mix(in oklab, var(--brand) 28%, transparent);
      border-radius:999px;
      padding:.28rem .7rem;
    }
  </style>
  <div class="container testimonial-wrap">
    <div class="testimonial-head">
      <h2 class="testimonial-head__title">Ils parlent mieux que moi</h2>
      <p class="testimonial-head__sub">Recommandation professionnelle v&eacute;rifi&eacute;e</p>
    </div>
    <figure class="testimonial-card">
      <svg class="testimonial-quote-icon" aria-hidden="true" width="64" height="52" viewBox="0 0 36 28" fill="currentColor">
        <path d="M0 28V17.6C0 7.87 5.6 2.13 16.8 0l1.4 2.8C12.13 4.27 9.07 7.6 8.4 13.2H14V28H0zm20 0V17.6C20 7.87 25.6 2.13 36.8 0L38.2 2.8C32.13 4.27 29.07 7.6 28.4 13.2H34V28H20z"/>
      </svg>
      <blockquote class="testimonial-body">
        &laquo;&nbsp;Martial poss&egrave;de une vraie capacit&eacute; d&rsquo;autonomie, une rigueur pr&eacute;cieuse, et une curiosit&eacute; naturelle qui le pousse &agrave; aller au fond des sujets, m&ecirc;me les plus complexes ou inconnus. L&agrave; o&ugrave; certains reculent, lui avance, explore, teste, propose &mdash; toujours avec pertinence et fiabilit&eacute;. C&rsquo;est quelqu&rsquo;un sur qui on peut vraiment compter, et avec qui il est aussi agr&eacute;able qu&rsquo;efficace de travailler.&nbsp;&raquo;
      </blockquote>
      <figcaption class="testimonial-footer">
        <span class="testimonial-avatar" aria-hidden="true">NL</span>
        <div class="testimonial-author">
          <strong class="testimonial-author__name">Nicolas Lambert</strong>
          <span class="testimonial-author__role">Pilotage business &mdash; Manager direct</span>
        </div>
        <span class="testimonial-badge" aria-label="Source : LinkedIn">
          <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zm7 0h3.8v2.05h.05c.53-1 1.82-2.05 3.75-2.05 4.01 0 4.75 2.64 4.75 6.08V23h-4v-5.28c0-1.26-.02-2.89-1.76-2.89-1.76 0-2.03 1.37-2.03 2.79V23h-4V8z" fill="currentColor"/></svg>
          LinkedIn
        </span>
      </figcaption>
    </figure>
  </div>
</section>

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
