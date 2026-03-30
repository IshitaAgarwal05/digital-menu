import pandas as pd
from pymongo import MongoClient
import requests
from PIL import Image
from io import BytesIO
import os
import re
from datetime import datetime

# Configuration
MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "digital_menu"
EXCEL_PATH = "./Digital_Menu.xlsx"
IMAGE_DIR = "/home/ishita/Desktop/clg/couding/glacier/digital-menu/frontend/public/assets/products"

def get_volume(name):
    match = re.search(r'(\d+\s*(ml|l|ltr|gm|g|kg))', name, re.I)
    return match.group(0) if match else "Standard"

def sync():
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    products_col = db.products

    df = pd.read_excel(EXCEL_PATH)
    # Normalize headers
    df.columns = [c.strip() for c in df.columns]
    
    # Map ' Category' to 'category' if needed
    if ' Category' in df.columns:
        df.rename(columns={' Category': 'category'}, inplace=True)
    else:
        # Check for case sensitivity
        cols_map = {c.lower(): c for c in df.columns}
        if 'category' in cols_map:
            df.rename(columns={cols_map['category']: 'category'}, inplace=True)

    print(f"Processing {len(df)} products from Excel...")

    new_count = 0
    updated_count = 0

    for _, row in df.iterrows():
        name = str(row['Name']).strip()
        brand = str(row['Brand']).strip()
        
        # Sanitization
        try:
            price = float(row['Price'])
            if pd.isna(price): price = 0
        except:
            price = 0
            
        try:
            mrp = float(row['MRP'])
            if pd.isna(mrp): mrp = price # Default MRP to price if missing
        except:
            mrp = price
            
        img_url = str(row['ImageURL'])
        category = str(row['category']).strip() if 'category' in row else "General"
        
        # Launching Year handling
        launch_date = row['launchingyear']
        if pd.isna(launch_date):
            launch_date = None
        else:
            if isinstance(launch_date, datetime):
                pass
            else:
                try:
                    launch_date = pd.to_datetime(launch_date)
                except:
                    launch_date = None

        discount = round(((mrp - price) / mrp) * 100) if mrp > price and mrp > 0 else 0
        volume = get_volume(name)

        existing = products_col.find_one({"name": name, "brand": brand})
        
        if existing:
            # Update existing if needed (e.g. launchingyear)
            products_col.update_one(
                {"_id": existing["_id"]},
                {"$set": {"launchingyear": launch_date, "discount": discount, "mrp": mrp, "price": price}}
            )
            updated_count += 1
            continue

        # New Product Process
        print(f"New product found: {name}")
        
        # Image Processing
        filename = re.sub(r'[^a-zA-Z0-9]', '_', name).lower() + ".webp"
        target_path = os.path.join(IMAGE_DIR, filename)
        
        try:
            response = requests.get(img_url, timeout=10)
            if response.status_code == 200:
                img = Image.open(BytesIO(response.content))
                img = img.convert('RGB')
                img.save(target_path, 'WEBP', quality=85)
                image_db_path = f"/assets/products/{filename}"
            else:
                image_db_path = "/assets/products/placeholder.webp"
        except Exception as e:
            print(f"Error downloading image for {name}: {e}")
            image_db_path = "/assets/products/placeholder.webp"

        new_product = {
            "name": name,
            "brand": brand,
            "category": category,
            "price": price,
            "mrp": mrp,
            "image": image_db_path,
            "bestseller": False,
            "available": True,
            "volume": volume,
            "discount": discount,
            "launchingyear": launch_date
        }
        
        products_col.insert_one(new_product)
        new_count += 1

    print(f"Sync complete. New: {new_count}, Updated: {updated_count}")

if __name__ == "__main__":
    sync()
