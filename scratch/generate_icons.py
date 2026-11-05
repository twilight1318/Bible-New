from PIL import Image, ImageDraw, ImageFont
import os

def generate_icon(size, filename):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Soft rounded square / circle background
    # Background gradient or warm soft tone
    bg_color = (250, 245, 242, 255) # Ivory / blush
    border_color = (212, 175, 55, 255) # Gold
    
    # Draw soft circle
    margin = size // 20
    draw.ellipse([margin, margin, size - margin, size - margin], fill=bg_color, outline=border_color, width=size // 35)
    
    # Inner decorative gold ring
    inner_margin = size // 10
    draw.ellipse([inner_margin, inner_margin, size - inner_margin, size - inner_margin], outline=(230, 205, 125, 180), width=size // 80)
    
    # Stylized cross in gold
    cx = size // 2
    cy = size // 2 - (size // 20)
    cross_w = size // 18
    cross_h = size // 3
    
    # Vertical bar of cross
    draw.rounded_rectangle([cx - cross_w//2, cy - cross_h//2, cx + cross_w//2, cy + cross_h//2], radius=cross_w//4, fill=border_color)
    # Horizontal bar of cross
    arm_w = size // 4
    arm_y = cy - cross_h//6
    draw.rounded_rectangle([cx - arm_w//2, arm_y - cross_w//2, cx + arm_w//2, arm_y + cross_w//2], radius=cross_w//4, fill=border_color)
    
    # Heart at center
    heart_size = size // 12
    # Simple heart below or at center
    hy = cy + cross_h // 2 + size // 15
    # Draw small heart
    heart_color = (217, 107, 127, 255) # Rose blush
    
    # Let's draw stylized open bible curve at bottom
    bx1 = size // 4
    bx2 = size * 3 // 4
    by = cy + cross_h // 2 + size // 20
    draw.arc([bx1, by - size//15, cx, by + size//15], 0, 180, fill=border_color, width=size//45)
    draw.arc([cx, by - size//15, bx2, by + size//15], 0, 180, fill=border_color, width=size//45)
    
    # Save image
    out_dir = os.path.join(os.path.dirname(__file__), "..", "assets", "icons")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, filename)
    img.save(out_path, "PNG")
    print(f"Generated {out_path} ({size}x{size})")

generate_icon(192, "icon-192.png")
generate_icon(512, "icon-512.png")
generate_icon(64, "favicon.png")

