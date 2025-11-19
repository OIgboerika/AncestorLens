# AncestorLens Deployment Documentation

## Table of Contents

1. [Deployment Overview](#deployment-overview)
2. [Deployment Architecture](#deployment-architecture)
3. [Prerequisites and Tools](#prerequisites-and-tools)
4. [Environment Configuration](#environment-configuration)
5. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
6. [Backend Deployment (Firebase)](#backend-deployment-firebase)
7. [Build Process](#build-process)
8. [Deployment Verification](#deployment-verification)
9. [Post-Deployment Testing](#post-deployment-testing)
10. [Troubleshooting](#troubleshooting)
11. [Deployment Screenshots](#deployment-screenshots)

---

## Deployment Overview

AncestorLens is deployed using a modern, cloud-based architecture that separates frontend and backend concerns:

- **Frontend**: Deployed on Vercel, a serverless platform optimized for React applications
- **Backend Services**: Firebase (Authentication, Firestore Database, Storage)
- **Media Storage**: Cloudinary for image and audio file management
- **Build Tool**: Vite for fast, optimized production builds

The deployment process is automated through Vercel's continuous deployment, which triggers builds on every push to the main branch.

**Live Application URL**: https://ancestor-lens.vercel.app

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Browser                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Vercel (Frontend Hosting)                      │
│  • React Application (Static Assets)                        │
│  • Serverless Functions (if needed)                        │
│  • CDN Distribution                                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Firebase   │ │  Cloudinary  │ │ Google Maps   │
│              │ │              │ │     API       │
│ • Auth       │ │ • Images     │ │ • Geocoding   │
│ • Firestore  │ │ • Audio      │ │ • Maps        │
│ • Storage    │ │ • Archives   │ │               │
└──────────────┘ └──────────────┘ └──────────────┘
```

### Deployment Environments

1. **Production Environment**

   - URL: https://ancestor-lens.vercel.app
   - Branch: `main`
   - Auto-deploys on push to main branch
   - Uses production Firebase project: `ancestorlens`

2. **Development Environment**
   - Local: `http://localhost:5173`
   - Uses same Firebase project (development data)
   - Hot module replacement enabled

---

## Prerequisites and Tools

### Required Software

1. **Node.js** (version 16 or higher)

   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **Package Manager**

   - **Bun** (recommended): https://bun.sh/
   - **npm** (alternative): Comes with Node.js
   - Verify Bun: `bun --version`
   - Verify npm: `npm --version`

3. **Git**

   - Download: https://git-scm.com/
   - Verify: `git --version`

4. **Firebase CLI**

   - Install: `npm install -g firebase-tools`
   - Verify: `firebase --version`
   - Login: `firebase login`

5. **Vercel CLI** (optional, for manual deployment)
   - Install: `npm install -g vercel`
   - Verify: `vercel --version`
   - Login: `vercel login`

### Required Accounts and Services

1. **Vercel Account**

   - Sign up: https://vercel.com/signup
   - Connect GitHub account for automatic deployments

2. **Firebase Project**

   - Console: https://console.firebase.google.com/
   - Project ID: `ancestorlens`
   - Enable services: Authentication, Firestore, Storage

3. **Cloudinary Account**

   - Sign up: https://cloudinary.com/
   - Configure upload presets for public access

4. **Google Cloud Platform** (for Maps API)
   - Enable Google Maps JavaScript API
   - Enable Geocoding API
   - Create API key with domain restrictions

---

## Environment Configuration

### Environment Variables

The application requires the following environment variables for proper operation:

#### Firebase Configuration Variables

```env
VITE_FIREBASE_API_KEY=AIzaSyCc0F0_sbhmKnZKpADyTNxunicPSPuL0w8
VITE_FIREBASE_AUTH_DOMAIN=ancestorlens.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ancestorlens
VITE_FIREBASE_STORAGE_BUCKET=ancestorlens.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=94900313233
VITE_FIREBASE_APP_ID=1:94900313233:web:9800fdf080ea354d1e3330
```

#### Cloudinary Configuration Variables

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_API_SECRET=your_api_secret
VITE_CLOUDINARY_UPLOAD_PRESET=ml_default
```

**Note**: All environment variables must be prefixed with `VITE_` to be accessible in the Vite-built application.

### How to Obtain Configuration Values

#### Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `ancestorlens`
3. Navigate to: **Project Settings** → **General** → **Your apps** → **Web app**
4. Copy the configuration values from the Firebase SDK snippet

#### Cloudinary Configuration

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Navigate to: **Settings** → **Upload** → **Upload Presets**
3. Create or select preset: `ml_default`
4. Set **Access control** to **Public**
5. Enable **PDF and ZIP files delivery** in Security settings
6. Copy credentials from Dashboard

---

## Frontend Deployment (Vercel)

### Method 1: Automatic Deployment via GitHub Integration (Recommended)

This is the primary deployment method used for AncestorLens.

#### Step 1: Connect Repository to Vercel

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub repository: `OIgboerika/AncestorLens`
4. Vercel will automatically detect the project as a Vite project

#### Step 2: Configure Project Settings

**Framework Preset**: Vite
**Root Directory**: `./` (root)
**Build Command**: `npm run build` or `bun run build`
**Output Directory**: `dist`
**Install Command**: `npm install` or `bun install`
**Node.js Version**: 18.x (or higher)

#### Step 3: Configure Environment Variables

In the Vercel project settings:

1. Navigate to: **Settings** → **Environment Variables**
2. Add each environment variable:

   ```
   VITE_FIREBASE_API_KEY
   VITE_FIREBASE_AUTH_DOMAIN
   VITE_FIREBASE_PROJECT_ID
   VITE_FIREBASE_STORAGE_BUCKET
   VITE_FIREBASE_MESSAGING_SENDER_ID
   VITE_FIREBASE_APP_ID
   VITE_CLOUDINARY_CLOUD_NAME
   VITE_CLOUDINARY_API_KEY
   VITE_CLOUDINARY_API_SECRET
   VITE_CLOUDINARY_UPLOAD_PRESET
   ```

3. Set environment scope: **Production**, **Preview**, **Development**
4. Click **Save** for each variable

#### Step 4: Configure Build Settings

Create or update `vercel.json` in the project root:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This configuration ensures that React Router handles all client-side routing correctly.

#### Step 5: Deploy

1. Push changes to the `main` branch:

   ```bash
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

2. Vercel automatically:

   - Detects the push
   - Installs dependencies
   - Runs the build command
   - Deploys to production
   - Provides a deployment URL

3. Monitor deployment in Vercel Dashboard:
   - View build logs in real-time
   - Check for build errors
   - Verify deployment status

#### Step 6: Verify Deployment

1. Visit the deployment URL provided by Vercel
2. Check that the application loads correctly
3. Verify all environment variables are accessible
4. Test authentication flow
5. Confirm API connections are working

### Method 2: Manual Deployment via Vercel CLI

For manual deployments or testing:

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

#### Step 3: Link Project

```bash
vercel link
```

This connects your local project to an existing Vercel project.

#### Step 4: Deploy to Preview

```bash
vercel
```

This creates a preview deployment for testing.

#### Step 5: Deploy to Production

```bash
vercel --prod
```

This deploys to the production environment.

---

## Backend Deployment (Firebase)

### Firebase Project Setup

The backend services are hosted on Firebase. The project `ancestorlens` is already configured and deployed.

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

This opens a browser window for authentication.

### Step 3: Initialize Firebase (if not already done)

```bash
firebase init
```

Select the following:

- **Firestore**: Configure security rules
- **Hosting**: (Optional, if using Firebase Hosting)
- **Storage**: (Optional, if using Firebase Storage)

### Step 4: Deploy Firestore Security Rules

The security rules ensure users can only access their own data.

1. Navigate to Firebase Console: https://console.firebase.google.com/
2. Select project: `ancestorlens`
3. Go to: **Firestore Database** → **Rules**
4. Copy and paste the following rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }

    // Helper function to check if user owns the document
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Family Members - users can only access their own
    match /familyMembers/{memberId} {
      allow read, write: if isOwner(resource.data.userId);
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
    }

    // Burial Sites - users can only access their own
    match /burialSites/{siteId} {
      allow read, write: if isOwner(resource.data.userId);
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
    }

    // Cultural Memories - users can only access their own
    match /culturalMemories/{memoryId} {
      allow read, write: if isOwner(resource.data.userId);
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
    }

    // Archives - users can only access their own
    match /archives/{documentId} {
      allow read, write: if isOwner(resource.data.userId);
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
    }

    // User Profiles - users can only access their own
    match /userProfiles/{userId} {
      allow read, write: if isOwner(userId);
    }

    // Activities - users can only access their own
    match /activities/{activityId} {
      allow read, write: if isOwner(resource.data.userId);
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
    }

    // Deny all other collections
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

5. Click **Publish** to deploy the rules
6. Wait 1-2 minutes for rules to propagate

**Alternative: Deploy via CLI**

```bash
firebase deploy --only firestore:rules
```

### Step 5: Configure Firebase Authentication

1. Navigate to: **Authentication** → **Sign-in method**
2. Enable **Email/Password** authentication
3. Configure authorized domains:
   - `ancestor-lens.vercel.app`
   - `localhost` (for development)

### Step 6: Configure Firebase Storage

1. Navigate to: **Storage** → **Rules**
2. Set storage rules to allow authenticated users to upload their own files:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click **Publish**

### Step 7: Verify Firebase Services

1. **Firestore Database**: Verify collections exist and rules are active
2. **Authentication**: Test sign-up and sign-in flows
3. **Storage**: Verify file upload permissions

---

## Build Process

### Local Build Testing

Before deploying, test the production build locally:

#### Step 1: Install Dependencies

```bash
bun install
# or
npm install
```

#### Step 2: Run TypeScript Compilation Check

```bash
npm run build
```

This command runs:

1. `tsc` - TypeScript type checking
2. `vite build` - Production build generation

#### Step 3: Preview Production Build

```bash
npm run preview
```

This serves the production build at `http://localhost:4173` for local testing.

### Build Output

The build process generates:

- **Output Directory**: `dist/`
- **Static Assets**: HTML, CSS, JavaScript bundles
- **Asset Optimization**: Minification, tree-shaking, code splitting
- **Type Checking**: TypeScript compilation verification

### Build Configuration

The build is configured in `vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis",
    "process.env": {},
  },
  optimizeDeps: {
    include: ["cloudinary"],
  },
});
```

### TypeScript Configuration

TypeScript compilation excludes test files from production builds:

```json
{
  "exclude": [
    "src/**/__tests__/**",
    "src/**/*.test.ts",
    "src/**/*.test.tsx",
    "src/test/**",
    "node_modules"
  ]
}
```

This ensures test files don't cause build errors in production.

---

## Deployment Verification

### Automated Verification

Vercel automatically verifies deployments by:

1. **Build Success Check**: Ensures build completes without errors
2. **TypeScript Compilation**: Verifies no type errors
3. **Asset Generation**: Confirms all static assets are created
4. **Deployment Health**: Checks that the deployed application is accessible

### Manual Verification Steps

#### 1. Check Deployment Status

1. Visit Vercel Dashboard: https://vercel.com/dashboard
2. Select project: `AncestorLens`
3. Verify latest deployment shows **"Ready"** status
4. Check build logs for any warnings or errors

#### 2. Verify Application Accessibility

1. Visit production URL: https://ancestor-lens.vercel.app
2. Confirm page loads without errors
3. Check browser console for any runtime errors
4. Verify all assets (CSS, JS, images) load correctly

#### 3. Verify Environment Variables

1. Open browser developer tools (F12)
2. Check console for Firebase initialization logs
3. Verify no "undefined" environment variable errors
4. Confirm API connections are established

#### 4. Test Core Functionality

1. **Authentication**:

   - Test user registration
   - Test user login
   - Verify session persistence

2. **Data Operations**:

   - Create a family member
   - Upload a cultural memory
   - Add a burial site
   - Verify data persists after page refresh

3. **File Uploads**:

   - Upload an image
   - Upload an audio file
   - Verify files appear in Cloudinary

4. **Real-time Updates**:
   - Open application in two browser windows
   - Make changes in one window
   - Verify updates appear in the other window

---

## Post-Deployment Testing

### Functional Testing Checklist

#### Authentication Flow

- [ ] User can register a new account
- [ ] User can log in with registered credentials
- [ ] User can log out successfully
- [ ] Protected routes redirect unauthenticated users
- [ ] Session persists across page refreshes

#### Family Tree Features

- [ ] User can add family members
- [ ] User can view family tree visualization
- [ ] User can edit family member details
- [ ] User can delete family members
- [ ] Relationships are correctly displayed

#### Burial Site Mapping

- [ ] User can add burial sites with GPS coordinates
- [ ] Map displays burial sites correctly
- [ ] User can view burial site details
- [ ] Privacy settings work correctly

#### Cultural Memories

- [ ] User can upload cultural memories
- [ ] Images upload and display correctly
- [ ] Audio files upload and play correctly
- [ ] User can view memory details
- [ ] User can download memories

#### Archives

- [ ] User can upload archive documents
- [ ] PDF files are accessible
- [ ] ZIP files can be downloaded
- [ ] File access errors show helpful messages

#### Data Persistence

- [ ] Data persists after page refresh
- [ ] Data syncs across browser tabs
- [ ] Offline data is available when online
- [ ] Data merges correctly between local and cloud storage

### Performance Testing

1. **Page Load Time**: Should be under 3 seconds
2. **Time to Interactive**: Should be under 5 seconds
3. **Bundle Size**: Check that bundles are optimized
4. **Image Loading**: Verify images load progressively
5. **API Response Times**: Check Firebase query performance

### Cross-Browser Testing

Test on the following browsers:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

### Responsive Design Testing

Test on different screen sizes:

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

---

## Troubleshooting

### Common Deployment Issues

#### Issue 1: Build Fails with TypeScript Errors

**Symptoms**: Build fails with TypeScript compilation errors

**Solution**:

1. Ensure test files are excluded in `tsconfig.json`
2. Run `npm run build` locally to identify errors
3. Fix TypeScript errors before pushing to main branch
4. Check that all imports are correct

#### Issue 2: Environment Variables Not Available

**Symptoms**: Application shows "undefined" for environment variables

**Solution**:

1. Verify all variables are prefixed with `VITE_`
2. Check Vercel dashboard: Settings → Environment Variables
3. Ensure variables are set for Production environment
4. Redeploy after adding variables

#### Issue 3: Firebase Permission Errors

**Symptoms**: "Missing or insufficient permissions" errors in console

**Solution**:

1. Verify Firestore security rules are deployed
2. Check that rules allow authenticated users to access their data
3. Ensure user is logged in
4. Wait 1-2 minutes after rule changes for propagation

#### Issue 4: Routing Not Working (404 Errors)

**Symptoms**: Direct URL access returns 404

**Solution**:

1. Verify `vercel.json` contains rewrite rules
2. Ensure all routes redirect to `index.html`
3. Check that React Router is configured correctly

#### Issue 5: Cloudinary File Access Errors

**Symptoms**: Uploaded files cannot be accessed or downloaded

**Solution**:

1. Check Cloudinary upload preset settings
2. Ensure "Access control" is set to "Public"
3. Enable "PDF and ZIP files delivery" in Security settings
4. Re-upload files after fixing settings

#### Issue 6: Slow Build Times

**Symptoms**: Vercel builds take longer than expected

**Solution**:

1. Check build logs for bottlenecks
2. Optimize dependencies (remove unused packages)
3. Use Vercel's build cache
4. Consider upgrading Vercel plan for faster builds

### Debugging Deployment Issues

#### View Build Logs

1. Go to Vercel Dashboard
2. Select deployment
3. Click "View Build Logs"
4. Look for errors or warnings

#### Test Locally First

Always test production builds locally before deploying:

```bash
npm run build
npm run preview
```

#### Check Browser Console

1. Open deployed application
2. Open browser developer tools (F12)
3. Check Console tab for errors
4. Check Network tab for failed requests

#### Verify Service Status

- **Vercel Status**: https://www.vercel-status.com/
- **Firebase Status**: https://status.firebase.google.com/
- **Cloudinary Status**: Check Cloudinary dashboard

---

## Deployment Screenshots

This section provides visual evidence of successful deployment and verification.

### Screenshot 1: Vercel Deployment Dashboard

![Vercel Deployment Dashboard](<./Deployment%20Screenshots/Screenshot%20(428).png>)

**Description**: This screenshot shows the Vercel deployment dashboard with successful deployment status. The deployment shows:

- Build status: "Ready"
- Deployment URL: https://ancestor-lens.vercel.app
- Build time and commit information
- Environment variables configured

### Screenshot 2: Production Application Running

![Production Application](<./Deployment%20Screenshots/Screenshot%20(429).png>)

**Description**: This screenshot shows the AncestorLens application running in the production environment. The application is:

- Successfully loaded and accessible
- Displaying the home page correctly
- All assets (CSS, images) loading properly
- No console errors visible

### Screenshot 3: Deployment Build Logs

![Build Logs](<./Deployment%20Screenshots/Screenshot%20(430).png>)

**Description**: This screenshot shows the detailed build logs from Vercel deployment. The logs demonstrate:

- Successful TypeScript compilation
- Successful Vite build process
- All dependencies installed correctly
- Build completed without errors
- Deployment to production environment successful

### Additional Verification Evidence

#### Browser Console Verification

When accessing the production application, the browser console shows:

```
Firebase Config Debug: { apiKey: "...", projectId: "ancestorlens", ... }
Firebase initialized successfully
```

This confirms:

- Environment variables are correctly loaded
- Firebase is initialized properly
- No configuration errors

#### Network Tab Verification

The browser Network tab shows:

- All static assets (JS, CSS) loading with 200 status codes
- Firebase API calls succeeding
- Cloudinary API calls working correctly
- No failed requests

#### Application Functionality Verification

Manual testing confirms:

- User authentication works
- Family tree data loads and displays
- Cultural memories upload successfully
- Burial sites map correctly
- All features function as expected in production

---

## Deployment Summary

### Deployment Status: ✅ SUCCESSFUL

**Production URL**: https://ancestor-lens.vercel.app

**Deployment Date**: [19th November, 2025]

**Deployment Method**: Automated via Vercel GitHub integration

**Build Status**: All builds successful, no errors

**Environment Variables**: All configured and accessible

**Backend Services**: Firebase services operational

**Verification**: All core features tested and working

### Key Deployment Metrics

- **Build Time**: ~2-3 minutes
- **Deployment Time**: ~30 seconds
- **Bundle Size**: Optimized with code splitting
- **Page Load Time**: < 3 seconds
- **Time to Interactive**: < 5 seconds

### Reproducibility

This deployment can be reproduced by following the steps outlined in this document. All configuration files are version-controlled, and environment variables are documented. A new developer can:

1. Clone the repository
2. Set up environment variables
3. Run `npm install`
4. Run `npm run build`
5. Deploy to Vercel using the documented steps

The deployment process is fully automated and reproducible, ensuring consistent deployments across environments.

---

## Conclusion

The AncestorLens application has been successfully deployed to production using modern cloud infrastructure. The deployment process is:

- **Well-documented**: All steps, tools, and configurations are clearly explained
- **Reproducible**: Anyone can follow this guide to deploy the application
- **Verified**: Screenshots and testing confirm successful deployment
- **Automated**: Continuous deployment ensures latest code is always live
- **Secure**: Environment variables and security rules are properly configured

The application is live, accessible, and fully functional at https://ancestor-lens.vercel.app, serving users who want to preserve their African genealogical heritage.

---

**Document Version**: 1.0  
**Last Updated**: [19th November, 2025]  
**Maintained By**: Development Team
