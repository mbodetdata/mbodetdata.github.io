"""Génère _data/lastmod.json : date du dernier commit Git de chaque page, lue par sitemap.xml.

Usage (depuis la racine du site) :
  python scripts/generate-lastmod.py           # dates issues de l'historique Git
  python scripts/generate-lastmod.py --staged  # idem, mais les fichiers indexés prennent
                                               # l'heure courante (hook pre-commit)

GitHub Pages ne peut pas lancer `git log` pendant le build : les dates sont donc
calculées ici et versionnées. Pour une page pilotée par un fichier _data (ex.
pages/a-propos.html -> _data/about.json), la date retenue est la plus récente des
deux. Les données communes à tout le site (global, navigation) sont ignorées.
"""
import json, re, subprocess, sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "_data" / "lastmod.json"
SOURCES = ["index.html", "pages/*.html", "portfolio/*.html", "_posts/*.md"]
DATA_IGNORED = {"global", "navigation", "image-dimensions", "lastmod"}
DATA_RE = re.compile(r"site\.data(?:\.([A-Za-z0-9_-]+)|\['([A-Za-z0-9_-]+)'\])")


def git(*args):
    return subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True,
                          encoding="utf-8", check=True).stdout.strip()


def main():
    now = datetime.now().astimezone().isoformat(timespec="seconds")
    staged = set(git("diff", "--cached", "--name-only").splitlines()) if "--staged" in sys.argv else set()
    cache = {}

    def date(rel):
        if rel not in cache:
            cache[rel] = now if rel in staged else (git("log", "-1", "--format=%cI", "--", rel) or now)
        return cache[rel]

    result = {}
    for pattern in SOURCES:
        for f in sorted(ROOT.glob(pattern)):
            rel = f.relative_to(ROOT).as_posix()
            deps = [rel]
            for a, b in DATA_RE.findall(f.read_text(encoding="utf-8")):
                name = a or b
                if name not in DATA_IGNORED:
                    data = next(ROOT.glob(f"_data/{name}.*"), None)
                    if data:
                        deps.append(data.relative_to(ROOT).as_posix())
            # comparaison sur l'instant UTC (les fuseaux peuvent différer d'un commit à l'autre)
            result[rel] = max((date(d) for d in deps), key=datetime.fromisoformat)

    text = json.dumps(result, indent=2, ensure_ascii=False) + "\n"
    if not OUT.exists() or OUT.read_text(encoding="utf-8") != text:
        OUT.write_text(text, encoding="utf-8")
        print(f"{OUT.relative_to(ROOT).as_posix()} mis à jour ({len(result)} pages)")
    else:
        print(f"{OUT.relative_to(ROOT).as_posix()} déjà à jour ({len(result)} pages)")


if __name__ == "__main__":
    main()
