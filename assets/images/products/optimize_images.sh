#!/bin/bash

# 图片优化和生成脚本
# 优化现有大图片，生成缺失的占位图片

echo "🖼️ 开始图片优化和生成流程..."

# 创建优化后的图片目录
mkdir -p optimized-images

# 需要优化的大图片列表
large_images=(
    "backyard-duplex-series.jpg"
    "backyard-entertainment-series.jpg"
    "backyard-garden-series.jpg"
    "backyard-leisure-series.jpg"
    "backyard-office-series.jpg"
    "chengdu-countryside-1.jpg"
    "chengdu-countryside-2.jpg"
    "chengdu-countryside-3.jpg"
    "chengdu-countryside-4.jpg"
    "chengdu-countryside-main.jpg"
    "gallery-hero.jpg"
    "traditional-log-cabin-rustic-01.png"
    "commercial-office-aerial-view-01.png"
    "westlake-villa-main.jpg"
    "westlake-villa-2.jpg"
    "westlake-villa-4.jpg"
)

# 优化大图片
echo "📉 优化大图片文件..."
for img in "${large_images[@]}"; do
    if [ -f "$img" ]; then
        echo "处理: $img"
        # 备份原始文件
        cp "$img" "${img}.backup"
        # 调整大小到最大宽度1200px
        sips -Z 1200 "$img" > /dev/null 2>&1
        echo "✅ 已优化: $img"
    else
        echo "⚠️ 文件不存在: $img"
    fi
done

# 生成需要的占位图片类别
categories=(
    "products-backyard-office"
    "products-guest-house"
    "products-garden-studio"
    "products-leisure-cabin"
    "resort-luxury-eco"
    "resort-family-cabin"
    "interior-modern-living"
    "interior-bedroom-design"
    "client-avatars"
    "social-media-previews"
)

# 生成占位图片
echo "🎨 生成占位图片..."
for category in "${categories[@]}"; do
    echo "生成类别: $category"

    case $category in
        "products-backyard-office")
            generate_product_image "backyard-office-modern" "Modern Backyard Office" "1200x800"
            ;;
        "products-guest-house")
            generate_product_image "guest-house-cozy" "Cozy Guest House" "1200x800"
            ;;
        "products-garden-studio")
            generate_product_image "garden-studio-light" "Garden Studio" "1200x800"
            ;;
        "products-leisure-cabin")
            generate_product_image "leisure-cabin-rustic" "Leisure Cabin" "1200x800"
            ;;
        "resort-luxury-eco")
            generate_product_image "resort-eco-luxury" "Eco Luxury Resort" "1200x800"
            ;;
        "resort-family-cabin")
            generate_product_image "resort-family-cabin" "Family Resort Cabin" "1200x800"
            ;;
        "interior-modern-living")
            generate_product_image "interior-modern-living" "Modern Living Interior" "1200x800"
            ;;
        "interior-bedroom-design")
            generate_product_image "interior-bedroom" "Bedroom Design" "1200x800"
            ;;
        "client-avatars")
            for i in {1..8}; do
                generate_avatar "client-$i" "Client $i"
            done
            ;;
        "social-media-previews")
            generate_social_preview "facebook-og" "Wooden Cabin Homes"
            generate_social_preview "twitter-card" "Wooden Cabin Homes"
            ;;
    esac
done

# 计算优化效果
echo "📊 计算优化效果..."
original_size=$(find . -name "*.backup" -exec ls -l {} \; | awk '{sum+=$5} END {print sum/1024/1024}')
current_size=$(find . -name "*.png" -o -name "*.jpg" | grep -v backup | xargs ls -l 2>/dev/null | awk '{sum+=$5} END {print sum/1024/1024}')
saved_size=$(echo "$original_size - $current_size" | bc -l 2>/dev/null || echo "计算中...")

echo "✅ 图片优化完成!"
echo "📈 优化统计:"
echo "   原始大小: ${original_size}MB"
echo "   当前大小: ${current_size}MB"
echo "   节省空间: ${saved_size}MB"

