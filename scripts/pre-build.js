#!/usr/bin/env node

// Pre-build script that runs automatically when HubSpot builds from GitHub
// This configures the app based on the current branch

const fs = require('fs');
const path = require('path');

// Detect environment from git branch or environment variable
function detectEnvironment() {
  // Check if HubSpot provides branch info
  if (process.env.GITHUB_REF_NAME) {
    const branch = process.env.GITHUB_REF_NAME;
    if (branch === 'main') return 'prod';
    if (branch === 'staging') return 'staging';
    if (branch === 'develop') return 'dev';
  }
  
  // Check current git branch
  try {
    const { execSync } = require('child_process');
    const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    if (branch === 'main') return 'prod';
    if (branch === 'staging') return 'staging';
    if (branch === 'develop') return 'dev';
  } catch (e) {
    console.log('Could not detect git branch');
  }
  
  // Default to dev
  return 'dev';
}

// Environment configurations
const configs = {
  dev: {
    projectName: 'flourish-theme-dev',
    appName: 'Flourish Theme - Dev',
    webhookUrl: 'https://lucitra-webhook-server-dev-ygq5jwikta-uc.a.run.app/webhook',
    oauthUrl: 'https://lucitra-oauth-server-dev-ygq5jwikta-uc.a.run.app/oauth-callback',
    allowedUrls: [
      'https://lucitra-oauth-server-dev-ygq5jwikta-uc.a.run.app',
      'https://lucitra-webhook-server-dev-ygq5jwikta-uc.a.run.app'
    ]
  },
  staging: {
    projectName: 'flourish-theme-staging',
    appName: 'Flourish Theme - Staging',
    webhookUrl: 'https://lucitra-webhook-server-staging-ygq5jwikta-uc.a.run.app/webhook',
    oauthUrl: 'https://lucitra-oauth-server-staging-ygq5jwikta-uc.a.run.app/oauth-callback',
    allowedUrls: [
      'https://lucitra-oauth-server-staging-ygq5jwikta-uc.a.run.app',
      'https://lucitra-webhook-server-staging-ygq5jwikta-uc.a.run.app'
    ]
  },
  prod: {
    projectName: 'flourish-theme-prod',
    appName: 'Flourish Theme',
    webhookUrl: 'https://lucitra-webhook-server-prod-ygq5jwikta-uc.a.run.app/webhook',
    oauthUrl: 'https://lucitra-oauth-server-prod-ygq5jwikta-uc.a.run.app/oauth-callback',
    allowedUrls: [
      'https://lucitra-oauth-server-prod-ygq5jwikta-uc.a.run.app',
      'https://lucitra-webhook-server-prod-ygq5jwikta-uc.a.run.app'
    ]
  }
};

const environment = detectEnvironment();
const config = configs[environment];

console.log(`🔧 Configuring for environment: ${environment}`);
console.log(`   Project: ${config.projectName}`);
console.log(`   Branch: ${process.env.GITHUB_REF_NAME || 'local'}`);

// Update hsproject.json
const hsprojectPath = path.join(__dirname, '..', 'hsproject.json');
const hsproject = {
  name: config.projectName,
  srcDir: 'src',
  platformVersion: '2025.1'
};
fs.writeFileSync(hsprojectPath, JSON.stringify(hsproject, null, 2));
console.log('✅ Updated hsproject.json');

// Update public-app.json
const appConfigPath = path.join(__dirname, '..', 'src', 'app', 'public-app.json');
const appConfig = JSON.parse(fs.readFileSync(appConfigPath, 'utf8'));

appConfig.name = config.appName;
appConfig.description = `Flourish Theme - A HubSpot public app for managing themes. [${environment.toUpperCase()}]`;
appConfig.allowedUrls = config.allowedUrls;
appConfig.auth.redirectUrls = [config.oauthUrl];

fs.writeFileSync(appConfigPath, JSON.stringify(appConfig, null, 2));
console.log('✅ Updated public-app.json');

// Update webhooks.json
const webhooksPath = path.join(__dirname, '..', 'src', 'app', 'webhooks', 'webhooks.json');
const webhooks = JSON.parse(fs.readFileSync(webhooksPath, 'utf8'));

webhooks.settings.targetUrl = config.webhookUrl;

fs.writeFileSync(webhooksPath, JSON.stringify(webhooks, null, 2));
console.log('✅ Updated webhooks.json');

console.log(`\n🎉 Configuration complete for ${environment} environment!`);