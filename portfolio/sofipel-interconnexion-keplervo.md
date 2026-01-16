---
layout: default
title: "SOFIPEL • Interconnexion KeplerVo | BM Data"
description: "Collecte API KeplerVo, base MySQL et vue consolidée multi-garages pour SOFIPEL."
permalink: /portfolio/sofipel-interconnexion-keplervo.html
project_link: "/portfolio/sofipel-interconnexion-keplervo.html"
sector: "Automobile & services"
---
{% assign project = site.data.projets | where: "link", page.project_link | first %}
{% include portfolio-case.html project=project sector=page.sector %}
