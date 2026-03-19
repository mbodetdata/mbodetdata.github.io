---
layout: default
title: "Blog Talend & Power BI pour débuter"
description: Articles pédagogiques sur Talend, Talaxie, Power BI, ETL, DAX et DataOps pour progresser pas à pas.
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
{% assign latest_post = posts_sorted.first %}

{% comment %} Build categories_map = ["slug::Label", ...] for filter buttons {% endcomment %}
{% assign categories_map = "" | split: "" %}
{% for post in posts_sorted %}
  {% assign cat_input = post.category | default: post.parent_category | default: post.category_label | default: 'divers' | strip %}
  {% if cat_input == "" %}{% assign cat_input = 'divers' %}{% endif %}
  {% assign cat_label = post.category_label | default: '' | strip %}
  {% assign cat_slug = cat_input | slugify %}
  {% if cat_label == "" %}
    {% assign cat_label = cat_input %}
    {% for entry in parent_categories %}
      {% assign parts = entry | split: "::" %}
      {% assign e_slug = parts[0] | strip | slugify %}
      {% assign e_label = parts[1] | strip %}
      {% if cat_slug == e_slug %}{% assign cat_label = e_label %}{% endif %}
    {% endfor %}
    {% if cat_label == cat_input %}{% assign cat_label = cat_input | replace: '-', ' ' | capitalize %}{% endif %}
  {% endif %}
  {% assign map_entry = cat_slug | append: "::" | append: cat_label %}
  {% unless categories_map contains map_entry %}
    {% assign categories_map = categories_map | push: map_entry %}
  {% endunless %}
{% endfor %}
{% assign total_categories = categories_map | size %}

