---
layout: default
title: Freelance Talend & Power BI
description: Intégrations de données, pipelines ETL Talend, modèles DAX et dashboards Power BI performants. Disponibilité rapide, résultats mesurables.
permalink: /
---

<!-- H1 accessible (améliore le SEO sans changer le design) -->
<h1 class="sr-only">Freelance Talend &amp; Power BI — Intégration de données ETL, DAX, tableaux de bord</h1>

<!-- ABOUT ME -->
{% include about-me.html %}

<!-- CERTS -->
{% include certs.html %}

<!-- METHODES -->
{% include methodes.html %}


<!-- SERVICES -->
<section id="services" class="section" aria-labelledby="services-title">
  <h2 id="services-title">Services</h2>

  <!-- ItemList de Services (SEO) -->
  <div class="grid cols-2"
       role="list"
       itemscope itemtype="https://schema.org/ItemList"
       aria-label="Catalogue de services">
    <meta itemprop="name" content="Services {{ site.author.name }}">
    <meta itemprop="itemListOrder" content="https://schema.org/ItemListOrderAscending">

    {% for service in site.data.services %}
      <article class="card"
               role="listitem"
               itemscope itemtype="https://schema.org/Service"
               itemprop="itemListElement">
        <meta itemprop="position" content="{{ forloop.index }}">
        <h3 itemprop="name">{{ service.title }}</h3>
        <p itemprop="description">{{ service.text }}</p>

        {% if service.badges %}
          <p aria-label="Compétences associées">
            {% for badge in service.badges %}
              <!-- Les badges servent de mots-clés / DefinedTerm -->
              <span class="badge"
                    itemprop="keywords">{{ badge }}</span>
            {% endfor %}
          </p>
        {% endif %}
      </article>
    {% endfor %}
  </div>
</section>
<!-- END SERVICES -->


<!-- REALISATIONS -->
<section id="realisation" class="section" aria-labelledby="work-title">
  <h2 id="work-title">Réalisations récentes</h2>

  <!-- ItemList de projets (CreativeWork) -->
  <div class="grid cols-2"
       role="list"
       itemscope itemtype="https://schema.org/ItemList"
       aria-label="Sélection de réalisations">
    <meta itemprop="name" content="Réalisations {{ site.author.name }}">
    <meta itemprop="itemListOrder" content="https://schema.org/ItemListOrderAscending">

    {% for projet in site.data.projets %}
      <article class="card"
               role="listitem"
               itemscope itemtype="https://schema.org/CreativeWork"
               itemprop="itemListElement">
        <meta itemprop="position" content="{{ forloop.index }}">
        <h3 itemprop="name">{{ projet.title }}</h3>
        <p class="lead" itemprop="abstract">{{ projet.text }}</p>
        <a class="btn" href="{{ projet.link }}" itemprop="url">Voir les projets</a>
      </article>
    {% endfor %}
  </div>
</section>
<!-- END REALISATIONS -->

{% include contact.html %}


<!-- Modal Calendly -->
<div id="calendly-modal" class="modal" hidden>
  <div class="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="calendlyTitle">
    <button class="modal__close" aria-label="Fermer">×</button>
    <div style="padding:.75rem 1rem; border-bottom:1px solid var(--border)">
      <h3 id="calendlyTitle" style="margin:0">Réserver un créneau</h3>
    </div>
    <!-- Le widget s’injecte ici -->
    <div id="calendly-inline"
         class="calendly-inline"
         data-calendly-url="{{ site.author.calendly_url }}"
         style="position:relative; min-height:72vh;">
      <div class="calendly-skeleton" aria-hidden="true" style="display:grid;place-items:center;height:100%;">
        <p class="muted" style="margin:0">Chargement du calendrier…</p>
      </div>
    </div>
  </div>
</div>

<!-- JSON-LD : ItemList Services + Réalisations (dynamique depuis _data) -->
{%- assign total_services = site.data.services | size -%}
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
        {% for s in site.data.services %}
        {
          "@type": "ListItem",
          "position": {{ forloop.index }},
          "item": {
            "@type": "Service",
            "name": {{ s.title | jsonify }},
            "description": {{ s.text  | jsonify }}
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
            "abstract": {{ p.text  | jsonify }},
            {% if p.link %}"url": {{ p.link | jsonify }}{% endif %}
          }
        }{% unless forloop.last %},{% endunless %}
        {% endfor %}
      ]
    }
  ]
}
</script>
