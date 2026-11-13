# Build 01 validation report

- JSON files parsed: 6296
- JSON parse errors: 0
- Top-level behavior scripts: 8 (Node syntax checks executed separately)
- Behavior-pack files: 6923
- Resource-pack files: 3020
- Original Java JAR included: yes, unchanged
- Live Minecraft/Android gameplay test: **not performed** (runtime unavailable in this build environment)

## Result
Static JSON parsing: PASS. This is not gameplay certification.

## Known release gates
1. Import on the target Android Bedrock version and confirm both packs activate.
2. Test each race, death/rejoin persistence, resource regeneration and EP equality.
3. Test LOW/MEDIUM/HIGH naming costs, 25% HP threshold, player opt-in/consent, and named evolution.
4. Test possession state transfer and reconnect behavior.
5. Confirm no duplicate dynamic-property owners after integration.
