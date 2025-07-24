#!/bin/bash

# Simplified deployment script for HubSpot GitHub integration

ENVIRONMENT=$1

if [ -z "$ENVIRONMENT" ] || ! [[ "$ENVIRONMENT" =~ ^(dev|staging|prod)$ ]]; then
  echo "Usage: ./push-environment.sh <dev|staging|prod>"
  exit 1
fi

# Map environments to branches
BRANCH="develop"
if [ "$ENVIRONMENT" = "staging" ]; then
  BRANCH="staging"
elif [ "$ENVIRONMENT" = "prod" ]; then
  BRANCH="main"
fi

echo "🚀 Preparing $ENVIRONMENT environment for HubSpot deployment..."
echo "   Branch: $BRANCH"
echo ""

# Ensure we're on the right branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "$BRANCH" ]; then
  echo "❌ You're on branch '$CURRENT_BRANCH' but need to be on '$BRANCH'"
  echo "   Run: git checkout $BRANCH"
  exit 1
fi

# Update environment URLs
echo "📝 Updating environment URLs..."
node scripts/update-environment.js $ENVIRONMENT

# Check if there are changes
if ! git diff --quiet; then
  echo "📦 Committing environment changes..."
  git add -A
  git commit -m "chore: update URLs for $ENVIRONMENT environment

- Webhook URL updated for $ENVIRONMENT
- OAuth redirect URL updated for $ENVIRONMENT
- Ready for HubSpot auto-deployment

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
fi

# Push to trigger HubSpot deployment
echo "📤 Pushing to $BRANCH branch..."
git push origin $BRANCH

echo ""
echo "✅ Pushed successfully!"
echo ""
echo "🚢 HubSpot will automatically deploy from the $BRANCH branch"
echo ""
echo "📋 Environment URLs:"
echo "   OAuth: https://lucitra-oauth-server-$ENVIRONMENT-ygq5jwikta-uc.a.run.app"
echo "   Webhook: https://lucitra-webhook-server-$ENVIRONMENT-ygq5jwikta-uc.a.run.app"
echo ""
echo "🔍 To monitor deployment:"
echo "   1. Check HubSpot app dashboard"
echo "   2. View OAuth logs: gcloud run services logs lucitra-oauth-server-$ENVIRONMENT --region us-central1 --tail"
echo "   3. View Webhook logs: gcloud run services logs lucitra-webhook-server-$ENVIRONMENT --region us-central1 --tail"