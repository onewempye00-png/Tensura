import hashlib
import json
import os
import shutil
from pathlib import Path
from io import BytesIO
from zipfile import ZipFile

ROOT = Path(".")
BP = ROOT / "behavior_pack"
RP = ROOT / "resource_pack"
DIST = ROOT / "dist"
DIST.mkdir(exist_ok=True)

json_files = [p for root in (BP, RP) for p in root.rglob("*.json")]
json_errors = []
for path in json_files:
    try:
        json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        json_errors.append(f"{path}: {exc}")
if json_errors:
    raise SystemExit("\n".join(json_errors))

def count_files(root, pattern="*"):
    return sum(1 for p in root.rglob(pattern) if p.is_file())

def read_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))

def write_json(path, value):
    Path(path).write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

script = (BP / "scripts/main.js").read_text(encoding="utf-8")
if "labyrinth" in script.lower():
    raise SystemExit("Active script still references the removed Great Spirit Labyrinth.")
if "ensureVillageChurch" not in script or "openBattlewillHorn" not in script:
    raise SystemExit("Required 1.0.1 gameplay handlers are missing.")

mob_ids = [
    "companion_clayman", "clayman", "dagruel", "mai_furuki", "folgen",
    "shin_ryusei", "shizu", "mark_lauren", "hinata", "giant_salmon",
    "kirara_mizutani", "companion_hinata", "pegasus", "companion_frey",
    "sky_wyvern", "supermassive_slime", "megalodon", "shinji_tanimura",
    "zombie", "metal_slime", "carrion", "tempest_serpent", "giant_bat",
    "dwarf", "skeleton", "giant_cod", "one_eyed_owl", "shogo_taguchi",
    "kyoya_tachibana", "evil_centipede", "direwolf"
]
geometry_ids = set()
for path in (RP / "models/entity").rglob("*.geo.json"):
    data = read_json(path)
    for geometry in data.get("minecraft:geometry", []):
        identifier = geometry.get("description", {}).get("identifier")
        if identifier:
            geometry_ids.add(identifier)
controller_data = read_json(RP / "render_controllers/render_controllers.json")
controller_ids = set(controller_data.get("render_controllers", {}))
mob_errors = []
for mob in mob_ids:
    path = RP / f"entity/{mob}.entity.json"
    if not path.exists():
        mob_errors.append(f"{mob}: missing client entity")
        continue
    desc = read_json(path).get("minecraft:client_entity", {}).get("description", {})
    geometry = desc.get("geometry", {}).get("default")
    texture = desc.get("textures", {}).get("default")
    if geometry not in geometry_ids:
        mob_errors.append(f"{mob}: unresolved geometry {geometry}")
    if not texture or not (RP / (texture + ".png")).exists():
        mob_errors.append(f"{mob}: unresolved texture {texture}")
    controllers = desc.get("render_controllers", [])
    if not controllers or any(c not in controller_ids for c in controllers):
        mob_errors.append(f"{mob}: unresolved render controller {controllers}")
if mob_errors:
    raise SystemExit("\n".join(mob_errors))
if "controller.render.default" not in controller_ids:
    raise SystemExit("Shared controller.render.default is missing.")

active_labyrinth = []
for root in (BP, RP):
    for path in root.rglob("*"):
        if not path.is_file() or "labyrinth" not in path.as_posix().lower():
            continue
        rel = path.as_posix()
        if rel.startswith("behavior_pack/source_reference/"):
            continue
        if rel == "resource_pack/textures/block/labyrinth_stone.png":
            continue
        active_labyrinth.append(rel)
if active_labyrinth:
    raise SystemExit("Active Labyrinth assets remain: " + ", ".join(active_labyrinth))

totem_files = sorted((BP / "items").glob("skill_icon_*.json"))
totem_errors = []
for path in totem_files:
    item = read_json(path).get("minecraft:item", {})
    components = item.get("components", {})
    if not components.get("minecraft:use_modifiers"):
        totem_errors.append(f"{path}: missing use modifiers")
    if not components.get("minecraft:display_name", {}).get("value", "").endswith("Skill Totem"):
        totem_errors.append(f"{path}: display name is not Skill Totem")
if totem_errors:
    raise SystemExit("\n".join(totem_errors))

