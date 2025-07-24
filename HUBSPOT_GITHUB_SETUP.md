# HubSpot GitHub Integration Setup

## Overview

HubSpot Projects support native GitHub integration that automatically deploys based on branch pushes. This guide helps you set up separate apps for each environment using HubSpot's built-in GitHub connection.

## Environment Structure

```
GitHub Branch → HubSpot App → Backend Services
develop       → Dev App      → lucitra-oauth-server-dev + lucitra-webhook-server-dev
staging       → Staging App  → lucitra-oauth-server-staging + lucitra-webhook-server-staging
main          → Prod App     → lucitra-oauth-server-prod + lucitra-webhook-server-prod
```

## Setup Steps

### 1. Create Environment-Specific Apps in HubSpot

For each environment (dev, staging, prod), you'll need to:

1. Go to https://app.hubspot.com/developers/243261134/applications
2. Click "Create app"
3. Name it appropriately:
   - `Flourish Theme - Dev`
   - `Flourish Theme - Staging`
   - `Flourish Theme - Prod`

### 2. Configure Each App

For each app, configure:

#### Auth Settings:
- **Client ID**: (auto-generated)
- **Client Secret**: (auto-generated)
- **Redirect URLs**: 
  - Dev: `https://lucitra-oauth-server-dev-ygq5jwikta-uc.a.run.app/oauth-callback`
  - Staging: `https://lucitra-oauth-server-staging-ygq5jwikta-uc.a.run.app/oauth-callback`
  - Prod: `https://lucitra-oauth-server-prod-ygq5jwikta-uc.a.run.app/oauth-callback`

#### Webhook Settings:
- **Target URL**:
  - Dev: `https://lucitra-webhook-server-dev-ygq5jwikta-uc.a.run.app/webhook`
  - Staging: `https://lucitra-webhook-server-staging-ygq5jwikta-uc.a.run.app/webhook`
  - Prod: `https://lucitra-webhook-server-prod-ygq5jwikta-uc.a.run.app/webhook`

### 3. Connect GitHub Repository

For each app:

1. In HubSpot, go to the app's settings
2. Navigate to "GitHub Integration" or "Version Control"
3. Connect to repository: `lucitra/flourish-theme-app`
4. Select the appropriate branch:
   - Dev App → `develop` branch
   - Staging App → `staging` branch
   - Prod App → `main` branch
5. Enable automatic deployment on push

### 4. Configure OAuth/Webhook Servers

For each environment, set the credentials:

#### Dev Environment:
```bash
# OAuth Server
cd /Users/ibraheem/Projects/react-projects/hubspot-apps/lucitra-oauth-server
./scripts/set-env-vars.sh dev DEV_CLIENT_ID DEV_CLIENT_SECRET

# Webhook Server
gcloud run services update lucitra-webhook-server-dev \
  --set-env-vars HUBSPOT_WEBHOOK_SECRET=DEV_WEBHOOK_SECRET \
  --region us-central1
```

#### Staging Environment:
```bash
# OAuth Server
./scripts/set-env-vars.sh staging STAGING_CLIENT_ID STAGING_CLIENT_SECRET

# Webhook Server
gcloud run services update lucitra-webhook-server-staging \
  --set-env-vars HUBSPOT_WEBHOOK_SECRET=STAGING_WEBHOOK_SECRET \
  --region us-central1
```

#### Production Environment:
```bash
# OAuth Server
./scripts/set-env-vars.sh prod PROD_CLIENT_ID PROD_CLIENT_SECRET

# Webhook Server
gcloud run services update lucitra-webhook-server-prod \
  --set-env-vars HUBSPOT_WEBHOOK_SECRET=PROD_WEBHOOK_SECRET \
  --region us-central1
```

## Workflow

Once set up, the workflow is automatic:

1. **Development**: Push to `develop` → Auto-deploys to Dev App
2. **Staging**: Merge to `staging` → Auto-deploys to Staging App
3. **Production**: Merge to `main` → Auto-deploys to Prod App

## Environment Variables Reference

Store these securely for each environment:

### Dev App
- App ID: `<dev-app-id>`
- Client ID: `<dev-client-id>`
- Client Secret: `<dev-client-secret>`
- Webhook Secret: `<dev-webhook-secret>`

### Staging App
- App ID: `<staging-app-id>`
- Client ID: `<staging-client-id>`
- Client Secret: `<staging-client-secret>`
- Webhook Secret: `<staging-webhook-secret>`

### Prod App
- App ID: `<prod-app-id>`
- Client ID: `<prod-client-id>`
- Client Secret: `<prod-client-secret>`
- Webhook Secret: `<prod-webhook-secret>`

## Testing Each Environment

### Test OAuth Flow:
```bash
# Replace with actual client ID for each environment
open "https://app.hubspot.com/oauth/authorize?client_id=CLIENT_ID&redirect_uri=REDIRECT_URI&scope=crm.objects.contacts.read"
```

### Monitor Logs:
```bash
# OAuth Server
gcloud run services logs lucitra-oauth-server-dev --region us-central1 --tail

# Webhook Server
gcloud run services logs lucitra-webhook-server-dev --region us-central1 --tail
```

## Benefits of This Setup

1. **Automatic Deployments**: Push to branch = automatic deployment
2. **Environment Isolation**: Each environment has its own credentials
3. **Native Integration**: Uses HubSpot's built-in GitHub support
4. **No Custom CI/CD**: Simpler setup, maintained by HubSpot

## Notes

- Each app needs its own App ID in HubSpot
- The project structure remains the same across all apps
- Only the credentials and URLs differ between environments
- HubSpot handles the build and deployment process