<style>
  /* ── BLOG PAGE ── */
  :root {
    --brand: #6677ff; --brand-2: #2bd48f; --accent: var(--brand);
    --bg: #080b14; --fg: #e8edf6; --muted: #a6b1c7;
    --surface-0: #0a0f1e; --surface-1: #0f1426;
    --surface-2: color-mix(in oklab, var(--surface-1) 88%, #000 12%);
    --border: color-mix(in oklab, #93a4c5 12%, #0a0f1e 88%);
  }

  /* ── HERO ── */
  #blog-hero.about-hero { padding-block: clamp(3rem, 7vw, 5.5rem); }

  #blog-hero .about-hero__canvas {
    position: relative;
    border-radius: clamp(1.6rem, 3vw, 2.4rem);
    padding: clamp(2.2rem, 5vw, 3.4rem);
    border: 1px solid color-mix(in oklab, var(--border), var(--brand) 30%);
    background:
      radial-gradient(130% 140% at 10% 0%,  color-mix(in oklab, var(--brand)   28%, transparent) 0%, transparent 68%),
      radial-gradient(100% 110% at 85% 10%,  color-mix(in oklab, var(--brand-2) 18%, transparent) 0%, transparent 62%),
      linear-gradient(150deg, var(--surface-1), color-mix(in oklab, var(--surface-0) 80%, var(--brand) 8%));
    box-shadow: var(--shadow-lg);
    overflow: hidden;
  }
  #blog-hero .about-hero__canvas::before {
    content: "";
    position: absolute;
    inset: -2px;
    border-radius: inherit;
    background: linear-gradient(135deg, color-mix(in oklab, var(--brand) 25%, transparent) 0%, transparent 50%);
    pointer-events: none;
    opacity: .35;
    z-index: 0;
  }

  #blog-hero .about-hero__inner {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1.25fr) minmax(240px, .85fr);
    gap: clamp(2rem, 5vw, 3rem);
    align-items: center;
  }

  #blog-hero .about-hero__content {
    display: flex;
    flex-direction: column;
    gap: clamp(.85rem, 1.6vw, 1.3rem);
  }

  #blog-hero .about-hero__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: .55rem;
    font-size: .78rem;
    text-transform: uppercase;
    letter-spacing: .18em;
    font-weight: 700;
    color: color-mix(in oklab, var(--brand) 80%, #fff 20%);
  }
  #blog-hero .about-hero__eyebrow::before {
    content: "";
    display: inline-block;
    width: 24px; height: 2px;
    border-radius: 2px;
    background: var(--brand);
  }

  #blog-hero .about-hero__title {
    margin: 0;
    font-size: clamp(2.8rem, 2rem + 2.8vw, 4.2rem);
    line-height: 1.04;
    letter-spacing: -.03em;
    background: linear-gradient(135deg, #fff 35%, color-mix(in oklab, var(--brand) 70%, #fff 30%) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  #blog-hero .about-hero__text {
    margin: 0;
    color: color-mix(in oklab, var(--muted) 65%, #fff 35%);
    font-size: clamp(.95rem, .9rem + .3vw, 1.08rem);
    line-height: 1.7;
    max-width: 56ch;
  }

  #blog-hero .hero-actions {
    display: flex;
    gap: .75rem;
    flex-wrap: wrap;
    margin-top: .3rem;
  }
  #blog-hero .hero-actions .btn { padding: .68rem 1.5rem; }

  /* Stats panel */
  #blog-hero .blog-stats-panel {
    display: flex;
    flex-direction: column;
    gap: .85rem;
    padding: clamp(1.4rem, 2.8vw, 2rem);
    border-radius: clamp(1.1rem, 2vw, 1.6rem);
    background: color-mix(in oklab, var(--surface-0) 72%, transparent);
    border: 1px solid color-mix(in oklab, var(--border), var(--brand) 28%);
    backdrop-filter: blur(16px);
    box-shadow: 0 22px 52px rgba(6, 11, 30, .52);
  }
  #blog-hero .stats-top-label {
    font-size: .72rem;
    text-transform: uppercase;
    letter-spacing: .18em;
    font-weight: 700;
    color: var(--muted);
    margin: 0;
  }
  #blog-hero .stats-numbers {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: .65rem;
  }
  #blog-hero .stat-block {
    padding: .85rem 1rem;
    border-radius: 1rem;
    background: color-mix(in oklab, var(--surface-1) 82%, var(--brand) 8%);
    border: 1px solid color-mix(in oklab, var(--border), var(--brand) 18%);
    display: flex;
    flex-direction: column;
    gap: .2rem;
  }
  #blog-hero .stat-block__value {
    font-size: clamp(1.9rem, 1.5rem + 1.4vw, 2.6rem);
    font-weight: 800;
    color: #fff;
    line-height: 1;
    letter-spacing: -.03em;
  }
  #blog-hero .stat-block__label {
    font-size: .72rem;
    text-transform: uppercase;
    letter-spacing: .12em;
    color: var(--muted);
    font-weight: 600;
    line-height: 1.3;
  }
  #blog-hero .stat-latest {
    display: flex;
    align-items: center;
    gap: .8rem;
    padding: .85rem 1rem;
    border-radius: 1rem;
    background: color-mix(in oklab, var(--brand) 12%, var(--surface-1) 88%);
    border: 1px solid color-mix(in oklab, var(--brand) 32%, transparent);
  }
  #blog-hero .stat-latest__dot {
    width: 10px; min-width: 10px; height: 10px;
    border-radius: 50%;
    background: var(--brand-2);
    box-shadow: 0 0 0 5px color-mix(in oklab, var(--brand-2) 20%, transparent);
  }
  #blog-hero .stat-latest__body { display: flex; flex-direction: column; gap: .1rem; overflow: hidden; }
  #blog-hero .stat-latest__label {
    font-size: .68rem; text-transform: uppercase; letter-spacing: .14em; font-weight: 700; color: var(--muted);
  }
  #blog-hero .stat-latest__title {
    font-size: .88rem; color: #fff; font-weight: 500; line-height: 1.35;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  /* ── FILTER BAR ── */
  #articles .filter-bar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: .45rem;
    padding: .9rem clamp(1rem, 2vw, 1.4rem);
    border-radius: clamp(.9rem, 2vw, 1.3rem);
    background: color-mix(in oklab, var(--surface-1) 85%, transparent);
    border: 1px solid color-mix(in oklab, var(--border), var(--brand) 20%);
    box-shadow: var(--shadow-sm);
    margin-bottom: clamp(1.2rem, 2.4vw, 1.8rem);
  }
  #articles .filter-bar__label {
    font-size: .72rem; text-transform: uppercase; letter-spacing: .16em;
    font-weight: 700; color: var(--muted); margin-right: .3rem; white-space: nowrap;
  }
  #articles .filter-btn {
    padding: .38rem .95rem;
    border-radius: 999px;
    border: 1px solid color-mix(in oklab, var(--border), transparent 15%);
    background: color-mix(in oklab, var(--surface-2) 70%, transparent);
    color: color-mix(in oklab, var(--muted) 72%, #fff 28%);
    font-size: .82rem; font-weight: 500; cursor: pointer;
    transition: background .18s ease, border-color .18s ease, color .18s ease, transform .18s ease, box-shadow .18s ease;
    letter-spacing: .02em; line-height: 1;
  }
  #articles .filter-btn:hover {
    background: color-mix(in oklab, var(--brand) 16%, var(--surface-1) 84%);
    border-color: color-mix(in oklab, var(--brand) 40%, transparent);
    color: #fff; transform: translateY(-1px);
  }
  #articles .filter-btn.is-active {
    background: var(--brand); border-color: var(--brand); color: #fff;
    box-shadow: 0 5px 16px color-mix(in oklab, var(--brand) 38%, transparent);
  }
  #articles .filter-count {
    margin-left: auto;
    font-size: .78rem; color: var(--muted); white-space: nowrap; padding-left: .5rem;
  }

  /* ── POSTS GRID ── */
  #articles .posts-grid.modern-grid {
    display: grid;
    gap: clamp(1.1rem, 1.8vw, 1.5rem);
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }

  /* ── POST CARD ── */
  #articles .post-card {
    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: clamp(1rem, 2vw, 1.3rem);
    border: 1px solid color-mix(in oklab, var(--border), var(--brand) 18%);
    background: color-mix(in oklab, var(--surface-1) 92%, transparent);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
    transition: transform .26s cubic-bezier(.22,.8,.2,1), box-shadow .26s ease, border-color .26s ease;
  }
  #articles .post-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
    border-color: color-mix(in oklab, var(--border), var(--brand) 42%);
  }

  /* Featured card — horizontal layout on desktop */
  @media (min-width: 700px) {
    #articles .post-card--featured {
      grid-column: 1 / -1;
      flex-direction: row;
    }
    #articles .post-card--featured .pc-media {
      width: clamp(240px, 36%, 380px);
      min-width: clamp(240px, 36%, 380px);
      aspect-ratio: unset;
      border-bottom: none;
      border-right: 1px solid color-mix(in oklab, var(--border), transparent 35%);
      order: 2;
    }
    #articles .post-card--featured .pc-body {
      padding: clamp(1.4rem, 3vw, 2rem);
      justify-content: center;
      flex: 1;
    }
    #articles .post-card--featured .pc-title {
      font-size: clamp(1.35rem, 1.1rem + 1vw, 1.75rem);
      -webkit-line-clamp: 3;
      letter-spacing: -.02em;
    }
    #articles .post-card--featured .pc-excerpt {
      -webkit-line-clamp: 4;
      font-size: .95rem;
    }
    #articles .post-card--featured .pc-badge {
      display: inline-flex;
    }
  }

  /* Card media */
  #articles .post-card .pc-media {
    position: relative;
    overflow: hidden;
    background: var(--surface-0);
    border-bottom: 1px solid color-mix(in oklab, var(--border), transparent 35%);
    aspect-ratio: 16 / 9;
    flex-shrink: 0;
  }
  #articles .post-card .pc-media img {
    width: 100%; height: 100%;
    object-fit: contain; object-position: center;
    padding: 8px;
    display: block;
    filter: saturate(1.04);
    background: var(--surface-0);
    transition: transform .4s ease;
  }
  #articles .post-card:hover .pc-media img { transform: scale(1.05); }

  /* Card body */
  #articles .post-card .pc-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: .55rem;
    padding: clamp(.9rem, 1.6vw, 1.15rem);
  }

  /* Featured badge */
  #articles .post-card .pc-badge {
    display: none;
    align-items: center;
    gap: .4rem;
    font-size: .7rem; text-transform: uppercase; letter-spacing: .14em; font-weight: 700;
    color: var(--brand-2);
    padding: .25rem .7rem;
    border-radius: 999px;
    border: 1px solid color-mix(in oklab, var(--brand-2) 38%, transparent);
    background: color-mix(in oklab, var(--brand-2) 12%, transparent);
    width: fit-content; margin-bottom: .1rem;
  }
  #articles .post-card .pc-badge::before {
    content: ""; width: 6px; height: 6px; border-radius: 50%; background: var(--brand-2);
  }

  /* Top row: category + reading time */
  #articles .post-card .pc-top {
    display: flex; align-items: center; justify-content: space-between;
    gap: .5rem; flex-wrap: wrap;
  }
  #articles .post-card .chip--category {
    font-size: .72rem; padding: .22rem .65rem; border-radius: 999px;
    background: color-mix(in oklab, var(--brand) 18%, var(--surface-2) 82%);
    color: color-mix(in oklab, var(--brand) 75%, #fff 25%);
    border: 1px solid color-mix(in oklab, var(--brand) 30%, transparent);
    font-weight: 600; letter-spacing: .04em; white-space: nowrap;
  }
  #articles .post-card .pc-time {
    font-size: .78rem; color: var(--muted); white-space: nowrap;
  }

  /* Title */
  #articles .post-card .pc-title {
    margin: 0;
    font-size: clamp(1rem, .9rem + .38vw, 1.18rem);
    font-weight: 700; line-height: 1.22; color: #fff;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    letter-spacing: -.01em;
  }
  #articles .post-card .pc-title a {
    text-decoration: none; color: inherit;
    transition: color .2s ease;
  }
  #articles .post-card .pc-title a:hover { color: color-mix(in oklab, #fff 78%, var(--brand) 22%); }

  /* Excerpt */
  #articles .post-card .pc-excerpt {
    margin: 0; flex: 1;
    color: color-mix(in oklab, var(--muted) 80%, #fff 20%);
    font-size: .88rem; line-height: 1.62;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }

  /* Footer row: date + tags + read more */
  #articles .post-card .pc-footer {
    display: flex; align-items: center; justify-content: space-between;
    gap: .5rem; padding-top: .65rem;
    border-top: 1px solid color-mix(in oklab, var(--border), transparent 38%);
    flex-wrap: wrap; margin-top: auto;
  }
  #articles .post-card .pc-date {
    font-size: .78rem; color: var(--muted); white-space: nowrap;
  }
  #articles .post-card .pc-tags {
    display: flex; gap: .28rem; flex-wrap: wrap;
  }
  #articles .post-card .chip {
    font-size: .7rem; padding: .18rem .55rem;
    background: color-mix(in oklab, var(--surface-2) 80%, transparent);
    border: 1px solid color-mix(in oklab, var(--border), transparent 22%);
    border-radius: 999px;
  }
  #articles .post-card .pc-read-more {
    font-size: .8rem; font-weight: 700; color: var(--brand);
    text-decoration: none; display: inline-flex; align-items: center;
    gap: .28rem; transition: gap .2s ease, color .2s ease; white-space: nowrap;
  }
  #articles .post-card:hover .pc-read-more { gap: .5rem; color: color-mix(in oklab, var(--brand) 85%, #fff 15%); }

  /* Stretched link */
  #articles .post-card .stretched {
    position: absolute; inset: 0; z-index: 2; border-radius: inherit;
  }

  /* Empty state */
  #articles .posts-empty {
    display: none;
    grid-column: 1 / -1;
    text-align: center;
    padding: clamp(2.4rem, 5vw, 4rem) 1rem;
    color: var(--muted);
  }
  #articles .posts-empty.is-visible { display: block; }
  #articles .posts-empty__icon {
    font-size: 2.5rem; margin-bottom: .75rem; opacity: .4;
  }
  #articles .posts-empty p { margin: 0; font-size: .95rem; }

  @media (max-width: 480px) {
    #articles .posts-grid.modern-grid { grid-template-columns: 1fr; }
  }

  /* ── WOW EFFECTS ── */

  /* Dot pulse sur le dernier article */
  @keyframes dot-pulse {
    0%, 100% { box-shadow: 0 0 0 5px color-mix(in oklab, var(--brand-2) 20%, transparent); }
    50%       { box-shadow: 0 0 0 10px color-mix(in oklab, var(--brand-2) 6%, transparent); }
  }
  #blog-hero .stat-latest__dot { animation: dot-pulse 2.2s ease-in-out infinite; }

  /* Entrée staggerée des cards */
  @keyframes card-enter {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  #articles .post-card { animation: card-enter .5s cubic-bezier(.22,.8,.2,1) backwards; }

  /* Mouse-tracking radial glow (--mouse-x / --mouse-y injectés via JS) */
  #articles .post-card::after {
    content: "";
    position: absolute; inset: 0; border-radius: inherit;
    background: radial-gradient(
      280px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      color-mix(in oklab, var(--brand) 14%, transparent),
      transparent 72%
    );
    opacity: 0;
    transition: opacity .32s ease;
    pointer-events: none; z-index: 1;
  }
  #articles .post-card:hover::after { opacity: 1; }

  /* Featured card : bordure + ombre plus prononcées */
  #articles .post-card--featured {
    border-color: color-mix(in oklab, var(--border), var(--brand) 34%);
    box-shadow: var(--shadow-lg), 0 0 0 1px color-mix(in oklab, var(--brand) 10%, transparent);
  }
  #articles .post-card--featured:hover {
    box-shadow: 0 28px 64px rgba(6,11,30,.62), 0 0 52px color-mix(in oklab, var(--brand) 12%, transparent);
  }
  /* Light-sweep périodique sur la featured card */
  #articles .post-card--featured::before {
    content: "";
    position: absolute; top: -10%; left: 0;
    width: 44%; height: 120%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.055), transparent);
    transform: translateX(-130%) skewX(-18deg);
    animation: feat-shine 5.5s ease-in-out infinite;
    animation-delay: 2s;
    pointer-events: none; z-index: 1;
  }
  @keyframes feat-shine {
    0%, 55%, 100% { transform: translateX(-130%) skewX(-18deg); opacity: 0; }
    4%  { opacity: 1; }
    38% { transform: translateX(330%) skewX(-18deg); opacity: 1; }
    46% { opacity: 0; }
  }

  /* ── Responsive mobile/tablette (desktop inchangé) ── */
  @media (max-width: 900px) {
    #blog-hero.about-hero {
      padding-block: clamp(2rem, 6vw, 3.2rem);
    }
    #blog-hero .about-hero__canvas {
      padding: clamp(1.35rem, 4.2vw, 2rem);
      border-radius: clamp(1.05rem, 3.8vw, 1.65rem);
    }
    #blog-hero .about-hero__inner {
      grid-template-columns: 1fr;
      gap: clamp(1rem, 3.2vw, 1.6rem);
      align-items: stretch;
    }
    #blog-hero .about-hero__content,
    #blog-hero .blog-stats-panel,
    #blog-hero .hero-actions,
    #blog-hero .stat-latest__body {
      min-width: 0;
    }
    #blog-hero .about-hero__title {
      display: inline-block;
      max-width: 100%;
      font-size: clamp(2.2rem, 8.4vw, 3.1rem);
      line-height: 1.05;
      letter-spacing: 0;
      padding-left: .08em;
      margin-left: -.08em;
      word-break: break-word;
      overflow-wrap: anywhere;
    }
    #blog-hero .about-hero__text {
      max-width: 100%;
      line-height: 1.58;
    }
    #blog-hero .hero-actions {
      width: 100%;
      flex-direction: column;
      align-items: stretch;
      gap: .6rem;
    }
    #blog-hero .hero-actions .btn {
      width: 100%;
      justify-content: center;
    }
    #blog-hero .blog-stats-panel {
      padding: 1rem;
      gap: .7rem;
    }
    #blog-hero .stats-numbers {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: .6rem;
    }
    #blog-hero .stat-block {
      min-width: 0;
      padding: .78rem .82rem;
    }
    #blog-hero .stat-block__value {
      font-size: clamp(1.55rem, 6.2vw, 2rem);
    }
    #blog-hero .stat-block__label {
      letter-spacing: .09em;
    }
    #blog-hero .stat-latest {
      align-items: flex-start;
      padding: .8rem .85rem;
    }
    #blog-hero .stat-latest__title {
      white-space: normal;
      overflow: hidden;
      text-overflow: initial;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      line-clamp: 2;
      word-break: break-word;
      overflow-wrap: anywhere;
    }

    #articles .filter-bar {
      align-items: flex-start;
      gap: .5rem;
    }
    #articles .filter-bar__label {
      width: 100%;
      margin-right: 0;
    }
    #articles .filter-count {
      width: 100%;
      order: 99;
      margin-left: 0;
      padding-left: 0;
    }
    #articles .posts-grid.modern-grid {
      grid-template-columns: minmax(0, 1fr);
    }
    #articles .post-card .pc-top {
      align-items: flex-start;
      gap: .45rem .55rem;
    }
    #articles .post-card .pc-footer {
      align-items: flex-start;
      justify-content: flex-start;
      gap: .45rem .75rem;
    }
    #articles .post-card .pc-tags {
      order: 2;
    }
    #articles .post-card .pc-read-more {
      margin-left: auto;
    }
  }

  @media (max-width: 680px) {
    #blog-hero .about-hero__canvas {
      padding: 1.15rem 1rem;
    }
    #blog-hero .about-hero__eyebrow {
      font-size: .68rem;
      letter-spacing: .15em;
    }
    #blog-hero .about-hero__eyebrow::before {
      width: 18px;
    }
    #blog-hero .about-hero__title {
      font-size: clamp(2rem, 10.5vw, 2.5rem);
    }
    #blog-hero .about-hero__text {
      font-size: .95rem;
    }
    #blog-hero .stats-top-label {
      font-size: .66rem;
      letter-spacing: .15em;
    }
    #blog-hero .stat-block {
      padding: .72rem .75rem;
    }
    #blog-hero .stat-block__label {
      font-size: .67rem;
    }

    #articles .filter-btn {
      font-size: .78rem;
      padding: .34rem .75rem;
    }
    #articles .post-card .pc-body {
      padding: .85rem;
    }
  }

  @media (max-width: 560px) {
    #blog-hero .about-hero__canvas {
      padding: 1rem .88rem;
    }
    #blog-hero .about-hero__title {
      font-size: clamp(1.9rem, 11.4vw, 2.25rem);
    }
    #blog-hero .stats-numbers {
      gap: .5rem;
    }
    #blog-hero .stat-latest {
      padding: .72rem .78rem;
    }
    #blog-hero .stat-latest__label {
      font-size: .62rem;
      letter-spacing: .12em;
    }
    #blog-hero .stat-latest__title {
      font-size: .82rem;
      line-height: 1.35;
      -webkit-line-clamp: 3;
      line-clamp: 3;
    }

    #articles .filter-bar {
      padding: .8rem .85rem;
    }
    #articles .filter-count {
      font-size: .74rem;
    }
    #articles .post-card .pc-top {
      flex-direction: column;
      align-items: flex-start;
    }
    #articles .post-card .pc-footer {
      flex-direction: column;
      align-items: flex-start;
    }
    #articles .post-card .pc-read-more {
      margin-left: 0;
    }
  }
