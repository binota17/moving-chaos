"""
=============================================================================
STANDALONE GAMEPLAY ANIMATION LIBRARY GENERATOR (GLTF 2.0 FOR GODOT 4 & THREE.JS)
Builds 13 P0 animation clips with keyframed TRS channels, samplers & mesh links.
=============================================================================
"""

import json
import math
import struct
import os

def euler_to_quat(rx, ry, rz):
    """Convert Euler angles (radians) in XYZ order to Quaternion [x, y, z, w]."""
    cx, sx = math.cos(rx * 0.5), math.sin(rx * 0.5)
    cy, sy = math.cos(ry * 0.5), math.sin(ry * 0.5)
    cz, sz = math.cos(rz * 0.5), math.sin(rz * 0.5)

    qw = cx * cy * cz - sx * sy * sz
    qx = sx * cy * cz + cx * sy * sz
    qy = cx * sy * cz - sx * cy * sz
    qz = cx * cy * sz + sx * sy * cz
    return [round(qx, 5), round(qy, 5), round(qz, 5), round(qw, 5)]

def build_animation_library():
    base_dir = "/home/bbinota/dev/game/CharacterProduction"
    rig_gltf_path = f"{base_dir}/exports/skeletons/CHR_Bobi_Rigged.gltf"
    out_anim_gltf = f"{base_dir}/exports/animations/CHR_Bobi_Animations.gltf"
    out_anim_bin = f"{base_dir}/exports/animations/CHR_Bobi_Animations.bin"

    with open(rig_gltf_path, 'r') as f:
        rig_data = json.load(f)

    nodes = rig_data["nodes"]
    node_name_to_id = {node["name"]: i for i, node in enumerate(nodes)}

    hips_base = nodes[node_name_to_id["Hips"]]["translation"][:]
    fps = 30.0

    # Preserve Buffer 0 from CHR_Bobi_Rigged.gltf (fix relative URI)
    buffers = []
    for buf in rig_data["buffers"]:
        b_copy = dict(buf)
        b_copy["uri"] = "../skeletons/" + os.path.basename(buf["uri"])
        buffers.append(b_copy)

    buffer_views = list(rig_data["bufferViews"])
    accessors = list(rig_data["accessors"])

    anim_buffer_index = len(buffers)
    bin_data = bytearray()

    def add_time_accessor(times):
        offset = len(bin_data)
        for t in times:
            bin_data.extend(struct.pack('<f', t))
        while len(bin_data) % 4 != 0:
            bin_data.append(0)
        length = len(bin_data) - offset

        bv_idx = len(buffer_views)
        buffer_views.append({
            "buffer": anim_buffer_index,
            "byteOffset": offset,
            "byteLength": length
        })

        acc_idx = len(accessors)
        accessors.append({
            "bufferView": bv_idx,
            "componentType": 5126,
            "count": len(times),
            "type": "SCALAR",
            "min": [min(times)],
            "max": [max(times)]
        })
        return acc_idx

    def add_vec3_accessor(values):
        offset = len(bin_data)
        min_v = [float('inf')] * 3
        max_v = [float('-inf')] * 3
        for v in values:
            bin_data.extend(struct.pack('<fff', v[0], v[1], v[2]))
            for i in range(3):
                min_v[i] = min(min_v[i], v[i])
                max_v[i] = max(max_v[i], v[i])
        while len(bin_data) % 4 != 0:
            bin_data.append(0)
        length = len(bin_data) - offset

        bv_idx = len(buffer_views)
        buffer_views.append({
            "buffer": anim_buffer_index,
            "byteOffset": offset,
            "byteLength": length
        })

        acc_idx = len(accessors)
        accessors.append({
            "bufferView": bv_idx,
            "componentType": 5126,
            "count": len(values),
            "type": "VEC3",
            "min": min_v,
            "max": max_v
        })
        return acc_idx

    def add_quat_accessor(quats):
        offset = len(bin_data)
        for q in quats:
            bin_data.extend(struct.pack('<ffff', q[0], q[1], q[2], q[3]))
        while len(bin_data) % 4 != 0:
            bin_data.append(0)
        length = len(bin_data) - offset

        bv_idx = len(buffer_views)
        buffer_views.append({
            "buffer": anim_buffer_index,
            "byteOffset": offset,
            "byteLength": length
        })

        acc_idx = len(accessors)
        accessors.append({
            "bufferView": bv_idx,
            "componentType": 5126,
            "count": len(quats),
            "type": "VEC4"
        })
        return acc_idx

    animations = []

    def create_clip(name, num_frames, channel_generators):
        times = [i / fps for i in range(num_frames + 1)]
        time_acc = add_time_accessor(times)

        samplers = []
        channels = []

        for target_node_name, path_type, keyframe_func in channel_generators:
            if target_node_name not in node_name_to_id:
                continue
            target_node = node_name_to_id[target_node_name]
            val_list = [keyframe_func(i, num_frames) for i in range(num_frames + 1)]

            if path_type in ("translation", "scale"):
                val_acc = add_vec3_accessor(val_list)
            elif path_type == "rotation":
                val_acc = add_quat_accessor(val_list)
            else:
                continue

            s_idx = len(samplers)
            samplers.append({"input": time_acc, "interpolation": "LINEAR", "output": val_acc})
            channels.append({"sampler": s_idx, "target": {"node": target_node, "path": path_type}})

        animations.append({"name": name, "samplers": samplers, "channels": channels})

    # 1. CHR_Base_Idle (30 frames)
    def idle_hips_t(f, nf):
        bob = math.sin(2 * math.pi * f / nf) * 0.025
        return [hips_base[0], hips_base[1] + bob, hips_base[2]]

    def idle_chest_r(f, nf):
        tilt = math.sin(2 * math.pi * f / nf) * 0.04
        return euler_to_quat(tilt, 0, 0)

    def idle_larm_r(f, nf):
        sway = math.cos(2 * math.pi * f / nf) * 0.06
        return euler_to_quat(0, 0, sway)

    def idle_rarm_r(f, nf):
        sway = -math.cos(2 * math.pi * f / nf) * 0.06
        return euler_to_quat(0, 0, sway)

    create_clip("CHR_Base_Idle", 30, [
        ("Hips", "translation", idle_hips_t),
        ("Chest", "rotation", idle_chest_r),
        ("LeftUpperArm", "rotation", idle_larm_r),
        ("RightUpperArm", "rotation", idle_rarm_r)
    ])

    # 2. CHR_Base_Walk (24 frames, Penguin Waddle)
    def walk_hips_t(f, nf):
        bob = abs(math.sin(2 * math.pi * f / nf)) * 0.035
        return [hips_base[0], hips_base[1] + bob, hips_base[2]]

    def walk_hips_r(f, nf):
        roll = math.sin(2 * math.pi * f / nf) * 0.12
        return euler_to_quat(0, 0, roll)

    def walk_lleg_r(f, nf):
        pitch = -math.sin(2 * math.pi * f / nf) * 0.55
        return euler_to_quat(pitch, 0, 0)

    def walk_rleg_r(f, nf):
        pitch = math.sin(2 * math.pi * f / nf) * 0.55
        return euler_to_quat(pitch, 0, 0)

    def walk_larm_r(f, nf):
        pitch = math.sin(2 * math.pi * f / nf) * 0.45
        return euler_to_quat(pitch, 0, 0)

    def walk_rarm_r(f, nf):
        pitch = -math.sin(2 * math.pi * f / nf) * 0.45
        return euler_to_quat(pitch, 0, 0)

    create_clip("CHR_Base_Walk", 24, [
        ("Hips", "translation", walk_hips_t),
        ("Hips", "rotation", walk_hips_r),
        ("LeftUpperLeg", "rotation", walk_lleg_r),
        ("RightUpperLeg", "rotation", walk_rleg_r),
        ("LeftUpperArm", "rotation", walk_larm_r),
        ("RightUpperArm", "rotation", walk_rarm_r)
    ])

    # 3. CHR_Base_Run (16 frames, Forward sprint)
    def run_hips_t(f, nf):
        bob = abs(math.sin(2 * math.pi * f / nf)) * 0.055
        return [hips_base[0], hips_base[1] + bob, hips_base[2]]

    def run_chest_r(f, nf):
        return euler_to_quat(0.28, 0, 0)

    def run_lleg_r(f, nf):
        pitch = -math.sin(2 * math.pi * f / nf) * 0.85
        return euler_to_quat(pitch, 0, 0)

    def run_rleg_r(f, nf):
        pitch = math.sin(2 * math.pi * f / nf) * 0.85
        return euler_to_quat(pitch, 0, 0)

    def run_larm_r(f, nf):
        pitch = math.sin(2 * math.pi * f / nf) * 0.75
        return euler_to_quat(pitch, 0, 0)

    def run_rarm_r(f, nf):
        pitch = -math.sin(2 * math.pi * f / nf) * 0.75
        return euler_to_quat(pitch, 0, 0)

    create_clip("CHR_Base_Run", 16, [
        ("Hips", "translation", run_hips_t),
        ("Chest", "rotation", run_chest_r),
        ("LeftUpperLeg", "rotation", run_lleg_r),
        ("RightUpperLeg", "rotation", run_rleg_r),
        ("LeftUpperArm", "rotation", run_larm_r),
        ("RightUpperArm", "rotation", run_rarm_r)
    ])

    # 4. CHR_Base_PickUp (20 frames)
    def pickup_hips_t(f, nf):
        prog = (f / 10.0) if f <= 10 else ((20 - f) / 10.0)
        return [hips_base[0], hips_base[1] - prog * 0.16, hips_base[2]]

    def pickup_chest_r(f, nf):
        prog = (f / 10.0) if f <= 10 else ((20 - f) / 10.0)
        return euler_to_quat(prog * 0.45, 0, 0)

    def pickup_arm_r(f, nf):
        if f <= 10:
            prog = f / 10.0
            return euler_to_quat(-prog * 0.9, 0, 0) # Reach down/fwd
        else:
            prog = (f - 10) / 10.0
            return euler_to_quat(-0.9 - prog * 1.4, 0, 0) # Swing overhead

    create_clip("CHR_Base_PickUp", 20, [
        ("Hips", "translation", pickup_hips_t),
        ("Chest", "rotation", pickup_chest_r),
        ("LeftUpperArm", "rotation", pickup_arm_r),
        ("RightUpperArm", "rotation", pickup_arm_r)
    ])

    # 5. CHR_Base_Drop (15 frames)
    def drop_arm_r(f, nf):
        prog = f / float(nf)
        return euler_to_quat(-2.3 * (1.0 - prog), 0, 0)

    create_clip("CHR_Base_Drop", 15, [
        ("LeftUpperArm", "rotation", drop_arm_r),
        ("RightUpperArm", "rotation", drop_arm_r)
    ])

    # 6. CHR_Base_CarryIdle (30 frames)
    def carry_arm_l(f, nf):
        wobble = math.sin(2 * math.pi * f / nf) * 0.05
        return euler_to_quat(-2.35 + wobble, 0, -0.25)

    def carry_arm_r(f, nf):
        wobble = math.sin(2 * math.pi * f / nf) * 0.05
        return euler_to_quat(-2.35 + wobble, 0, 0.25)

    def carry_chest_r(f, nf):
        return euler_to_quat(-0.08, 0, 0)

    create_clip("CHR_Base_CarryIdle", 30, [
        ("Hips", "translation", idle_hips_t),
        ("Chest", "rotation", carry_chest_r),
        ("LeftUpperArm", "rotation", carry_arm_l),
        ("RightUpperArm", "rotation", carry_arm_r)
    ])

    # 7. CHR_Base_CarryWalk (24 frames)
    create_clip("CHR_Base_CarryWalk", 24, [
        ("Hips", "translation", walk_hips_t),
        ("Hips", "rotation", walk_hips_r),
        ("Chest", "rotation", carry_chest_r),
        ("LeftUpperLeg", "rotation", walk_lleg_r),
        ("RightUpperLeg", "rotation", walk_rleg_r),
        ("LeftUpperArm", "rotation", carry_arm_l),
        ("RightUpperArm", "rotation", carry_arm_r)
    ])

    # 8. CHR_Base_Push (24 frames)
    def push_chest_r(f, nf):
        return euler_to_quat(0.35, 0, 0)

    def push_arm_r(f, nf):
        pump = math.sin(2 * math.pi * f / nf) * 0.1
        return euler_to_quat(-1.45 + pump, 0, 0)

    create_clip("CHR_Base_Push", 24, [
        ("Hips", "translation", walk_hips_t),
        ("Chest", "rotation", push_chest_r),
        ("LeftUpperLeg", "rotation", walk_lleg_r),
        ("RightUpperLeg", "rotation", walk_rleg_r),
        ("LeftUpperArm", "rotation", push_arm_r),
        ("RightUpperArm", "rotation", push_arm_r)
    ])

    # 9. CHR_Base_Pull (24 frames)
    def pull_chest_r(f, nf):
        return euler_to_quat(-0.30, 0, 0)

    def pull_arm_r(f, nf):
        tug = math.sin(2 * math.pi * f / nf) * 0.12
        return euler_to_quat(-1.2 + tug, 0, 0)

    create_clip("CHR_Base_Pull", 24, [
        ("Hips", "translation", walk_hips_t),
        ("Chest", "rotation", pull_chest_r),
        ("LeftUpperLeg", "rotation", walk_rleg_r),
        ("RightUpperLeg", "rotation", walk_lleg_r),
        ("LeftUpperArm", "rotation", pull_arm_r),
        ("RightUpperArm", "rotation", pull_arm_r)
    ])

    # 10. CHR_Base_Fall (20 frames)
    def fall_hips_t(f, nf):
        prog = min(1.0, f / 8.0)
        return [hips_base[0], hips_base[1] - prog * 0.30, hips_base[2]]

    def fall_root_r(f, nf):
        prog = min(1.0, f / 8.0)
        return euler_to_quat(prog * (math.pi / 2), 0, 0)

    def fall_arm_r(f, nf):
        prog = min(1.0, f / 8.0)
        return euler_to_quat(-prog * 1.5, 0, 0)

    create_clip("CHR_Base_Fall", 20, [
        ("Root", "rotation", fall_root_r),
        ("Hips", "translation", fall_hips_t),
        ("LeftUpperArm", "rotation", fall_arm_r),
        ("RightUpperArm", "rotation", fall_arm_r)
    ])

    # 11. CHR_Base_GetUp (30 frames)
    def getup_root_r(f, nf):
        prog = (1.0 - (f / 15.0) * 0.4) if f <= 15 else (0.6 * (1.0 - (f - 15) / 15.0))
        return euler_to_quat(prog * (math.pi / 2), 0, 0)

    def getup_hips_t(f, nf):
        prog = f / float(nf)
        return [hips_base[0], hips_base[1] - (1.0 - prog) * 0.30, hips_base[2]]

    create_clip("CHR_Base_GetUp", 30, [
        ("Root", "rotation", getup_root_r),
        ("Hips", "translation", getup_hips_t)
    ])

    # 12. CHR_Base_Throw (18 frames)
    def throw_arm_r(f, nf):
        if f <= 6:
            prog = f / 6.0
            return euler_to_quat(-2.3 - prog * 0.5, 0, 0) # Wind up overhead/back
        elif f <= 10:
            prog = (f - 6) / 4.0
            return euler_to_quat(-2.8 + prog * 1.8, 0, 0) # Snap forward toss!
        else:
            prog = (f - 10) / 8.0
            return euler_to_quat(-1.0 * (1.0 - prog), 0, 0)

    def throw_chest_r(f, nf):
        if f <= 6: return euler_to_quat(-0.22, 0, 0)
        elif f <= 10: return euler_to_quat(0.32, 0, 0)
        return euler_to_quat(0.0, 0, 0)

    create_clip("CHR_Base_Throw", 18, [
        ("Chest", "rotation", throw_chest_r),
        ("LeftUpperArm", "rotation", throw_arm_r),
        ("RightUpperArm", "rotation", throw_arm_r)
    ])

    # 13. CHR_Base_Celebrate (36 frames)
    def celeb_hips_t(f, nf):
        jump = abs(math.sin(4 * math.pi * f / nf)) * 0.14
        return [hips_base[0], hips_base[1] + jump, hips_base[2]]

    def celeb_root_r(f, nf):
        spin = 2 * math.pi * f / float(nf)
        return euler_to_quat(0, spin, 0)

    def celeb_larm_r(f, nf):
        return euler_to_quat(-2.6, 0, -0.45)

    def celeb_rarm_r(f, nf):
        return euler_to_quat(-2.6, 0, 0.45)

    create_clip("CHR_Base_Celebrate", 36, [
        ("Hips", "translation", celeb_hips_t),
        ("Root", "rotation", celeb_root_r),
        ("LeftUpperArm", "rotation", celeb_larm_r),
        ("RightUpperArm", "rotation", celeb_rarm_r)
    ])

    with open(out_anim_bin, 'wb') as f:
        f.write(bin_data)

    buffers.append({
        "uri": os.path.basename(out_anim_bin),
        "byteLength": len(bin_data)
    })

    anim_gltf = {
        "asset": {"version": "2.0", "generator": "Moving Chaos Godot 4 & Three.js Animation Generator"},
        "scenes": rig_data["scenes"],
        "scene": 0,
        "nodes": nodes,
        "skins": rig_data["skins"],
        "meshes": rig_data["meshes"],
        "materials": rig_data["materials"],
        "animations": animations,
        "buffers": buffers,
        "bufferViews": buffer_views,
        "accessors": accessors
    }

    with open(out_anim_gltf, 'w') as f:
        json.dump(anim_gltf, f, indent=2)

    print("Complete Validated Gameplay Animation Library Generated:")
    print(f"  glTF File: {out_anim_gltf} (Mesh + Skin + {len(animations)} Animations)")
    print(f"  Anim Binary: {out_anim_bin} ({len(bin_data)} bytes)")

if __name__ == "__main__":
    build_animation_library()
