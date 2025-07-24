#!/bin/bash

# Script to create separate HubSpot projects for each environment

set -e

ENVIRONMENTS=("dev" "staging" "prod")
BASE_PROJECT_NAME="flourish-theme"

echo "🚀 Creating separate HubSpot projects for each environment"
echo ""

for ENV in "${ENVIRONMENTS[@]}"; do
  PROJECT_NAME="${BASE_PROJECT_NAME}-${ENV}"
  
  echo "📁 Setting up project: $PROJECT_NAME"
  
  # Update hsproject.json with environment-specific name
  cat > hsproject.json << EOF
{
  "name": "$PROJECT_NAME",
  "srcDir": "src",
  "platformVersion": "2025.1"
}
EOF
  
  # Update the app configuration for the environment
  node scripts/update-environment.js $ENV
  
  echo "   ✅ Configuration updated for $ENV"
  echo ""
  
  # Instructions for manual steps
  echo "   📋 Next steps for $PROJECT_NAME:"
  echo "   1. Run: hs project upload"
  echo "   2. When prompted, create a NEW project named: $PROJECT_NAME"
  echo "   3. After upload, connect the ${ENV} branch in HubSpot UI"
  echo "   4. Note the App ID for this environment"
  echo ""
  echo "   Press Enter when ready to continue to next environment..."
  read
done

echo "✅ All environment projects configured!"
echo ""
echo "📝 Don't forget to:"
echo "1. Store the App IDs for each environment"
echo "2. Set up secrets using: manage-all-secrets.sh set <env>"
echo "3. Connect GitHub branches in each project:"
echo "   - develop branch → ${BASE_PROJECT_NAME}-dev"
echo "   - staging branch → ${BASE_PROJECT_NAME}-staging"
echo "   - main branch → ${BASE_PROJECT_NAME}-prod"