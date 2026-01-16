---
layout: default
title: "Frère-Loup • Migration e-commerce | BM Data"
description: "Migration e-commerce avec ETL Talend et API PrestaShop pour préserver les données clés."
permalink: /portfolio/frele-loup-migration-prestashop.html
project_link: "/portfolio/frele-loup-migration-prestashop.html"
sector: "E-commerce"
---
{% assign project = site.data.projets | where: "link", page.project_link | first %}
{% include portfolio-case.html project=project sector=page.sector %}
