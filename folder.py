import os

def print_tree(path, indent=""):
    try:
        items = os.listdir(path)
    except PermissionError:
        return  

    for index, item in enumerate(items):
        # Skip node_modules folder
        if item == "node_modules":
            continue

        full_path = os.path.join(path, item)
        is_last = (index == len(items) - 1)

        branch = "└── " if is_last else "├── "
        next_indent = "    " if is_last else "│   "

        print(indent + branch + item)

        if os.path.isdir(full_path):
            print_tree(full_path, indent + next_indent)

# Give the folder path here
folder_path = r"C:\Users\lookb\Desktop\merzaai test"
print_tree(folder_path)
