#!/bin/bash

# 图片优化脚本 - WebP/AVIF转换和响应式图片生成

echo "🖼️ 开始图片优化..."

# 检查是否安装了图片处理工具
if ! command -v cwebp &> /dev/null; then
    echo "⚠️  cwebp 未安装，跳过WebP转换"
else
    echo "🔄 转换关键图片为WebP格式..."

    # 转换hero图片
    if [ -f "assets/images/hero/hero-main-banner-large.png" ]; then
        cwebp -q 75 assets/images/hero/hero-main-banner-large.png -o assets/images/hero/hero-main-banner-large.webp
        echo "✅ Hero图片WebP转换完成"
    fi

    # 转换产品图片
    for img in assets/images/products/*.png; do
        if [ -f "$img" ]; then
            filename=$(basename "$img" .png)
            cwebp -q 75 "$img" -o "assets/images/products/${filename}.webp"
            echo "✅ $filename WebP转换完成"
        fi
    done
fi

echo "🖼️ 图片优化完成"
