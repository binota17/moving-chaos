# Character Production Pipeline

## 2.5D Isometric Multiplayer Party Game

**Document type:** Character Art & Technical Production Specification\
**Status:** Initial production brief\
**Primary references:** Moving Out, Overcooked\
**Character type:** Stylized humanoid\
**Camera:** Isometric\
**Primary DCC:** Blender\
**Target engine:** To be confirmed\
**Important:** This document defines a proposed production baseline.
Values marked *proposed* must be validated against the actual game
engine, target hardware, camera framing, and gameplay requirements.

------------------------------------------------------------------------

## 1. Project Objective

Build a reusable, production-ready 3D humanoid character pipeline for a
2.5D isometric cooperative party game.

The game direction combines: - Cooperative object handling and chaotic
physics interactions. - Fast, readable character actions. - Humorous
movement and exaggerated reactions. - Colorful, approachable cartoon
character designs.

The goal is not merely to produce attractive renders. Each character
must be usable in real-time gameplay, support the required interaction
animations, and be compatible with a shared character framework.

### 1.1 Core production principles

1.  **Gameplay readability first:** Character silhouettes, pose, held
    objects, and facing direction must remain readable from the actual
    gameplay camera.
2.  **Reusable foundations:** Build one robust base character, skeleton,
    and animation convention before expanding the roster.
3.  **Modular where valuable:** Heads, hair, outfits, and accessories
    should be replaceable without rebuilding the entire character.
4.  **Animation-ready geometry:** Topology and skinning must support
    carrying, lifting, pushing, pulling, falling, and recovery.
5.  **Real-time constraints:** Control mesh complexity, material count,
    texture memory, and animation overhead based on measured in-game
    performance.
6.  **Verified deliverables:** Never report a phase complete unless the
    relevant files exist and have passed the stated checks.
7.  **No unsupported assumptions:** Ask the project owner when engine,
    platform, camera, multiplayer, or gameplay details materially affect
    implementation.

------------------------------------------------------------------------

## 2. Scope and Non-Goals

### In scope

-   Character art direction and design rules.
-   One production-quality base humanoid character.
-   Mesh construction and topology.
-   UVs, materials, and textures.
-   Skeleton, skinning, IK controls, and attachment points.
-   Core gameplay animation library.
-   Modular customization architecture.
-   Export conventions and engine integration tests.
-   Documentation and automated validation where practical.

### Not in scope until separately approved

-   Full character roster production.
-   Final UI character creator.
-   Facial dialogue/lip-sync system.
-   Advanced cloth or hair simulation.
-   Motion-capture pipeline.
-   Final multiplayer networking implementation.
-   Engine-specific implementation before the engine is confirmed.

------------------------------------------------------------------------

## 3. Required Project Decisions

The following values are not confirmed. The Agent must ask the project
owner rather than silently choosing them.

  -----------------------------------------------------------------------
  Decision                Current status          Why it matters
  ----------------------- ----------------------- -----------------------
  Game engine             TBD                     Export format, skeleton
                                                  mapping, materials,
                                                  animation import

  Target platforms        TBD                     Polygon, texture,
                                                  shader, and performance
                                                  budgets

  Camera behavior         Isometric;              Character orientation
                          fixed/rotatable TBD     and directional
                                                  animation

  Maximum players on      TBD                     Performance and visual
  screen                                          readability

  Gameplay movement       TBD                     Free 360-degree
                                                  movement vs constrained
                                                  directions

  Multiplayer model       TBD                     Animation/event
                                                  synchronization
                                                  requirements

  Character scale         TBD                     Physics, interaction
                                                  reach, camera framing

  Visual reference board  Moving Out + Overcooked Original art direction
                          direction               must be defined, not
                                                  copied
  -----------------------------------------------------------------------

### 3.1 Questions to ask before production

Ask only the unresolved questions that block the next phase. Do not ask
the entire list again if the owner has already answered.

1.  Which engine and version will receive the assets?
2.  Which platforms and minimum hardware are targeted?
3.  Is the isometric camera fixed, rotatable, or dynamic?
4.  Can characters move freely through 360 degrees?
5.  What is the maximum number of visible players and characters?
6.  Are characters intended to have different body proportions, or
    mostly cosmetic variation over one base body?
7.  What is the expected visual size of a character on screen?

------------------------------------------------------------------------

## 4. Art Direction