# 生成图片占位符函数
generate_product_image() {
    local name="$1"
    local title="$2"
    local dimensions="$3"

    # 使用SVG创建高质量的占位图片
    cat > "${name}.svg" << EOF
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="wood" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8B6F47;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#A0826D;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8B6F47;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#E0F6FF;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Sky background -->
  <rect width="1200" height="400" fill="url(#sky)"/>

  <!-- Ground -->
  <rect y="400" width="1200" height="400" fill="#7CB342"/>

  <!-- Cabin silhouette -->
  <g transform="translate(300, 200)">
    <!-- Main cabin structure -->
    <rect x="0" y="150" width="600" height="250" fill="url(#wood)" stroke="#654321" stroke-width="3"/>
    <!-- Roof -->
    <polygon points="-50,150 300,50 650,150" fill="#8B4513" stroke="#654321" stroke-width="2"/>
    <!-- Door -->
    <rect x="250" y="250" width="100" height="150" fill="#654321"/>
    <!-- Windows -->
    <rect x="50" y="200" width="80" height="80" fill="#87CEEB" stroke="#654321" stroke-width="2"/>
    <rect x="470" y="200" width="80" height="80" fill="#87CEEB" stroke="#654321" stroke-width="2"/>
    <!-- Chimney -->
    <rect x="500" y="80" width="60" height="120" fill="#8B4513" stroke="#654321" stroke-width="2"/>
  </g>

  <!-- Title text -->
  <text x="600" y="650" font-family="Arial, sans-serif" font-size="36" font-weight="bold" text-anchor="middle" fill="#2C3E50">
    ${title}
  </text>
  <text x="600" y="700" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="#7F8C8D">
    Premium Wooden Cabin Design
  </text>
</svg>
EOF

    echo "✅ 生成产品图片: ${name}.svg"
}

# 生成头像占位符函数
generate_avatar() {
    local name="$1"
    local title="$2"

    cat > "${name}.svg" << EOF
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="avatar${name}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667EEA;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764BA2;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background circle -->
  <circle cx="100" cy="100" r="90" fill="url(#avatar${name})"/>

  <!-- Person silhouette -->
  <circle cx="100" cy="80" r="30" fill="#FFFFFF" opacity="0.9"/>
  <ellipse cx="100" cy="140" rx="40" ry="30" fill="#FFFFFF" opacity="0.9"/>

  <!-- Initial -->
  <text x="100" y="90" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="#FFFFFF">
    ${title:0:1}
  </text>
</svg>
EOF

    echo "✅ 生成头像: ${name}.svg"
}

# 生成社交媒体预览图
generate_social_preview() {
    local name="$1"
    local title="$2"

    local width="1200"
    local height="630"

    cat > "${name}.svg" << EOF
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="social${name}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8B6F47;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#A0826D;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8B6F47;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#social${name})"/>

  <!-- Logo area -->
  <g transform="translate(${width}/2, ${height}/2)">
    <!-- Cabin icon -->
    <g transform="translate(-100, -80)">
      <rect x="0" y="40" width="200" height="80" fill="#FFFFFF" opacity="0.9"/>
      <polygon points="-20,40 100,-20 220,40" fill="#FFFFFF" opacity="0.95"/>
      <rect x="80" y="60" width="40" height="60" fill="#8B6F47"/>
      <rect x="20" y="60" width="30" height="30" fill="#87CEEB"/>
      <rect x="150" y="60" width="30" height="30" fill="#87CEEB"/>
    </g>

    <!-- Title -->
    <text x="0" y="40" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="#FFFFFF">
      ${title}
    </text>
    <text x="0" y="80" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="#FFFFFF" opacity="0.9">
      Premium Modular Wooden Cabins
    </text>
  </g>
</svg>
EOF

    echo "✅ 生成社交媒体预览: ${name}.svg"
}

echo "🎉 图片优化和生成完成!"