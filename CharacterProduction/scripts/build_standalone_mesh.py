"""
=============================================================================
STANDALONE 3D BASE MESH GENERATOR (OBJ & GLTF 2.0 FOR GODOT 4 & THREE.JS)
Generates Bobi's stylized Chibi Bean geometry with multi-material groups,
connected limbs, overalls straps, bandana, catchlights, gloves, and boots.
=============================================================================
"""

import math
import json
import os

class MeshBuilder:
    def __init__(self):
        self.vertices = []
        self.normals = []
        self.uvs = []
        self.faces = [] # list of {"mat": str, "verts": [(v, vt, vn), ...]}
        self.materials_used = set()

    def add_vertex(self, x, y, z):
        self.vertices.append((x, y, z))
        return len(self.vertices)

    def add_normal(self, nx, ny, nz):
        l = math.sqrt(nx*nx + ny*ny + nz*nz) or 1.0
        self.normals.append((nx/l, ny/l, nz/l))
        return len(self.normals)

    def add_uv(self, u, v):
        self.uvs.append((u, v))
        return len(self.uvs)

    def _rotate_point(self, x, y, z, rx=0, ry=0, rz=0):
        # Rotate X
        if rx:
            c, s = math.cos(rx), math.sin(rx)
            y, z = y*c - z*s, y*s + z*c
        # Rotate Y
        if ry:
            c, s = math.cos(ry), math.sin(ry)
            x, z = x*c + z*s, -x*s + z*c
        # Rotate Z
        if rz:
            c, s = math.cos(rz), math.sin(rz)
            x, y = x*c - y*s, x*s + y*c
        return x, y, z

    def add_capsule(self, cx, cy, cz, radius, height, rings=16, sectors=24, mat="Mat_YellowBean", rx=0, ry=0, rz=0, scale_x=1.0, scale_y=1.0):
        self.materials_used.add(mat)
        half_h = height / 2.0
        start_v = len(self.vertices)

        for r in range(rings + 1):
            theta = math.pi * r / rings
            sin_t = math.sin(theta)
            cos_t = math.cos(theta)
            z_offset = half_h if r <= rings // 2 else -half_h

            for s in range(sectors):
                phi = 2 * math.pi * s / sectors
                cos_p = math.cos(phi)
                sin_p = math.sin(phi)

                lx = radius * sin_t * cos_p * scale_x
                ly = radius * sin_t * sin_p * scale_y
                lz = z_offset + radius * cos_t

                x, y, z = self._rotate_point(lx, ly, lz, rx, ry, rz)
                nx, ny, nz = self._rotate_point(sin_t * cos_p, sin_t * sin_p, cos_t, rx, ry, rz)

                self.add_vertex(cx + x, cy + y, cz + z)
                self.add_normal(nx, ny, nz)
                self.add_uv(s / sectors, r / rings)

        for r in range(rings):
            for s in range(sectors):
                next_s = (s + 1) % sectors
                v0 = start_v + r * sectors + s + 1
                v1 = start_v + (r + 1) * sectors + s + 1
                v2 = start_v + (r + 1) * sectors + next_s + 1
                v3 = start_v + r * sectors + next_s + 1
                self.faces.append({
                    "mat": mat,
                    "verts": [(v0, v0, v0), (v1, v1, v1), (v2, v2, v2), (v3, v3, v3)]
                })

    def add_ellipsoid(self, cx, cy, cz, rad_x, rad_y, rad_z, rings=12, sectors=16, mat="Mat_Default", rx=0, ry=0, rz=0):
        self.materials_used.add(mat)
        start_v = len(self.vertices)
        for r in range(rings + 1):
            theta = math.pi * r / rings
            sin_t = math.sin(theta)
            cos_t = math.cos(theta)
            for s in range(sectors):
                phi = 2 * math.pi * s / sectors
                lx = rad_x * sin_t * math.cos(phi)
                ly = rad_y * sin_t * math.sin(phi)
                lz = rad_z * cos_t

                x, y, z = self._rotate_point(lx, ly, lz, rx, ry, rz)
                nx, ny, nz = self._rotate_point(sin_t * math.cos(phi), sin_t * math.sin(phi), cos_t, rx, ry, rz)

                self.add_vertex(cx + x, cy + y, cz + z)
                self.add_normal(nx, ny, nz)
                self.add_uv(s / sectors, r / rings)

        for r in range(rings):
            for s in range(sectors):
                next_s = (s + 1) % sectors
                v0 = start_v + r * sectors + s + 1
                v1 = start_v + (r + 1) * sectors + s + 1
                v2 = start_v + (r + 1) * sectors + next_s + 1
                v3 = start_v + r * sectors + next_s + 1
                self.faces.append({
                    "mat": mat,
                    "verts": [(v0, v0, v0), (v1, v1, v1), (v2, v2, v2), (v3, v3, v3)]
                })

    def add_torus(self, cx, cy, cz, major_r, minor_r, major_seg=20, minor_seg=8, mat="Mat_BandanaRed", rx=0, ry=0, rz=0):
        self.materials_used.add(mat)
        start_v = len(self.vertices)
        for i in range(major_seg):
            u = 2 * math.pi * i / major_seg
            cu, su = math.cos(u), math.sin(u)
            for j in range(minor_seg):
                v = 2 * math.pi * j / minor_seg
                cv, sv = math.cos(v), math.sin(v)
                lx = (major_r + minor_r * cv) * cu
                ly = (major_r + minor_r * cv) * su
                lz = minor_r * sv

                x, y, z = self._rotate_point(lx, ly, lz, rx, ry, rz)
                nx, ny, nz = self._rotate_point(cv * cu, cv * su, sv, rx, ry, rz)
                self.add_vertex(cx + x, cy + y, cz + z)
                self.add_normal(nx, ny, nz)
                self.add_uv(i / major_seg, j / minor_seg)

        for i in range(major_seg):
            next_i = (i + 1) % major_seg
            for j in range(minor_seg):
                next_j = (j + 1) % minor_seg
                v0 = start_v + i * minor_seg + j + 1
                v1 = start_v + next_i * minor_seg + j + 1
                v2 = start_v + next_i * minor_seg + next_j + 1
                v3 = start_v + i * minor_seg + next_j + 1
                self.faces.append({
                    "mat": mat,
                    "verts": [(v0, v0, v0), (v1, v1, v1), (v2, v2, v2), (v3, v3, v3)]
                })

    def export_obj(self, filepath, mtl_filename):
        with open(filepath, 'w') as f:
            f.write("# Bobi Base Character Model (Articulated Chibi Bean)\n")
            f.write(f"mtllib {mtl_filename}\n\n")

            for v in self.vertices:
                f.write(f"v {v[0]:.4f} {v[1]:.4f} {v[2]:.4f}\n")
            for vt in self.uvs:
                f.write(f"vt {vt[0]:.4f} {vt[1]:.4f}\n")
            for vn in self.normals:
                f.write(f"vn {vn[0]:.4f} {vn[1]:.4f} {vn[2]:.4f}\n")

            current_mat = None
            for face in self.faces:
                if face["mat"] != current_mat:
                    current_mat = face["mat"]
                    f.write(f"usemtl {current_mat}\n")
                f_str = " ".join(f"{v[0]}/{v[1]}/{v[2]}" for v in face["verts"])
                f.write(f"f {f_str}\n")

    def export_mtl(self, filepath):
        materials = {
            "Mat_YellowBean": (1.0, 0.647, 0.008),
            "Mat_DenimBlue": (0.216, 0.259, 0.980),
            "Mat_BandanaRed": (1.0, 0.278, 0.341),
            "Mat_WhiteGloves": (0.96, 0.96, 0.98),
            "Mat_BootsCharcoal": (0.24, 0.27, 0.33),
            "Mat_EyesBlack": (0.04, 0.04, 0.05),
            "Mat_EyeWhite": (1.0, 1.0, 1.0),
            "Mat_CheeksPink": (1.0, 0.420, 0.506),
            "Mat_ButtonGold": (1.0, 0.84, 0.16)
        }
        with open(filepath, 'w') as f:
            for name, rgb in materials.items():
                f.write(f"newmtl {name}\n")
                f.write(f"Kd {rgb[0]:.3f} {rgb[1]:.3f} {rgb[2]:.3f}\n")
                f.write("Ka 0.15 0.15 0.15\n")
                f.write("Ks 0.25 0.25 0.25\n")
                f.write("Ns 32.0\n")
                f.write("d 1.0\n\n")