### 4.1 Proposed visual style

Use an original stylized 3D cartoon humanoid style with: - Compact,
appealing proportions. - Slightly oversized head. - Rounded and simple
forms. - Strong, readable silhouette. - Expressive face. - Bright but
controlled color palette. - Clear separation between skin, hair,
clothing, and accessories. - Exaggerated poses that communicate action
and emotion.

Do not reproduce copyrighted character designs, costumes, logos, or
distinctive assets from the reference games. References are for broad
genre and presentation direction only.

### 4.2 Proposed proportion starting point

Use normalized total character height = 1.0.

  Region           Initial target
  -------- ----------------------
  Head                    25--30%
  Torso                   30--35%
  Legs                    30--35%
  Hands      Slightly exaggerated
  Feet       Slightly exaggerated

These are initial art-direction targets, not strict anatomical rules.
Validate the proportions in gameplay-camera screenshots.

### 4.3 Required concept package

Before modeling, create: - Front orthographic view. - Side orthographic
view. - Back orthographic view. - Three-quarter view. - Neutral A-pose
or T-pose. - Silhouette-only view. - Color palette. - Facial expression
sheet. - Key gameplay pose sheet: idle, carry, push/pull, fall. - Scale
comparison against a representative gameplay object.

### 4.4 Art-direction acceptance criteria

-   Character is identifiable at expected in-game screen size.
-   Silhouette is distinct from the environment.
-   Held-object poses remain readable.
-   Color blocks remain distinguishable under gameplay lighting.
-   The design is original and does not depend on small surface details
    to communicate identity.
-   Front, side, back, and three-quarter views are visually consistent.

**Deliverables** - `character_style_guide.md` -
`concept/character_turnaround.png` -
`concept/character_expression_sheet.png` -
`concept/character_pose_sheet.png` - `concept/palette.png`

------------------------------------------------------------------------

## 5. Base Character Modeling

### 5.1 Modeling strategy

Build one complete base humanoid before creating variants.

Recommended logical mesh groups: - Body or torso. - Head. - Upper and
lower arms. - Hands. - Upper and lower legs. - Feet. - Eyes and facial
elements. - Hair. - Outfit pieces. - Accessories.

These groups may be separate objects during production. Decide later
whether to combine them for runtime based on customization needs and
engine constraints.

### 5.2 Modeling requirements

-   Apply and document scale and transforms.
-   Establish a consistent character forward axis and up axis.
-   Keep the character centered around a documented origin.
-   Use consistent naming for objects and collections.
-   Avoid non-manifold geometry and accidental internal faces.
-   Keep deformation areas suitable for skinning.
-   Avoid unnecessary hidden geometry.
-   Ensure the model looks good in neutral pose and gameplay poses.
-   Keep hands large and clear enough to communicate object interaction.
-   Test head and body proportions against the actual camera.

### 5.3 Proposed triangle budget

Initial target for a single standard character:

  Component                                           Proposed triangles
  -------------------------- -------------------------------------------
  Main body and limbs                                      5,000--10,000
  Head and facial geometry     Included above or 1,000--2,000 additional
  Accessories                                                 500--2,000
  Initial total target                       Approximately 6,000--12,000

This is a starting hypothesis only. Measure the final asset in the
target engine and profile scenes containing the expected maximum number
of characters. Adjust for platform and art quality.

### 5.4 Modeling acceptance criteria

-   No visible holes, inverted normals, or accidental duplicate
    geometry.
-   Silhouette matches the approved concept.
-   Neutral pose is balanced and symmetrical where intended.
-   Character scale and orientation are documented.
-   Mesh density is concentrated where silhouette or deformation needs
    it.
-   No unnecessary detail that disappears at gameplay camera distance.

**Deliverables** - `source/base_character_model.blend` -
`renders/base_character_front.png` - `renders/base_character_side.png` -
`reports/model_stats.md`

------------------------------------------------------------------------

## 6. Topology and Deformation

### 6.1 Topology priorities

Use animation-friendly edge flow around: - Shoulder and armpit. -
Elbow. - Wrist. - Hip and groin. - Knee. - Ankle. - Neck. - Mouth and
eyes if facial deformation is required.

Use predominantly quads in deformation regions. Triangles may be
acceptable in stable, low-deformation areas after testing.

### 6.2 Deformation test poses

