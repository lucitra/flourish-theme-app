# Environment Setup Guide

## Architecture Overview

We use a **single HubSpot project** with **environment-specific configurations** that are managed through the codebase:

```
Single HubSpot Project
        |
        ├── develop branch → Dev Configuration → Dev Backend Services
        ├── staging branch → Staging Configuration → Staging Backend Services
        └── main branch → Production Configuration → Production Backend Services
```

## Key Benefits

1. **Single Project Management**: One HubSpot project to maintain
2. **Configuration as Code**: Environment differences are in the codebase
3. **Automatic Environment Switching**: Branch determines the environment
4. **GitHub Integration**: HubSpot automatically deploys on push

## Environment Configurations

Each environment has different:
- App name (shown in HubSpot)
- Webhook URLs
- OAuth redirect URLs
- Allowed URLs
- Description with environment indicator

### Dev Environment (develop branch)
- **Name**: "Flourish Theme - Dev"
- **OAuth**: https://lucitra-oauth-server-dev-ygq5jwikta-uc.a.run.app/oauth-callback
- **Webhook**: https://lucitra-webhook-server-dev-ygq5jwikta-uc.a.run.app/webhook

### Staging Environment (staging branch)
- **Name**: "Flourish Theme - Staging"
- **OAuth**: https://lucitra-oauth-server-staging-ygq5jwikta-uc.a.run.app/oauth-callback
- **Webhook**: https://lucitra-webhook-server-staging-ygq5jwikta-uc.a.run.app/webhook

### Production Environment (main branch)
- **Name**: "Flourish Theme"
- **OAuth**: https://lucitra-oauth-server-prod-ygq5jwikta-uc.a.run.app/oauth-callback
- **Webhook**: https://lucitra-webhook-server-prod-ygq5jwikta-uc.a.run.app/webhook

## Setup Instructions

### 1. Initial HubSpot Project Setup

1. Go to https://app.hubspot.com/developers/243261134/projects
2. Create a new project or use existing "flourish-theme-app"
3. Connect GitHub repository:
   - Repository: `lucitra/flourish-theme-app`
   - Enable automatic deployments

### 2. Configure GitHub Branch Deployments

In HubSpot project settings:
1. Set up branch deployments:
   - `develop` → Development builds
   - `staging` → Staging builds
   - `main` → Production builds
2. Enable automatic deployment on push for each branch

### 3. Set Backend Service Credentials

For each environment, configure the OAuth and Webhook servers:

#### Development:
```bash
# Get credentials from HubSpot app (they're the same for all environments)
CLIENT_ID="your-client-id"
CLIENT_SECRET="your-client-secret"
WEBHOOK_SECRET="your-webhook-secret"

# OAuth Server
cd /path/to/lucitra-oauth-server
./scripts/set-env-vars.sh dev $CLIENT_ID $CLIENT_SECRET

# Webhook Server
gcloud run services update lucitra-webhook-server-dev \
  --set-env-vars HUBSPOT_WEBHOOK_SECRET=$WEBHOOK_SECRET \
  --region us-central1
```

#### Staging:
```bash
# OAuth Server
./scripts/set-env-vars.sh staging $CLIENT_ID $CLIENT_SECRET

# Webhook Server
gcloud run services update lucitra-webhook-server-staging \
  --set-env-vars HUBSPOT_WEBHOOK_SECRET=$WEBHOOK_SECRET \
  --region us-central1
```

#### Production:
```bash
# OAuth Server
./scripts/set-env-vars.sh prod $CLIENT_ID $CLIENT_SECRET

# Webhook Server
gcloud run services update lucitra-webhook-server-prod \
  --set-env-vars HUBSPOT_WEBHOOK_SECRET=$WEBHOOK_SECRET \
  --region us-central1
```

## Deployment Workflow

### Automatic Deployment (Recommended)

1. **Development**:
   ```bash
   git checkout develop
   ./scripts/push-environment.sh dev
   # Pushes to develop branch → HubSpot auto-deploys
   ```

2. **Staging**:
   ```bash
   git checkout staging
   git merge develop
   ./scripts/push-environment.sh staging
   # Pushes to staging branch → HubSpot auto-deploys
   ```

3. **Production**:
   ```bash
   git checkout main
   git merge staging
   ./scripts/push-environment.sh prod
   # Pushes to main branch → HubSpot auto-deploys
   ```

### Manual Configuration Update

If you need to update environment-specific settings:

```bash
# Switch to appropriate branch
git checkout develop  # or staging/main

# Update configuration
node scripts/update-environment.js dev  # or staging/prod

# Commit and push
git add -A
git commit -m "chore: update dev environment configuration"
git push origin develop
```

## Configuration Management

The `update-environment.js` script manages:
- App name per environment
- Webhook URLs
- OAuth redirect URLs
- Allowed URLs
- Description with environment tags

To modify environment settings, edit the `configs` object in `scripts/update-environment.js`.

## Monitoring

### Check Deployment Status
- HubSpot Project Dashboard: https://app.hubspot.com/developers/243261134/projects

### Monitor Backend Services
```bash
# OAuth Server Logs
gcloud run services logs lucitra-oauth-server-dev --region us-central1 --tail

# Webhook Server Logs
gcloud run services logs lucitra-webhook-server-dev --region us-central1 --tail
```

## Troubleshooting

### Configuration Not Updating
1. Ensure you're on the correct branch
2. Run `node scripts/update-environment.js <env>`
3. Commit and push changes
4. Check HubSpot project for deployment status

### OAuth/Webhook Failures
1. Verify backend services are running
2. Check credentials are set correctly
3. Ensure URLs match exactly in configuration
4. Monitor logs for errors

## Best Practices

1. **Always update configuration** before pushing to a branch
2. **Test in dev** before promoting to staging
3. **Verify staging** before promoting to production
4. **Monitor logs** after deployment
5. **Keep credentials secure** and environment-specific