</style>

<section id="blog-hero" class="section about-hero">
  <div class="about-hero__canvas">
    <div class="about-hero__inner">

      <div class="about-hero__content">
        <p class="about-hero__eyebrow">Journal de bord data</p>
        <h1 class="about-hero__title">Blog</h1>
        <p class="about-hero__text">
          Guides pratiques, retours terrain et veille sur Talend, Talaxie, Power BI et les plateformes data modernes. Des articles concrets pour progresser vite.
        </p>
        <div class="hero-actions">
          <a class="btn primary" href="#articles">Parcourir les articles</a>
          <a class="btn ghost" href="{{ '/#contact' | relative_url }}">Parler de mon projet</a>
        </div>
      </div>

      <div class="blog-stats-panel" aria-label="Vue d'ensemble du blog">
        <p class="stats-top-label">Vue d'ensemble</p>
        <div class="stats-numbers">
          <div class="stat-block">
            <span class="stat-block__value" data-count="{{ total_posts }}">0</span>
            <span class="stat-block__label">Articles publiés</span>
          </div>
          <div class="stat-block">
            <span class="stat-block__value" data-count="{{ total_categories }}">0</span>
            <span class="stat-block__label">Thématiques</span>
          </div>
        </div>
        {% if latest_post %}
        <div class="stat-latest">
          <span class="stat-latest__dot" aria-hidden="true"></span>
          <div class="stat-latest__body">
            <span class="stat-latest__label">Dernier article</span>
            <span class="stat-latest__title">{{ latest_post.title }}</span>
          </div>
        </div>
        {% endif %}
      </div>

    </div>
  </div>
