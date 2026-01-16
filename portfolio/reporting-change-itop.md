---
layout: default
title: "Reporting Change • iTop | BM Data"
description: "Dashboard Power BI pour piloter les SLA et le backlog des changements dans iTop."
permalink: /portfolio/reporting-change-itop.html
project_link: "/portfolio/reporting-change-itop.html"
sector: "ITSM & support"
---
{% assign project = site.data.projets | where: "link", page.project_link | first %}
{% include portfolio-case.html project=project sector=page.sector %}
