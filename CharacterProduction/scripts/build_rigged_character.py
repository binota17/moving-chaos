"""
=============================================================================
STANDALONE RIGGED CHARACTER GENERATOR (GLTF 2.0 MULTI-MATERIAL + SKELETON)
Engine Target: Godot 4.x & Three.js WebGL
Generates CHR_Bobi_Rigged.gltf with multi-material primitives, joint weights,
and gameplay sockets.
=============================================================================
"""

import json
import math
import struct
import os

MATERIAL_LIBRARY = {
    "Mat_YellowBean":    {"color": [1.0, 0.647, 0.008, 1.0], "roughness": 0.42, "metallic": 0.0},
    "Mat_DenimBlue":     {"color": [0.216, 0.259, 0.980, 1.0], "roughness": 0.72, "metallic": 0.0},
    "Mat_BandanaRed":    {"color": [1.0, 0.278, 0.341, 1.0],   "roughness": 0.55, "metallic": 0.0},
    "Mat_WhiteGloves":   {"color": [0.96, 0.96, 0.98, 1.0],    "roughness": 0.50, "metallic": 0.0},
    "Mat_BootsCharcoal": {"color": [0.24, 0.27, 0.33, 1.0],    "roughness": 0.65, "metallic": 0.0},
    "Mat_EyesBlack":     {"color": [0.03, 0.03, 0.04, 1.0],    "roughness": 0.10, "metallic": 0.0},
    "Mat_EyeWhite":      {"color": [1.0, 1.0, 1.0, 1.0],       "roughness": 0.08, "metallic": 0.0, "emissive": [0.35, 0.35, 0.35]},
    "Mat_CheeksPink":    {"color": [1.0, 0.420, 0.506, 1.0],   "roughness": 0.60, "metallic": 0.0},
    "Mat_ButtonGold":    {"color": [1.0, 0.84, 0.16, 1.0],     "roughness": 0.25, "metallic": 0.85}
}

