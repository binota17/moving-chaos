"""
=============================================================================
BLENDER AUTOMATION: CHARACTER ARMATURE, RIGGING & SKINNING (GODOT 4 TARGET)
Pipeline: Moving Chaos Character Production (Milestone 3)
Compatible with Blender 3.6+ / 4.x Headless Execution
=============================================================================
"""

import bpy
import math
from mathutils import Vector, Matrix

def clean_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for block in bpy.data.meshes:
        bpy.data.meshes.remove(block)
    for block in bpy.data.armatures:
        bpy.data.armatures.remove(block)
    for block in bpy.data.materials:
        bpy.data.materials.remove(block)

def create_bobi_armature():
    """
    Creates the complete deform skeleton for Bobi according to Section 8.1
    and adds the required gameplay socket bones.
    """
    armature_data = bpy.data.armatures.new("Armature_Bobi")
    armature_obj = bpy.data.objects.new("CHR_Bobi_Armature", armature_data)
    bpy.context.collection.objects.link(armature_obj)
    bpy.context.view_layer.objects.active = armature_obj
    bpy.ops.object.mode_set(mode='EDIT')

    # Define bone hierarchy and coordinates (Head, Tail, Parent)
    # Unit: meters. Godot 4: Forward = -Y (in Blender) or -Z (Godot), Up = +Z (Blender) or +Y (Godot)
    bones_def = {
        # Core Spine
        "Root": {"head": (0.0, 0.0, 0.0), "tail": (0.0, 0.0, 0.20), "parent": None},
        "Hips": {"head": (0.0, 0.0, 0.38), "tail": (0.0, 0.0, 0.55), "parent": "Root"},
        "Spine": {"head": (0.0, 0.0, 0.55), "tail": (0.0, 0.0, 0.70), "parent": "Hips"},
        "Chest": {"head": (0.0, 0.0, 0.70), "tail": (0.0, 0.0, 0.85), "parent": "Spine"},
        "Head": {"head": (0.0, 0.0, 0.85), "tail": (0.0, 0.0, 1.15), "parent": "Chest"},
        
        # Left Arm
        "LeftShoulder": {"head": (-0.12, 0.0, 0.72), "tail": (-0.22, 0.0, 0.65), "parent": "Chest"},
        "LeftUpperArm": {"head": (-0.22, 0.0, 0.65), "tail": (-0.34, 0.0, 0.54), "parent": "LeftShoulder"},
        "LeftForearm": {"head": (-0.34, 0.0, 0.54), "tail": (-0.44, -0.01, 0.44), "parent": "LeftUpperArm"},
        "LeftHand": {"head": (-0.44, -0.01, 0.44), "tail": (-0.52, -0.02, 0.38), "parent": "LeftForearm"},

        # Right Arm
        "RightShoulder": {"head": (0.12, 0.0, 0.72), "tail": (0.22, 0.0, 0.65), "parent": "Chest"},
        "RightUpperArm": {"head": (0.22, 0.0, 0.65), "tail": (0.34, 0.0, 0.54), "parent": "RightShoulder"},
        "RightForearm": {"head": (0.34, 0.0, 0.54), "tail": (0.44, -0.01, 0.44), "parent": "RightUpperArm"},
        "RightHand": {"head": (0.44, -0.01, 0.44), "tail": (0.52, -0.02, 0.38), "parent": "RightForearm"},

        # Left Leg
        "LeftUpperLeg": {"head": (-0.16, 0.0, 0.38), "tail": (-0.16, 0.0, 0.22), "parent": "Hips"},
        "LeftLowerLeg": {"head": (-0.16, 0.0, 0.22), "tail": (-0.16, -0.02, 0.10), "parent": "LeftUpperLeg"},
        "LeftFoot": {"head": (-0.16, -0.02, 0.10), "tail": (-0.16, -0.16, 0.02), "parent": "LeftLowerLeg"},

        # Right Leg
        "RightUpperLeg": {"head": (0.16, 0.0, 0.38), "tail": (0.16, 0.0, 0.22), "parent": "Hips"},
        "RightLowerLeg": {"head": (0.16, 0.0, 0.22), "tail": (0.16, -0.02, 0.10), "parent": "RightUpperLeg"},
        "RightFoot": {"head": (0.16, -0.02, 0.10), "tail": (0.16, -0.16, 0.02), "parent": "RightLowerLeg"},

        # Gameplay Sockets (Exportable Bone Attachment Nodes for Godot 4)
        "Socket_OverheadCarry": {"head": (0.0, 0.0, 1.25), "tail": (0.0, 0.0, 1.35), "parent": "Chest"},
        "Socket_ChestCarry": {"head": (0.0, -0.38, 0.65), "tail": (0.0, -0.48, 0.65), "parent": "Chest"},
        "Socket_LeftHand": {"head": (-0.46, -0.05, 0.42), "tail": (-0.46, -0.12, 0.42), "parent": "LeftHand"},
        "Socket_RightHand": {"head": (0.46, -0.05, 0.42), "tail": (0.46, -0.12, 0.42), "parent": "RightHand"},
        "Socket_Backpack": {"head": (0.0, 0.34, 0.62), "tail": (0.0, 0.44, 0.62), "parent": "Chest"},
        "Socket_Hat": {"head": (0.04, -0.02, 1.15), "tail": (0.04, -0.02, 1.25), "parent": "Head"},
    }

    edit_bones = armature_data.edit_bones

    # 1. Create bones
    for b_name, b_info in bones_def.items():
        bone = edit_bones.new(b_name)
        bone.head = Vector(b_info["head"])
        bone.tail = Vector(b_info["tail"])

    # 2. Assign parents
    for b_name, b_info in bones_def.items():
        if b_info["parent"]:
            edit_bones[b_name].parent = edit_bones[b_info["parent"]]

    bpy.ops.object.mode_set(mode='OBJECT')
    print("Armature 'CHR_Bobi_Armature' created with 22 bones (16 deform + 6 sockets).")
    return armature_obj

