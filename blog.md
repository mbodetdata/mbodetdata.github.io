---
layout: default
title: "Blog Talend & Power BI pour debuter"
description: Articles pedagogiques sur Talend, Talaxie, Power BI, ETL, DAX et DataOps pour progresser pas a pas.
keywords_groups:
  - competences
  - outils
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

<style>
  #blog-hero.about-hero{
    padding-block:clamp(3rem, 10vw, 5.6rem);
  }
  #blog-hero .about-hero__canvas{
    position:relative;
    border-radius:var(--radius-xl);
    padding:clamp(2.4rem, 6vw, 3.4rem);
  }
  #blog-hero .about-hero__inner{
    display:grid;
    grid-template-columns:repeat(auto-fit, minmax(260px, 1fr));
    gap:clamp(2rem, 6vw, 3rem);
    align-items:start;
  }
  #blog-hero .about-hero__content{
    max-width:min(640px, 100%);
    display:grid;
    gap:clamp(1rem, 2vw, 1.6rem);
    justify-items:start;
  }
  #blog-hero .about-hero__eyebrow{
    letter-spacing:.08em;
    text-transform:uppercase;
  }
  #blog-hero .about-hero__text{
    color:var(--muted);
    max-width:52ch;
  }
  #blog-hero .hero-actions{
    display:flex;
    gap:clamp(.8rem, 2vw, 1.2rem);
    flex-wrap:wrap;
  }
  #blog-hero .blog-hero__stats{
    padding:clamp(1.8rem, 4vw, 2.4rem);
    border-radius:var(--radius-lg);
    display:grid;
    gap:1.2rem;
    background:var(--surface-2, rgba(20,26,45,.65));
    box-shadow:0 0 0 1px rgba(255,255,255,.04) inset, 0 24px 40px rgba(6,11,30,.35);
  }
  #blog-hero .blog-hero__stats-title{
    color:var(--muted);
    font-weight:500;
  }
  #blog-hero .blog-hero__stats-list{
    list-style:disc;
    padding-left:1.4rem;
    display:grid;
    gap:.4rem;
  }
  #blog-hero .blog-hero__stats-list li{
    color:var(--muted);
  }
  #blog-hero .blog-hero__stats-list strong{
    color:var(--text);
  }
  @media (max-width: 720px){
    #blog-hero .about-hero__canvas{
      padding:clamp(1.8rem, 8vw, 2.4rem);
    }
  }
</style>

<section id="blog-hero" class="section about-hero about-hero--blog">
  <div class="about-hero__canvas">
    <div class="about-hero__inner">
      <div class="about-hero__content">
        <p class="about-hero__eyebrow">Journal de bord data</p>
        <h1 class="about-hero__title">Blog</h1>
        <p class="about-hero__text">
          Guides, retours d'experience et veille autour de Talend, Talaxie, Power BI et des plateformes data modernes.
        </p>
        <p>
          Nouveau lecteur ? Commencez par les tutoriels simples pour comprendre Talend, Talaxie et Power BI sans jargon.
        </p>
        <div class="hero-actions">
          <a class="btn primary" href="#articles">Guides pour debuter</a>
          <a class="btn ghost" href="https://bmdata.fr/#contact">Parler de mon projet data</a>
        </div>
      </div>
    </div>
  </div>
</section>

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
