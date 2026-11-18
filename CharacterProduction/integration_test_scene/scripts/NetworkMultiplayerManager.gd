class_name NetworkMultiplayerManager extends Node

## Moving Chaos - LAN Multiplayer & Co-op Lobby Manager
## Uses Godot 4 ENetMultiplayerPeer for zero-latency local network play

const DEFAULT_PORT: int = 7777
const MAX_PLAYERS: int = 8

@export var player_scene: PackedScene
@export var spawn_points: Array[Marker3D] = []

var peer: ENetMultiplayerPeer

signal player_connected(peer_id: int)
signal player_disconnected(peer_id: int)

func host_lan_game(port: int = DEFAULT_PORT) -> Error:
    peer = ENetMultiplayerPeer.new()
    var err = peer.create_server(port, MAX_PLAYERS)
    if err != OK:
        push_error("Failed to host LAN server on port %d: %s" % [port, error_string(err)])
        return err

    multiplayer.multiplayer_peer = peer
    multiplayer.peer_connected.connect(_on_peer_connected)
    multiplayer.peer_disconnected.connect(_on_peer_disconnected)

    print("LAN Server hosted on port %d. Waiting for players (Max %d)..." % [port, MAX_PLAYERS])
    # Spawn host player (id 1)
    spawn_player(1)
    return OK

func join_lan_game(address: String = "127.0.0.1", port: int = DEFAULT_PORT) -> Error:
    peer = ENetMultiplayerPeer.new()
    var err = peer.create_client(address, port)
    if err != OK:
        push_error("Failed to connect to LAN host %s:%d" % [address, port])
        return err

    multiplayer.multiplayer_peer = peer
    print("Connecting to LAN host at %s:%d..." % [address, port])
    return OK

func _on_peer_connected(id: int) -> void:
    print("Player %d joined the LAN game!" % id)
    if multiplayer.is_server():
        spawn_player(id)
    emit_signal("player_connected", id)

func _on_peer_disconnected(id: int) -> void:
    print("Player %d left the LAN game." % id)
    var player_node = get_tree().current_scene.get_node_or_null("Player_%d" % id)
    if player_node:
        player_node.queue_free()
    emit_signal("player_disconnected", id)

func spawn_player(id: int) -> void:
    if not player_scene:
        return

    var player_inst = player_scene.instantiate() as CharacterController
    player_inst.name = "Player_%d" % id
    player_inst.player_id = id

    # Determine spawn position
    var spawn_idx = (id - 1) % max(1, spawn_points.size())
    if spawn_points.size() > spawn_idx and spawn_points[spawn_idx]:
        player_inst.global_position = spawn_points[spawn_idx].global_position

    get_tree().current_scene.add_child(player_inst)
    print("Spawned Bobi instance for Player %d at %s" % [id, player_inst.global_position])

