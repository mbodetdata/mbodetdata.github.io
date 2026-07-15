#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
audit-maillage.py — Inventaire du maillage interne de bmdata.fr
================================================================

Objectif
--------
Cartographier les liens internes *contextuels* (en corps de contenu) entre les
pages du site, puis produire `maillage-audit.md` à la racine :

  - tableau  : URL | fichier source | nb de liens entrants contextuels | sources
  - orphelins: pages de contenu avec 0 lien entrant contextuel
  - profondeur de clic depuis l'accueil (liens contextuels + nav principale)

Ce que compte « contextuel »
----------------------------
On lit la sortie *rendue* (`_site/`), pas les sources — car les liens dépendent
des layouts. Pour chaque page, on n'extrait QUE les <a href> situés dans le
conteneur de contenu éditorial, en excluant le chrome (header, nav, footer,
sidebar, fil d'Ariane, bloc auteur, bandeau de partage, CTA, et le bloc
« Articles récents » généré automatiquement) ainsi que les listings à cartes.

  - Articles (layout post) : contenu = `.post-content` moins `.post-tags`,
    `.post-author-bio`, `.post-share-banner`. Le fil d'Ariane, le CTA et la
    section « Articles récents » sont hors de `.post-content` → exclus d'office.
  - Pages (layout page/home) : contenu = <main id="main-content">, moins les
    listings (`.card`, `.grid`, `.post-card`, `.section-footer`…) et tout
    nav/header/footer/aside.

Le script NE MODIFIE RIEN. Il est relançable pour vérifier le travail.

Usage
-----
    python scripts/audit-maillage.py
    (préalable : `bundle exec jekyll build` pour générer `_site/`)
"""

from __future__ import annotations

import json
import re
import sys
from collections import defaultdict, deque
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, urljoin

# ── Chemins ────────────────────────────────────────────────────────────────
ROOT = Path(__file__).resolve().parent.parent
SITE_DIR = ROOT / "_site"
POSTS_DIR = ROOT / "_posts"
PAGES_DIR = ROOT / "pages"
NAV_FILE = ROOT / "_data" / "navigation.json"
OUTPUT = ROOT / "maillage-audit.md"

INTERNAL_HOSTS = {"bmdata.fr", "www.bmdata.fr", ""}

# Fichiers/segments à ignorer comme « pages »
SKIP_URL_RE = re.compile(r"^/(assets/|404\.html$|feed\.xml$|sitemap\.xml$"
                         r"|robots\.txt$|manifest\.json$|sw\.js$)")
# Pagination du blog : /blog/page2/ … — navigationnel, pas contextuel
PAGINATION_RE = re.compile(r"^/blog/page\d+/?$")

# Éléments vides (ne pas empiler)
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link",
        "meta", "param", "source", "track", "wbr"}

# Classes qui, si présentes sur un ancêtre, sortent le lien de la zone éditoriale
EXCLUDE_CLASSES = {
    # blocs de fin d'article (dans .post-content)
    "post-tags", "post-author-bio", "post-share-banner",
    # chrome / CTA / listings
    "post-hero", "breadcrumb", "post-cta-wrap", "cta-banner",
    "post-card", "card", "grid", "section-footer", "section-header",
    "related", "swiper", "post-sidebar", "back-to-top", "reading-progress",
}
EXCLUDE_TAGS = {"nav", "header", "footer", "aside"}


# ── Extraction des liens éditoriaux ────────────────────────────────────────
class EditorialLinkParser(HTMLParser):
    """Extrait les href des <a> situés dans la zone de contenu éditorial."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.stack: list[dict] = []          # pile d'éléments ouverts
        self.links: list[str] = []
        self.has_post_content = False        # article détecté ?

    def _classes(self, attrs) -> set[str]:
        for k, v in attrs:
            if k == "class" and v:
                return set(v.split())
        return set()

    def _attr(self, attrs, name):
        for k, v in attrs:
            if k == name:
                return v
        return None

    def handle_starttag(self, tag, attrs):
        classes = self._classes(attrs)
        el_id = self._attr(attrs, "id")
        if "post-content" in classes:
            self.has_post_content = True

        if tag == "a":
            href = self._attr(attrs, "href")
            if href and self._in_editorial():
                self.links.append(href)

        if tag not in VOID:
            self.stack.append({"tag": tag, "classes": classes, "id": el_id})

    def handle_startendtag(self, tag, attrs):
        # <a/> auto-fermant est improbable, mais on gère le href si présent
        if tag == "a":
            href = self._attr(attrs, "href")
            if href and self._in_editorial():
                self.links.append(href)

    def handle_endtag(self, tag):
        # dépile jusqu'à la balise correspondante (tolérant au HTML imparfait)
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i]["tag"] == tag:
                del self.stack[i:]
                return

    def _in_editorial(self) -> bool:
        in_post_content = False
        in_main = False
        for el in self.stack:
            if el["tag"] in EXCLUDE_TAGS:
                return False
            if el["classes"] & EXCLUDE_CLASSES:
                return False
            if "post-content" in el["classes"]:
                in_post_content = True
            if el["tag"] == "main" and el["id"] == "main-content":
                in_main = True
        # Article : impérativement dans .post-content
        if self.has_post_content:
            return in_post_content
        # Page : dans <main id=main-content>
        return in_main