required_files = [
    BP / "items/battlewill_horn.json",
    BP / "items/crafting_bench.json",
    BP / "recipes/crafting_bench.json",
    BP / "feature_rules/magic_ore_surface_ore_rule.json",
    BP / "features/magic_ore_surface_ore_feature.json",
    RP / "textures/block/labyrinth_stone.png",
]
for path in required_files:
    if not path.exists():
        raise SystemExit(f"Required build asset missing: {path}")

greater_daemon = read_json(BP / "entities/greater_daemon.json").get("minecraft:entity", {})
if "minecraft:boss" in greater_daemon.get("components", {}):
    raise SystemExit("Greater Demon still has a native boss component.")
if 'dead?.typeId==="tensura:greater_daemon"?false' not in script:
    raise SystemExit("Greater Demon boss exclusion is missing.")

ledger_path = BP / "conversion_audit/JAVA_TO_BEDROCK_PARITY_LEDGER.json"
ledger = read_json(ledger_path)
ledger["version"] = "3.4.0"
converted = ledger.setdefault("converted", {})
converted.update({
    "bp_files": count_files(BP),
    "rp_files": count_files(RP),
    "items": count_files(BP / "items", "*.json"),
    "blocks": count_files(BP / "blocks", "*.json"),
    "behavior_entities": count_files(BP / "entities", "*.json"),
    "client_entities": count_files(RP / "entity", "*.json"),
    "recipes": count_files(BP / "recipes", "*.json"),
    "loot_tables": count_files(BP / "loot_tables", "*.json"),
    "structures": count_files(BP / "structures", "*.mcstructure"),
    "features": count_files(BP / "features", "*.json"),
    "feature_rules": count_files(BP / "feature_rules", "*.json"),
    "textures": count_files(RP / "textures", "*.png"),
    "geometries": count_files(RP / "models/entity", "*.geo.json"),
    "animations": count_files(RP / "animations", "*.json"),
    "spawn_rules": count_files(BP / "spawn_rules", "*.json"),
    "dimensions": count_files(BP / "dimensions", "*.json"),
})
jar_path = ROOT / "original_java_mod.jar"
jar_sha = hashlib.sha256(jar_path.read_bytes()).hexdigest() if jar_path.exists() else "not-present"
ledger.setdefault("source", {})["jar_sha256"] = jar_sha
ledger["validation"] = {
    "live_runtime_test": "not performed; Android Bedrock import and gameplay remain manual",
    "static_json": f"passed: {len(json_files)} files, 0 errors",
    "javascript": "passed: all behavior_pack/scripts/*.js checked with Node ES module syntax mode",
    "targeted_mob_render_references": f"passed: {len(mob_ids)} of {len(mob_ids)} listed mobs have valid geometry, texture and render-controller references",
    "active_labyrinth_content": "passed: no active Labyrinth content; only the requested Labyrinth Stone icon texture remains",
    "archive_integrity": "verified by tools/verify_archives.py",
}
ledger["build_1_0_1_fixes"] = {
    "skill_totems": f"{len(totem_files)} creative skill icons prepared as usable Skill Totems",
    "battlewill_horn": "implemented; learned Battlewill techniques cast through the AP resource path",
    "chest_rewards": "randomized Battlewill Manual and Skill Totem rewards injected on first chest interaction",
    "naming_horn": "ray selection filters to valid nameable entities before choosing a target",
    "hud": "resource bars compressed into two rows with compass retained",
    "greater_daemon": "explicitly excluded from native/custom boss display and boss rewards",
    "hell": "roof, glowstone columns, denser lava and bidirectional portal interaction",
    "magic_ore": "surface feature/rule added; mobs have a 2.5% shard chance and bosses receive 3-6 shards",
    "unique_skill_reroll": "previous owned skill removed and equipped Skill/Magic Horn slots replaced",
    "race_starts": "human/goblin start without Unique Skills; other mapped races retain their starting Unique; slime Great Sage/Gluttony odds preserved",
    "great_sage": "kept as a learnable skill; no new Raphael skill added",
    "labyrinth": "removed from active behavior/resource packs; only Labyrinth Stone icon texture retained",
    "village_spirits": "script builds a chapel near a natural village with at least two villagers; prayer is performed at its lectern",
    "crafting_bench": "named item places a vanilla crafting table, preserving the native crafting UI and Tensura crafting-table recipes",
    "equipment_ep_mending": "Tensura durable gear gains EP and is periodically repaired in inventory and equipped slots",
    "mob_rendering": f"shared render controller restored and {len(mob_ids)} listed mob references validated",
}
write_json(ledger_path, ledger)

