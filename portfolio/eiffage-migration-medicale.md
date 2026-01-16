---
layout: default
title: "Eiffage • Migration données médicales | BM Data"
description: "Migration Oracle vers MongoDB pour sécuriser des questionnaires médicaux et améliorer les performances."
permalink: /portfolio/eiffage-migration-medicale.html
project_link: "/portfolio/eiffage-migration-medicale.html"
sector: "BTP & santé au travail"
---
{% assign project = site.data.projets | where: "link", page.project_link | first %}
{% include portfolio-case.html project=project sector=page.sector %}
