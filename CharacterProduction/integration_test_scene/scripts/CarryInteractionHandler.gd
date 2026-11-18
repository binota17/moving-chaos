class_name CarryInteractionHandler extends Node3D

## Moving Chaos - Object Pickup, Overhead Carry & Throwing System
## Handles BoneAttachment3D binding and LAN RPC synchronization

signal object_picked_up(object: RigidBody3D)
signal object_dropped(object: RigidBody3D)
signal object_thrown(object: RigidBody3D, impulse: Vector3)

@export var pickup_range: float = 1.3 # meters
@export var throw_force: float = 14.0 # impulse force for Super Yeet
@export var socket_overhead_path: NodePath
@export var socket_chest_path: NodePath

@onready var character: CharacterController = get_parent() as CharacterController
@onready var overhead_socket: Node3D = get_node_or_null(socket_overhead_path)
@onready var chest_socket: Node3D = get_node_or_null(socket_chest_path)
@onready var pickup_raycast: RayCast3D = $PickupRayCast

var carried_object: RigidBody3D = null
var is_carrying: bool = false
var pending_pickup_target: RigidBody3D = null

func _unhandled_input(event: InputEvent) -> void:
    if not character or not character.is_multiplayer_authority():
        return

    if event.is_action_pressed("interact_pickup"):
        if is_carrying:
            request_drop()
        else:
            request_pickup()
    elif event.is_action_pressed("action_throw"):
        if is_carrying:
            request_throw()

func request_pickup() -> void:
    if not pickup_raycast.is_colliding():
        return

    var collider = pickup_raycast.get_collider()
    if collider is RigidBody3D and collider.is_in_group("Carriable"):
        pending_pickup_target = collider
        # Play PickUp Animation
        if character.anim_state_machine:
            character.anim_state_machine.travel("CHR_Base_PickUp")

func request_drop() -> void:
    if not is_carrying or not carried_object:
        return
    if character.anim_state_machine:
        character.anim_state_machine.travel("CHR_Base_Drop")

func request_throw() -> void:
    if not is_carrying or not carried_object:
        return
    if character.anim_state_machine:
        character.anim_state_machine.travel("CHR_Base_Throw")

# Called by AnimationPlayer Animation Events (GripContact)
func on_anim_event_grip_contact() -> void:
    if pending_pickup_target and is_instance_valid(pending_pickup_target):
        var obj_path = pending_pickup_target.get_path()
        rpc("sync_pickup_lan", obj_path)
        pending_pickup_target = null

# Called by AnimationPlayer Animation Events (ObjectRelease)
func on_anim_event_object_release() -> void:
    if is_carrying and carried_object:
        var forward_dir = -character.visual_mesh.global_transform.basis.z
        rpc("sync_throw_lan", forward_dir * throw_force)

@rpc("call_local", "reliable")
func sync_pickup_lan(object_path: NodePath) -> void:
    var target = get_node_or_null(object_path) as RigidBody3D
    if not target:
        return

    carried_object = target
    is_carrying = true

    # Temporarily disable physics simulation while carried
    carried_object.freeze = true
    carried_object.collision_layer = 0 # Prevent colliding with player body
    
    # Reparent to Socket_OverheadCarry
    var target_socket = overhead_socket if overhead_socket else self
    carried_object.reparent(target_socket)
    carried_object.transform = Transform3D.IDENTITY

    emit_signal("object_picked_up", carried_object)

@rpc("call_local", "reliable")
func sync_drop_lan() -> void:
    if not carried_object:
        return

    var obj = carried_object
    is_carrying = false
    carried_object = null

    # Reparent back to Level root
    obj.reparent(get_tree().current_scene)
    obj.collision_layer = 1
    obj.freeze = false

    emit_signal("object_dropped", obj)

@rpc("call_local", "reliable")
func sync_throw_lan(impulse: Vector3) -> void:
    if not carried_object:
        return

    var obj = carried_object
    is_carrying = false
    carried_object = null

    obj.reparent(get_tree().current_scene)
    obj.collision_layer = 1
    obj.freeze = false
    obj.apply_central_impulse(impulse + Vector3(0, 3.5, 0)) # Slight upward arc

    emit_signal("object_thrown", obj, impulse)

