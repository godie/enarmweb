import os

with open("src/routes/AppRoutes.jsx", "r") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if not line.strip().startswith("import"):
        new_lines.append(line)
        continue

    if "from" not in line:
        new_lines.append(line)
        continue

    parts = line.split("from")
    comp_part = parts[0].strip()
    path_orig = parts[1].strip().strip(";").strip("\"").strip("'")
    path_part = path_orig.split("/")[-1]

    # Keep external libs or v2 or modules
    if "react-router-dom" in path_orig or "modules/" in path_orig or "v2/" in path_orig or "components/custom" in path_orig:
        new_lines.append(line)
        continue

    # Try to find the file in src
    found = False
    for root, dirs, files in os.walk("src"):
        if f"{path_part}.jsx" in files:
            target_rel = os.path.relpath(os.path.join(root, path_part), "src/routes")
            if not target_rel.startswith("."): target_rel = "./" + target_rel
            new_lines.append(f"{comp_part} from \"{target_rel}\";\n")
            found = True
            break
        elif f"{path_part}.js" in files:
            target_rel = os.path.relpath(os.path.join(root, path_part), "src/routes")
            if not target_rel.startswith("."): target_rel = "./" + target_rel
            new_lines.append(f"{comp_part} from \"{target_rel}\";\n")
            found = True
            break

    if not found:
        new_lines.append(line)

with open("src/routes/AppRoutes.jsx", "w") as f:
    f.writelines(new_lines)