Before UV and final materials, test: - Arms raised overhead. - Arms
extended forward. - Arms crossed or reaching inward. - Elbows bent to
maximum intended range. - Legs in wide stance. - Deep knee bend. - Torso
twist. - Torso lean forward and backward. - Squat/lift pose. - Fall
pose.

Inspect for: - Collapsing shoulders. - Pinching elbows and knees. -
Volume loss. - Mesh intersections. - Unnatural stretching. -
Clothing/body intersections.

### 6.3 Topology acceptance criteria

-   Required gameplay poses do not produce unacceptable deformation.
-   Shoulder and hip deformations are visually acceptable.
-   No severe pinching or collapsing at joints.
-   Mesh normals remain consistent.
-   Any known limitations are documented.

**Deliverables** - `reports/topology_review.md` -
`renders/deformation_tests/`

------------------------------------------------------------------------

## 7. UV Mapping, Materials, and Textures

### 7.1 UV requirements

-   UVs must be non-overlapping unless intentional mirroring or shared
    UVs are documented.
-   Use consistent texel density where practical.
-   Minimize wasted UV space.
-   Keep seams away from highly visible areas where possible.
-   Provide UV layout images for review.
-   Ensure all modular parts use compatible texture/material
    conventions.

### 7.2 Material direction

Prefer a simple, readable stylized material setup: - Base color as the
primary visual signal. - Moderate roughness variation. - Metallic only
where physically appropriate. - Normal maps only where they visibly
improve the result. - Avoid excessive small texture detail.

### 7.3 Texture strategy

Possible texture maps: - Base Color. - Normal, if needed. - Roughness,
if needed. - Metallic, if needed. - Emission, only if needed.

Use texture atlases or shared materials when they reduce runtime cost
without compromising customization requirements.

### 7.4 Texture resolution

Do not hard-code a final resolution before platform and camera testing.
Start with a practical test resolution, compare visual quality at actual
gameplay size, and profile memory use.

### 7.5 Acceptance criteria

-   No visible UV stretching in important areas.
-   No unexpected seams or texture bleeding.
-   Materials render consistently in Blender and the target engine as
    far as supported.
-   Character remains readable under gameplay lighting.
-   Material and texture counts are documented.

**Deliverables** - `textures/` - `source/materials.blend` -
`renders/material_review.png` - `reports/uv_material_review.md`

------------------------------------------------------------------------

## 8. Rigging and Skinning

### 8.1 Skeleton design

Use a humanoid skeleton with a stable naming convention. The final
hierarchy must be adapted to the target engine.

Suggested conceptual hierarchy:

``` text
Root
└── Hips
    ├── Spine
    │   └── Chest
    │       ├── Neck
    │       │   └── Head
    │       ├── LeftShoulder
    │       │   └── LeftUpperArm
    │       │       └── LeftForearm
    │       │           └── LeftHand
    │       └── RightShoulder
    │           └── RightUpperArm
    │               └── RightForearm
    │                   └── RightHand
    ├── LeftUpperLeg
    │   └── LeftLowerLeg
    │       └── LeftFoot
    └── RightUpperLeg
        └── RightLowerLeg
            └── RightFoot
```

Optional bones or controls: - Toe bones. - Eye bones. - Jaw or facial
controls. - Additional spine segment. - Hand/finger bones where gameplay
requires visible gripping. - Twist bones if deformation testing shows
they are needed.

### 8.2 Control rig

The Blender control rig may include: - IK/FK arm controls. - IK leg
controls. - Pole targets for elbows and knees. - Spine and chest
controls. - Head look control. - Foot controls. - Hand pose controls. -
Animation-friendly root and hips controls.

Separate the animator-facing control rig from the deform skeleton if
this improves workflow. Export only the required deform skeleton and
animation data.

### 8.3 Object attachment points

Provide documented attachment points or equivalent engine-side
sockets: - Left hand. - Right hand. - Two-hand carry reference. -
Back. - Head.

For two-handed objects, define a consistent grip convention. Do not
assume all objects should be parented directly to one hand.

### 8.4 Skinning requirements

-   Use clean vertex groups.
-   Remove unintended weights.
-   Normalize weights where required.
-   Test all deformation poses.
-   Avoid clothing clipping in core animations.
-   Document any mesh pieces that are rigidly attached rather than
    skinned.

### 8.5 Physics interaction note

