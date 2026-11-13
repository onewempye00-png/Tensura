import hashlib
import shutil
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from io import BytesIO

ROOT = Path(".")
DIST = ROOT / "dist"
source_zip = DIST / "Tensura_Build_01_R1.0.1_Source.zip"
report_path = ROOT / "BUILD_01_VALIDATION_REPORT.md"
dist_report = DIST / report_path.name

def create_source_archive():
    if source_zip.exists():
        source_zip.unlink()
    with ZipFile(source_zip, "w", ZIP_DEFLATED, compresslevel=6) as archive:
        for path in ROOT.rglob("*"):
            if not path.is_file():
                continue
            rel = path.relative_to(ROOT)
            if rel.parts[0] in {".git", "dist", "__pycache__"}:
                continue
            if "__pycache__" in rel.parts or path.suffix == ".pyc":
                continue
            archive.write(path, rel.as_posix())

def test_zip(path):
    with ZipFile(path) as archive:
        bad = archive.testzip()
        if bad:
            raise SystemExit(f"Corrupt ZIP member in {path}: {bad}")

addon = DIST / "Tensura_Build_01_Core_Races_Progression_R1.0.1.mcaddon"
test_zip(addon)
with ZipFile(addon) as archive:
    for name in ("Tensura_Behavior.mcpack", "Tensura_Resources.mcpack"):
        with ZipFile(BytesIO(archive.read(name))) as pack:
            bad = pack.testzip()
            if bad:
                raise SystemExit(f"Corrupt member in {name}: {bad}")

create_source_archive()
test_zip(source_zip)
report = report_path.read_text(encoding="utf-8")
report = report.replace("Source archive integrity: pending final packaging check", "Source archive integrity: PASS (ZIP integrity test passed)")
report_path.write_text(report, encoding="utf-8")
shutil.copy2(report_path, dist_report)
create_source_archive()
test_zip(source_zip)

integrity = """ARCHIVE INTEGRITY
Tensura_Behavior.mcpack: PASS (embedded ZIP member check)
Tensura_Resources.mcpack: PASS (embedded ZIP member check)
Tensura_Build_01_Core_Races_Progression_R1.0.1.mcaddon: PASS
Tensura_Build_01_R1.0.1_Source.zip: PASS
"""
(DIST / "ARCHIVE_INTEGRITY.txt").write_text(integrity, encoding="utf-8")

sums = []
for path in sorted(DIST.iterdir()):
    if path.is_file() and path.name != "SHA256SUMS.txt":
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        sums.append(f"{digest}  {path.name}")
(DIST / "SHA256SUMS.txt").write_text("\n".join(sums) + "\n", encoding="utf-8")
print("Add-on, embedded packs and editable source ZIP passed integrity checks.")
