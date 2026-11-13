import json
from pathlib import Path

items = Path("behavior_pack/items")
changed = 0
for path in items.glob("skill_icon_*.json"):
    data = json.loads(path.read_text(encoding="utf-8"))
    item = data.get("minecraft:item", {})
    description = item.get("description", {})
    identifier = description.get("identifier", "")
    skill = identifier.removeprefix("tensura:skill_icon_")
    title = " ".join(part.capitalize() for part in skill.split("_"))
    components = item.setdefault("components", {})
    components["minecraft:display_name"] = {"value": f"{title} • Skill Totem"}
    components["minecraft:use_modifiers"] = {"use_duration": 0.1, "movement_modifier": 1.0}
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    changed += 1
print(f"Prepared {changed} usable Skill Totems.")
