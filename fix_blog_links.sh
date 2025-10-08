#!/bin/bash

# Fix all placeholder links in blog articles
files=(
    "blog/2024-global-cabin-market-trends.html"
    "blog/ai-powered-cabin-design.html"
    "blog/resort-cabin-project-analysis.html"
)

for file in "${files[@]}"; do
    echo "Fixing $file..."

    # Get filename without extension for sharing URLs
    filename=$(basename "$file" .html)

    # Fix social media share links
    sed -i '' "s|href=\"#\" class=\"btn btn-outline-info btn-sm\"><i class=\"fab fa-twitter\"></i></a>|href=\"https://twitter.com/intent/tweet?url=https://premiumwoodencabins.com/blog/$filename.html&text=Global%20Cabin%20Market%20Trends\" class=\"btn btn-outline-info btn-sm\" target=\"_blank\" rel=\"noopener\"><i class=\"fab fa-twitter\"></i></a>|g" "$file"

    sed -i '' "s|href=\"#\" class=\"btn btn-outline-success btn-sm\"><i class=\"fab fa-whatsapp\"></i></a>|href=\"https://wa.me/?text=https://premiumwoodencabins.com/blog/$filename.html\" class=\"btn btn-outline-success btn-sm\" target=\"_blank\" rel=\"noopener\"><i class=\"fab fa-whatsapp\"></i></a>|g" "$file"

    sed -i '' "s|href=\"#\" class=\"btn btn-outline-danger btn-sm\"><i class=\"fab fa-pinterest\"></i></a>|href=\"https://pinterest.com/pin/create/button/?url=https://premiumwoodencabins.com/blog/$filename.html&description=Global%20Cabin%20Market%20Trends\" class=\"btn btn-outline-danger btn-sm\" target=\"_blank\" rel=\"noopener\"><i class=\"fab fa-pinterest\"></i></a>|g" "$file"

    sed -i '' "s|href=\"#\" class=\"btn btn-outline-secondary btn-sm\"><i class=\"fas fa-link\"></i></a>|href=\"https://premiumwoodencabins.com/blog/$filename.html\" class=\"btn btn-outline-secondary btn-sm\" onclick=\"navigator.clipboard.writeText(window.location.href); return false;\"><i class=\"fas fa-link\"></i></a>|g" "$file"

    # Fix service links
    sed -i '' 's|<li><a href="#">Design</a></li>|<li><a href="../products.html">Design</a></li>|g' "$file"
    sed -i '' 's|<li><a href="#">Construction</a></li>|<li><a href="../projects.html">Construction</a></li>|g' "$file"
    sed -i '' 's|<li><a href="#">Consulting</a></li>|<li><a href="../about.html">Consulting</a></li>|g' "$file"
    sed -i '' 's|<li><a href="#">Export</a></li>|<li><a href="../contact.html">Export</a></li>|g' "$file"

    # Fix footer social media links
    sed -i '' 's|<a href="#"><i class="fab fa-facebook"></i></a>|<a href="https://wa.me/8619932411993" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i></a>|g' "$file"
    sed -i '' 's|<a href="#"><i class="fab fa-twitter"></i></a>|<a href="https://linkedin.com/company/premium-wooden-cabins" target="_blank" rel="noopener"><i class="fab fa-linkedin"></i></a>|g' "$file"
    sed -i '' 's|<a href="#"><i class="fab fa-instagram"></i></a>|<a href="https://instagram.com/premiumwoodencabins" target="_blank" rel="noopener"><i class="fab fa-instagram"></i></a>|g' "$file"

    echo "Fixed $file"
done

echo "All blog articles fixed!"