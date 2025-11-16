"""
简单的图片去背并转换为SVG
只需要 Pillow
"""
from PIL import Image
import base64
import os

def remove_white_background(input_path, output_path):
    """Remove white background"""
    print(f"Processing: {input_path}")

    # 打开图片
    img = Image.open(input_path)

    # 转换为RGBA模式
    img = img.convert("RGBA")

    # 获取像素数据
    datas = img.getdata()

    new_data = []
    for item in datas:
        # 如果像素接近白色（RGB都大于240），设为透明
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            new_data.append((255, 255, 255, 0))  # 透明
        else:
            new_data.append(item)

    # 更新图片数据
    img.putdata(new_data)

    # 保存为PNG
    img.save(output_path, "PNG")
    print(f"[OK] Background removed: {output_path}")
    return img

def create_favicon_svg(png_path, svg_path, size=64):
    """Create favicon SVG"""
    print(f"Creating SVG: {svg_path}")

    # 打开图片
    img = Image.open(png_path)

    # 确保是RGBA
    if img.mode != 'RGBA':
        img = img.convert('RGBA')

    # 调整大小
    img.thumbnail((size, size), Image.Resampling.LANCZOS)

    # 保存临时PNG
    temp_png = png_path.replace('.png', f'_resized.png')
    img.save(temp_png, 'PNG')

    # 转换为base64
    with open(temp_png, 'rb') as f:
        img_data = f.read()
        img_base64 = base64.b64encode(img_data).decode()

    width, height = img.size

    # 创建SVG内容
    svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="{width}" height="{height}" viewBox="0 0 {width} {height}">
    <image width="{width}" height="{height}"
           xlink:href="data:image/png;base64,{img_base64}"/>
</svg>'''

    # 保存SVG
    with open(svg_path, 'w', encoding='utf-8') as f:
        f.write(svg_content)

    print(f"[OK] SVG created: {svg_path}")

    # 删除临时文件
    if os.path.exists(temp_png):
        os.remove(temp_png)

def main():
    print("="*60)
    print("Image Background Removal and SVG Conversion")
    print("="*60)

    # 文件路径
    input_file = "character_input.png"
    output_nobg = "character_nobg.png"
    output_svg = "images/character_favicon.svg"

    # 检查输入文件
    if not os.path.exists(input_file):
        print(f"\nError: Cannot find {input_file}")
        return

    try:
        # Step 1: Remove background
        print(f"\n[1/2] Removing white background...")
        remove_white_background(input_file, output_nobg)

        # Step 2: Create SVG
        print(f"\n[2/2] Converting to SVG...")

        # Make sure images directory exists
        os.makedirs("images", exist_ok=True)

        create_favicon_svg(output_nobg, output_svg, size=64)

        print("\n" + "="*60)
        print("[SUCCESS] Processing complete!")
        print("="*60)
        print(f"\nGenerated files:")
        print(f"  - {output_nobg}")
        print(f"  - {output_svg}")
        print(f"\nSVG file saved to images directory, ready for favicon!")

    except Exception as e:
        print(f"\nError: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
