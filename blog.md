---
layout: default
title: Blog
description: Articles techniques sur Talend, Power BI, ETL, DAX, performance et DataOps.
permalink: /blog/
---

{% assign posts_visible = site.posts | where_exp: "post", "post.active != false" %}
{% assign posts_sorted = posts_visible | sort: 'date' | reverse %}

{% assign filter_terms = "" | split: "" %}
{% for post in posts_sorted %}
  {% assign term_bucket = "" | split: "" %}
  {% if post.categories %}
    {% assign term_bucket = term_bucket | concat: post.categories %}
  {% endif %}
  {% if post.tags %}
    {% assign term_bucket = term_bucket | concat: post.tags %}
  {% endif %}
  {% if term_bucket != empty %}
    {% assign filter_terms = filter_terms | concat: term_bucket %}
  {% endif %}
{% endfor %}
{% assign filter_terms = filter_terms | uniq | sort %}

<header class="section page-hero page-hero--blog">
  <div class="page-hero__content">
    <p class="eyebrow muted">Inspiration &amp; expertise data</p>
    <h1>Blog</h1>
    <p class="hero-lead muted">
      Guides pratiques, retours d'experience et innovations autour de Talend, Power BI et de la performance des plateformes data.
    </p>
    <div class="hero-actions">
      <a class="btn primary" href="#articles">Decouvrir les articles</a>
      <a class="btn ghost" href="{{ '/contact/' | relative_url }}">Discuter d'un projet</a>
    </div>
  </div>
  <div class="page-hero__meta card">
    <p class="muted">En un clin d'oeil</p>
    <ul class="hero-stats">
      <li><strong>{{ posts_sorted.size }}</strong> articles publies</li>
      <li><strong>{{ filter_terms.size }}</strong> thematiques explorees</li>
      <li><strong>10+</strong> projets accompagnes</li>
    </ul>
  </div>
</header>

<section class="section section--filters" id="articles">
  <div class="filter-toolbar card">
    <div class="filter-toolbar__top">
      <h2>Explorer les articles</h2>
      <p class="muted">Filtrez par thematique ou recherchez un sujet precis.</p>
    </div>
    <div class="filter-toolbar__row">
      <label class="sr-only" for="post-search">Rechercher un article</label>
      <input id="post-search" class="filter-search" type="search" placeholder="Rechercher un article..." autocomplete="off">
      <div class="filter-pills" role="tablist" aria-label="Filtrer par thematique">
        <button type="button" class="chip is-active" data-filter-button data-filter="all">Tout</button>
        {% for term in filter_terms %}
          {% assign term_slug = term | slugify: "latin" %}
          <button type="button" class="chip" data-filter-button data-filter="{{ term_slug }}">{{ term }}</button>
        {% endfor %}
      </div>
    </div>
    <div class="filter-count muted" aria-live="polite">
      <span data-filter-count>{{ posts_sorted.size }}</span> article{% if posts_sorted.size > 1 %}s{% endif %} disponibles
    </div>
  </div>

  <div class="posts-grid modern-grid" data-post-grid>
    {% for post in posts_sorted %}
      {% assign cover = post.image | default: site.og_image %}
      {% assign words = post.content | strip_html | strip_newlines | replace: '  ', ' ' | split: ' ' | size %}
      {% assign minutes = words | divided_by: 220 | plus: 1 %}
      {% assign post_filters = "" | split: "" %}
      {% if post.categories %}
        {% assign post_filters = post_filters | concat: post.categories %}
      {% endif %}
      {% if post.tags %}
        {% assign post_filters = post_filters | concat: post.tags %}
      {% endif %}
      {% assign post_filters = post_filters | uniq %}
      {% assign post_filter_slugs = "" %}
      {% for filter in post_filters %}
        {% assign slug = filter | slugify: "latin" %}
        {% if forloop.first %}
          {% assign post_filter_slugs = slug %}
        {% else %}
          {% assign post_filter_slugs = post_filter_slugs | append: "," | append: slug %}
        {% endif %}
      {% endfor %}
      <article class="post-card card" data-post-card data-filter-groups="{{ post_filter_slugs | downcase }}" data-post-title="{{ post.title | escape }}">
        <div class="thumb" aria-hidden="true">
          <img src="{{ cover | relative_url }}" alt="" loading="lazy" decoding="async">
        </div>
        <div class="pc-body">
          <div class="pc-meta muted">
            <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%d %b %Y" }}</time>
            <span aria-hidden="true">&middot;</span> ~{{ minutes }} min
          </div>
          <h3 class="pc-title"><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
          <p class="pc-excerpt muted">{{ post.excerpt | strip_html | truncate: 160 }}</p>
          {% if post_filters != empty %}
          <div class="pc-tags">
            {% for t in post_filters %}
              <span class="chip">{{ t }}</span>
            {% endfor %}
          </div>
          {% endif %}
        </div>
        <a class="stretched" href="{{ post.url | relative_url }}" aria-label="Lire : {{ post.title }}"></a>
      </article>
    {% endfor %}
    <p class="muted empty-state card" data-empty-state hidden>
      Aucun article ne correspond a votre recherche. Essayez une autre thematique ou un nouveau mot-cle.
    </p>
  </div>
</section>

<script>
  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.querySelector('[data-post-grid]');
    if (!grid) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-post-card]'));
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-button]'));
    var searchInput = document.getElementById('post-search');
    var emptyState = grid.querySelector('[data-empty-state]');
    var counter = document.querySelector('[data-filter-count]');

    var activeFilter = 'all';

    function applyFilters() {
      var query = (searchInput && searchInput.value ? searchInput.value : '').trim().toLowerCase();
      var visibleCount = 0;

      cards.forEach(function (card) {
        var matchesFilter = activeFilter === 'all';
        var groups = (card.getAttribute('data-filter-groups') || '').split(',');
        if (!matchesFilter && groups.length > 0) {
          matchesFilter = groups.indexOf(activeFilter) !== -1;
        }

        var title = (card.getAttribute('data-post-title') || '').toLowerCase();
        var matchesSearch = !query || title.indexOf(query) !== -1;

        var shouldShow = matchesFilter && matchesSearch;
        card.hidden = !shouldShow;
        if (shouldShow) visibleCount += 1;
      });

      if (emptyState) {
        emptyState.hidden = visibleCount !== 0;
      }
      if (counter) {
        counter.textContent = visibleCount;
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

    if (searchInput) {
      searchInput.addEventListener('input', applyFilters);
    }

    applyFilters();
  });
</script>
