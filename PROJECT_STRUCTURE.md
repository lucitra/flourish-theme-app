# HubSpot Project Structure

## Overview

We use separate HubSpot projects for each environment to maintain clean separation and enable proper GitHub branch integration.

## Project Names

- **Dev**: `flourish-theme-dev`
- **Staging**: `flourish-theme-staging`  
- **Prod**: `flourish-theme-prod`

## Branch Mapping

Each project is connected to a specific GitHub branch:

| Environment | Project Name | GitHub Branch | 
|------------|--------------|---------------|
| Development | flourish-theme-dev | develop |
| Staging | flourish-theme-staging | staging |
| Production | flourish-theme-prod | main |

## Creating Projects

Run the setup script to configure each environment:

```bash
./scripts/create-environment-projects.sh
```

This script will:
1. Update hsproject.json with the environment-specific project name
2. Update public-app.json with environment-specific settings
3. Guide you through creating each project in HubSpot

## Manual Steps After Project Creation

For each project:

1. **Upload the project**:
   ```bash
   hs project upload
   ```
   Choose "Create new project" and use the environment-specific name

2. **Connect GitHub branch**:
   - Go to the project in HubSpot
   - Click "GitHub" in the left sidebar
   - Connect the appropriate branch

3. **Note the App ID**:
   - Each project will have its own App ID
   - Store these for reference

## Environment URLs

Each environment has its own OAuth and webhook servers:

### Dev
- OAuth: https://lucitra-oauth-server-dev-ygq5jwikta-uc.a.run.app
- Webhook: https://lucitra-webhook-server-dev-ygq5jwikta-uc.a.run.app

### Staging  
- OAuth: https://lucitra-oauth-server-staging-ygq5jwikta-uc.a.run.app
- Webhook: https://lucitra-webhook-server-staging-ygq5jwikta-uc.a.run.app

### Prod
- OAuth: https://lucitra-oauth-server-prod-ygq5jwikta-uc.a.run.app
- Webhook: https://lucitra-webhook-server-prod-ygq5jwikta-uc.a.run.app

## Deployment Flow

1. **Development**: Push to `develop` branch → Auto-deploys to dev project
2. **Staging**: Merge to `staging` branch → Auto-deploys to staging project
3. **Production**: Merge to `main` branch → Auto-deploys to prod project

## Benefits

- **Isolation**: Each environment is completely separate
- **Testing**: Can test changes in dev/staging before production
- **Rollback**: Can revert individual environments
- **Security**: Different credentials per environment