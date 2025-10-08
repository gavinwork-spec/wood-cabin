#!/bin/bash

# Create missing pages script
declare -A pages=(
    ["backyard-office-small-en.html"]="Small Office Cabin|Compact Home Office Solution|home office workspace"
    ["backyard-studio-large-en.html"]="Large Studio Cabin|Spacious Creative Studio|creative workspace studio"
    ["desert-proof-en.html"]="Desert Proof Cabin|Desert-Resistant Cabin Design|desert climate cabin"
    ["entertainment-series-en.html"]="Entertainment Series|Entertainment Cabin Solutions|entertainment cabin"
    ["guest-series-en.html"]="Guest Series|Guest Cabin Collection|guest accommodation"
    ["majlis-lounge-en.html"]="Majlis Lounge|Traditional Majlis Cabin|majlis lounge cabin"
    ["middle-east-series-en.html"]="Middle East Series|Middle East Cabin Collection|middle east cabin"
    ["office-series-en.html"]="Office Series|Office Cabin Solutions|office workspace"
    ["poolside-villa-en.html"]="Poolside Villa|Luxury Poolside Cabin|poolside luxury cabin"
    ["process.html"]="Our Process|Cabin Construction Process|construction process"
    ["rooftop-luxury-en.html"]="Rooftop Luxury|Luxury Rooftop Cabin|rooftop luxury cabin"
)

# Create each page
for filename in "${!pages[@]}"; do
    IFS='|' read -r title subtitle description <<< "${pages[$filename]}"

    # Create page based on the template
    sed "s/Medium Guest Cabin/$title/g" backyard-guest-medium-en.html | \
    sed "s/Perfect backyard guest accommodation for family and friends/$subtitle/g" | \
    sed "s/Perfect medium-sized backyard guest cabin featuring modern design, premium materials, and comfortable living space/$description/g" > "$filename"

    echo "Created: $filename"
done

echo "All missing pages created!"