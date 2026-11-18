class_name CharacterController extends CharacterBody3D

## Moving Chaos - Bobi Character Controller
## Supports Continuous 360-degree Isometric Movement and LAN Co-op Multiplayer

@export_group("Locomotion")
@export var walk_speed: float = 3.5 # m/s
@export var run_speed: float = 6.2 # m/s
@export var acceleration: float = 24.0 # m/s^2
@export var friction: float = 18.0 # m/s^2
@export var rotation_speed: float = 14.0 # rad/s

@export_group("Network LAN")
@export var player_id: int = 1

# Node References
@onready var anim_tree: AnimationTree = $AnimationTree
@onready var anim_state_machine: AnimationNodeStateMachinePlayback = $AnimationTree["parameters/playback"] if has_node("AnimationTree") else null
@onready var carry_handler: CarryInteractionHandler = $CarryInteractionHandler
@onready var visual_mesh: Node3D = $CHR_Bobi_Model

var current_target_speed: float = 0.0
var is_running: bool = false
var is_stunned: bool = false

func _ready() -> void:
    # Set multiplayer authority for LAN player control
    set_multiplayer_authority(player_id)
    if anim_tree:
        anim_tree.active = true

func _physics_process(delta: float) -> void:
    # Apply gravity
    if not is_on_floor():
        velocity.y -= ProjectSettings.get_setting("physics/3d/default_gravity") * delta

    # Only process local player input
    if is_multiplayer_authority() and not is_stunned:
        handle_locomotion(delta)
    else:
        # Remote players: damp velocity and apply movement
        velocity.x = move_toward(velocity.x, 0.0, friction * delta)
        velocity.z = move_toward(velocity.z, 0.0, friction * delta)
        move_and_slide()

    update_animation_tree()

func handle_locomotion(delta: float) -> void:
    # 1. Read Raw Input (WASD / Left Stick)
    var input_dir: Vector2 = Input.get_vector("move_left", "move_right", "move_forward", "move_backward")
    
    # 2. Transform into 2.5D Isometric Space (45-degree isometric projection)
    # Camera is angled at ~35 deg pitch and 45 deg yaw
    var iso_x = (input_dir.x + input_dir.y) * 0.7071
    var iso_z = (input_dir.y - input_dir.x) * 0.7071
    var move_direction = Vector3(iso_x, 0.0, iso_z).normalized()

    # 3. Determine Speed
    is_running = Input.is_action_pressed("move_run") if InputMap.has_action("move_run") else input_dir.length() > 0.85
    var max_speed = run_speed if is_running else walk_speed

    # Heavy object penalty when carrying
    if carry_handler and carry_handler.is_carrying:
        max_speed *= 0.75 # 25% slower when carrying heavy objects

    # 4. Accelerate / Decelerate
    if move_direction.length_squared() > 0.01:
        velocity.x = move_toward(velocity.x, move_direction.x * max_speed, acceleration * delta)
        velocity.z = move_toward(velocity.z, move_direction.z * max_speed, acceleration * delta)

        # 5. Smooth 360-Degree Continuous Facing Rotation
        var target_basis = Basis.looking_at(move_direction, Vector3.UP)
        visual_mesh.basis = visual_mesh.basis.slerp(target_basis, rotation_speed * delta)
    else:
        velocity.x = move_toward(velocity.x, 0.0, friction * delta)
        velocity.z = move_toward(velocity.z, 0.0, friction * delta)

    move_and_slide()

func update_animation_tree() -> void:
    if not anim_tree:
        return

    var horizontal_speed = Vector2(velocity.x, velocity.z).length()

    # Drive Locomotion Blend
    anim_tree.set("parameters/Locomotion/blend_position", horizontal_speed / run_speed)

    # State Machine Transitions
    if anim_state_machine:
        if is_stunned:
            anim_state_machine.travel("CHR_Base_Fall")
        elif carry_handler and carry_handler.is_carrying:
            if horizontal_speed > 0.2:
                anim_state_machine.travel("CHR_Base_CarryWalk")
            else:
                anim_state_machine.travel("CHR_Base_CarryIdle")
        else:
            if horizontal_speed > 0.2:
                anim_state_machine.travel("Locomotion")
            else:
                anim_state_machine.travel("CHR_Base_Idle")

@rpc("call_local", "reliable")
func trigger_stun(duration: float = 2.0) -> void:
    is_stunned = true
    velocity = Vector3.ZERO
    if carry_handler and carry_handler.is_carrying:
        carry_handler.drop_object()

    await get_tree().create_timer(duration).timeout
    if anim_state_machine:
        anim_state_machine.travel("CHR_Base_GetUp")
    await get_tree().create_timer(1.0).timeout
    is_stunned = false

