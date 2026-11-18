"""
=============================================================================
MODULAR CHARACTER SYSTEM & VARIANTS GENERATOR (GODOT 4 TARGET)
Generates:
1. Variant A (Bobi Builder: Construction Safety Vest + Hardhat with lamp)
2. Variant B (Chef Bobi: Tall Chef Toque + Apron + Gingham Scarf)
3. Individual modular equipment OBJs for runtime attachment
4. Variant texture atlases
=============================================================================
"""

import json
import math
import struct
import os
from PIL import Image, ImageDraw, ImageFont

def create_variant_textures():
    base_dir = "/home/bbinota/dev/game/CharacterProduction"
    out_dir = f"{base_dir}/textures/variants"
    os.makedirs(out_dir, exist_ok=True)

    # 1. Variant A: Bobi Builder Albedo (Orange High-Vis Vest + Yellow Helmet with Silver Stripes)
    img_builder = Image.new("RGBA", (1024, 1024), (255, 175, 20, 255)) # Warm Yellow Bean Skin
    draw_b = ImageDraw.Draw(img_builder)

    # Denim Overalls base (U: 0.5-1.0, V: 0.5-1.0 -> X: 512..1024, Y: 0..512)
    draw_b.rectangle([512, 0, 1024, 512], fill=(45, 60, 140, 255))
    # High-vis Neon Orange Vest over body (X: 540..990, Y: 40..460)
    draw_b.rectangle([540, 40, 990, 460], fill=(255, 95, 10, 255))
    # Silver reflective safety stripes (dual horizontal stripes)
    draw_b.rectangle([540, 180, 990, 230], fill=(225, 230, 240, 255))
    draw_b.rectangle([540, 310, 990, 360], fill=(225, 230, 240, 255))
    # White stitchings and safety badge
    draw_b.rectangle([570, 70, 680, 150], fill=(250, 250, 250, 255)) # ID badge
    draw_b.rectangle([590, 90, 660, 130], fill=(40, 120, 220, 255))

    # Hardhat & accessories (X: 512..1024, Y: 512..1024)
    draw_b.rectangle([512, 512, 1024, 1024], fill=(255, 180, 0, 255)) # Bright yellow helmet
    draw_b.rectangle([600, 600, 900, 680], fill=(230, 235, 245, 255)) # Front reflector
    # Headlamp bezel
    draw_b.ellipse([700, 750, 840, 890], fill=(50, 55, 65, 255))
    draw_b.ellipse([720, 770, 820, 870], fill=(220, 250, 255, 255)) # Cyan LED lens

    # Gloves & Boots (X: 0..512, Y: 512..1024)
    draw_b.rectangle([0, 512, 512, 768], fill=(245, 245, 245, 255)) # White gloves
    draw_b.rectangle([0, 768, 512, 1024], fill=(70, 60, 50, 255)) # Heavy brown construction boots

    # Face details (X: 0..512, Y: 0..512)
    draw_b.ellipse([140, 160, 220, 280], fill=(20, 20, 20, 255)) # Eye L
    draw_b.ellipse([160, 180, 190, 220], fill=(255, 255, 255, 255)) # Highlight L
    draw_b.ellipse([290, 160, 370, 280], fill=(20, 20, 20, 255)) # Eye R
    draw_b.ellipse([310, 180, 340, 220], fill=(255, 255, 255, 255)) # Highlight R
    draw_b.ellipse([90, 270, 210, 340], fill=(255, 120, 140, 180)) # Cheek L
    draw_b.ellipse([300, 270, 420, 340], fill=(255, 120, 140, 180)) # Cheek R

    builder_path = f"{out_dir}/bobi_builder_albedo.png"
    img_builder.save(builder_path)
    print(f"Generated Builder Texture: {builder_path}")

    # 2. Variant B: Chef Bobi Albedo (Clean White Apron + Red Checkered Gingham Scarf + White Toque)
    img_chef = Image.new("RGBA", (1024, 1024), (255, 180, 40, 255)) # Golden Butter Bean Skin
    draw_c = ImageDraw.Draw(img_chef)

    # Chef Apron over torso (X: 512..1024, Y: 0..512)
    draw_c.rectangle([512, 0, 1024, 512], fill=(250, 250, 250, 255)) # Crisp White Apron
    # Front kitchen utensil pocket
    draw_c.rectangle([600, 200, 930, 400], fill=(235, 238, 245, 255))
    draw_c.rectangle([600, 200, 930, 215], fill=(200, 205, 215, 255)) # Pocket seam
    # Red & White Gingham Checkered Scarf (X: 512..1024, Y: 512..1024)
    for row in range(16):
        for col in range(16):
            is_red = (row + col) % 2 == 0
            color = (220, 35, 45, 255) if is_red else (255, 255, 255, 255)
            x0 = 512 + col * 32
            y0 = 512 + row * 32
            draw_c.rectangle([x0, y0, x0 + 32, y0 + 32], fill=color)

    # Gloves & Shoes (X: 0..512, Y: 512..1024)
    draw_c.rectangle([0, 512, 512, 768], fill=(250, 250, 250, 255)) # White gloves
    draw_c.rectangle([0, 768, 512, 1024], fill=(35, 35, 40, 255)) # Black kitchen clogs

    # Face details (X: 0..512, Y: 0..512)
    draw_c.ellipse([140, 160, 220, 280], fill=(20, 20, 20, 255)) # Eye L
    draw_c.ellipse([160, 180, 190, 220], fill=(255, 255, 255, 255))
    draw_c.ellipse([290, 160, 370, 280], fill=(20, 20, 20, 255)) # Eye R
    draw_c.ellipse([310, 180, 340, 220], fill=(255, 255, 255, 255))
    draw_c.ellipse([90, 270, 210, 340], fill=(255, 130, 150, 180)) # Cheek L
    draw_c.ellipse([300, 270, 420, 340], fill=(255, 130, 150, 180)) # Cheek R

    chef_path = f"{out_dir}/bobi_chef_albedo.png"
    img_chef.save(chef_path)
    print(f"Generated Chef Texture: {chef_path}")

