#!/bin/bash

# Smart Inventory Pro - iOS Build Script
# Run this script to build and deploy to iOS

echo "🍎 Building Smart Inventory Pro for iOS..."

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 2: Build the web app
echo "🔨 Building web application..."
npm run build

# Step 3: Remove existing iOS platform and add fresh one
echo "🗑️  Removing existing iOS platform..."
rm -rf ios

echo "📱 Adding iOS platform..."
npx cap add ios

# Step 4: Copy web assets to iOS
echo "📋 Copying web assets to iOS..."
npx cap copy ios

# Step 5: Sync Capacitor plugins
echo "🔄 Syncing Capacitor plugins..."
npx cap sync ios

# Step 6: Open in Xcode
echo "🚀 Opening in Xcode..."
npx cap open ios

echo "✅ iOS build complete!"
echo ""
echo "📋 Next steps in Xcode:"
echo "1. Select your development team"
echo "2. Set Bundle Identifier: com.smartinventory.pro"
echo "3. Configure signing certificates"
echo "4. Build and run on device or simulator"
echo ""
echo "🏪 For App Store submission:"
echo "1. Archive the build (Product → Archive)"
echo "2. Upload to App Store Connect"
echo "3. Submit for review"
echo ""
echo "🎉 Your restaurant inventory app is ready to revolutionize the industry!"