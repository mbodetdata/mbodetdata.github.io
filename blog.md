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

<ul class="post-list" role="list">
  {% assign posts_sorted = site.posts | sort: 'date' | reverse %}
  {% for post in posts_sorted %}
    <li class="post-item">
      <article class="card">
        <h3 style="margin-top:0;margin-bottom:.25rem">
          <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        </h3>
        <p class="muted" style="margin:.25rem 0 .5rem 0">{{ post.excerpt | strip_html | truncate: 180 }}</p>
        <small class="muted">{{ post.date | date: "%d %b %Y" }}</small>
      </article>
    </li>
  {% endfor %}
  {% if posts_sorted == empty %}
    <li class="post-item">
      <p class="muted">Aucun article publié pour le moment.</p>
    </li>
  {% endif %}
</ul>