The character art rig and gameplay physics system are separate
responsibilities.

For held objects, the game may: - Attach an object to a hand/socket for
simple interactions; or - Keep a physics body active and drive it with
constraints, joints, or forces for physical interactions.

The Technical Artist must document attachment transforms and grip
points. The gameplay engineer must decide the runtime ownership and
physics behavior.

### 8.6 Acceptance criteria

-   Skeleton hierarchy is stable and documented.
-   All core deformation tests pass.
-   Hand attachment transforms are usable.
-   No unexpected bone scaling or axis changes during export.
-   Test animations export and import correctly.

**Deliverables** - `source/base_character_rig.blend` -
`exports/base_character_skeleton.fbx` - `reports/rig_skinning_review.md`

------------------------------------------------------------------------

## 9. Animation Production

### 9.1 Animation categories

#### P0 --- Core gameplay

-   Idle.
-   Walk.
-   Run.
-   Start/stop movement.
-   Turn or directional transition.
-   Pick up.
-   Drop.
-   Carry idle.
-   Carry walk.
-   Carry run, if needed.
-   Push.
-   Pull.
-   Fall.
-   Get up.

#### P1 --- Gameplay enhancement

-   Lift heavy object.
-   Throw.
-   Place/deliver object.
-   Hit reaction.
-   Stumble.
-   Knockback.
-   Struggle while carrying.
-   Reach/grab interaction.

#### P2 --- Cosmetic

-   Celebrate.
-   Confused.
-   Angry.
-   Sad.
-   Dance.
-   Victory.
-   Other emotes.

### 9.2 Isometric direction handling

The camera being isometric does not automatically mean movement is
restricted to eight directions.

First establish whether the game supports: - Continuous 360-degree
movement. - Four/eight-direction movement. - Camera-relative movement. -
World-relative movement.

For a fully 3D humanoid, a useful baseline is to rotate the character
toward the movement or interaction direction and reuse locomotion clips.
Direction-specific clips or blend spaces can be added where the
silhouette or footwork requires them.

Do not create eight independent animation sets by default. Validate
whether the chosen engine and animation system can use a blend tree,
blend space, or directional locomotion approach.

### 9.3 Animation conventions

Define: - Frame rate. - Clip naming. - Start/end frame conventions. -
Looping flags. - Root motion policy. - In-place vs root-motion
locomotion. - Event markers for gameplay actions. - Animation transition
rules.

Suggested naming:

``` text
CHR_Base_Idle
CHR_Base_Walk
CHR_Base_Run
CHR_Base_PickUp
CHR_Base_Drop
CHR_Base_CarryIdle
CHR_Base_CarryWalk
CHR_Base_Push
CHR_Base_Pull
CHR_Base_Fall
CHR_Base_GetUp
CHR_Base_Throw
CHR_Base_Celebrate
```

### 9.4 Gameplay events

Where useful, add animation events/markers such as: - `GripStart` -
`GripContact` - `ObjectRelease` - `Footstep` - `Impact` -
`RecoveryComplete`

These markers are signals for gameplay integration, not a replacement
for gameplay authority. The game code must validate interactions and
physics state.

### 9.5 Animation acceptance criteria

-   Locomotion loops without visible popping.
-   Feet do not slide excessively under the intended movement
    controller.
-   Pick-up and drop poses align with object grip points.
-   Carry poses remain readable from the gameplay camera.
-   Fall and get-up animations work from the intended orientations.
-   Clips use the documented root motion policy.
-   All events and clip names are documented.

**Deliverables** - `source/animation_library.blend` -
`exports/animations.fbx` or engine-specific animation assets -
`reports/animation_review.md` - `renders/animation_preview/`

------------------------------------------------------------------------

## 10. Modular Character System

### 10.1 Recommended architecture

``` text
Character
├── Skeleton
├── BaseBody
├── Head
│   ├── Face
│   ├── Eyes
│   └── Hair
├── Outfit
│   ├── UpperBody
│   ├── LowerBody
│   └── Shoes
├── Accessories
│   ├── Hat
│   ├── Glasses
│   └── Backpack
└── AttachmentPoints
    ├── LeftHand
    ├── RightHand
    ├── Back
    └── Head
```

### 10.2 Compatibility rules

-   Modular parts must be authored against the same reference skeleton
    or documented compatible skeleton.