</section>

<section class="section" id="articles">

  <div class="filter-bar" role="group" aria-label="Filtrer par catégorie">
    <span class="filter-bar__label">Filtrer</span>
    <button class="filter-btn is-active" data-filter="all" type="button">Tout</button>
    {% for map_entry in categories_map %}
      {% assign parts = map_entry | split: "::" %}
      {% assign f_slug  = parts[0] | strip %}
      {% assign f_label = parts[1] | strip %}
      <button class="filter-btn" data-filter="{{ f_slug }}" type="button">{{ f_label }}</button>
    {% endfor %}
    <span class="filter-count" aria-live="polite" id="blog-filter-count">{{ total_posts }} article{% if total_posts != 1 %}s{% endif %}</span>
  </div>

  <div class="posts-grid modern-grid" id="blog-posts-grid">
    {% for post in posts_sorted %}
      {% assign cover = post.image | default: site.og_image %}
      {% assign words = post.content | strip_html | strip_newlines | replace: '  ', ' ' | split: ' ' | size %}
      {% assign minutes = words | divided_by: 220 | plus: 1 %}
      {% assign cat_input = post.category | default: post.parent_category | default: post.category_label | default: 'divers' | strip %}
      {% if cat_input == "" %}{% assign cat_input = 'divers' %}{% endif %}
      {% assign cat_label = post.category_label | default: '' | strip %}
      {% assign cat_slug = cat_input | slugify %}
      {% if cat_label == "" %}
        {% assign cat_label = cat_input %}
        {% for entry in parent_categories %}
          {% assign parts = entry | split: "::" %}
          {% assign e_slug  = parts[0] | strip | slugify %}
          {% assign e_label = parts[1] | strip %}
          {% if cat_slug == e_slug %}{% assign cat_label = e_label %}{% endif %}
        {% endfor %}
        {% if cat_label == cat_input %}{% assign cat_label = cat_input | replace: '-', ' ' | capitalize %}{% endif %}
      {% endif %}

      {% assign anim_delay = forloop.index0 | times: 85 %}
      <article class="post-card card{% if forloop.first %} post-card--featured{% endif %}" data-category="{{ cat_slug }}" style="animation-delay:{{ anim_delay }}ms">
        <div class="pc-media" aria-hidden="true">
          <img src="{{ cover | relative_url }}" alt="" loading="lazy" decoding="async">
        </div>
        <div class="pc-body">
          {% if forloop.first %}
            <span class="pc-badge" aria-label="Article à la une">À la une</span>
          {% endif %}
          <div class="pc-top">
            <span class="chip--category">{{ cat_label }}</span>
            <span class="pc-time">{{ minutes }} min</span>
          </div>
          <h2 class="pc-title">
            <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
          </h2>
          <p class="pc-excerpt">{{ post.excerpt | strip_html | truncate: 180 }}</p>
          <div class="pc-footer">
            <time class="pc-date" datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%d %b %Y" }}</time>
            {% if post.tags and post.tags != empty %}
            <div class="pc-tags" aria-label="Tags">
              {% for t in post.tags limit: 2 %}<span class="chip">{{ t }}</span>{% endfor %}
            </div>
            {% endif %}
            <span class="pc-read-more" aria-hidden="true">Lire <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
          </div>
        </div>
        <a class="stretched" href="{{ post.url | relative_url }}" aria-label="Lire : {{ post.title }}"></a>
      </article>
    {% endfor %}

    <div class="posts-empty" role="status" id="blog-empty-state">
      <p class="posts-empty__icon" aria-hidden="true">🗂</p>
      <p>Aucun article dans cette catégorie pour le moment.</p>
    </div>
  </div>

