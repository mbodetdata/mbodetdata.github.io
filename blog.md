---
layout: default
title: Blog
description: Articles techniques sur Talend, Power BI, ETL, DAX, performance et DataOps.
permalink: /blog/
---

<header class="section">
  <h1>Blog</h1>
  <p class="muted">Notes techniques, retours d’expérience et petits guides.</p>
  <hr style="border:0;border-top:1px solid var(--border);opacity:.6;margin-block:1rem;"/>
</header>

{% assign posts_visible = site.posts | where_exp: "post", "post.active != false" %}
{% assign posts_sorted = posts_visible | sort: 'date' | reverse %}

<section class="posts-grid">
  {% for post in posts_sorted %}
    {% assign cover = post.image | default: site.og_image %}
    {% assign words = post.content | strip_html | strip_newlines | replace: '  ', ' ' | split: ' ' | size %}
    {% assign minutes = words | divided_by: 220 | plus: 1 %}
    <article class="post-card card">
      <div class="thumb" aria-hidden="true">
        <img src="{{ cover | relative_url }}" alt="" loading="lazy" decoding="async">
      </div>
      <div class="pc-body">
        <h3 class="pc-title"><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
        <p class="pc-excerpt muted">{{ post.excerpt | strip_html | truncate: 160 }}</p>
        <div class="pc-meta muted">
          <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%d %b %Y" }}</time>
          <span aria-hidden="true">&middot;</span> ~{{ minutes }} min
        </div>
        {% if post.tags and post.tags.size > 0 %}
        <div class="pc-tags">
          {% for t in post.tags limit:3 %}<span class="chip">{{ t }}</span>{% endfor %}
        </div>
        {% endif %}
      </div>
      <a class="stretched" href="{{ post.url | relative_url }}" aria-label="Lire : {{ post.title }}"></a>
    </article>
  {% endfor %}
  {% if posts_sorted == empty %}
    <p class="muted">Aucun article publié pour le moment.</p>
  {% endif %}
</section>
