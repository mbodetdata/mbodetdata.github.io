---
layout: default
title: "EDI • TMS OneWorld | BM Data"
description: "Mappings EDI et automatisations Talend pour connecter les SI clients au TMS OneWorld."
permalink: /portfolio/edi-tms-oneworld.html
project_link: "/portfolio/edi-tms-oneworld.html"
sector: "Transport & logistique"
---
{% assign project = site.data.projets | where: "link", page.project_link | first %}
{% include portfolio-case.html project=project sector=page.sector %}
