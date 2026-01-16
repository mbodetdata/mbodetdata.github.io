---
layout: default
title: "EDI • WMS IzyPro | BM Data"
description: "Flux EDI standardisés, supervision et alertes pour WMS IzyPro multi-clients."
permalink: /portfolio/edi-wms-izypro.html
project_link: "/portfolio/edi-wms-izypro.html"
sector: "Supply chain multi-clients"
---
{% assign project = site.data.projets | where: "link", page.project_link | first %}
{% include portfolio-case.html project=project sector=page.sector %}