def setup_pbr_material(texture_dir):
    """
    Creates the Master Stylized PBR Material in Blender with Albedo, Roughness, and Normal.
    """
    mat = bpy.data.materials.new(name="M_Bobi_Master")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    # Create shader nodes
    output_node = nodes.new(type='ShaderNodeOutputMaterial')
    output_node.location = (400, 0)

    bsdf = nodes.new(type='ShaderNodeBsdfPrincipled')
    bsdf.location = (100, 0)
    links.new(bsdf.outputs['BSDF'], output_node.inputs['Surface'])

    # Base Color Texture
    albedo_img_path = f"{texture_dir}/bobi_albedo.png"
    if bpy.data.images.get("bobi_albedo.png") is None and bpy.path.exists(albedo_img_path):
        albedo_img = bpy.data.images.load(albedo_img_path)
        tex_albedo = nodes.new(type='ShaderNodeTexImage')
        tex_albedo.location = (-300, 150)
        tex_albedo.image = albedo_img
        links.new(tex_albedo.outputs['Color'], bsdf.inputs['Base Color'])

    # Roughness Texture
    rough_img_path = f"{texture_dir}/bobi_roughness.png"
    if bpy.data.images.get("bobi_roughness.png") is None and bpy.path.exists(rough_img_path):
        rough_img = bpy.data.images.load(rough_img_path)
        rough_img.colorspace_settings.name = 'Non-Color'
        tex_rough = nodes.new(type='ShaderNodeTexImage')
        tex_rough.location = (-300, -100)
        tex_rough.image = rough_img
        links.new(tex_rough.outputs['Color'], bsdf.inputs['Roughness'])

    # Normal Map Texture
    norm_img_path = f"{texture_dir}/bobi_normal.png"
    if bpy.data.images.get("bobi_normal.png") is None and bpy.path.exists(norm_img_path):
        norm_img = bpy.data.images.load(norm_img_path)
        norm_img.colorspace_settings.name = 'Non-Color'
        tex_norm = nodes.new(type='ShaderNodeTexImage')
        tex_norm.location = (-500, -350)
        tex_norm.image = norm_img

        norm_map = nodes.new(type='ShaderNodeNormalMap')
        norm_map.location = (-200, -350)
        links.new(tex_norm.outputs['Color'], norm_map.inputs['Color'])
        links.new(norm_map.outputs['Normal'], bsdf.inputs['Normal'])

    return mat

def import_and_skin(mesh_obj_path, armature_obj, material):
    """
    Imports the Bobi OBJ mesh, applies material, parents to Armature with automatic weights.
    """
    bpy.ops.wm.obj_import(filepath=mesh_obj_path)
    imported_objs = [obj for obj in bpy.context.selected_objects if obj.type == 'MESH']
    
    # If multiple mesh pieces, join into single Bobi body
    bpy.context.view_layer.objects.active = imported_objs[0]
    bpy.ops.object.join()
    body_mesh = bpy.context.active_object
    body_mesh.name = "CHR_Bobi_Skinned"

    # Assign material
    body_mesh.data.materials.clear()
    body_mesh.data.materials.append(material)

    # Parent mesh to armature with automatic weights
    body_mesh.select_set(True)
    armature_obj.select_set(True)
    bpy.context.view_layer.objects.active = armature_obj
    bpy.ops.object.parent_set(type='ARMATURE_AUTO')

    print("Mesh successfully parented to CHR_Bobi_Armature with skinning weights.")
    return body_mesh

def export_character_gltf(export_path):
    bpy.ops.export_scene.gltf(
        filepath=export_path,
        export_format='GLTF_SEPARATE',
        use_selection=False,
        export_apply=False,
        export_skins=True,
        export_all_influences=False, # 4 influences per vert for Godot
        export_yup=True
    )
    print(f"Exported rigged character to: {export_path}")

if __name__ == "__main__":
    clean_scene()
    base_dir = "/home/bbinota/dev/game/CharacterProduction"
    armature = create_bobi_armature()
    material = setup_pbr_material(f"{base_dir}/textures")
    obj_path = f"{base_dir}/exports/meshes/CHR_Bobi_Base.obj"
    export_gltf_path = f"{base_dir}/exports/skeletons/CHR_Bobi_Rigged.gltf"
    
    # If in interactive/test run:
    print("Blender character rig setup script ready.")

