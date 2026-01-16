---
layout: default
title: "Media Participations • Migration applicative | BM Data"
description: "Migration applicative Talend avec contrôles qualité et historique conservé pour Media Participations."
permalink: /portfolio/media-participations-migration.html
project_link: "/portfolio/media-participations-migration.html"
sector: "Édition & médias"
---
{% assign project = site.data.projets | where: "link", page.project_link | first %}
{% include portfolio-case.html project=project sector=page.sector %}