def generate_modular_mesh_parts():
    """
    Exports individual modular accessories as standard OBJ models.
    """
    base_dir = "/home/bbinota/dev/game/CharacterProduction"
    modular_dir = f"{base_dir}/exports/modular"
    os.makedirs(modular_dir, exist_ok=True)

    # 1. Part_Hat_Hardhat.obj (Construction safety helmet with headlamp)
    with open(f"{modular_dir}/Part_Hat_Hardhat.obj", 'w') as f:
        f.write("# Modular Part: Construction Hardhat\n")
        f.write("# Attaches to: Socket_Hat (Head joint)\n")
        # Base dome vertices
        f.write("v 0.00 0.00 0.12\n")
        f.write("v -0.20 -0.22 0.00\nv 0.20 -0.22 0.00\nv 0.22 0.22 0.00\nv -0.22 0.22 0.00\n")
        # Lamp bezel
        f.write("v 0.00 -0.26 0.06\nv -0.05 -0.24 0.08\nv 0.05 -0.24 0.08\nv 0.00 -0.24 0.02\n")
        f.write("f 1 2 3\nf 1 3 4\nf 1 4 5\nf 1 5 2\nf 6 7 8\nf 6 8 9\n")

    # 2. Part_Hat_ChefToque.obj (Tall pleated chef hat)
    with open(f"{modular_dir}/Part_Hat_ChefToque.obj", 'w') as f:
        f.write("# Modular Part: Chef Toque\n")
        f.write("# Attaches to: Socket_Hat (Head joint)\n")
        # Crown cylinder + puffy mushroom top
        f.write("v 0.00 0.00 0.35\n")
        f.write("v -0.26 -0.26 0.25\nv 0.26 -0.26 0.25\nv 0.26 0.26 0.25\nv -0.26 0.26 0.25\n")
        f.write("v -0.18 -0.18 0.00\nv 0.18 -0.18 0.00\nv 0.18 0.18 0.00\nv -0.18 0.18 0.00\n")
        f.write("f 1 2 3\nf 1 3 4\nf 1 4 5\nf 1 5 2\n")
        f.write("f 2 6 7 3\nf 3 7 8 4\nf 4 8 9 5\nf 5 9 6 2\n")

    # 3. Part_Vest_Safety.obj (High-Vis Safety Vest)
    with open(f"{modular_dir}/Part_Vest_Safety.obj", 'w') as f:
        f.write("# Modular Part: High-Vis Safety Vest\n")
        f.write("# Skinned to: Spine & Chest joints\n")
        f.write("v -0.34 0.00 0.25\nv 0.34 0.00 0.25\nv 0.34 0.00 -0.15\nv -0.34 0.00 -0.15\n")
        f.write("v 0.00 -0.35 0.25\nv 0.00 -0.35 -0.15\n")
        f.write("f 1 5 6 4\nf 2 5 6 3\n")

    # 4. Part_Apron_Chef.obj (Kitchen Chef Apron)
    with open(f"{modular_dir}/Part_Apron_Chef.obj", 'w') as f:
        f.write("# Modular Part: Chef Apron\n")
        f.write("# Skinned to: Spine & Hips joints\n")
        f.write("v -0.22 -0.34 0.20\nv 0.22 -0.34 0.20\nv 0.25 -0.34 -0.25\nv -0.25 -0.34 -0.25\n")
        f.write("f 1 2 3 4\n")

    print(f"Generated 4 Modular Part OBJs in {modular_dir}")

