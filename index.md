---
layout: default
title: Freelance Talend & Power BI (PowerBI) — ETL, DAX & Dashboards
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
{% include services.html %}


<!-- REALISATIONS -->
{% include realisations.html %}

<!-- FAQ ciblée SEO -->
<section id="faq" class="section" aria-labelledby="faq-title">
  <h2 id="faq-title">FAQ — Freelance Talend &amp; Power BI</h2>
  <div class="grid cols-2" style="gap:1rem">
    <details class="card"><summary><strong>Quelles missions proposez‑vous en Freelance Talend et Power BI&nbsp;?</strong></summary>
      <p style="margin:.6rem 0 0">De l’intégration de données (ETL Talend, APIs) jusqu’à la data‑viz Power BI/PowerBI&nbsp;: modélisation DAX, tableaux de bord, automatisations et gouvernance.</p>
    </details>
    <details class="card"><summary><strong>Combien coûte une mission&nbsp;?</strong></summary>
      <p style="margin:.6rem 0 0">Forfait cadrage/PoC puis régie ou forfait projet. Le TJM varie selon le périmètre (Talend, DWH, DAX/PowerBI, SLA) et l’urgence.</p>
    </details>
    <details class="card"><summary><strong>Quels sont les délais d’intervention&nbsp;?</strong></summary>
      <p style="margin:.6rem 0 0">Démarrage rapide. Audit 2–5 j, PoC 5–10 j, puis itérations produit pour livrer des résultats mesurables chaque semaine.</p>
    </details>
    <details class="card"><summary><strong>Accompagnez‑vous la migration Talend Cloud et la gouvernance Power BI&nbsp;?</strong></summary>
      <p style="margin:.6rem 0 0">Oui&nbsp;: migration Talend OSS → Cloud, refonte pipelines, monitoring/qualité. Côté Power BI&nbsp;: modèle en étoile, DAX performant, espaces/partage et bonnes pratiques.</p>
    </details>
  </div>
</section>

<!-- CONTACTS -->
{% include contact.html %}


<!-- Modal Calendly -->
<div id="calendly-modal" class="modal" hidden>
  <div class="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="calendlyTitle">
    <button class="modal__close" aria-label="Fermer">×</button>
    <div style="padding:.75rem 1rem; border-bottom:1px solid var(--border)">
      <h3 id="calendlyTitle" style="margin:0">Réserver un créneau</h3>
    </div>
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

<!-- JSON-LD : FAQPage (spécifique aux requêtes Freelance Talend & Power BI) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type":"Question","name":"Quelles missions proposez‑vous en Freelance Talend et Power BI ?","acceptedAnswer":{"@type":"Answer","text":"De l’intégration de données (ETL Talend, APIs) jusqu’à la data‑viz Power BI/PowerBI : modélisation DAX, tableaux de bord, automatisations et gouvernance."}},
    {"@type":"Question","name":"Combien coûte une mission ?","acceptedAnswer":{"@type":"Answer","text":"Forfait cadrage/PoC puis régie ou forfait projet. Le TJM varie selon le périmètre (Talend, DWH, DAX/PowerBI, SLA) et l’urgence."}},
    {"@type":"Question","name":"Quels sont les délais d’intervention ?","acceptedAnswer":{"@type":"Answer","text":"Démarrage rapide. Audit 2–5 jours, PoC 5–10 jours, puis itérations produit pour livrer des résultats mesurables chaque semaine."}},
    {"@type":"Question","name":"Accompagnez‑vous la migration Talend Cloud et la gouvernance Power BI ?","acceptedAnswer":{"@type":"Answer","text":"Oui : migration Talend OSS vers Talend Cloud, refonte des pipelines et monitoring/qualité. Côté Power BI : modèle en étoile, DAX performant, espaces/partage et bonnes pratiques de gouvernance."}}
  ]
}
</script>
