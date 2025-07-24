#!/usr/bin/env node

// Script to update webhook URLs based on environment
const fs = require('fs');
const path = require('path');

const environment = process.argv[2];

if (!environment || !['dev', 'staging', 'prod'].includes(environment)) {
  console.error('Usage: node update-environment.js <dev|staging|prod>');
  process.exit(1);
}

// Environment-specific webhook URLs
const webhookUrls = {
  dev: 'https://lucitra-webhook-server-dev-ygq5jwikta-uc.a.run.app/webhook',
  staging: 'https://lucitra-webhook-server-staging-ygq5jwikta-uc.a.run.app/webhook',
  prod: 'https://lucitra-webhook-server-prod-ygq5jwikta-uc.a.run.app/webhook'
};

// Environment-specific OAuth redirect URLs
const oauthUrls = {
  dev: 'https://lucitra-oauth-server-dev-ygq5jwikta-uc.a.run.app/oauth-callback',
  staging: 'https://lucitra-oauth-server-staging-ygq5jwikta-uc.a.run.app/oauth-callback',
  prod: 'https://lucitra-oauth-server-prod-ygq5jwikta-uc.a.run.app/oauth-callback'
};

// Update webhooks.json
const webhooksPath = path.join(__dirname, '../src/app/webhooks/webhooks.json');
const webhooksConfig = JSON.parse(fs.readFileSync(webhooksPath, 'utf8'));
webhooksConfig.settings.targetUrl = webhookUrls[environment];
fs.writeFileSync(webhooksPath, JSON.stringify(webhooksConfig, null, 2) + '\n');

// Update public-app.json
const publicAppPath = path.join(__dirname, '../src/app/public-app.json');
const publicAppConfig = JSON.parse(fs.readFileSync(publicAppPath, 'utf8'));

// Keep localhost and add the environment-specific URL
publicAppConfig.auth.redirectUrls = [
  'http://localhost:3000/oauth-callback',
  oauthUrls[environment]
];

// Remove any other environment URLs
Object.values(oauthUrls).forEach(url => {
  if (url !== oauthUrls[environment]) {
    const index = publicAppConfig.auth.redirectUrls.indexOf(url);
    if (index > -1) {
      publicAppConfig.auth.redirectUrls.splice(index, 1);
    }
  }
});

fs.writeFileSync(publicAppPath, JSON.stringify(publicAppConfig, null, 2) + '\n');

console.log(`✅ Updated configuration for ${environment} environment:`);
console.log(`   Webhook URL: ${webhookUrls[environment]}`);
console.log(`   OAuth URL: ${oauthUrls[environment]}`);
console.log('\n📝 Next steps:');
console.log(`   1. Commit these changes: git add -A && git commit -m "chore: update URLs for ${environment} environment"`);
console.log(`   2. Push to branch: git push origin ${environment === 'dev' ? 'develop' : environment === 'prod' ? 'main' : 'staging'}`);
console.log(`   3. Deploy to HubSpot: hs project upload && hs project deploy`);