def build_bobi():
    builder = MeshBuilder()

    # 1. Main Chubby Bean Torso/Head Capsule (Center Z=0.63m)
    builder.add_capsule(0, 0, 0.63, radius=0.31, height=0.32, rings=16, sectors=24, mat="Mat_YellowBean", scale_x=1.02, scale_y=0.92)

    # 2. Denim Overalls (Lower tummy shell + chest bib + straps + buttons)
    builder.add_ellipsoid(0, 0, 0.44, 0.325, 0.295, 0.21, rings=12, sectors=24, mat="Mat_DenimBlue")
    # Front bib pocket panel
    builder.add_ellipsoid(0, -0.25, 0.56, 0.16, 0.07, 0.11, rings=8, sectors=14, mat="Mat_DenimBlue")
    # Shoulder straps
    builder.add_ellipsoid(-0.14, -0.15, 0.64, 0.045, 0.14, 0.07, rings=8, sectors=10, mat="Mat_DenimBlue", rx=0.55)
    builder.add_ellipsoid(0.14, -0.15, 0.64, 0.045, 0.14, 0.07, rings=8, sectors=10, mat="Mat_DenimBlue", rx=0.55)
    # Brass overall buttons
    builder.add_ellipsoid(-0.12, -0.30, 0.60, 0.025, 0.015, 0.025, rings=6, sectors=10, mat="Mat_ButtonGold")
    builder.add_ellipsoid(0.12, -0.30, 0.60, 0.025, 0.015, 0.025, rings=6, sectors=10, mat="Mat_ButtonGold")

    # 3. Red Neck Bandana Collar + Knot Tail
    builder.add_torus(0, -0.01, 0.66, major_r=0.29, minor_r=0.042, major_seg=22, minor_seg=8, mat="Mat_BandanaRed", rx=0.08)
    builder.add_ellipsoid(0.06, -0.30, 0.64, 0.045, 0.03, 0.065, rings=6, sectors=10, mat="Mat_BandanaRed", ry=-0.4)

    # 4. Expressive Eyes + Catchlights + Rosy Cheeks
    # Left Eye & Catchlight
    builder.add_ellipsoid(-0.11, -0.275, 0.80, 0.052, 0.028, 0.068, rings=10, sectors=12, mat="Mat_EyesBlack")
    builder.add_ellipsoid(-0.092, -0.302, 0.825, 0.018, 0.014, 0.022, rings=6, sectors=8, mat="Mat_EyeWhite")
    # Right Eye & Catchlight
    builder.add_ellipsoid(0.11, -0.275, 0.80, 0.052, 0.028, 0.068, rings=10, sectors=12, mat="Mat_EyesBlack")
    builder.add_ellipsoid(0.128, -0.302, 0.825, 0.018, 0.014, 0.022, rings=6, sectors=8, mat="Mat_EyeWhite")
    # Rosy Cheeks
    builder.add_ellipsoid(-0.18, -0.245, 0.72, 0.050, 0.020, 0.032, rings=8, sectors=10, mat="Mat_CheeksPink", rz=-0.35)
    builder.add_ellipsoid(0.18, -0.245, 0.72, 0.050, 0.020, 0.032, rings=8, sectors=10, mat="Mat_CheeksPink", rz=0.35)

    # 5. Miniature Hardhat with Brim & Red Pom-Pom (tilted playfully)
    builder.add_ellipsoid(0.03, -0.01, 0.99, 0.22, 0.22, 0.13, rings=12, sectors=20, mat="Mat_YellowBean", ry=-0.12)
    builder.add_ellipsoid(0.03, -0.14, 0.94, 0.18, 0.12, 0.025, rings=8, sectors=14, mat="Mat_YellowBean", ry=-0.12) # Visor brim
    builder.add_ellipsoid(0.05, -0.01, 1.13, 0.05, 0.05, 0.05, rings=8, sectors=12, mat="Mat_BandanaRed")

    # 6. Chubby Arms (Connecting shoulder to gloves at A-Pose)
    builder.add_capsule(-0.34, -0.01, 0.54, radius=0.068, height=0.18, rings=10, sectors=14, mat="Mat_YellowBean", ry=0.85)
    builder.add_capsule(0.34, -0.01, 0.54, radius=0.068, height=0.18, rings=10, sectors=14, mat="Mat_YellowBean", ry=-0.85)
    # Puffy White Cartoon Gloves + Cuffs
    builder.add_torus(-0.41, -0.01, 0.47, major_r=0.075, minor_r=0.025, major_seg=14, minor_seg=6, mat="Mat_WhiteGloves", ry=0.85)
    builder.add_ellipsoid(-0.46, -0.02, 0.42, 0.105, 0.115, 0.095, rings=10, sectors=14, mat="Mat_WhiteGloves")
    builder.add_torus(0.41, -0.01, 0.47, major_r=0.075, minor_r=0.025, major_seg=14, minor_seg=6, mat="Mat_WhiteGloves", ry=-0.85)
    builder.add_ellipsoid(0.46, -0.02, 0.42, 0.105, 0.115, 0.095, rings=10, sectors=14, mat="Mat_WhiteGloves")

    # 7. Stubby Legs + Chunky Work Boots
    builder.add_capsule(-0.15, -0.01, 0.21, radius=0.085, height=0.14, rings=10, sectors=14, mat="Mat_DenimBlue")
    builder.add_capsule(0.15, -0.01, 0.21, radius=0.085, height=0.14, rings=10, sectors=14, mat="Mat_DenimBlue")
    builder.add_ellipsoid(-0.15, -0.04, 0.075, 0.095, 0.145, 0.078, rings=10, sectors=14, mat="Mat_BootsCharcoal")
    builder.add_ellipsoid(0.15, -0.04, 0.075, 0.095, 0.145, 0.078, rings=10, sectors=14, mat="Mat_BootsCharcoal")

    base_dir = "/home/bbinota/dev/game/CharacterProduction"
    out_obj = f"{base_dir}/exports/meshes/CHR_Bobi_Base.obj"
    out_mtl = f"{base_dir}/exports/meshes/CHR_Bobi_Base.mtl"
    src_obj = f"{base_dir}/source/base_character_model.obj"
    src_mtl = f"{base_dir}/source/base_character_model.mtl"

    builder.export_obj(out_obj, "CHR_Bobi_Base.mtl")
    builder.export_mtl(out_mtl)
    builder.export_obj(src_obj, "base_character_model.mtl")
    builder.export_mtl(src_mtl)

    tri_count = len(builder.faces) * 2
    vert_count = len(builder.vertices)

    print("Generated Upgraded Bobi 3D Mesh:")
    print(f"  Vertices: {vert_count}")
    print(f"  Triangles: {tri_count}")
    print(f"  Materials: {sorted(list(builder.materials_used))}")
    return vert_count, tri_count

if __name__ == "__main__":
    build_bobi()
