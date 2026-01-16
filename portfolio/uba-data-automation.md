---
layout: default
title: "UBA • Data & Automatisation (Azure) | BM Data"
description: "Centralisation Azure, automatisations Talend et dashboard Power BI pour fiabiliser le pilotage financier d'UBA."
permalink: /portfolio/uba-data-automation.html
project_link: "/portfolio/uba-data-automation.html"
sector: "Services financiers"
---
{% assign project = site.data.projets | where: "link", page.project_link | first %}
{% include portfolio-case.html project=project sector=page.sector %}
