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
{% assign categories_unique = "" | split: "" %}
{% for post in posts_sorted %}
  {% assign category_input = post.category | default: post.parent_category | default: post.category_label | default: 'divers' | strip %}
  {% if category_input == "" %}
    {% assign category_input = 'divers' %}
  {% endif %}
  {% assign category_label = post.category_label | default: '' | strip %}
  {% assign category_slug = category_input | slugify %}
  {% if category_label == "" %}
    {% assign category_label = category_input %}
    {% for entry in parent_categories %}
      {% assign parts = entry | split: "::" %}
      {% assign cat_slug = parts[0] | strip | slugify %}
      {% assign cat_label = parts[1] | strip %}
      {% if category_slug == cat_slug %}
        {% assign category_label = cat_label %}
      {% endif %}
    {% endfor %}
    {% if category_label == category_input %}
      {% assign category_label = category_input | replace: '-', ' ' | capitalize %}
    {% endif %}
  {% endif %}
  {% unless categories_unique contains category_label %}
    {% assign categories_unique = categories_unique | push: category_label %}
  {% endunless %}
{% endfor %}
{% assign total_categories = categories_unique | size %}
{% assign latest_post = posts_sorted.first %}

<style>
  /* Palette harmonisee avec la home (index.md) */
  :root{
    --brand:#6677ff;
    --brand-2:#2bd48f;
    --accent: var(--brand);
    --bg:#080b14;
    --fg:#e8edf6;
    --muted:#a6b1c7;
    --surface-0:#0a0f1e;
    --surface-1:#0f1426;
    --surface-2:color-mix(in oklab, var(--surface-1) 88%, #000 12%);
    --border:color-mix(in oklab, #93a4c5 12%, #0a0f1e 88%);
  }
  #blog-hero.about-hero{
    padding-block:clamp(3.2rem, 8vw, 6rem);
  }
  #blog-hero .about-hero__canvas{
    position:relative;
    border-radius:clamp(1.8rem, 3vw, 2.6rem);
    padding:clamp(2.6rem, 6vw, 3.6rem);
    border:1px solid color-mix(in oklab, var(--border), var(--brand) 28%);
    background:
      radial-gradient(120% 140% at 12% 0%, color-mix(in oklab, var(--brand) 32%, transparent) 0%, transparent 70%),
      radial-gradient(100% 100% at 82% 18%, color-mix(in oklab, var(--brand-2) 24%, transparent) 0%, transparent 60%),
      linear-gradient(135deg, color-mix(in oklab, var(--surface-1) 82%, transparent), color-mix(in oklab, var(--surface-2) 72%, var(--brand) 16%));
    box-shadow: var(--shadow-lg);
  }
  #blog-hero .about-hero__inner{
    display:grid;
    grid-template-columns:minmax(0, 1.15fr) minmax(280px, .95fr);
    gap:clamp(2.2rem, 6vw, 3.2rem);
    align-items:stretch;
  }
  #blog-hero .about-hero__content{
    max-width:min(720px, 100%);
    display:grid;
    gap:clamp(1rem, 2vw, 1.6rem);
    justify-items:start;
  }
  #blog-hero .about-hero__eyebrow{
    letter-spacing:.14em;
    text-transform:uppercase;
    color:color-mix(in oklab, #fff 78%, transparent);
  }
  #blog-hero .about-hero__title{
    margin:0;
    font-size:clamp(2.4rem, 1.6rem + 2.6vw, 3.5rem);
  }
  #blog-hero .about-hero__text{
    color:color-mix(in oklab, var(--muted) 65%, #fff 35%);
    max-width:62ch;
    font-size:clamp(1rem, .95rem + .35vw, 1.15rem);
  }
  #blog-hero .hero-tags{
    display:flex;
    flex-wrap:wrap;
    gap:.6rem;
    padding:.25rem 0 .35rem;
  }
  #blog-hero .hero-actions{
    display:flex;
    gap:clamp(.85rem, 2vw, 1.2rem);
    flex-wrap:wrap;
  }
  #blog-hero .hero-actions .btn{
    padding:.7rem 1.6rem;
  }
  #blog-hero .blog-hero__stats{
    padding:clamp(1.9rem, 4vw, 2.5rem);
    border-radius:var(--radius-2);
    display:grid;
    gap:1rem;
    background:color-mix(in oklab, var(--surface-2) 88%, transparent);
    border:1px solid color-mix(in oklab, var(--border), var(--brand) 35%);
    box-shadow:0 18px 40px rgba(6,11,30,.45);
  }
  #blog-hero .blog-hero__stats-title{
    color:var(--muted);
    font-weight:600;
    margin:0;
    letter-spacing:.02em;
  }
  #blog-hero .blog-hero__stats-list{
    list-style:none;
    padding:0;
    margin:0;
    display:grid;
    gap:.45rem;
  }
  #blog-hero .blog-hero__stats-list li{
    color:color-mix(in oklab, var(--muted) 82%, #fff 18%);
    display:flex;
    align-items:center;
    gap:.5rem;
  }
  #blog-hero .blog-hero__stats-list strong{
    color:#fff;
    font-weight:750;
    letter-spacing:.01em;
  }
  #blog-hero .stat-pill{
    display:flex;
    gap:.65rem;
    align-items:center;
    padding:.85rem 1rem;
    border-radius:999px;
    background:color-mix(in oklab, var(--surface-1) 88%, var(--brand) 12%);
    border:1px solid color-mix(in oklab, var(--border), transparent 25%);
  }
  #blog-hero .pill-dot{
    width:10px;
    height:10px;
    border-radius:50%;
    background:var(--brand-2);
    box-shadow:0 0 0 6px color-mix(in oklab, var(--brand-2) 25%, transparent);
  }
  #blog-hero .pill-label{
    margin:0;
    font-size:.95rem;
    color:var(--muted);
  }
  #blog-hero .pill-value{
    margin:0;
    color:#fff;
    font-weight:600;
  }
  .chip--ghost{
    border:1px solid color-mix(in oklab, var(--border), var(--brand) 30%);
    background: color-mix(in oklab, var(--surface-2) 70%, transparent);
    color:color-mix(in oklab, var(--muted) 70%, #fff 30%);
  }
  @media (max-width: 960px){
    #blog-hero .about-hero__inner{
      grid-template-columns:1fr;
    }
  }
  @media (max-width: 720px){
    #blog-hero .about-hero__canvas{
      padding:clamp(1.9rem, 8vw, 2.5rem);
    }
  }

  #articles .articles-head{
    display:grid;
    grid-template-columns:minmax(0, 1.1fr) minmax(260px, .9fr);
    gap:clamp(1.2rem, 2.6vw, 1.8rem);
    align-items:center;
    padding:clamp(1.2rem, 2vw, 1.6rem) clamp(1rem, 2vw, 1.4rem);
    border-radius:clamp(1rem, 2vw, 1.6rem);
    border:1px solid color-mix(in oklab, var(--border), var(--brand) 25%);
    background:linear-gradient(125deg, color-mix(in oklab, var(--surface-1) 88%, transparent), color-mix(in oklab, var(--surface-2) 70%, var(--brand) 18%));
    box-shadow: var(--shadow-md);
    margin-bottom:clamp(1.2rem, 2vw, 1.6rem);
  }
  #articles .articles-head__copy{
    display:grid;
    gap:.5rem;
  }
  #articles .articles-head__copy h2{
    margin:0;
  }
  #articles .articles-head__copy p{
    margin:0;
    color:color-mix(in oklab, var(--muted) 80%, #fff 20%);
  }
  #articles .articles-head__filters{
    display:flex;
    flex-wrap:wrap;
    gap:.6rem;
    justify-content:flex-end;
  }
  #articles .articles-head__filters .chip{
    background:color-mix(in oklab, var(--surface-2) 72%, transparent);
  }
  @media (max-width: 900px){
    #articles .articles-head{
      grid-template-columns:1fr;
    }
    #articles .articles-head__filters{
      justify-content:flex-start;
    }
  }

  #articles .posts-grid.modern-grid{
    display:grid;
    gap:clamp(1.4rem, 2vw, 1.9rem);
    grid-template-columns:repeat(auto-fit, minmax(440px, 1fr));
    max-width:1120px;
    margin-inline:auto;
  }
  #articles .post-card{
    position:relative;
    display:grid;
    grid-template-rows: auto 1fr;
    gap:.9rem;
    padding:clamp(1rem, 1.8vw, 1.4rem);
    border-radius:clamp(1rem, 2vw, 1.4rem);
    background:
      radial-gradient(140% 140% at 15% 0%, color-mix(in oklab, var(--brand) 18%, transparent) 0%, transparent 60%),
      color-mix(in oklab, var(--surface-1) 88%, transparent);
    border:1px solid color-mix(in oklab, var(--border), var(--brand) 28%);
    box-shadow: var(--shadow-md);
    transition:transform .25s ease, box-shadow .25s ease;
    overflow:hidden;
  }
  #articles .post-card .pc-media{
    position:relative;
    border-radius:clamp(1rem, 1.6vw, 1.2rem);
    overflow:hidden;
    isolation:isolate;
    border:1px solid color-mix(in oklab, var(--border), transparent 20%);
    background:var(--surface-2);
    aspect-ratio: 16 / 9;
  }
  #articles .post-card .pc-media img{
    width:100%;
    height:100%;
    object-fit:contain;
    object-position:center;
    display:block;
    filter:saturate(1.04);
    background:var(--surface-0);
    padding:6px;
  }
  #articles .post-card .pc-body{
    display:grid;
    gap:.65rem;
  }
  #articles .post-card .pc-meta{
    font-size:.94rem;
    display:flex;
    align-items:center;
    gap:.55rem;
    color:color-mix(in oklab, var(--muted) 78%, #fff 22%);
    flex-wrap:wrap;
    letter-spacing:.01em;
  }
  #articles .post-card .pc-title{
    margin:0;
    font-size: clamp(1.15rem, 1rem + .5vw, 1.4rem);
    line-height:1.2;
    display:-webkit-box;
    -webkit-line-clamp:2;
    -webkit-box-orient:vertical;
    overflow:hidden;
  }
  #articles .post-card .pc-excerpt{
    margin:0;
    color:color-mix(in oklab, var(--muted) 85%, #fff 15%);
    display:-webkit-box;
    -webkit-line-clamp:3;
    -webkit-box-orient:vertical;
    overflow:hidden;
  }
  #articles .post-card .pc-tags{
    display:flex;
    flex-wrap:wrap;
    gap:.35rem;
  }
  #articles .post-card .chip{
    background:color-mix(in oklab, var(--surface-2) 78%, transparent);
    border:1px solid color-mix(in oklab, var(--border), transparent 10%);
  }
  #articles .post-card .chip--category{
    background: color-mix(in oklab, var(--brand) 20%, var(--surface-2) 80%);
    color:#fff;
    border:1px solid color-mix(in oklab, var(--brand) 38%, transparent);
    box-shadow:0 0 0 1px rgba(255,255,255,.05);
  }
  #articles .post-card .chip--time{
    background: color-mix(in oklab, var(--surface-2) 80%, var(--brand) 12%);
    color:color-mix(in oklab, var(--muted) 60%, #fff 40%);
    border:1px solid color-mix(in oklab, var(--border), var(--brand) 18%);
  }
  #articles .post-card .chip--pill{
    background: color-mix(in oklab, var(--surface-2) 82%, var(--brand) 12%);
    border:1px solid color-mix(in oklab, var(--border), var(--brand) 20%);
    color:color-mix(in oklab, var(--muted) 40%, #fff 60%);
    padding:.35rem .8rem;
    border-radius:999px;
  }
  #articles .post-card .stretched{
    position:absolute;
    inset:0;
    border-radius:inherit;
    z-index:3;
  }
  #articles .post-card:hover{
    transform:translateY(-6px);
    box-shadow: var(--shadow-lg);
  }
  @media (max-width: 520px){
    #articles .post-card{
      padding:.85rem;
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
          Guides, retours d'experience et veille autour de Talend, Talaxie, Power BI et des plateformes data modernes. Un blog pratique pour monter vite en competence sans sacrifier l'esthetique produit.
        </p>
        <p>
          Nouveau lecteur ? Commencez par les tutoriels simples pour comprendre Talend, Talaxie et Power BI sans jargon.
        </p>
        <div class="hero-tags" aria-label="Categories disponibles">
          {% for category_label in categories_unique %}
            <span class="chip chip--ghost">{{ category_label }}</span>
          {% endfor %}
        </div>
        <div class="hero-actions">
          <a class="btn primary" href="#articles">Guides pour debuter</a>
          <a class="btn ghost" href="https://bmdata.fr/#contact">Parler de mon projet data</a>
        </div>
      </div>
      <div class="blog-hero__stats">
        <p class="blog-hero__stats-title">Vue d'ensemble</p>
        <ul class="blog-hero__stats-list">
          <li><strong>{{ total_posts }}</strong> articles operationnels</li>
          <li><strong>{{ total_categories }}</strong> thematiques couvertes</li>
          {% if latest_post %}
          <li>Dernier article : <strong>{{ latest_post.date | date: "%d %b %Y" }}</strong></li>
          {% endif %}
        </ul>
        <div class="stat-pill">
          <span class="pill-dot" aria-hidden="true"></span>
          <div>
            <p class="pill-label">Approche produit</p>
            <p class="pill-value">Talend / Talaxie &middot; Power BI</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section" id="articles">
  <div class="articles-head">
    <div class="articles-head__copy">
      <p class="about-hero__eyebrow">Articles</p>
      <h2>Guides pour debuter (et progresser) sans perdre de temps</h2>
      <p>Une selection premium : des visuels soignes, des pas-a-pas concrets et des astuces terrain pour Talend, Talaxie et Power BI.</p>
    </div>
    <div class="articles-head__filters" aria-label="Categories disponibles">
      {% for category_label in categories_unique %}
        <span class="chip chip--ghost">{{ category_label }}</span>
      {% endfor %}
    </div>
  </div>
  <div class="posts-grid modern-grid">
    {% for post in posts_sorted %}
      {% assign cover = post.image | default: site.og_image %}
      {% assign words = post.content | strip_html | strip_newlines | replace: '  ', ' ' | split: ' ' | size %}
      {% assign minutes = words | divided_by: 220 | plus: 1 %}
      {% assign category_input = post.category | default: post.parent_category | default: post.category_label | default: 'divers' | strip %}
      {% if category_input == "" %}
        {% assign category_input = 'divers' %}
      {% endif %}
      {% assign category_label = post.category_label | default: '' | strip %}
      {% assign category_slug = category_input | slugify %}
      {% if category_label == "" %}
        {% assign category_label = category_input %}
        {% for entry in parent_categories %}
          {% assign parts = entry | split: "::" %}
          {% assign cat_slug = parts[0] | strip | slugify %}
          {% assign cat_label = parts[1] | strip %}
          {% if category_slug == cat_slug %}
            {% assign category_label = cat_label %}
          {% endif %}
        {% endfor %}
        {% if category_label == category_input %}
          {% assign category_label = category_input | replace: '-', ' ' | capitalize %}
        {% endif %}
      {% endif %}
      <article class="post-card card" data-category="{{ category_slug }}">
        <div class="pc-media" aria-hidden="true">
          <img src="{{ cover | relative_url }}" alt="" loading="lazy" decoding="async">
        </div>
        <div class="pc-body">
          <div class="pc-meta muted">
            <span class="chip chip--pill">{{ category_label }}</span>
            <span aria-hidden="true">&middot;</span>
            <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%d %b %Y" }}</time>
            <span aria-hidden="true">&middot;</span>
            <span>{{ minutes }} min de lecture</span>
          </div>
          <div class="pc-meta muted">
            {% if post.author %}
              <span>{{ post.author }}</span>
              <span aria-hidden="true">&middot;</span>
            {% endif %}
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
