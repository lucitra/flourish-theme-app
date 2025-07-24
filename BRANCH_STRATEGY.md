# HubSpot App Branch Strategy

## Overview

The HubSpot app follows the same three-environment branch strategy as the OAuth and Webhook servers:

```
develop → staging → main
   ↓        ↓        ↓
  dev    staging   prod
```

## Branch Mapping

| Branch | Environment | OAuth Server | Webhook Server |
|--------|-------------|--------------|----------------|
| develop | dev | lucitra-oauth-server-dev | lucitra-webhook-server-dev |
| staging | staging | lucitra-oauth-server-staging | lucitra-webhook-server-staging |
| main | prod | lucitra-oauth-server-prod | lucitra-webhook-server-prod |

## Deployment Workflow

### 1. Development (develop branch)
```bash
git checkout develop
./scripts/deploy-environment.sh dev
```

### 2. Staging (staging branch)
```bash
# Create PR from develop to staging
gh pr create --base staging --head develop --title "Deploy to staging"

# After merge
git checkout staging
git pull origin staging
./scripts/deploy-environment.sh staging
```

### 3. Production (main branch)
```bash
# Create PR from staging to main
gh pr create --base main --head staging --title "Deploy to production"

# After merge
git checkout main
git pull origin main
./scripts/deploy-environment.sh prod
```

## Environment URLs Update

The `update-environment.js` script automatically updates:
- Webhook URL in `src/app/webhooks/webhooks.json`
- OAuth redirect URL in `src/app/public-app.json`

## Quick Commands

```bash
# Update URLs for current environment
npm run update-env dev|staging|prod

# Deploy to HubSpot
npm run deploy dev|staging|prod

# Manual deployment
hs project upload --account=243261134
hs project deploy --account=243261134
```

## Important Notes

1. Always ensure you're on the correct branch before deploying
2. The script will automatically update URLs based on the environment
3. Changes are committed and pushed automatically
4. HubSpot deployment requires proper credentials to be set up

## Monitoring

After deployment, monitor the integration:

```bash
# Check OAuth server logs
gcloud run services logs lucitra-oauth-server-dev --region us-central1 --tail

# Check Webhook server logs
gcloud run services logs lucitra-webhook-server-dev --region us-central1 --tail
```