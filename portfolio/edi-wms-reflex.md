---
layout: default
title: "EDI • WMS Reflex | BM Data"
description: "Maintenance EDI et optimisation des flux WMS Reflex pour réduire les incidents supply chain."
permalink: /portfolio/edi-wms-reflex.html
project_link: "/portfolio/edi-wms-reflex.html"
sector: "Logistique & WMS"
---
{% assign project = site.data.projets | where: "link", page.project_link | first %}
{% include portfolio-case.html project=project sector=page.sector %}
