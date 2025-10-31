---
layout: default
title: BMData - Consultant Talend & Power BI freelance
description: Integrations de donnees, pipelines ETL Talend, modeles DAX et dashboards Power BI performants. Disponibilite rapide, resultats mesurables.
permalink: /
bandeau:
  photo: "/assets/img/bm-hero.webp"
---

<!-- H1 accessible (améliore le SEO sans changer le design) -->
<h1 class="sr-only">Freelance Talend &amp; Power BI — Intégration de données ETL, DAX, tableaux de bord</h1>

<!-- BANDEAU -->
<style>
  #bandeau .about-hero__inner{
    align-items:start;
  }
  #bandeau .about-hero__content{
    width:100%;
    max-width:min(620px, 100%);
    justify-items:start;
    gap:clamp(.8rem, 2.4vw, 1.4rem);
  }
  #bandeau .about-hero__content p{
    text-align:left;
  }
  #bandeau .about-photo-frame{
    aspect-ratio:auto;
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    gap:clamp(1rem, 3vw, 1.8rem);
    padding:clamp(1rem, 4vw, 1.9rem);
    max-width:min(480px, 100%);
  }
  #bandeau .about-photo-frame::after{
    display:none;
  }
  #bandeau .about-photo-slot{
    flex:1 1 auto;
    min-height:0;
  }
  #bandeau .about-photo-slot img{
    width:100%;
    height:auto;
    object-fit:cover;
  }
  #bandeau .about-hero__canvas::before,
  #bandeau .about-hero__canvas::after{
    content:none;
  }
  #bandeau .about-stats-card{
    width:100%;
    max-width:min(560px, 100%);
    margin-top:clamp(1.2rem, 4vw, 2rem);
  }
  #bandeau .about-stats-card__item{
    max-width:none;
  }
  @media (max-width: 720px){
    #bandeau .about-hero__inner{
      align-items:stretch;
    }
    #bandeau .about-photo-frame{
      margin-inline:auto;
      max-width:min(360px, 100%);
    }
    #bandeau .about-hero__content{
      text-align:left;
      justify-items:start;
    }
    #bandeau .about-stats-card{
      flex-direction:column;
      align-items:stretch;
      gap:clamp(.9rem, 4vw, 1.4rem);
    }
  }
  @media (min-width: 721px){
    #bandeau .about-hero__inner{
      align-items:start;
    }
    #bandeau .about-stats-card{
      gap:clamp(.9rem, 2vw, 1.6rem);
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


<!-- Modal Calendly -->
<div id="calendly-modal" class="modal" hidden>
  <div class="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="calendlyTitle">
    <button class="modal__close" type="button" aria-label="Fermer">&times;</button>
    <div style="padding:.75rem 1rem; border-bottom:1px solid var(--border)">
      <h3 id="calendlyTitle" style="margin:0">Réserver un créneau</h3>
    </div>
    <div id="calendly-inline"
         class="calendly-inline"
         data-booking-url="{{ site.author.cal_url | default: site.author.calendly_url }}"
         style="position:relative; min-height:72vh;">
      <div class="calendly-skeleton" aria-hidden="true" style="display:grid;place-items:center;height:100%;">
        <p class="muted" style="margin:0">Chargement du calendrier&hellip;</p>
      </div>
      <iframe
        src="{{ site.author.cal_url | default: site.author.calendly_url }}"
        title="R&eacute;server un cr&eacute;neau"
        loading="lazy"
        allowtransparency="true"></iframe>
    </div>
  </div>
</div>

<!-- JSON-LD : ItemList Services + Réalisations (dynamique depuis _data) -->
{%- assign services_list = site.data.services.cards | default: site.data.services -%}
{%- assign total_services = services_list | size -%}
{%- assign total_projets  = site.data.projets  | size -%}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ItemList",
      "name": "Services de {{ site.author.name }}",
      "itemListOrder": "https://schema.org/ItemListOrderAscending",
      "numberOfItems": {{ total_services | default: 0 }},
      "itemListElement": [
        {% for s in services_list %}
        {
          "@type": "ListItem",
          "position": {{ forloop.index }},
          "item": {
            "@type": "Service",
            "name": {{ s.title | jsonify }},
            "description": {{ s.description | default: s.tagline | jsonify }}{% if s.keywords %}
            ,"keywords": {{ s.keywords | jsonify }}{% endif %}
          }
        }{% unless forloop.last %},{% endunless %}
        {% endfor %}
      ]
    },
    {
      "@type": "ItemList",
      "name": "Réalisations de {{ site.author.name }}",
      "itemListOrder": "https://schema.org/ItemListOrderAscending",
      "numberOfItems": {{ total_projets | default: 0 }},
      "itemListElement": [
        {% for p in site.data.projets %}
        {
          "@type": "ListItem",
          "position": {{ forloop.index }},
          "item": {
            "@type": "CreativeWork",
            "name": {{ p.title | jsonify }},
            "abstract": {{ p.text | jsonify }},
            {% if p.link %}"url": {{ p.link | jsonify }}{% endif %}
          }
        }{% unless forloop.last %},{% endunless %}
        {% endfor %}
      ]
    }
  ]
}
</script>

