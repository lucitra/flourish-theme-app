#!/usr/bin/env node

// Script to update webhook URLs and app configuration based on environment
const fs = require('fs');
const path = require('path');

const environment = process.argv[2];

if (!environment || !['dev', 'staging', 'prod'].includes(environment)) {
  console.error('Usage: node update-environment.js <dev|staging|prod>');
  process.exit(1);
}

// Environment-specific configurations
const configs = {
  dev: {
    name: 'Flourish Theme - Dev',
    webhookUrl: 'https://lucitra-webhook-server-dev-ygq5jwikta-uc.a.run.app/webhook',
    oauthUrl: 'https://lucitra-oauth-server-dev-ygq5jwikta-uc.a.run.app/oauth-callback',
    allowedUrls: [
      'https://lucitra-oauth-server-dev-ygq5jwikta-uc.a.run.app',
      'https://lucitra-webhook-server-dev-ygq5jwikta-uc.a.run.app'
    ]
  },
  staging: {
    name: 'Flourish Theme - Staging',
    webhookUrl: 'https://lucitra-webhook-server-staging-ygq5jwikta-uc.a.run.app/webhook',
    oauthUrl: 'https://lucitra-oauth-server-staging-ygq5jwikta-uc.a.run.app/oauth-callback',
    allowedUrls: [
      'https://lucitra-oauth-server-staging-ygq5jwikta-uc.a.run.app',
      'https://lucitra-webhook-server-staging-ygq5jwikta-uc.a.run.app'
    ]
  },
  prod: {
    name: 'Flourish Theme',
    webhookUrl: 'https://lucitra-webhook-server-prod-ygq5jwikta-uc.a.run.app/webhook',
    oauthUrl: 'https://lucitra-oauth-server-prod-ygq5jwikta-uc.a.run.app/oauth-callback',
    allowedUrls: [
      'https://lucitra-oauth-server-prod-ygq5jwikta-uc.a.run.app',
      'https://lucitra-webhook-server-prod-ygq5jwikta-uc.a.run.app'
    ]
  }
};

const config = configs[environment];

// Update webhooks.json
const webhooksPath = path.join(__dirname, '../src/app/webhooks/webhooks.json');
const webhooksConfig = JSON.parse(fs.readFileSync(webhooksPath, 'utf8'));
webhooksConfig.settings.targetUrl = config.webhookUrl;
fs.writeFileSync(webhooksPath, JSON.stringify(webhooksConfig, null, 2) + '\n');

// Update public-app.json
const publicAppPath = path.join(__dirname, '../src/app/public-app.json');
const publicAppConfig = JSON.parse(fs.readFileSync(publicAppPath, 'utf8'));

// Update app name
publicAppConfig.name = config.name;

// Update allowed URLs
publicAppConfig.allowedUrls = config.allowedUrls;

// Update OAuth redirect URLs
publicAppConfig.auth.redirectUrls = [config.oauthUrl];

// Add environment indicator to description (only for non-prod)
if (environment === 'prod') {
  publicAppConfig.description = 'Flourish Theme - A HubSpot public app for managing themes.';
} else {
  publicAppConfig.description = `Flourish Theme - A HubSpot public app for managing themes. [${environment.toUpperCase()}]`;
}

fs.writeFileSync(publicAppPath, JSON.stringify(publicAppConfig, null, 2) + '\n');

console.log(`✅ Updated configuration for ${environment} environment:`);
console.log(`   App Name: ${config.name}`);
console.log(`   Webhook URL: ${config.webhookUrl}`);
console.log(`   OAuth URL: ${config.oauthUrl}`);
console.log('\n📝 Next steps:');
console.log(`   1. Commit these changes: git add -A && git commit -m "chore: update configuration for ${environment} environment"`);
console.log(`   2. Push to branch: git push origin ${environment === 'dev' ? 'develop' : environment === 'prod' ? 'main' : 'staging'}`);
console.log(`   3. HubSpot will automatically deploy via GitHub integration`);