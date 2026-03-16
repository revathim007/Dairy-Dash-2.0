import os
import glob

base_dir = r"c:\Users\Tanishka Bhagat\Desktop\project\Smart Milk Delivery Management System\frontend\src"

# Update imports in admin/pages
admin_pages_dir = os.path.join(base_dir, "admin", "pages")
for filepath in glob.glob(os.path.join(admin_pages_dir, "*.js")):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace('"../components/', '"../../components/')
    content = content.replace('"../services/', '"../../services/')
    content = content.replace("'../components/", "'../../components/")
    content = content.replace("'../services/", "'../../services/")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# create placeholders
customer_pages = ['Home.js', 'Products.js', 'Cart.js', 'Subscriptions.js', 'Orders.js', 'Billing.js', 'Profile.js']
for p in customer_pages:
    filepath = os.path.join(base_dir, "customer", "pages", p)
    # create empty placeholder
    with open(filepath, 'w') as f:
        f.write(f"// Placeholder for {p}\nexport default function () {{ return <div>{p}</div>; }}\n")

customer_components = ['CustomerNavbar.js', 'ProductCard.js', 'SubscriptionCard.js', 'OrderCard.js']
for c in customer_components:
    filepath = os.path.join(base_dir, "customer", "components", c)
    with open(filepath, 'w') as f:
        f.write(f"// Placeholder for {c}\nexport default function () {{ return <div>{c}</div>; }}\n")

auth_pages = ['Register.js']
for a in auth_pages:
    filepath = os.path.join(base_dir, "auth", a)
    with open(filepath, 'w') as f:
        f.write(f"// Placeholder for {a}\nexport default function () {{ return <div>{a}</div>; }}\n")

print("Replacements and placeholders created successfully.")
