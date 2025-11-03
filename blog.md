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

<header class="page-hero page-hero--blog section">
  <div class="page-hero__canvas" aria-hidden="true">
    <div class="page-hero__glow page-hero__glow--left"></div>
    <div class="page-hero__glow page-hero__glow--right"></div>
  </div>
  <div class="page-hero__inner">
    <div class="page-hero__content">
      <p class="eyebrow muted">Journal de bord data</p>
      <h1>Blog</h1>
      <p class="hero-lead muted">
        Guides, retours d'experience et veille autour de Talend, Talaxie, Power BI et des plateformes data modernes.
      </p>
      <div class="hero-actions">
        <a class="btn primary" href="#articles">Derniers articles</a>
        <a class="btn ghost" href="{{ '/contact/' | relative_url }}">Parlons de votre projet</a>
      </div>
    </div>
    <aside class="page-hero__badge card">
      <p class="muted">En un clin d'oeil</p>
      <ul class="hero-stats">
        <li><strong>{{ total_posts }}</strong> articles publies</li>
        <li><strong>{{ total_categories }}</strong> categories principales</li>
        <li><strong>10+</strong> projets accompagnes</li>
      </ul>
    </aside>
  </div>
</header>

<section class="section" id="articles">
  <div class="posts-grid modern-grid">
    {% for post in posts_sorted %}
      {% assign cover = post.image | default: site.og_image %}
      {% assign words = post.content | strip_html | strip_newlines | replace: '  ', ' ' | split: ' ' | size %}
      {% assign minutes = words | divided_by: 220 | plus: 1 %}
      {% assign parent_slug = post.parent_category | default: 'divers' | strip | downcase %}
      {% assign parent_label = 'Divers' %}
      {% for entry in parent_categories %}
        {% assign parts = entry | split: "::" %}
        {% assign cat_slug = parts[0] | strip | downcase %}
        {% assign cat_label = parts[1] | strip %}
        {% if parent_slug == cat_slug %}
          {% assign parent_label = cat_label %}
        {% endif %}
      {% endfor %}
      <article class="post-card card">
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
          {% if post.tags and post.tags != empty %}
          <div class="pc-tags">
            {% for t in post.tags limit:3 %}
              <span class="chip">{{ t }}</span>
            {% endfor %}
          </div>
          {% endif %}
        </div>
        <a class="stretched" href="{{ post.url | relative_url }}" aria-label="Lire : {{ post.title }}"></a>
      </article>
    {% endfor %}
  </div>
</section>