-   Pivot, scale, orientation, and naming must be consistent.
-   Outfit pieces must be tested against all relevant body poses.
-   Accessories must have documented attachment transforms.
-   Color variants should use material parameters or a documented
    texture approach.
-   Avoid unnecessary unique materials for every character part.
-   Define how hidden body geometry is handled beneath clothing.

### 10.3 Expansion test

After the base character is approved, create two variants: - Variant A:
Different head, hair, and outfit. - Variant B: Different visual identity
while remaining compatible with the shared rig.

Run the same core animation suite on all variants. Do not expand the
roster until compatibility is demonstrated.

**Deliverables** - `source/modular_character_library.blend` -
`reports/modular_compatibility.md` - `renders/character_variants.png`

------------------------------------------------------------------------

## 11. Export and Engine Integration

### 11.1 General export requirements

Before the engine is confirmed, maintain a clean source file and a
documented export preset. Do not assume that one FBX/GLB preset is
correct for every engine.

Document: - Unit scale. - Up axis and forward axis. - Object
transforms. - Skeleton hierarchy. - Deform bones included. - Animation
clip ranges. - Root motion policy. - Material/texture handling. - Naming
conventions.

### 11.2 Export formats

  Format   Intended use
  -------- ------------------------------------------------------
  BLEND    Editable source project
  FBX      Common skeletal mesh and animation interchange
  GLB      Useful for mesh/material interchange where supported
  PNG      Texture maps and previews
  JSON     Optional character metadata/configuration

### 11.3 Engine validation

Once the engine is selected: 1. Import the base character. 2. Verify
scale and orientation. 3. Verify skeleton hierarchy. 4. Verify material
and texture appearance. 5. Play all core animation clips. 6. Verify
attachment points. 7. Test character rotation and movement. 8. Test
multiple character instances. 9. Profile runtime performance. 10. Record
engine-specific import settings.

**Deliverables** - `exports/` - `integration_test_scene/` -
`reports/engine_import_validation.md`

------------------------------------------------------------------------

## 12. Suggested Repository Structure

``` text
CharacterProduction/
├── README.md
├── docs/
│   ├── character_style_guide.md
│   ├── skeleton_specification.md
│   ├── animation_specification.md
│   ├── naming_conventions.md
│   └── export_specification.md
├── concept/
│   ├── turnaround/
│   ├── expressions/
│   ├── poses/
│   └── palettes/
├── source/
│   ├── base_character_model.blend
│   ├── base_character_rig.blend
│   ├── animation_library.blend
│   └── modular_character_library.blend
├── textures/
├── exports/
│   ├── meshes/
│   ├── skeletons/
│   └── animations/
├── previews/
│   ├── renders/
│   └── animation/
├── scripts/
│   ├── blender/
│   └── validation/
└── reports/
```

------------------------------------------------------------------------

## 13. Agent Roles and Responsibilities

One AI Agent may perform multiple roles, but each task must have a
clearly defined output and acceptance criteria.

### 13.1 Character Designer

Responsible for: - Art direction. - Proportions. - Turnaround sheets. -
Palette. - Facial expressions. - Gameplay pose concepts.

Must not begin final modeling before concept approval.

### 13.2 3D Modeler

Responsible for: - Base mesh. - Topology. - UV mapping. - Material
assignment. - Modeling validation.

Must provide editable Blender source files, not only rendered images.

### 13.3 Technical Artist

Responsible for: - Skeleton and rig. - Skinning. - IK controls. -
Attachment points. - Export setup. - Engine compatibility tests.

Must provide skeleton and export documentation.

### 13.4 Animator

Responsible for: - Core gameplay animation. - Secondary animation. -
Clip naming and timing. - Animation events. - Preview renders. -
Animation validation.

Must test animations with representative held-object shapes.

------------------------------------------------------------------------

## 14. AI Agent Operating Protocol

### 14.1 Work in approved phases

Do not attempt to complete the entire character pipeline in one prompt
or one unreviewed operation.

For each phase: 1. Read this specification. 2. Identify missing
decisions. 3. State the planned implementation. 4. List expected files.
5. Execute only the approved scope. 6. Validate the actual output. 7.
Report failures and limitations. 8. Request approval before moving to
the next phase.

### 14.2 Blender automation requirements