# ── Utilitaires URL ────────────────────────────────────────────────────────
def url_for_site_file(path: Path) -> str:
    """Chemin `_site/...` → URL du site (avec slash final pour les dossiers)."""
    rel = path.relative_to(SITE_DIR).as_posix()
    if rel == "index.html":
        return "/"
    if rel.endswith("/index.html"):
        return "/" + rel[: -len("index.html")]
    return "/" + rel


def normalize_target(href: str, base_url: str):
    """Normalise un href en URL interne canonique, ou None si hors périmètre."""
    href = href.strip()
    if not href or href.startswith(("mailto:", "tel:", "javascript:", "#",
                                    "data:")):
        return None
    parts = urlsplit(href)
    if parts.scheme in ("http", "https") or href.startswith("//"):
        if parts.hostname not in INTERNAL_HOSTS:
            return None                       # externe (linkedin, hub., test.…)
    # Résolution des chemins relatifs par rapport à la page courante
    path = urljoin(base_url, parts.path)
    path = path.split("#", 1)[0].split("?", 1)[0]
    if not path.startswith("/"):
        path = "/" + path
    if SKIP_URL_RE.match(path):
        return None
    # Slash final pour les URL « dossier » (sans extension de fichier)
    last = path.rsplit("/", 1)[-1]
    if "." not in last and not path.endswith("/"):
        path += "/"
    return path


# ── Cartographie URL → fichier source ──────────────────────────────────────
def build_source_map() -> dict[str, str]:
    src = {"/": "index.html"}
    for md in sorted(POSTS_DIR.glob("*.md")):
        slug = re.sub(r"^\d{4}-\d{2}-\d{2}-", "", md.stem)
        src[f"/blog/{slug}/"] = f"_posts/{md.name}"
    for html in sorted(PAGES_DIR.glob("*.html")):
        m = re.search(r"^permalink:\s*(\S+)", html.read_text(encoding="utf-8",
                      errors="ignore"), re.MULTILINE)
        url = m.group(1) if m else f"/{html.stem}/"
        if not url.endswith("/"):
            url += "/"
        src[url] = f"pages/{html.name}"
    return src


# ── Classification des pages ───────────────────────────────────────────────
UTILITY_URLS = {"/mentions-legales/", "/politique-de-confidentialite/",
                "/temoignages/", "/blog/"}


def is_content_page(url: str) -> bool:
    """Page de contenu susceptible d'être orpheline (hors utilitaires/pagination)."""
    if url in UTILITY_URLS or PAGINATION_RE.match(url):
        return False
    if url.endswith((".html", ".xml", ".txt", ".json", ".js")):
        return False
    return True


# ── Programme principal ────────────────────────────────────────────────────
def main() -> int:
    if not SITE_DIR.is_dir():
        print("ERREUR : _site/ introuvable. Lance d'abord "
              "`bundle exec jekyll build`.", file=sys.stderr)
        return 1

    nav = json.loads(NAV_FILE.read_text(encoding="utf-8"))
    nav_urls = [item["url"] for item in nav["main"]]

    source_map = build_source_map()

    # Inventaire des pages rendues
    pages: dict[str, Path] = {}
    for html in SITE_DIR.rglob("*.html"):
        url = url_for_site_file(html)
        if SKIP_URL_RE.match(url) or url == "/404.html":
            continue
        pages[url] = html

    # Extraction des liens contextuels sortants
    out_edges: dict[str, list[str]] = {}
    for url, path in sorted(pages.items()):
        parser = EditorialLinkParser()
        parser.feed(path.read_text(encoding="utf-8", errors="ignore"))
        targets = []
        seen = set()
        for href in parser.links:
            tgt = normalize_target(href, url)
            if tgt is None or tgt == url:
                continue
            if PAGINATION_RE.match(tgt):
                continue
            if tgt not in seen:
                seen.add(tgt)
                targets.append(tgt)
        out_edges[url] = targets

    # Graphe inverse (liens entrants contextuels)
    inbound: dict[str, list[str]] = defaultdict(list)
    for src_url, targets in out_edges.items():
        for tgt in targets:
            inbound[tgt].append(src_url)

    # Profondeur de clic : nav principale (depuis toute page) + contextuels
    depth: dict[str, int] = {"/": 0}
    queue = deque(["/"])
    while queue:
        cur = queue.popleft()
        neighbours = set(out_edges.get(cur, []))
        neighbours.update(nav_urls)          # nav dispo sur chaque page
        for nxt in neighbours:
            nxt = nxt if nxt.endswith("/") or "." in nxt.rsplit("/", 1)[-1] else nxt + "/"
            if nxt in pages and nxt not in depth:
                depth[nxt] = depth[cur] + 1
                queue.append(nxt)

    write_report(pages, out_edges, inbound, depth, source_map, nav_urls)
    print(f"OK — rapport écrit : {OUTPUT.relative_to(ROOT)}")
    print(f"     {len(pages)} pages analysées, "
          f"{sum(len(v) for v in out_edges.values())} liens contextuels au total.")
    return 0