def generate_variant_gltfs():
    """
    Creates complete animated & rigged glTF files for Variant A and Variant B
    reusing the exact same skeleton hierarchy, skinning & 13 P0 animations.
    """
    base_dir = "/home/bbinota/dev/game/CharacterProduction"
    base_anim_path = f"{base_dir}/exports/animations/CHR_Bobi_Animations.gltf"
    modular_dir = f"{base_dir}/exports/modular"

    with open(base_anim_path, 'r') as f:
        anim_template = json.load(f)

    # Fix relative buffer URIs for modular/ subdirectory
    for buf in anim_template["buffers"]:
        bname = os.path.basename(buf["uri"])
        if "Rigged" in bname:
            buf["uri"] = "../skeletons/" + bname
        else:
            buf["uri"] = "../animations/" + bname

    # 1. Variant A: Bobi Builder (Orange High-Vis Vest, Silver Reflector Bandana, Brown Work Boots)
    gltf_a = json.loads(json.dumps(anim_template))
    gltf_a["asset"]["generator"] = "Moving Chaos Bobi Variant A (Builder)"
    gltf_a["nodes"][0]["name"] = "CHR_Bobi_Builder"
    for mat in gltf_a["materials"]:
        if mat["name"] == "Mat_DenimBlue":
            mat["pbrMetallicRoughness"]["baseColorFactor"] = [1.0, 0.38, 0.04, 1.0] # High-Vis Orange Vest
        elif mat["name"] == "Mat_BandanaRed":
            mat["pbrMetallicRoughness"]["baseColorFactor"] = [0.85, 0.90, 0.98, 1.0] # Safety Reflector Trim
        elif mat["name"] == "Mat_BootsCharcoal":
            mat["pbrMetallicRoughness"]["baseColorFactor"] = [0.35, 0.22, 0.12, 1.0] # Leather Construction Boots

    out_a = f"{modular_dir}/CHR_Bobi_VariantA_Builder.gltf"
    with open(out_a, 'w') as f:
        json.dump(gltf_a, f, indent=2)
    print(f"Generated Variant A Animated glTF: {out_a}")

    # 2. Variant B: Chef Bobi (Crisp White Chef Apron, Scarlet Scarf, Dark Kitchen Clogs)
    gltf_b = json.loads(json.dumps(anim_template))
    gltf_b["asset"]["generator"] = "Moving Chaos Bobi Variant B (Chef)"
    gltf_b["nodes"][0]["name"] = "CHR_Bobi_Chef"
    for mat in gltf_b["materials"]:
        if mat["name"] == "Mat_DenimBlue":
            mat["pbrMetallicRoughness"]["baseColorFactor"] = [0.97, 0.97, 0.99, 1.0] # White Chef Apron
        elif mat["name"] == "Mat_BootsCharcoal":
            mat["pbrMetallicRoughness"]["baseColorFactor"] = [0.10, 0.10, 0.12, 1.0] # Black Kitchen Clogs

    out_b = f"{modular_dir}/CHR_Bobi_VariantB_Chef.gltf"
    with open(out_b, 'w') as f:
        json.dump(gltf_b, f, indent=2)
    print(f"Generated Variant B Animated glTF: {out_b}")

if __name__ == "__main__":
    create_variant_textures()
    generate_modular_mesh_parts()
    generate_variant_gltfs()