def build_rigged_gltf():
    base_dir = "/home/bbinota/dev/game/CharacterProduction"
    obj_path = f"{base_dir}/exports/meshes/CHR_Bobi_Base.obj"
    out_gltf = f"{base_dir}/exports/skeletons/CHR_Bobi_Rigged.gltf"
    out_bin = f"{base_dir}/exports/skeletons/CHR_Bobi_Rigged.bin"

    # 1. Parse OBJ mesh grouped by material
    raw_positions = []
    raw_normals = []
    raw_uvs = []
    
    mat_triangles = {} # mat_name -> list of triangle indices
    current_mat = "Mat_YellowBean"

    vert_map = {}
    positions = []
    normals = []
    uvs = []

    with open(obj_path, 'r') as f:
        for line in f:
            tokens = line.strip().split()
            if not tokens:
                continue
            if tokens[0] == 'v':
                raw_positions.append([float(tokens[1]), float(tokens[2]), float(tokens[3])])
            elif tokens[0] == 'vn':
                raw_normals.append([float(tokens[1]), float(tokens[2]), float(tokens[3])])
            elif tokens[0] == 'vt':
                raw_uvs.append([float(tokens[1]), float(tokens[2])])
            elif tokens[0] == 'usemtl':
                current_mat = tokens[1]
                if current_mat not in mat_triangles:
                    mat_triangles[current_mat] = []
            elif tokens[0] == 'f':
                if current_mat not in mat_triangles:
                    mat_triangles[current_mat] = []
                face_indices = []
                for v_str in tokens[1:]:
                    parts = v_str.split('/')
                    p_idx = int(parts[0]) - 1
                    uv_idx = int(parts[1]) - 1 if len(parts) > 1 and parts[1] else 0
                    norm_idx = int(parts[2]) - 1 if len(parts) > 2 and parts[2] else 0

                    key = (p_idx, uv_idx, norm_idx)
                    if key not in vert_map:
                        vert_map[key] = len(positions)
                        positions.append(raw_positions[p_idx])
                        normals.append(raw_normals[norm_idx] if raw_normals else [0, 0, 1])
                        uvs.append(raw_uvs[uv_idx] if raw_uvs else [0, 0])
                    face_indices.append(vert_map[key])

                for i in range(1, len(face_indices) - 1):
                    mat_triangles[current_mat].extend([face_indices[0], face_indices[i], face_indices[i + 1]])

    # 2. Coordinate conversion (Blender Z-up, -Y fwd -> glTF/Three/Godot Y-up, +Z fwd)
    def to_gltf(x, y, z):
        return [round(x, 4), round(z, 4), round(-y, 4)]

    gltf_positions = [to_gltf(p[0], p[1], p[2]) for p in positions]
    gltf_normals = [to_gltf(n[0], n[1], n[2]) for n in normals]

    joint_names = [
        "Root",          # 0
        "Hips",          # 1
        "Spine",         # 2
        "Chest",         # 3
        "Head",          # 4
        "LeftShoulder",  # 5
        "LeftUpperArm",  # 6
        "LeftForearm",   # 7
        "LeftHand",      # 8
        "RightShoulder", # 9
        "RightUpperArm", # 10
        "RightForearm",  # 11
        "RightHand",     # 12
        "LeftUpperLeg",  # 13
        "LeftLowerLeg",  # 14
        "LeftFoot",      # 15
        "RightUpperLeg", # 16
        "RightLowerLeg", # 17
        "RightFoot"      # 18
    ]

    joint_world_pos = {
        "Root": to_gltf(0, 0, 0),
        "Hips": to_gltf(0, 0, 0.44),
        "Spine": to_gltf(0, 0, 0.58),
        "Chest": to_gltf(0, 0, 0.72),
        "Head": to_gltf(0, 0, 0.85),
        "LeftShoulder": to_gltf(-0.22, 0, 0.64),
        "LeftUpperArm": to_gltf(-0.28, 0, 0.58),
        "LeftForearm": to_gltf(-0.36, 0, 0.51),
        "LeftHand": to_gltf(-0.44, -0.02, 0.43),
        "RightShoulder": to_gltf(0.22, 0, 0.64),
        "RightUpperArm": to_gltf(0.28, 0, 0.58),
        "RightForearm": to_gltf(0.36, 0, 0.51),
        "RightHand": to_gltf(0.44, -0.02, 0.43),
        "LeftUpperLeg": to_gltf(-0.15, 0, 0.32),
        "LeftLowerLeg": to_gltf(-0.15, 0, 0.18),
        "LeftFoot": to_gltf(-0.15, -0.03, 0.08),
        "RightUpperLeg": to_gltf(0.15, 0, 0.32),
        "RightLowerLeg": to_gltf(0.15, 0, 0.18),
        "RightFoot": to_gltf(0.15, -0.03, 0.08)
    }

    # 3. Skin weights
    joints_0 = []
    weights_0 = []

    for p in positions:
        ox, oy, oz = p[0], p[1], p[2]
        w_dict = {}

        if oz > 0.78:
            w_dict[joint_names.index("Head")] = 1.0
        elif oz <= 0.33 and abs(ox) > 0.04:
            if ox < 0:
                if oz <= 0.13: w_dict[joint_names.index("LeftFoot")] = 1.0
                elif oz <= 0.24: w_dict[joint_names.index("LeftLowerLeg")] = 1.0
                else:
                    w_dict[joint_names.index("LeftUpperLeg")] = 0.85
                    w_dict[joint_names.index("Hips")] = 0.15
            else:
                if oz <= 0.13: w_dict[joint_names.index("RightFoot")] = 1.0
                elif oz <= 0.24: w_dict[joint_names.index("RightLowerLeg")] = 1.0
                else:
                    w_dict[joint_names.index("RightUpperLeg")] = 0.85
                    w_dict[joint_names.index("Hips")] = 0.15
        elif abs(ox) > 0.24 and oz < 0.70 and oz > 0.28:
            if ox < 0:
                if ox <= -0.39: w_dict[joint_names.index("LeftHand")] = 1.0
                elif ox <= -0.32:
                    w_dict[joint_names.index("LeftForearm")] = 0.75
                    w_dict[joint_names.index("LeftHand")] = 0.25
                else:
                    w_dict[joint_names.index("LeftUpperArm")] = 0.75
                    w_dict[joint_names.index("LeftShoulder")] = 0.25
            else:
                if ox >= 0.39: w_dict[joint_names.index("RightHand")] = 1.0
                elif ox >= 0.32:
                    w_dict[joint_names.index("RightForearm")] = 0.75
                    w_dict[joint_names.index("RightHand")] = 0.25
                else:
                    w_dict[joint_names.index("RightUpperArm")] = 0.75
                    w_dict[joint_names.index("RightShoulder")] = 0.25
        else:
            if oz < 0.48:
                blend = max(0.0, min(1.0, (oz - 0.33) / 0.15))
                w_dict[joint_names.index("Hips")] = 1.0 - blend
                w_dict[joint_names.index("Spine")] = blend
            elif oz < 0.65:
                blend = (oz - 0.48) / 0.17
                w_dict[joint_names.index("Spine")] = 1.0 - blend
                w_dict[joint_names.index("Chest")] = blend
            else:
                blend = (oz - 0.65) / 0.13
                w_dict[joint_names.index("Chest")] = 1.0 - blend
                w_dict[joint_names.index("Head")] = blend

        sorted_w = sorted(w_dict.items(), key=lambda item: item[1], reverse=True)[:4]
        total_w = sum(w for j, w in sorted_w) if sorted_w else 1.0
        j_vec = [0, 0, 0, 0]
        w_vec = [0.0, 0.0, 0.0, 0.0]
        for k, (j, w) in enumerate(sorted_w):
            j_vec[k] = j
            w_vec[k] = w / total_w
        joints_0.append(j_vec)
        weights_0.append(w_vec)

    # 4. Pack Binary Buffer
    bin_data = bytearray()
    buffer_views = []
    accessors = []

    # Vertex Attributes first: Positions (0), Normals (1), UVs (2), Joints (3), Weights (4), IBM (5)
    # Positions
    pos_offset = len(bin_data)
    min_pos = [float('inf')] * 3
    max_pos = [float('-inf')] * 3
    for p in gltf_positions:
        bin_data.extend(struct.pack('<fff', p[0], p[1], p[2]))
        for i in range(3):
            if p[i] < min_pos[i]: min_pos[i] = p[i]
            if p[i] > max_pos[i]: max_pos[i] = p[i]
    buffer_views.append({"buffer": 0, "byteOffset": pos_offset, "byteLength": len(bin_data) - pos_offset, "target": 34962})
    accessors.append({"bufferView": 0, "componentType": 5126, "count": len(gltf_positions), "type": "VEC3", "max": max_pos, "min": min_pos})

    # Normals
    norm_offset = len(bin_data)
    for n in gltf_normals:
        bin_data.extend(struct.pack('<fff', n[0], n[1], n[2]))
    buffer_views.append({"buffer": 0, "byteOffset": norm_offset, "byteLength": len(bin_data) - norm_offset, "target": 34962})
    accessors.append({"bufferView": 1, "componentType": 5126, "count": len(gltf_normals), "type": "VEC3"})

    # UVs
    uv_offset = len(bin_data)
    for uv in uvs:
        bin_data.extend(struct.pack('<ff', uv[0], uv[1]))
    buffer_views.append({"buffer": 0, "byteOffset": uv_offset, "byteLength": len(bin_data) - uv_offset, "target": 34962})
    accessors.append({"bufferView": 2, "componentType": 5126, "count": len(uvs), "type": "VEC2"})

    # Joints
    joint_offset = len(bin_data)
    for j in joints_0:
        bin_data.extend(struct.pack('<HHHH', j[0], j[1], j[2], j[3]))
    buffer_views.append({"buffer": 0, "byteOffset": joint_offset, "byteLength": len(bin_data) - joint_offset, "target": 34962})
    accessors.append({"bufferView": 3, "componentType": 5123, "count": len(joints_0), "type": "VEC4"})

    # Weights
    weight_offset = len(bin_data)
    for w in weights_0:
        bin_data.extend(struct.pack('<ffff', w[0], w[1], w[2], w[3]))
    buffer_views.append({"buffer": 0, "byteOffset": weight_offset, "byteLength": len(bin_data) - weight_offset, "target": 34962})
    accessors.append({"bufferView": 4, "componentType": 5126, "count": len(weights_0), "type": "VEC4"})

    # IBM
    ibm_offset = len(bin_data)
    for j_name in joint_names:
        wx, wy, wz = joint_world_pos[j_name]
        ibm = [1.0, 0.0, 0.0, 0.0,  0.0, 1.0, 0.0, 0.0,  0.0, 0.0, 1.0, 0.0,  -wx, -wy, -wz, 1.0]
        for val in ibm:
            bin_data.extend(struct.pack('<f', val))
    buffer_views.append({"buffer": 0, "byteOffset": ibm_offset, "byteLength": len(bin_data) - ibm_offset})
    accessors.append({"bufferView": 5, "componentType": 5126, "count": len(joint_names), "type": "MAT4"})

    # Build Primitives and Materials
    gltf_materials = []
    primitives = []
    total_tris = 0

    for mat_name, tri_indices in mat_triangles.items():
        if not tri_indices:
            continue
        mat_idx = len(gltf_materials)
        mdef = MATERIAL_LIBRARY.get(mat_name, {"color": [0.8, 0.8, 0.8, 1.0], "roughness": 0.5, "metallic": 0.0})
        mat_json = {
            "name": mat_name,
            "pbrMetallicRoughness": {
                "baseColorFactor": mdef["color"],
                "roughnessFactor": mdef["roughness"],
                "metallicFactor": mdef["metallic"]
            }
        }
        if "emissive" in mdef:
            mat_json["emissiveFactor"] = mdef["emissive"]
        gltf_materials.append(mat_json)

        idx_offset = len(bin_data)
        for idx in tri_indices:
            bin_data.extend(struct.pack('<H', idx))
        while len(bin_data) % 4 != 0:
            bin_data.append(0)
        idx_length = len(bin_data) - idx_offset

        bv_idx = len(buffer_views)
        buffer_views.append({"buffer": 0, "byteOffset": idx_offset, "byteLength": idx_length, "target": 34963})

        acc_idx = len(accessors)
        accessors.append({"bufferView": bv_idx, "componentType": 5123, "count": len(tri_indices), "type": "SCALAR"})

        primitives.append({
            "attributes": {
                "POSITION": 0,
                "NORMAL": 1,
                "TEXCOORD_0": 2,
                "JOINTS_0": 3,
                "WEIGHTS_0": 4
            },
            "indices": acc_idx,
            "material": mat_idx
        })
        total_tris += len(tri_indices) // 3

    with open(out_bin, 'wb') as f:
        f.write(bin_data)

    bin_filename = os.path.basename(out_bin)

    # 5. Build Node Hierarchy
    N_MESH_NODE = 1
    joint_to_node = {}
    current_node = 2
    for j_name in joint_names:
        joint_to_node[j_name] = current_node
        current_node += 1

    socket_names = [
        "Socket_OverheadCarry",
        "Socket_ChestCarry",
        "Socket_LeftHand",
        "Socket_RightHand",
        "Socket_Backpack",
        "Socket_Hat"
    ]
    socket_to_node = {}
    for s_name in socket_names:
        socket_to_node[s_name] = current_node
        current_node += 1

    nodes = []
    nodes.append({"name": "CHR_Bobi", "children": [N_MESH_NODE, joint_to_node["Root"]]})
    nodes.append({"name": "CHR_Bobi_SkinnedMesh", "mesh": 0, "skin": 0})

    bone_children = {
        "Root": ["Hips"],
        "Hips": ["Spine", "LeftUpperLeg", "RightUpperLeg"],
        "Spine": ["Chest"],
        "Chest": ["Head", "LeftShoulder", "RightShoulder", "Socket_OverheadCarry", "Socket_ChestCarry", "Socket_Backpack"],
        "Head": ["Socket_Hat"],
        "LeftShoulder": ["LeftUpperArm"],
        "LeftUpperArm": ["LeftForearm"],
        "LeftForearm": ["LeftHand"],
        "LeftHand": ["Socket_LeftHand"],
        "RightShoulder": ["RightUpperArm"],
        "RightUpperArm": ["RightForearm"],
        "RightForearm": ["RightHand"],
        "RightHand": ["Socket_RightHand"],
        "LeftUpperLeg": ["LeftLowerLeg"],
        "LeftLowerLeg": ["LeftFoot"],
        "LeftFoot": [],
        "RightUpperLeg": ["RightLowerLeg"],
        "RightLowerLeg": ["RightFoot"],
        "RightFoot": []
    }

    parent_map = {
        "Root": None, "Hips": "Root", "Spine": "Hips", "Chest": "Spine", "Head": "Chest",
        "LeftShoulder": "Chest", "LeftUpperArm": "LeftShoulder", "LeftForearm": "LeftUpperArm", "LeftHand": "LeftForearm",
        "RightShoulder": "Chest", "RightUpperArm": "RightShoulder", "RightForearm": "RightUpperArm", "RightHand": "RightForearm",
        "LeftUpperLeg": "Hips", "LeftLowerLeg": "LeftUpperLeg", "LeftFoot": "LeftLowerLeg",
        "RightUpperLeg": "Hips", "RightLowerLeg": "RightUpperLeg", "RightFoot": "RightLowerLeg"
    }

    for j_name in joint_names:
        p_name = parent_map[j_name]
        pos = joint_world_pos[j_name]
        if p_name is not None:
            ppos = joint_world_pos[p_name]
            rel_trans = [round(pos[0] - ppos[0], 4), round(pos[1] - ppos[1], 4), round(pos[2] - ppos[2], 4)]
        else:
            rel_trans = pos

        ch_nodes = [joint_to_node[ch] if ch in joint_to_node else socket_to_node[ch] for ch in bone_children[j_name]]
        node_def = {"name": j_name, "translation": rel_trans}
        if ch_nodes:
            node_def["children"] = ch_nodes
        nodes.append(node_def)

    socket_defs = {
        "Socket_OverheadCarry": [0.0, 0.56, 0.0],
        "Socket_ChestCarry": [0.0, -0.08, 0.38],
        "Socket_LeftHand": [0.0, -0.02, 0.05],
        "Socket_RightHand": [0.0, -0.02, 0.05],
        "Socket_Backpack": [0.0, -0.10, -0.34],
        "Socket_Hat": [0.03, 0.28, 0.01]
    }
    for s_name in socket_names:
        nodes.append({"name": s_name, "translation": socket_defs[s_name]})

    gltf = {
        "asset": {"version": "2.0", "generator": "Moving Chaos Stylized Multi-Material Rig Generator"},
        "scenes": [{"nodes": [0]}],
        "scene": 0,
        "nodes": nodes,
        "skins": [{"inverseBindMatrices": 5, "joints": [joint_to_node[j] for j in joint_names], "skeleton": joint_to_node["Root"]}],
        "meshes": [{"name": "CHR_Bobi_Mesh", "primitives": primitives}],
        "materials": gltf_materials,
        "buffers": [{"uri": bin_filename, "byteLength": len(bin_data)}],
        "bufferViews": buffer_views,
        "accessors": accessors
    }

    with open(out_gltf, 'w') as f:
        json.dump(gltf, f, indent=2)

    print("Multi-Material Rigged glTF Generation Complete:")
    print(f"  glTF File: {out_gltf}")
    print(f"  Total Vertices Skinned: {len(positions)}")
    print(f"  Total Triangles: {total_tris}")
    print(f"  Materials ({len(gltf_materials)}): {[m['name'] for m in gltf_materials]}")

if __name__ == "__main__":
    build_rigged_gltf()