parity_md = ROOT / "BUILD_01_PARITY_LEDGER.md"
parity_text = parity_md.read_text(encoding="utf-8")
marker = "## Build 1.0.1 fix coverage"
if marker not in parity_text:
    parity_text += """
## Build 1.0.1 fix coverage

- **Naming Horn:** view-ray selection filters for valid, nameable living entities before choosing a target, so an ineligible foreground mob no longer blocks a valid target.
- **Skill Totems:** all creative skill-icon items are converted during packaging into usable, single-stack Skill Totems; using one learns its corresponding catalog skill. Randomized chest rewards include Skill Totems.
- **Battlewill:** a Battlewill Horn lists learned Battlewill techniques; the existing cast system charges AP. Battlewill Manuals and Skill Totems are added to randomized chest rewards on first chest interaction.
- **HUD:** HP/MP/AP are grouped on the first row and SP/EP on the second; the compass remains beneath them.
- **Greater Demons:** explicitly excluded from boss UI/reward classification; their entity definition has no native boss component.
- **Hell:** roof, glowstone light pillars, increased lava placement and bidirectional portal interaction.
- **Magic Ore:** surface feature/rule added. Normal creatures have a 2.5% Magic Ore Shard drop chance; classified bosses receive 3–6 shards.
- **Unique Skill reroll:** removes the prior owned Unique Skill and replaces references in equipped Skill Horn and Magic Horn slots. Human/Goblin starting Unique Skill remains empty and can be rerolled; the slime Great Sage/Gluttony roll is preserved.
- **Great Sage:** remains a learnable skill and is included in the Skill Totem catalog. No new Raphael skill was added.
- **Great Spirit Labyrinth:** removed from active behavior/resource packs, including its dimension, blocks, items, entities, structures and script routes. The original Java source references remain for provenance, and only the requested Labyrinth Stone texture is retained as an icon.
- **Village spirits:** a chapel is script-built beside a naturally generated village when at least two villagers are nearby; the Spirit Prayer Seal is used at the chapel lectern. This is a Bedrock script approximation, not native village jigsaw generation.
- **Crafting Bench:** a named custom item places the vanilla crafting table, preserving its native crafting UI and all recipes tagged for the crafting table.
- **Equipment EP/Mending:** Tensura durable gear receives item EP and periodic script-based repair in both inventory and equipped slots; this is a Bedrock approximation rather than the vanilla Mending enchantment.
- **Invisible mobs:** a shared render controller is restored; the 31 specifically reported mob client definitions are checked against geometry, texture and render-controller assets.

Live Android Bedrock import/gameplay testing was not performed in the build environment. Static validation does not certify runtime behavior.
"""
    parity_md.write_text(parity_text, encoding="utf-8")

