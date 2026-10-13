"""Ajoute width/height (dimensions réelles du fichier) aux images Markdown des articles.

Usage (depuis la racine du site) : python scripts/add-img-dimensions.py [--dry-run]

- Images Markdown des _posts : complète l'IAL kramdown {: ...} avec width, height,
  loading="lazy" et decoding="async" (les attributs déjà présents sont conservés).
  Les images du corps d'article sont toutes sous le héros : chargement différé.
- Images de couverture (clé `image:` du front matter) : écrit leurs dimensions
  dans _data/image-dimensions.json, lu par les gabarits (ex. article à la une du blog).

Dimensions lues avec ImageMagick (`magick identify`), jamais estimées.
"""
import io, json, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DRY = "--dry-run" in sys.argv

IMG_RE = re.compile(
    r"(?P<img>!\[[^\]]*\]\((?:\{\{\s*'(?P<liquid>[^']+)'\s*\|\s*relative_url\s*\}\}|(?P<plain>/[^)\s]+))\))"
    r"(?:\{:(?P<ial>[^}]*)\})?"
)
_cache = {}


def dims(src):
    """(largeur, hauteur) du fichier image désigné par une URL du site."""
    path = ROOT / src.lstrip("/")
    if path not in _cache:
        if not path.exists():
            raise FileNotFoundError(src)
        out = subprocess.run(["magick", "identify", "-format", "%w %h\n", str(path)],
                             capture_output=True, text=True, check=True).stdout
        w, h = out.split("\n")[0].split()  # première frame (webp animés)
        _cache[path] = (int(w), int(h))
    return _cache[path]


def fix(m, stats):
    ial = (m.group("ial") or "").strip()
    if re.search(r"\bwidth=", ial) and re.search(r"\bheight=", ial):
        stats["deja"] += 1
        return m.group(0)
    w, h = dims(m.group("liquid") or m.group("plain"))
    attrs = [ial] if ial else []
    attrs.append(f'width="{w}" height="{h}"')
    if "loading=" not in ial:
        attrs.append('loading="lazy"')
    if "decoding=" not in ial:
        attrs.append('decoding="async"')
    stats["corrigees"] += 1
    return m.group("img") + "{: " + " ".join(attrs) + "}"


def main():
    stats = {"corrigees": 0, "deja": 0}
    covers = {}
    for md in sorted((ROOT / "_posts").glob("*.md")):
        text = io.open(md, encoding="utf-8", newline="").read()
        new = IMG_RE.sub(lambda m: fix(m, stats), text)
        # front matter : en cas de clé `image:` en double, YAML retient la dernière
        front = text.split("---", 2)[1] if text.startswith("---") else ""
        covers_fm = re.findall(r'^image:\s*"?([^"\r\n]*?)"?\s*$', front, re.M)
        if covers_fm and covers_fm[-1].strip():
            url = "/" + covers_fm[-1].strip().lstrip("/")
            covers[url] = list(dims(url))
        if new != text:
            print(f"  {md.name}")
            if not DRY:
                io.open(md, "w", encoding="utf-8", newline="").write(new)
    data = ROOT / "_data" / "image-dimensions.json"
    if not DRY:
        data.write_text(json.dumps(dict(sorted(covers.items())), indent=2) + "\n", encoding="utf-8")
    print(f"Images corrigées : {stats['corrigees']} | déjà dimensionnées : {stats['deja']} "
          f"| couvertures dans {data.name} : {len(covers)}")


if __name__ == "__main__":
    main()
