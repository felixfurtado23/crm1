from PIL import Image, ImageOps

# Load the image
img = Image.open('/mnt/data/d6718827-aa54-4a6a-b047-b3ce488c2c9d.png')

# Invert colors
inverted_img = ImageOps.invert(img.convert("RGB"))

# Save and display result
output_path = "/mnt/data/meray_inverted.png"
inverted_img.save(output_path)
output_path
