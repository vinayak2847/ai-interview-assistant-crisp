# 🚀 Deployment Guide

This guide covers different deployment options for the AI Interview Assistant.

## 🌐 Vercel (Recommended)

### Automatic Deployment
1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically deploy on every push

### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Vercel Configuration
Create `vercel.json`:
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## 🌐 Netlify

### Automatic Deployment
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

### Manual Deployment
```bash
# Build the project
npm run build

# Upload the dist/ folder to Netlify
```

### Netlify Configuration
Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 🌐 GitHub Pages

### Setup
1. Enable GitHub Pages in repository settings
2. Use GitHub Actions for automatic deployment

### GitHub Actions Workflow
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 🌐 AWS S3 + CloudFront

### Setup
1. Create an S3 bucket
2. Enable static website hosting
3. Set up CloudFront distribution

### Deployment Script
```bash
#!/bin/bash
# Build the project
npm run build

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 🌐 Docker Deployment

### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Docker Commands
```bash
# Build image
docker build -t ai-interview-assistant .

# Run container
docker run -p 80:80 ai-interview-assistant
```

## 🔧 Environment Variables

### Production Environment
```bash
# Optional: Email service configuration
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# Optional: Analytics
VITE_GA_TRACKING_ID=your_ga_id
```

### Development Environment
```bash
# Copy .env.example to .env.local
cp .env.example .env.local

# Edit .env.local with your values
```

## 📊 Performance Optimization

### Build Optimization
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist

# Optimize images
npm install -g imagemin-cli
imagemin src/assets/*.{jpg,png} --out-dir=dist/assets
```

### CDN Configuration
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          antd: ['antd'],
          utils: ['axios', 'pdf-parse']
        }
      }
    }
  }
})
```

## 🔒 Security Considerations

### HTTPS
- Always use HTTPS in production
- Configure proper SSL certificates
- Use HSTS headers

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline';">
```

## 📈 Monitoring

### Error Tracking
```javascript
// Add to main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.NODE_ENV,
});
```

### Analytics
```javascript
// Add to App.tsx
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <div>
      <YourApp />
      <Analytics />
    </div>
  );
}
```

## 🚀 Quick Deploy Commands

### Vercel
```bash
npm i -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Drag and drop dist/ folder to Netlify
```

### GitHub Pages
```bash
npm run build
npx gh-pages -d dist
```

---

**Choose the deployment method that best fits your needs!** 🎯
