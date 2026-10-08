# Anatomical 3D asset replacement — sourcing decision (2026-10-08)

## Current state
The examination view uses procedural illustrative teeth, **not** an anatomically validated model. The existing camera, 360-degree rotation, pinch zoom, jaw visibility toggles and FDI tooth selection must be preserved during replacement.

## Candidate A — Permanent Dentition, University of Dundee School of Dentistry
- Model: https://sketchfab.com/3d-models/permanent-dentition-2f69d7b59c3e4a6a8bcae041bd8e591b
- Identified in OrthoViz project: https://github.com/DoubVarial/orthoviz
- Reported license: Creative Commons Attribution 4.0 (CC BY 4.0); verify asset download license and provenance before copying.
- Advantages: anatomy-oriented permanent dentition, commercial reuse permitted with attribution subject to CC BY terms.
- Integration blocked pending obtaining and examining actual model bytes, per-tooth mesh hierarchy, performance, and source attribution.

## Candidate B — 3Dentes
- https://github.com/NateSaindon/3Dentes
- 28 teeth from one consenting patient's CBCT; no third molars; derived dental anatomy and limitations are documented.
- Asset CC BY-NC 4.0: **noncommercial only**, unsuitable for a commercial product without separate permission.

## Candidate C — Dental Scope
- https://github.com/Yoosseph/dental-scope
- 32 individually selectable teeth, derived from BodyParts3D.
- Assets CC BY-SA 2.1 Japan; ShareAlike obligations must be reviewed for the planned distribution.

## Acceptance checklist
1. Obtain source .glb/.gltf or licensed equivalent and archive attribution and license.
2. Inspect geometry for individual tooth objects; verify upper/lower, left/right and FDI numbering.
3. Optimize meshes/textures for iPhone Safari, benchmark render and first load.
4. Replace procedural crowns with licensed anatomy, preserve camera controls and examination state.
5. Validate incisor/canine/premolar/molar morphology and test tap-selection on real iPhone.
6. Label model limitations; do not imply patient-specific pathology is present in generic anatomical asset.

**Status:** Research and asset evaluation completed; replacement NOT installed. Do not mark done until verified model integration and mobile QA.


## Asset received and converted (2026-10-08)
User provided the Sketchfab Permanent Dentition glTF ZIP. Its license.txt explicitly states CC BY 4.0 and author University of Dundee, School of Dentistry.
- 33 glTF mesh primitives, 86 nodes. Lower jaw has 16 mesh nodes; upper has 17 mesh nodes (one tooth may have multiple primitives), so do not map FDI by mesh index without validating.
- Source ZIP contained scene.gltf, scene.bin and 16 textures.
- Converted to self-contained GLB (11.1 MB), and mobile GLB with 768px JPEG textures (~2.1 MB). Both outputs were created in the conversation's sandbox; they have **not** been committed to GitHub.
- Next: upload the mobile GLB to repository path `models/permanent-dentition.glb`, inspect node hierarchy and map tooth components to correct FDI, then enable GLTFLoader and QA on iPhone.
- Attribution text: This work is based on "Permanent Dentition" by University of Dundee, School of Dentistry, licensed under CC BY 4.0. https://sketchfab.com/3d-models/permanent-dentition-2f69d7b59c3e4a6a8bcae041bd8e591b