def write_report(pages, out_edges, inbound, depth, source_map, nav_urls) -> None:
    lines: list[str] = []
    A = lines.append

    content_pages = sorted(u for u in pages if is_content_page(u))
    orphans = [u for u in content_pages if not inbound.get(u)]

    A("# Audit du maillage interne — bmdata.fr\n")
    A("> Généré par `scripts/audit-maillage.py` à partir de `_site/`. "
      "Relançable après modification. **Aucun contenu n'est modifié par ce script.**\n")
    A("## Méthodologie\n")
    A("Seuls les liens **en corps de contenu éditorial** sont comptés. Sont "
      "exclus : header, navigation principale, footer, sidebar/sommaire, fil "
      "d'Ariane, bloc auteur, bandeau de partage, CTA de fin d'article, section "
      "« Articles récents » (générée automatiquement) et listings à cartes "
      "(`.card`, `.grid`, `.post-card`).\n")
    A(f"- Pages analysées : **{len(pages)}**")
    A(f"- Pages de contenu : **{len(content_pages)}**")
    A(f"- Liens contextuels au total : "
      f"**{sum(len(v) for v in out_edges.values())}**")
    A(f"- Pages de contenu orphelines (0 lien entrant contextuel) : "
      f"**{len(orphans)}**\n")

    # ── Tableau principal ──────────────────────────────────────────────────
    A("## Liens entrants contextuels par page\n")
    A("Trié par nombre de liens entrants croissant (les plus fragiles d'abord).\n")
    A("| URL | Fichier source | Liens entrants | Pages sources |")
    A("|---|---|---:|---|")
    for url in sorted(content_pages, key=lambda u: (len(inbound.get(u, [])), u)):
        srcs = inbound.get(url, [])
        src_file = source_map.get(url, "—")
        src_list = ", ".join(f"`{s}`" for s in sorted(srcs)) if srcs else "—"
        A(f"| `{url}` | `{src_file}` | {len(srcs)} | {src_list} |")
    A("")

    # ── Orphelins ──────────────────────────────────────────────────────────
    A("## Pages orphelines — 0 lien entrant contextuel\n")
    if not orphans:
        A("_Aucune._\n")
    else:
        A("Ces pages ne sont accessibles que via la navigation, la pagination "
          "du blog ou le sitemap — aucune page n'y mène depuis son corps de "
          "texte. C'est la cause première du statut « Détectée, actuellement "
          "non indexée » dans GSC.\n")
        A("| URL | Fichier source | Profondeur de clic |")
        A("|---|---|---|")
        for url in sorted(orphans, key=lambda u: (depth.get(u, 10**9), u)):
            d = depth.get(url)
            d_str = str(d) if d is not None else "∞ (inatteignable)"
            A(f"| `{url}` | `{source_map.get(url, '—')}` | {d_str} |")
        A("")

    # ── Profondeur de clic ─────────────────────────────────────────────────
    A("## Profondeur de clic depuis l'accueil\n")
    A("Distance minimale depuis `/` en suivant **uniquement** les liens "
      "contextuels et la navigation principale (la pagination du blog est "
      "volontairement exclue). `∞` = inatteignable par ce chemin.\n")
    A(f"- Navigation principale : {', '.join('`'+u+'`' for u in nav_urls)}\n")
    unreached = sorted(u for u in content_pages if u not in depth)
    A("| URL | Fichier source | Profondeur |")
    A("|---|---|---|")
    for url in sorted(content_pages, key=lambda u: (depth.get(u, 10**9), u)):
        d = depth.get(url)
        d_str = str(d) if d is not None else "∞"
        A(f"| `{url}` | `{source_map.get(url, '—')}` | {d_str} |")
    A("")
    if unreached:
        A(f"**{len(unreached)} page(s) inatteignable(s)** par liens contextuels "
          "+ nav principale (seulement via pagination/sitemap) :\n")
        for url in unreached:
            A(f"- `{url}` — `{source_map.get(url, '—')}`")
        A("")

    # ── Liens sortants des pages fortes (aide à la tâche 3) ─────────────────
    strong = ["/blog/migration-talend-vers-talaxie/", "/blog/talend-studios/",
              "/blog/tWriteJSONField/", "/", "/blog/tFileOutputPDF2/"]
    A("## Liens contextuels sortants des pages fortes\n")
    A("Pour préparer le maillage descendant (pages à fort trafic → orphelines).\n")
    A("| Page forte | Liens contextuels sortants |")
    A("|---|---|")
    for url in strong:
        outs = out_edges.get(url, [])
        outs_str = ", ".join(f"`{t}`" for t in outs) if outs else "_aucun_"
        A(f"| `{url}` | {outs_str} |")
    A("")

    OUTPUT.write_text("\n".join(lines), encoding="utf-8")


if __name__ == "__main__":
    raise SystemExit(main())