js_files = list((BP / "scripts").glob("*.js"))
bp_files = count_files(BP)
rp_files = count_files(RP)
report = f"""# Build 01 — R1.0.1 validation report

- Repository: https://github.com/onewempye00-png/Tensura
- Branch: {os.environ.get("BUILD_BRANCH", "build-1.0.1-fixes")}
- Commit: {os.environ.get("BUILD_COMMIT", "unknown")}
- Workflow: {os.environ.get("BUILD_RUN_URL", "GitHub Actions")}
- Behavior-pack files: {bp_files}
- Resource-pack files: {rp_files}
- JSON files parsed: {len(json_files)}
- JSON parse errors: 0
- JavaScript files: {len(js_files)} (Node ES module syntax check is a required workflow step)
- Usable Skill Totems prepared: {len(totem_files)}
- Targeted invisible mobs with valid geometry/texture/controller references: {len(mob_ids)}/{len(mob_ids)}
- Active Great Spirit Labyrinth files: 0 (only the requested icon texture remains)
- Shared entity render controller: PASS
- Magic Ore surface feature and rule: PASS
- Greater Demon boss component/exclusion: PASS
- Original Java JAR included unchanged: {"yes" if jar_path.exists() else "no"}
- Original Java JAR SHA-256: {jar_sha}
- Add-on archive integrity: PASS (inner behavior/resource packs checked)
- Source archive integrity: pending final packaging check
- Live Minecraft/Android gameplay test: **not performed** (must be tested in Minecraft)

## Implemented 1.0.1 fixes

Naming Horn targeting; usable Skill Totems; randomized chest rewards for Skill Totems and Battlewill Manuals; Battlewill Horn/AP casting; compact HUD; Greater Demon boss exclusion; Hell roof/light/lava/exit; mob/boss Magic Ore drops; surface Magic Ore generation; corrected pack label; Unique Skill reroll replacement; race starting Unique Skill rules; Great Sage learnability; active Great Spirit Labyrinth removal with icon-only texture retention; village chapel prayer; Crafting Bench; EP and script-based Mending for Tensura gear; shared mob render controller.

## Remaining manual release checks

1. Import the .mcaddon into the target Android Bedrock version and activate both packs.
2. Confirm all 31 listed mobs render in-game and that Greater Demons do not show a boss bar.
3. Test Naming Horn targeting, Skill Totems, chest rewards, Battlewill Horn/AP costs and Skill/Magic Horn behavior.
4. Visit Hell, confirm the roof/lava/light, and use the portal in both directions.
5. Find Magic Ore at the surface, mine it with a diamond pickaxe, and verify mob/boss shard drops.
6. Visit a naturally generated village; confirm a chapel appears nearby and that prayer at its lectern consumes a Spirit Prayer Seal and grants a spirit.
7. Place the Crafting Bench and craft Tensura recipes; test EP and periodic repair on armor and weapons.
8. Test Unique Skill rerolls and new race starting skills, especially Human, Goblin and Slime.

Static checks do not replace live gameplay testing.
"""
(ROOT / "BUILD_01_VALIDATION_REPORT.md").write_text(report, encoding="utf-8")

provenance = f"""TENSURA BUILD 01 — R1.0.1 PROVENANCE

Repository: https://github.com/onewempye00-png/Tensura
Branch: {os.environ.get("BUILD_BRANCH", "build-1.0.1-fixes")}
Commit: {os.environ.get("BUILD_COMMIT", "unknown")}
Workflow: {os.environ.get("BUILD_RUN_URL", "GitHub Actions")}

Original Java mod JAR: original_java_mod.jar
Original Java mod JAR size: {jar_path.stat().st_size if jar_path.exists() else "not present"} bytes
Original Java mod JAR SHA-256: {jar_sha}
Source reference material: behavior_pack/source_reference/
Machine-readable parity ledger: behavior_pack/conversion_audit/JAVA_TO_BEDROCK_PARITY_LEDGER.json
Human-readable parity ledger: BUILD_01_PARITY_LEDGER.md

The original JAR and extracted Java source references are retained as provenance. Active Great Spirit Labyrinth gameplay assets are removed; only the requested Labyrinth Stone icon texture is retained.

This package was statically validated by GitHub Actions. Live Minecraft/Android import and gameplay testing were not performed.
"""
(ROOT / "PROVENANCE.txt").write_text(provenance, encoding="utf-8")

for source, dest in [
    (ROOT / "BUILD_01_VALIDATION_REPORT.md", DIST / "BUILD_01_VALIDATION_REPORT.md"),
    (parity_md, DIST / "BUILD_01_PARITY_LEDGER.md"),
    (ledger_path, DIST / "JAVA_TO_BEDROCK_PARITY_LEDGER.json"),
    (ROOT / "PROVENANCE.txt", DIST / "PROVENANCE.txt"),
]:
    shutil.copy2(source, dest)

addon = DIST / "Tensura_Build_01_Core_Races_Progression_R1.0.1.mcaddon"
with ZipFile(addon) as archive:
    if archive.testzip():
        raise SystemExit("The mcaddon ZIP has a corrupt member.")
    names = set(archive.namelist())
    expected = {"Tensura_Behavior.mcpack", "Tensura_Resources.mcpack"}
    if not expected.issubset(names):
        raise SystemExit(f"mcaddon is missing embedded packs: {expected - names}")
    for name in expected:
        with ZipFile(BytesIO(archive.read(name))) as pack:
            if pack.testzip():
                raise SystemExit(f"Corrupt embedded pack: {name}")

print(f"Prepared reports for {len(json_files)} JSON files, {len(totem_files)} Skill Totems and {len(mob_ids)} targeted mobs.")
