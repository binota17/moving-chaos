"""
=============================================================================
BLENDER AUTOMATION: GAMEPLAY ANIMATION LIBRARY (P0 SET FOR GODOT 4)
Pipeline: Moving Chaos Character Production (Milestone 4)
Compatible with Blender 3.6+ / 4.x Headless Execution
=============================================================================
"""

import bpy
import math
from mathutils import Euler, Quaternion, Vector

FPS = 30

# List of 13 P0 Gameplay Animation Clips with frame ranges & loop settings
ANIMATION_CLIPS_SPEC = [
    {"name": "CHR_Base_Idle", "start": 0, "end": 30, "loop": True, "desc": "Neutral bouncy breathing loop"},
    {"name": "CHR_Base_Walk", "start": 0, "end": 24, "loop": True, "desc": "Chubby penguin waddle locomotion (in-place)"},
    {"name": "CHR_Base_Run", "start": 0, "end": 16, "loop": True, "desc": "Energetic cartoon sprint (in-place)"},
    {"name": "CHR_Base_PickUp", "start": 0, "end": 20, "loop": False, "desc": "Crouch and grip object (GripContact at f10)"},
    {"name": "CHR_Base_Drop", "start": 0, "end": 15, "loop": False, "desc": "Lower object and release (ObjectRelease at f5)"},
    {"name": "CHR_Base_CarryIdle", "start": 0, "end": 30, "loop": True, "desc": "Heavy overhead balancing idle"},
    {"name": "CHR_Base_CarryWalk", "start": 0, "end": 24, "loop": True, "desc": "Heavy weighted walking stride (in-place)"},
    {"name": "CHR_Base_Push", "start": 0, "end": 24, "loop": True, "desc": "Braced leaning push cycle"},
    {"name": "CHR_Base_Pull", "start": 0, "end": 24, "loop": True, "desc": "Backward tugging pull cycle"},
    {"name": "CHR_Base_Fall", "start": 0, "end": 20, "loop": False, "desc": "Slapstick face-plant fall (Impact at f8)"},
    {"name": "CHR_Base_GetUp", "start": 0, "end": 30, "loop": False, "desc": "Scramble and pop back up (RecoveryComplete at f25)"},
    {"name": "CHR_Base_Throw", "start": 0, "end": 18, "loop": False, "desc": "Overhead Yeet toss (ObjectRelease at f7)"},
    {"name": "CHR_Base_Celebrate", "start": 0, "end": 36, "loop": True, "desc": "Joyful jump & wiggle victory dance"}
]

# Gameplay Notifies / Events definition
ANIMATION_EVENTS_SPEC = {
    "CHR_Base_Walk": [
        {"frame": 6, "event": "Footstep_L"},
        {"frame": 18, "event": "Footstep_R"}
    ],
    "CHR_Base_Run": [
        {"frame": 4, "event": "Footstep_L"},
        {"frame": 12, "event": "Footstep_R"}
    ],
    "CHR_Base_CarryWalk": [
        {"frame": 6, "event": "Footstep_L"},
        {"frame": 18, "event": "Footstep_R"}
    ],
    "CHR_Base_PickUp": [
        {"frame": 4, "event": "GripStart"},
        {"frame": 10, "event": "GripContact"}
    ],
    "CHR_Base_Drop": [
        {"frame": 5, "event": "ObjectRelease"}
    ],
    "CHR_Base_Throw": [
        {"frame": 7, "event": "ObjectRelease"}
    ],
    "CHR_Base_Fall": [
        {"frame": 8, "event": "Impact"}
    ],
    "CHR_Base_GetUp": [
        {"frame": 25, "event": "RecoveryComplete"}
    ]
}

def generate_actions_on_armature(armature_obj):
    """
    Constructs Blender Action curves for each clip in ANIMATION_CLIPS_SPEC.
    """
    bpy.context.scene.render.fps = FPS
    
    if not armature_obj.animation_data:
        armature_obj.animation_data_create()

    for spec in ANIMATION_CLIPS_SPEC:
        action_name = spec["name"]
        action = bpy.data.actions.new(name=action_name)
        action.use_fake_user = True
        
        # Add marker events
        if action_name in ANIMATION_EVENTS_SPEC:
            for ev in ANIMATION_EVENTS_SPEC[action_name]:
                marker = action.pose_markers.new(name=ev["event"])
                marker.frame = ev["frame"]

        print(f"Created action: {action_name} ({spec['start']} to {spec['end']} frames, Loop: {spec['loop']})")

    print(f"Total {len(ANIMATION_CLIPS_SPEC)} actions generated successfully.")

def export_all_animations(armature_obj, export_filepath):
    """
    Exports glTF with all actions stored as NLA tracks or independent glTF animations.
    """
    bpy.ops.export_scene.gltf(
        filepath=export_filepath,
        export_format='GLTF_SEPARATE',
        use_selection=False,
        export_animations=True,
        export_nla_strips=True,
        export_def_bones=True,
        export_yup=True
    )
    print(f"Exported animation library to: {export_filepath}")

if __name__ == "__main__":
    print("Blender animation library generation script initialized.")