When using Blender Python: - State the Blender version used. - Save
scripts under `scripts/blender/`. - Use deterministic object and
collection names. - Avoid destructive changes to approved source
files. - Save a new version before major operations. - Log operations
and validation results. - Reopen generated `.blend` files to verify they
are valid. - Do not claim a model is complete based only on successful
script execution. - Generate preview renders for visual review.

### 14.3 File delivery requirements

Every phase report must include: - Exact file paths. - File formats. -
What each file contains. - Whether the file was actually created. -
Validation steps performed. - Known defects or missing items. -
Screenshots/renders where relevant.

Never invent file paths or claim files exist without checking them.

### 14.4 Change management

If a change affects approved proportions, skeleton hierarchy, naming,
scale, or export conventions: - Explain the impact. - Identify dependent
assets. - Request approval before applying a breaking change. - Update
the relevant documentation after approval.

------------------------------------------------------------------------

## 15. Milestones and Acceptance Gates

### Milestone 1 --- Approved Character Concept

Must have: - Approved style direction. - Turnaround. - Proportions. -
Palette. - Gameplay pose sheet.

**Gate:** Owner approves the concept before final modeling.

### Milestone 2 --- Base Mesh

Must have: - Editable Blender model. - Correct scale/orientation. -
Clean geometry. - Approved silhouette. - Model statistics.

**Gate:** Owner approves the base mesh.

### Milestone 3 --- Deformation-ready Character

Must have: - UVs. - Materials. - Skeleton. - Skinning. - Deformation
test results.

**Gate:** Core poses pass review.

### Milestone 4 --- Gameplay Animation

Must have: - P0 animation set. - Clip naming. - Root motion policy. -
Grip and release markers. - Preview renders.

**Gate:** Core interactions are readable and functional.

### Milestone 5 --- Modular Character Framework

Must have: - Shared skeleton convention. - Two compatible variants. -
Outfit/accessory attachment rules. - Compatibility test report.

**Gate:** Variants pass the same core animation suite.

### Milestone 6 --- Engine Integration

Must have: - Imported character. - Correct scale and orientation. -
Working materials. - Working animations. - Attachment point tests. -
Multi-character performance test.

**Gate:** Character is approved for gameplay integration.

------------------------------------------------------------------------

## 16. Final Quality Assurance Checklist

### Visual

-   [ ] Approved art direction followed.
-   [ ] Silhouette readable at gameplay size.
-   [ ] Character distinguishable from environment.
-   [ ] Held-object poses readable.
-   [ ] No obvious clipping in key poses.

### Mesh and topology

-   [ ] No accidental duplicate or internal geometry.
-   [ ] Normals are correct.
-   [ ] Deformation loops are adequate.
-   [ ] Polygon count recorded.
-   [ ] Required deformation tests passed.

### UV and materials

-   [ ] UV layout reviewed.
-   [ ] No unexpected texture seams.
-   [ ] Material count recorded.
-   [ ] Texture memory considered.
-   [ ] Engine appearance reviewed.

### Rig and animation

-   [ ] Skeleton hierarchy documented.
-   [ ] Skin weights reviewed.
-   [ ] IK controls tested.
-   [ ] Attachment points tested.
-   [ ] Core animations reviewed.
-   [ ] Root motion policy documented.
-   [ ] Animation events documented.

### Integration

-   [ ] Source files present.
-   [ ] Export files present.
-   [ ] Engine import tested.
-   [ ] Scale and orientation correct.
-   [ ] Multiple character instances tested.
-   [ ] Performance measured.
-   [ ] Known limitations documented.

------------------------------------------------------------------------

## 17. First Task for the Agent

Start with **Milestone 1 --- Approved Character Concept** only.

Do not create the final 3D model yet.

The Agent must:

1.  Read this entire specification.
2.  List the project decisions that remain unresolved.
3.  Ask the owner only the questions needed to establish the concept.
4.  Propose one original humanoid character design suitable for the
    game.
5.  Produce front, side, back, and three-quarter concept views.
6.  Produce a neutral A-pose or T-pose.
7.  Produce a color palette and facial expression sheet.
8.  Show the character at representative isometric gameplay scale.
9.  Explain how the design will support carrying, lifting, pushing,
    pulling, falling, and recovery animations.
10. Submit the concept package for approval.

Do not proceed to final modeling until the owner explicitly approves the
concept.

**Definition of success:** The first milestone is complete only when the
concept assets and documentation have actually been created, inspected,
and approved.
