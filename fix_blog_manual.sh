#!/bin/bash

# Manual fix for AI-powered cabin design article
sed -i '' 's|href="#" class="btn btn-outline-primary btn-sm"><i class="fab fa-facebook"></i></a>|href="https://www.facebook.com/sharer/sharer.php?u=https://premiumwoodencabins.com/blog/ai-powered-cabin-design.html" class="btn btn-outline-primary btn-sm" target="_blank" rel="noopener"><i class="fab fa-facebook"></i></a>|g' ./blog/ai-powered-cabin-design.html

sed -i '' 's|href="https://twitter.com/intent/tweet?url=https://premiumwoodencabins.com/blog/ai-powered-cabin-design.htmlhref="#" class="btn btn-outline-info btn-sm"><i class="fab fa-twitter"></i></a>text=Global%20Cabin%20Market%20Trends" class="btn btn-outline-info btn-sm" target="_blank" rel="noopener"><i class="fab fa-twitter"></i></a>|href="https://twitter.com/intent/tweet?url=https://premiumwoodencabins.com/blog/ai-powered-cabin-design.html&text=AI-Powered%20Cabin%20Design" class="btn btn-outline-info btn-sm" target="_blank" rel="noopener"><i class="fab fa-twitter"></i></a>|g' ./blog/ai-powered-cabin-design.html

sed -i '' 's|href="https://pinterest.com/pin/create/button/?url=https://premiumwoodencabins.com/blog/ai-powered-cabin-design.htmlhref="#" class="btn btn-outline-danger btn-sm"><i class="fab fa-pinterest"></i></a>description=Global%20Cabin%20Market%20Trends" class="btn btn-outline-danger btn-sm" target="_blank" rel="noopener"><i class="fab fa-pinterest"></i></a>|href="https://pinterest.com/pin/create/button/?url=https://premiumwoodencabins.com/blog/ai-powered-cabin-design.html&description=AI-Powered%20Cabin%20Design" class="btn btn-outline-danger btn-sm" target="_blank" rel="noopener"><i class="fab fa-pinterest"></i></a>|g' ./blog/ai-powered-cabin-design.html

# Fix resort cabin article
sed -i '' 's|href="#" class="btn btn-outline-primary btn-sm"><i class="fab fa-facebook"></i></a>|href="https://www.facebook.com/sharer/sharer.php?u=https://premiumwoodencabins.com/blog/resort-cabin-project-analysis.html" class="btn btn-outline-primary btn-sm" target="_blank" rel="noopener"><i class="fab fa-facebook"></i></a>|g' ./blog/resort-cabin-project-analysis.html

echo "Fixed blog articles!"