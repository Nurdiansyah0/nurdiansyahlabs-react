import json

IMG_MAP = {
    "Laptop": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    "Smartphone": "https://images.unsplash.com/photo-1695048133142-1a20a5bf616f?w=500&q=80",
    "Audio": "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80",
    "Monitor": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80",
    "Aksesori": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80",
    "Tablet": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80",
    "Sepatu": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
    "Celana": "https://images.unsplash.com/photo-1624378439575-d1ead6af00f6?w=500&q=80",
    "Kemeja": "https://images.unsplash.com/photo-1596755094514-f87e32f85e23?w=500&q=80",
    "Kaos": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
    "Jam Tangan": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    "Koper": "https://images.unsplash.com/photo-1551021469-6d60cabe4154?w=500&q=80",
    "Elektronik Rumah": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&q=80",
    "Dapur": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&q=80",
    "Olahraga": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80",
    "Suplemen": "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&q=80",
    "Buku": "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&q=80",
    "Kamera": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80",
    "Gaming": "https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=500&q=80",
}

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    lines = content.split('\n')
    out = []
    in_products = False
    for line in lines:
        if "PRODUCTS: list[dict] = [" in line:
            in_products = True
            out.append(line)
            continue
        if in_products and line.strip() == "]":
            in_products = False
            out.append(line)
            continue
            
        if in_products and "{" in line and "}" in line and "category" in line:
            # Simple string inject
            for k, v in IMG_MAP.items():
                if f'"category": "{k}"' in line or f'"category":"{k}"' in line or f'"{k}"' in line:
                    if '"imageUrl"' not in line:
                        line = line.replace('}', f', "imageUrl": "{v}"}}')
                    break
        out.append(line)

    with open(filepath, 'w') as f:
        f.write('\n'.join(out))

process_file('/home/nurdiansyah/Nurdiansyah/react-app/ml_service/main.py')
process_file('/home/nurdiansyah/Nurdiansyah/react-app/api/ml_compute.py')
print("Done")
