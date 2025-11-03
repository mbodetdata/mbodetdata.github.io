---
layout: default
title: Blog
description: Articles techniques sur Talend, Power BI, ETL, DAX, performance et DataOps.
permalink: /blog/
---

{% assign posts_visible = site.posts | where_exp: "post", "post.active != false" %}
{% assign posts_sorted = posts_visible | sort: 'date' | reverse %}
{% capture categories_config %}
talend-talaxie::Talend &amp; Talaxie
powerbi::Power BI
avantages::Avantages
divers::Divers
{% endcapture %}
{% assign parent_categories = categories_config | strip | split: "\n" %}
{% assign total_posts = posts_sorted | size %}
{% assign total_categories = parent_categories | size %}

<header class="section hero hero--page hero--blog">
  <div class="hero__content">
    <p class="hero__eyebrow muted">Inspiration &amp; expertise data</p>
    <h1>Blog</h1>
    <p class="hero__lead muted">
      Guides pratiques, retours d'experience et innovations autour de Talend, Talaxie, Power BI et des plateformes data modernes.
    </p>
    <div class="hero-actions">
      <a class="btn primary" href="#articles">Decouvrir les articles</a>
      <a class="btn ghost" href="{{ '/contact/' | relative_url }}">Discuter d'un projet</a>
    </div>
  </div>
  <div class="hero__meta card hero__meta--compact">
    <p class="muted">En un clin d'oeil</p>
    <ul class="hero-stats">
      <li><strong>{{ total_posts }}</strong> articles publies</li>
      <li><strong>{{ total_categories }}</strong> categories principales</li>
      <li><strong>10+</strong> projets accompagnes</li>
    </ul>
  </div>
</header>

<section class="section section--filters" id="articles">
  <div class="filter-toolbar card card--gradient">
    <div class="filter-toolbar__top">
      <h2>Explorer les articles</h2>
      <p class="muted">Choisissez une categorie pour filtrer les publications.</p>
    </div>
    <div class="filter-toolbar__row">
      <div class="filter-pills" role="tablist" aria-label="Filtrer par categorie">
        <button type="button" class="chip is-active" data-filter-button data-filter="all">Tout</button>
        {% for entry in parent_categories %}
          {% assign parts = entry | split: "::" %}
          {% assign cat_slug = parts[0] | strip | downcase %}
          {% assign cat_label = parts[1] | strip %}
          <button type="button" class="chip" data-filter-button data-filter="{{ cat_slug }}">{{ cat_label }}</button>
        {% endfor %}
      </div>
    </div>
    <div class="filter-count muted" aria-live="polite">
      <span data-filter-count>{{ total_posts }}</span>
      <span data-filter-word>{% if total_posts > 1 %}articles{% else %}article{% endif %}</span>
      disponibles
    </div>
  </div>

  <div class="posts-grid modern-grid" data-post-grid>
    {% for post in posts_sorted %}
      {% assign cover = post.image | default: site.og_image %}
      {% assign words = post.content | strip_html | strip_newlines | replace: '  ', ' ' | split: ' ' | size %}
      {% assign minutes = words | divided_by: 220 | plus: 1 %}
      {% assign parent_slug = post.parent_category | default: 'divers' | downcase %}
      {% assign parent_label = '' %}
      {% for entry in parent_categories %}
        {% assign parts = entry | split: "::" %}
        {% assign cat_slug = parts[0] | strip | downcase %}
        {% assign cat_label = parts[1] | strip %}
        {% if parent_slug == cat_slug %}
          {% assign parent_label = cat_label %}
        {% endif %}
      {% endfor %}
      {% if parent_label == '' %}
        {% assign parent_label = 'Divers' %}
      {% endif %}
      {% assign post_tags = post.tags | default: empty %}
      <article class="post-card card" data-post-card data-category="{{ parent_slug }}">
        <div class="thumb" aria-hidden="true">
          <img src="{{ cover | relative_url }}" alt="" loading="lazy" decoding="async">
        </div>
        <div class="pc-body">
          <div class="pc-flags">
            <span class="chip chip--category">{{ parent_label }}</span>
          </div>
          <div class="pc-meta muted">
            <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%d %b %Y" }}</time>
            <span aria-hidden="true">&middot;</span> ~{{ minutes }} min
          </div>
          <h3 class="pc-title"><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
          <p class="pc-excerpt muted">{{ post.excerpt | strip_html | truncate: 160 }}</p>
          {% if post_tags and post_tags != empty %}
          <div class="pc-tags">
            {% for t in post_tags limit:3 %}
              <span class="chip">{{ t }}</span>
            {% endfor %}
          </div>
          {% endif %}
        </div>
        <a class="stretched" href="{{ post.url | relative_url }}" aria-label="Lire : {{ post.title }}"></a>
      </article>
    {% endfor %}
    <p class="muted empty-state card" data-empty-state hidden>
      Aucun article dans cette categorie pour le moment. Essayez une autre categorie.
    </p>
  </div>
</section>

<script>
  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.querySelector('[data-post-grid]');
    if (!grid) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-post-card]'));
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-button]'));
    var emptyState = grid.querySelector('[data-empty-state]');
    var counter = document.querySelector('[data-filter-count]');
    var counterWord = document.querySelector('[data-filter-word]');

    var activeFilter = 'all';

    function applyFilters() {
      var visibleCount = 0;

      cards.forEach(function (card) {
        var matchesFilter = activeFilter === 'all';
        if (!matchesFilter) {
          matchesFilter = card.getAttribute('data-category') === activeFilter;
        }

        card.hidden = !matchesFilter;
        if (matchesFilter) visibleCount += 1;
      });

      if (emptyState) {
        emptyState.hidden = visibleCount !== 0;
      }
      if (counter) {
        counter.textContent = visibleCount;
      }
      if (counterWord) {
        counterWord.textContent = visibleCount > 1 ? 'articles' : 'article';
      }
    }

    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        activeFilter = button.getAttribute('data-filter');
        filterButtons.forEach(function (btn) {
          btn.classList.toggle('is-active', btn === button);
        });
        applyFilters();
      });
    });

    applyFilters();
  });
</script>
