# HubSpot GitHub Integration Setup

HubSpot provides native GitHub integration that automatically deploys your app when you push to connected branches.

## Prerequisites

1. First deploy your app using `hs project upload`
2. Have separate HubSpot apps for each environment (dev, staging, prod)

## Setup Steps

### 1. Connect GitHub Repository

After uploading your app with `hs project upload`:

1. Go to your HubSpot developer account
2. Navigate to your app
3. Click on "GitHub" in the left sidebar
4. Click "Connect repository"
5. Select your GitHub repository: `hubspot-apps/flourish-theme-app`
6. Choose the branch to connect:
   - `develop` branch → Dev app
   - `staging` branch → Staging app
   - `main` branch → Prod app

### 2. Environment-Specific Configuration

Each branch should have its own app configuration:

- **Dev**: Connected to `develop` branch
  - Webhook URL: `https://lucitra-webhook-server-dev-ygq5jwikta-uc.a.run.app/webhook`
  - OAuth URL: `https://lucitra-oauth-server-dev-ygq5jwikta-uc.a.run.app/oauth-callback`

- **Staging**: Connected to `staging` branch
  - Webhook URL: `https://lucitra-webhook-server-staging-ygq5jwikta-uc.a.run.app/webhook`
  - OAuth URL: `https://lucitra-oauth-server-staging-ygq5jwikta-uc.a.run.app/oauth-callback`

- **Prod**: Connected to `main` branch
  - Webhook URL: `https://lucitra-webhook-server-prod-ygq5jwikta-uc.a.run.app/webhook`
  - OAuth URL: `https://lucitra-oauth-server-prod-ygq5jwikta-uc.a.run.app/oauth-callback`

### 3. Automatic Deployment

Once connected, HubSpot will automatically:
- Deploy when you push to the connected branch
- Update the app with changes from `public-app.json`
- Update webhook configurations from `webhooks.json`
- Deploy UI extensions and serverless functions

### 4. Branch Protection

To ensure code quality, set up branch protection rules:

1. Go to GitHub repository settings
2. Navigate to Branches
3. Add protection rules for:
   - `main`: Require PR reviews, status checks
   - `staging`: Require PR reviews
   - `develop`: Optional protection

## Important Notes

- No GitHub Actions needed - HubSpot handles deployment automatically
- Changes to `public-app.json` are applied on deployment
- Webhook URLs and OAuth redirect URLs must match your deployed servers
- Each environment should have its own HubSpot app

## Credentials Storage

Store app credentials securely:
- Use Google Secret Manager for server credentials
- Never commit credentials to the repository
- Each environment has its own client ID and secret