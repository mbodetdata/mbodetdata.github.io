---
layout: default
title: "Migration Talend OSS → Talaxie | BM Data"
description: "Étude de migration Talend OSS vers Talaxie pour sécuriser l'intégration data et préparer la continuité."
permalink: /portfolio/migration-talend-oss-talaxie.html
project_link: "/portfolio/migration-talend-oss-talaxie.html"
sector: "IT interne"
---
{% assign project = site.data.projets | where: "link", page.project_link | first %}
{% include portfolio-case.html project=project sector=page.sector %}
