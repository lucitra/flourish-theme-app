#!/bin/bash

# Deployment script for HubSpot app environments

ENVIRONMENT=$1
ACCOUNT_ID=${2:-243261134}

if [ -z "$ENVIRONMENT" ] || ! [[ "$ENVIRONMENT" =~ ^(dev|staging|prod)$ ]]; then
  echo "Usage: ./deploy-environment.sh <dev|staging|prod> [account-id]"
  exit 1
fi

# Map environments to branches
BRANCH="develop"
if [ "$ENVIRONMENT" = "staging" ]; then
  BRANCH="staging"
elif [ "$ENVIRONMENT" = "prod" ]; then
  BRANCH="main"
fi

echo "🚀 Deploying HubSpot app to $ENVIRONMENT environment..."
echo "   Branch: $BRANCH"
echo "   Account: $ACCOUNT_ID"
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

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
  git push origin $BRANCH
fi

# Upload to HubSpot
echo "📤 Uploading to HubSpot..."
hs project upload --account=$ACCOUNT_ID

# Deploy
echo "🚢 Deploying to HubSpot..."
hs project deploy --account=$ACCOUNT_ID --build=current

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Environment URLs:"
echo "   OAuth: https://lucitra-oauth-server-$ENVIRONMENT-ygq5jwikta-uc.a.run.app"
echo "   Webhook: https://lucitra-webhook-server-$ENVIRONMENT-ygq5jwikta-uc.a.run.app"
echo ""
echo "🔍 To view logs:"
echo "   OAuth: gcloud run services logs lucitra-oauth-server-$ENVIRONMENT --region us-central1 --tail"
echo "   Webhook: gcloud run services logs lucitra-webhook-server-$ENVIRONMENT --region us-central1 --tail"