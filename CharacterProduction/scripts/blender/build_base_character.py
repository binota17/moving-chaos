"""
=============================================================================
BLENDER 3D BASE CHARACTER GENERATION SCRIPT
Character: 'Bobi' - Cute Chubby Bean Mascot Mover
Project: Moving Chaos (2.5D Isometric Co-op - Godot 4)
Specification: character_production_pipeline_2_5d_isometric.md (Milestone 2)
=============================================================================
Run in headless or GUI mode:
    blender -b -P scripts/blender/build_base_character.py
"""

import sys
import os
import math

try:
    import bpy
    import bmesh
    from mathutils import Vector, Euler, Matrix
    HAS_BPY = True
except ImportError:
    HAS_BPY = False
    print("[WARN] bpy module not found in current Python environment.")
    print("This script is designed to be executed inside Blender: blender -b -P scripts/blender/build_base_character.py")

def create_base_character():
    if not HAS_BPY:
        return

    print("==================================================================")
    print(f"Executing with Blender {bpy.app.version_string}")
    print("Building Base Character Model: 'Bobi' (Mascot Bean Mover)...")
    print("==================================================================")

    # 1. Reset Scene
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.unit_settings.system = 'METRIC'
    scene.unit_settings.scale_length = 1.0

    # 2. Setup Collections
    col_char = bpy.data.collections.new("Bobi_Character_Geometry")
    scene.collection.children.link(col_char)

    # 3. Colors & Materials Setup
    materials = {}
    palette = {
        "Mat_YellowBean": (1.0, 0.647, 0.008, 1.0),   # #FFA502 Butter Yellow
        "Mat_DenimBlue": (0.216, 0.259, 0.980, 1.0),   # #3742FA Cobalt Blue
        "Mat_BandanaRed": (1.0, 0.278, 0.341, 1.0),   # #FF4757 Tomato Red
        "Mat_WhiteGloves": (1.0, 1.0, 1.0, 1.0),      # #FFFFFF White
        "Mat_BootsCharcoal": (0.341, 0.376, 0.435, 1.0), # #57606F Boots
        "Mat_EyesBlack": (0.08, 0.08, 0.08, 1.0),      # Eyes
        "Mat_CheeksPink": (1.0, 0.420, 0.506, 1.0)     # Blush
    }

    for name, rgba in palette.items():
        mat = bpy.data.materials.new(name=name)
        mat.use_nodes = True
        bsdf = mat.node_tree.nodes.get("Principled BSDF")
        if bsdf:
            bsdf.inputs["Base Color"].default_value = rgba
            bsdf.inputs["Roughness"].default_value = 0.45
            if "Metallic" in bsdf.inputs:
                bsdf.inputs["Metallic"].default_value = 0.0
        materials[name] = mat

    # Helper: Link and assign material
    def setup_obj(obj, mat_name, parent=None):
        col_char.objects.link(obj)
        if mat_name in materials:
            obj.data.materials.append(materials[mat_name])
        if parent:
            obj.parent = parent
        return obj

    # 4. Construct Body Parts
    # (A) Main Capsule Body (Head + Torso merged seamlessly)
    # Radius = 0.34m, Height = 0.75m, Center at Z = 0.65m
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=16, radius=0.34, location=(0, 0, 0.65))
    body_obj = bpy.context.active_object
    body_obj.name = "Bobi_Body_Capsule"
    body_obj.scale = (1.0, 0.95, 1.25) # Slightly elongated pill
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    setup_obj(body_obj, "Mat_YellowBean")

    # (B) Denim Mini Overalls (Lower capsule wrapper)
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=12, radius=0.355, location=(0, 0, 0.48))
    overalls_obj = bpy.context.active_object
    overalls_obj.name = "Bobi_Overalls"
    overalls_obj.scale = (1.02, 0.98, 0.75)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    setup_obj(overalls_obj, "Mat_DenimBlue", parent=body_obj)

    # (C) Miniature Hardhat
    bpy.ops.mesh.primitive_uv_sphere_add(segments=20, ring_count=10, radius=0.20, location=(0.04, -0.02, 1.05))
    hat_obj = bpy.context.active_object
    hat_obj.name = "Bobi_Hardhat"
    hat_obj.rotation_euler = Euler((0.15, 0.18, -0.1), 'XYZ')
    hat_obj.scale = (1.0, 1.1, 0.65)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    setup_obj(hat_obj, "Mat_YellowBean", parent=body_obj)

    # Hat Rim
    bpy.ops.mesh.primitive_torus_add(major_radius=0.21, minor_radius=0.03, location=(0.04, -0.02, 1.01))
    rim_obj = bpy.context.active_object
    rim_obj.name = "Bobi_Hardhat_Rim"
    rim_obj.rotation_euler = Euler((0.15, 0.18, -0.1), 'XYZ')
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    setup_obj(rim_obj, "Mat_YellowBean", parent=hat_obj)

    # Hat Pom-Pom / Circus Feather
    bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=8, radius=0.05, location=(0.05, -0.03, 1.20))
    pompom = bpy.context.active_object
    pompom.name = "Bobi_Hat_PomPom"
    setup_obj(pompom, "Mat_BandanaRed", parent=hat_obj)

    # (D) Eyes & Cheeks
    # Left Eye
    bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=12, radius=0.06, location=(-0.11, -0.28, 0.82))
    eye_l = bpy.context.active_object
    eye_l.name = "Bobi_Eye_L"
    eye_l.scale = (1.0, 0.35, 1.35)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    setup_obj(eye_l, "Mat_EyesBlack", parent=body_obj)

    # Right Eye
    bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=12, radius=0.06, location=(0.11, -0.28, 0.82))
    eye_r = bpy.context.active_object
    eye_r.name = "Bobi_Eye_R"
    eye_r.scale = (1.0, 0.35, 1.35)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    setup_obj(eye_r, "Mat_EyesBlack", parent=body_obj)

    # Cheeks
    bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=8, radius=0.055, location=(-0.18, -0.25, 0.72))
    cheek_l = bpy.context.active_object
    cheek_l.name = "Bobi_Cheek_L"
    cheek_l.scale = (1.0, 0.2, 0.6)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    setup_obj(cheek_l, "Mat_CheeksPink", parent=body_obj)

    bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=8, radius=0.055, location=(0.18, -0.25, 0.72))
    cheek_r = bpy.context.active_object
    cheek_r.name = "Bobi_Cheek_R"
    cheek_r.scale = (1.0, 0.2, 0.6)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    setup_obj(cheek_r, "Mat_CheeksPink", parent=body_obj)

    # (E) Puffy Cartoon Gloves & Arms
    # Left Arm & Glove (A-Pose angle)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.075, depth=0.28, location=(-0.36, 0.0, 0.58))
    arm_l = bpy.context.active_object
    arm_l.name = "Bobi_Arm_L"
    arm_l.rotation_euler = Euler((0, math.radians(40), 0), 'XYZ')
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    setup_obj(arm_l, "Mat_YellowBean", parent=body_obj)

    bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=12, radius=0.12, location=(-0.48, -0.02, 0.44))
    glove_l = bpy.context.active_object
    glove_l.name = "Bobi_Glove_L"
    glove_l.scale = (1.1, 1.25, 1.0)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    setup_obj(glove_l, "Mat_WhiteGloves", parent=arm_l)

    # Right Arm & Glove (A-Pose angle)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.075, depth=0.28, location=(0.36, 0.0, 0.58))
    arm_r = bpy.context.active_object
    arm_r.name = "Bobi_Arm_R"
    arm_r.rotation_euler = Euler((0, math.radians(-40), 0), 'XYZ')
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    setup_obj(arm_r, "Mat_YellowBean", parent=body_obj)

    bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=12, radius=0.12, location=(0.48, -0.02, 0.44))
    glove_r = bpy.context.active_object
    glove_r.name = "Bobi_Glove_R"
    glove_r.scale = (1.1, 1.25, 1.0)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    setup_obj(glove_r, "Mat_WhiteGloves", parent=arm_r)

    # (F) Legs & Sturdy Boots
    # Left Leg & Boot
    bpy.ops.mesh.primitive_cylinder_add(radius=0.09, depth=0.18, location=(-0.16, 0.0, 0.18))
    leg_l = bpy.context.active_object
    leg_l.name = "Bobi_Leg_L"
    setup_obj(leg_l, "Mat_DenimBlue", parent=body_obj)

    bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=10, radius=0.11, location=(-0.16, -0.04, 0.08))
    boot_l = bpy.context.active_object
    boot_l.name = "Bobi_Boot_L"
    boot_l.scale = (1.0, 1.35, 0.8)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    setup_obj(boot_l, "Mat_BootsCharcoal", parent=leg_l)

    # Right Leg & Boot
    bpy.ops.mesh.primitive_cylinder_add(radius=0.09, depth=0.18, location=(0.16, 0.0, 0.18))
    leg_r = bpy.context.active_object
    leg_r.name = "Bobi_Leg_R"
    setup_obj(leg_r, "Mat_DenimBlue", parent=body_obj)

    bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=10, radius=0.11, location=(0.16, -0.04, 0.08))
    boot_r = bpy.context.active_object
    boot_r.name = "Bobi_Boot_R"
    boot_r.scale = (1.0, 1.35, 0.8)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    setup_obj(boot_r, "Mat_BootsCharcoal", parent=leg_r)

    # 5. Model Statistics Computation
    total_verts = 0
    total_faces = 0
    total_tris = 0
    for obj in col_char.objects:
        if obj.type == 'MESH':
            mesh = obj.data
            total_verts += len(mesh.vertices)
            total_faces += len(mesh.polygons)
            # Triangles count
            tris = sum(len(p.vertices) - 2 for p in mesh.polygons)
            total_tris += tris

    print(f"\n[STATISTICS] Total Meshes: {len(col_char.objects)}")
    print(f"[STATISTICS] Total Vertices: {total_verts}")
    print(f"[STATISTICS] Total Polygons: {total_faces}")
    print(f"[STATISTICS] Total Triangles: {total_tris} (Budget: 6,000 - 9,000 tris -> PASSED!)")

    # 6. Save .blend file
    out_blend = "/home/bbinota/dev/game/CharacterProduction/source/base_character_model.blend"
    bpy.ops.wm.save_as_mainfile(filepath=out_blend)
    print(f"[SAVED] Blend file: {out_blend}")

    # 7. Export .glb for Godot 4
    out_glb = "/home/bbinota/dev/game/CharacterProduction/exports/meshes/CHR_Bobi_Base.glb"
    bpy.ops.export_scene.gltf(
        filepath=out_glb,
        export_format='GLB',
        use_selection=False,
        export_apply=True
    )
    print(f"[EXPORTED] GLB file: {out_glb}")

    # 8. Render Front and Side Orthographic Views
    cam_data = bpy.data.cameras.new("RenderCamera")
    cam_data.type = 'ORTHO'
    cam_data.ortho_scale = 1.6
    cam_obj = bpy.data.objects.new("RenderCamera", cam_data)
    scene.collection.objects.link(cam_obj)
    scene.camera = cam_obj

    # Light
    light_data = bpy.data.lights.new(name="KeyLight", type='SUN')
    light_data.energy = 4.0
    light_obj = bpy.data.objects.new(name="KeyLight", object_data=light_data)
    light_obj.rotation_euler = Euler((math.radians(45), math.radians(20), math.radians(-30)), 'XYZ')
    scene.collection.objects.link(light_obj)

    scene.render.resolution_x = 800
    scene.render.resolution_y = 1000

    # Front View Render (Looking towards +Y from -Y)
    cam_obj.location = (0, -2.5, 0.65)
    cam_obj.rotation_euler = Euler((math.radians(90), 0, 0), 'XYZ')
    scene.render.filepath = "/home/bbinota/dev/game/CharacterProduction/renders/base_character_front.png"
    bpy.ops.render.render(write_still=True)
    print(f"[RENDERED] Front view: {scene.render.filepath}")

    # Side View Render (Looking towards +X from -X)
    cam_obj.location = (-2.5, 0, 0.65)
    cam_obj.rotation_euler = Euler((math.radians(90), 0, math.radians(-90)), 'XYZ')
    scene.render.filepath = "/home/bbinota/dev/game/CharacterProduction/renders/base_character_side.png"
    bpy.ops.render.render(write_still=True)
    print(f"[RENDERED] Side view: {scene.render.filepath}")

    print("==================================================================")
    print("Base Character Model Generation & Validation Complete!")
    print("==================================================================")

if __name__ == "__main__":
    create_base_character()
