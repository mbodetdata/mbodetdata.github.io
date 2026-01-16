---
layout: default
title: "DashboardTV • Opérations temps réel | BM Data"
description: "Collecte multi-sources Talend et reporting temps réel pour le pilotage des opérations support."
permalink: /portfolio/dashboardtv-operations.html
project_link: "/portfolio/dashboardtv-operations.html"
sector: "Support opérationnel"
---
{% assign project = site.data.projets | where: "link", page.project_link | first %}
{% include portfolio-case.html project=project sector=page.sector %}
