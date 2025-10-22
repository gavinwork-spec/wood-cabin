#!/bin/bash

# 木屋网站index.html关键问题修复脚本
# 基于SEO专家、网站代码专家、页面展示专家的联合分析建议

echo "🚀 开始修复木屋网站index.html关键问题..."

# 创建备份
cp index.html index.html.backup-critical-fixes-$(date +%Y%m%d-%H%M%S)
echo "✅ 已创建备份文件"

# 修复1: 字体预加载错误
echo "📝 修复1: 修正字体预加载错误..."
sed -i '' 's|<link rel="preload" as="font" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Quicksand:wght@300;400;500;600;700&display=swap" crossorigin>|<link rel="preconnect" href="https://fonts.googleapis.com">\
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>|g' index.html

# 修复2: 移除meta keywords标签
echo "📝 修复2: 移除废弃的meta keywords标签..."
sed -i '' '/<meta name="keywords" content="[^>]*">/d' index.html

# 修复3: 优化Title标签
echo "📝 修复3: 优化Title标签，减少关键词堆砌..."
sed -i '' 's|<title>Modular Wooden Cabin Manufacturer | B2B Prefab Cabin Factory China | Premium Wooden Cabins</title>|<title>Premium Wooden Cabins | B2B Modular Manufacturer China</title>|g' index.html

# 修复4: 更新版权年份为2025
echo "📝 修复4: 更新版权年份至2025..."
sed -i '' 's|&copy; 2024 Premium Wooden Cabins|&copy; 2025 Premium Wooden Cabins|g' index.html

# 修复5: 修正CSS路径错误
echo "📝 修复5: 修正compact-layout.css路径错误..."
sed -i '' 's|<link rel="stylesheet" href="../assets/css/compact-layout.css">|<link rel="stylesheet" href="assets/css/compact-layout.css">|g' index.html

# 修复6: 更新结构化数据中的电话号码，与页脚保持一致
echo "📝 修复6: 统一联系信息..."
sed -i '' 's|"telephone": "+86-123-4567-8900",|"telephone": "+86 19932411993",|g' index.html

# 修复7: 添加地理位置和更完整的地址信息
echo "📝 修复7: 完善结构化数据地址信息..."
sed -i '' 's|"addressCountry": "CN",|"addressCountry": "CN",\
        "addressLocality": "Taizhou",\
        "addressRegion": "Zhejiang",\
        "postalCode": "317000",\
        "streetAddress": "Linhai Economic Development Zone",|g' index.html

# 修复8: 添加多语言hreflang支持
echo "📝 修复8: 添加多语言hreflang支持..."
# 在head中添加hreflang标签
sed -i '' '/<link rel="canonical" href="https:\/\/woodencabin.com\/">/a\
\
    <!-- Hreflang for International SEO -->\
    <link rel="alternate" hreflang="en" href="https://woodencabin.com/">\
    <link rel="alternate" hreflang="zh" href="https://woodencabin.com/zh/">\
    <link rel="alternate" hreflang="ar" href="https://woodencabin.com/ar/">\
    <link rel="alternate" hreflang="x-default" href="https://woodencabin.com/">' index.html

# 修复9: 统一Open Graph标签
echo "📝 修复9: 统一Open Graph标签..."
sed -i '' 's|<meta property="og:title" content="Modular Wooden Cabin Manufacturer | B2B Prefab Cabin Factory China">|<meta property="og:title" content="Premium Wooden Cabins | B2B Modular Manufacturer China">|g' index.html

# 修复10: 为轮播控件添加可访问性标签
echo "📝 修复10: 添加轮播控件可访问性标签..."
# 为上一个按钮添加aria-label
sed -i '' 's|<button class="carousel-control-prev" type="button" id="b2bCarouselPrev">|<button class="carousel-control-prev" type="button" id="b2bCarouselPrev" aria-label="Previous slide" aria-controls="b2bCarousel">|g' index.html

# 为下一个按钮添加aria-label
sed -i '' 's|<button class="carousel-control-next" type="button" id="b2bCarouselNext">|<button class="carousel-control-next" type="button" id="b2bCarouselNext" aria-label="Next slide" aria-controls="b2bCarousel">|g' index.html

# 修复11: 移除重复的loading="lazy"属性
echo "📝 修复11: 移除重复的loading属性..."
# 使用sed移除重复的loading="lazy"属性
sed -i '' 's/loading="lazy" loading="lazy"/loading="lazy"/g' index.html

# 修复12: 优化meta description长度
echo "📝 修复12: 优化meta description..."
sed -i '' 's|<meta name="description" content="Professional modular wooden cabin manufacturer in China specializing in B2B partnerships with importers and distributors. Prefab cabin factory offering wholesale pricing, custom designs, and worldwide shipping. ISO certified wooden cabin solutions for resorts, residential, and commercial projects.">|<meta name="description" content="Leading B2B wooden cabin manufacturer in China. Premium modular cabins with custom designs, wholesale pricing & worldwide shipping. ISO certified for resorts & commercial projects.">|g' index.html

echo "🎉 所有关键问题修复完成！"
echo ""
echo "📋 修复摘要："
echo "✅ 1. 修正字体预加载错误"
echo "✅ 2. 移除废弃的meta keywords标签"
echo "✅ 3. 优化Title标签，减少关键词堆砌"
echo "✅ 4. 更新版权年份至2025"
echo "✅ 5. 修正CSS路径错误"
echo "✅ 6. 统一联系信息（电话号码）"
echo "✅ 7. 完善结构化数据地址信息"
echo "✅ 8. 添加多语言hreflang支持"
echo "✅ 9. 统一Open Graph标签"
echo "✅ 10. 添加轮播控件可访问性标签"
echo "✅ 11. 移除重复的loading属性"
echo "✅ 12. 优化meta description"
echo ""
echo "🔍 建议下一步：验证页面功能和提交到GitHub"