</section>

<script>
(function () {
  const btns  = document.querySelectorAll('#articles .filter-btn');
  const cards = document.querySelectorAll('#blog-posts-grid .post-card');
  const empty = document.getElementById('blog-empty-state');
  const count = document.getElementById('blog-filter-count');

  function updateCount(n) {
    if (!count) return;
    count.textContent = n + ' article' + (n !== 1 ? 's' : '');
  }

  btns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      btns.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');

      var filter = btn.dataset.filter;
      var visible = 0;

      cards.forEach(function (card) {
        var match = filter === 'all' || card.dataset.category === filter;
        card.style.display = match ? '' : 'none';
        if (match) visible++;
      });

      if (empty) empty.classList.toggle('is-visible', visible === 0);
      updateCount(visible);
    });
  });
})();

/* ── Mouse-glow tracking ── */
(function () {
  var cards = document.querySelectorAll('#blog-posts-grid .post-card');
  cards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', (e.clientX - r.left) + 'px');
      card.style.setProperty('--mouse-y', (e.clientY - r.top) + 'px');
    });
  });
})();

/* ── Count-up animation sur les stats ── */
(function () {
  var els = document.querySelectorAll('.stat-block__value[data-count]');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.textContent = el.dataset.count; });
    return;
  }
  function countUp(el, target) {
    var dur = Math.min(900 + target * 15, 1800);
    var start = performance.now();
    function step(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        countUp(entry.target, parseInt(entry.target.dataset.count, 10));
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.7 });
  els.forEach(function (el) { obs.observe(el); });
})();
</script>
