# AncestorLens 🌍

**A culturally relevant genealogy platform designed to help African families preserve their heritage through oral traditions, burial site mapping, and interactive family tree documentation.**

[![Deployment Status](https://img.shields.io/badge/Deployment-Live-brightgreen)](https://ancestor-lens.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Tech%20Stack-React%20%7C%20Firebase%20%7C%20Vercel-blue)](https://github.com/OIgboerika/AncestorLens)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## 🌐 Live Application

**🔗 Deployed Version:** [https://ancestor-lens.vercel.app](https://ancestor-lens.vercel.app)

**📹 Demo Video:** [Watch 5-Minute Platform Demo](https://drive.google.com/file/d/1zNHY5NSfNBXiL2WZ0k0dX_th7B_DOEXr/view?usp=sharing)

> **Note:** The demo video focuses on core functionalities including Family Tree management, Burial Site mapping, and Cultural Memory archive features.

---

## 📖 Description

AncestorLens is a full-stack web application that addresses the unique needs of African genealogy by focusing on features that existing Western genealogy tools often overlook. The platform empowers families to preserve their cultural heritage through:

### ✨ Key Features

- **🌳 Interactive Family Trees**
  - Static and draggable family tree views
  - Real-time relationship mapping
  - Comprehensive family member profiles
  - Location-based family member mapping

- **🗺️ Burial Site Mapping**
  - GPS coordinate recording
  - Interactive map visualization
  - Burial site management with photos
  - Privacy controls for sensitive locations

- **📚 Cultural Memory Archive**
  - Audio and image memory uploads
  - Oral storytelling preservation
  - Category-based organization
  - Download and sharing capabilities

- **🔒 Privacy & Security**
  - Firebase Authentication
  - Role-based access control
  - Data encryption and secure storage
  - User privacy settings

- **📱 Responsive Design**
  - Mobile-first approach
  - Cross-platform compatibility
  - Modern UI/UX with Tailwind CSS

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons

### Backend & Services
- **Firebase** - Authentication, Firestore Database, Storage
- **Cloudinary** - Image and media management
- **Leaflet** - Interactive maps
- **React Flow** - Interactive family tree diagrams
- **Google Maps API** - Geolocation services

### Development Tools
- **Bun** - Fast package manager
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

### Deployment
- **Vercel** - Frontend hosting
- **Firebase Hosting** - Backend services
- **GitHub Actions** - CI/CD pipeline

---

## 🚀 Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16 or higher) - [Download Node.js](https://nodejs.org/)
- **Bun** package manager - [Install Bun](https://bun.sh/)
- **Firebase CLI** - Will be installed in step 4
- **Git** - [Download Git](https://git-scm.com/)

### Step-by-Step Installation Instructions

#### Step 1: Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/OIgboerika/AncestorLens.git
cd AncestorLens
```

#### Step 2: Install Dependencies

Install all required dependencies using Bun (recommended):

```bash
bun install
```

**Alternative:** If you prefer npm, you can use:

```bash
npm install
```

#### Step 3: Configure Environment Variables

Create a local environment file:

```bash
# Copy the environment template
cp env.example .env.local
```

Open `.env.local` in your text editor and fill in your configuration values:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_API_SECRET=your_api_secret
VITE_CLOUDINARY_UPLOAD_PRESET=ml_default
```

**How to get these values:**
- **Firebase:** Create a project at [Firebase Console](https://console.firebase.google.com/), then go to Project Settings > General > Your apps > Web app
- **Cloudinary:** Sign up at [Cloudinary](https://cloudinary.com/) and get your credentials from the Dashboard

#### Step 4: Firebase CLI Setup

Install Firebase CLI globally:

```bash
npm install -g firebase-tools
```

Login to Firebase:

```bash
firebase login
```

Initialize Firebase (if not already done):

```bash
firebase init
```

Follow the prompts to configure your Firebase project.

#### Step 5: Start the Development Server

Run the development server:

```bash
# Using Bun (recommended)
bun run dev

# Alternative: Using npm
npm run dev
```

The application will be available at **`http://localhost:5173`**

Open your browser and navigate to the URL to see the application running.

#### Step 6: Build for Production (Optional)

To create a production build:

```bash
# Using Bun
bun run build

# Alternative: Using npm
npm run build
```

The production files will be generated in the `dist/` folder.

---

## 📁 Related Files to the Project

### Configuration Files

These files configure the build tools and development environment:

- **`package.json`** - Project dependencies and npm scripts
- **`package-lock.json`** - Locked dependency versions
- **`vercel.json`** - Vercel deployment configuration
- **`tailwind.config.js`** - Tailwind CSS configuration
- **`tsconfig.json`** - TypeScript compiler configuration
- **`tsconfig.node.json`** - TypeScript config for Node.js tools
- **`vite.config.ts`** - Vite build tool configuration
- **`postcss.config.js`** - PostCSS configuration
- **`.gitignore`** - Git ignore patterns

### Environment Files

- **`env.example`** - Template for environment variables (copy this to `.env.local`)
- **`.env.local`** - Local environment variables (create this file, not committed to git)

### Documentation Files

- **`README.md`** - This documentation file
- **`Screens/`** - Directory containing application screenshots
  - `Sign Up.png`
  - `Log In.png`
  - `Dashboard.png`
  - `Family Tree.png`
  - `Family Tree Builder.png`
  - `Family Tree (Member Details).png`
  - `Burial Sites.png`
  - `Cultural Memories.png`
  - `Cultural Memory Details.png`
  - `Cultural Memories Upload.png`
  - `User Profile.png`
  - `Privacy Settings.png`

### Source Code Structure

- **`src/App.tsx`** - Main application component and routing
- **`src/contexts/AuthContext.tsx`** - Authentication context provider
- **`src/firebase/config.ts`** - Firebase configuration
- **`src/firebase/services/`** - Firestore service files
  - `familyService.ts` - Family member data operations
  - `burialSiteService.ts` - Burial site data operations
  - `culturalMemoryService.ts` - Cultural memory data operations
  - `activityService.ts` - Activity tracking
  - `firestore.ts` - Generic Firestore operations
- **`src/pages/`** - Application page components
  - `auth/` - Authentication pages (SignUp, Login)
  - `family/` - Family tree pages (Overview, Builder, Details)
  - `cultural/` - Cultural memory pages (List, Upload, Details)
  - `BurialSitesPage.tsx` - Burial sites management
  - `DashboardPage.tsx` - User dashboard
  - `ProfilePage.tsx` - User profile
  - `PrivacySettingsPage.tsx` - Privacy settings
- **`src/components/`** - Reusable UI components
  - `ui/` - Base UI components (Button, Card, etc.)
  - `family/` - Family tree components
  - `maps/` - Map-related components
- **`src/services/`** - External service integrations
  - `cloudinaryService.ts` - Cloudinary image upload
  - `geocodingService.ts` - Address geocoding

### Static Assets

- **`public/images/`** - Application images and logos
- **`index.html`** - HTML entry point

---

## 🎨 Key Features & Screenshots

### Authentication & User Management

- [Sign Up Screen](./Screens/Sign%20Up.png)
- [Log In Screen](./Screens/Log%20In.png)
- [User Profile](./Screens/User%20Profile.png)

### Core Features

- [Dashboard](./Screens/Dashboard.png)
- [Family Tree Overview](./Screens/Family%20Tree.png)
- [Family Tree Builder](./Screens/Family%20Tree%20Builder.png)
- [Family Member Details](./Screens/Family%20Tree%20(Member%20Details).png)

### Burial Sites & Cultural Memory

- [Burial Sites Map](./Screens/Burial%20Sites.png)
- [Cultural Memories](./Screens/Cultural%20Memories.png)
- [Cultural Memory Details](./Screens/Cultural%20Memory%20Details.png)
- [Cultural Memories Upload](./Screens/Cultural%20Memories%20Upload.png)

### Privacy & Settings

- [Privacy Settings](./Screens/Privacy%20Settings.png)

---

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Connect Repository to Vercel**

   ```bash
   # Using Vercel CLI
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Configure Environment Variables**

   - Add Firebase configuration variables in Vercel dashboard
   - Add Cloudinary configuration variables
   - Set Node.js version to 16 or higher

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Backend Deployment (Firebase)

1. **Deploy Firebase Functions** (if using)

   ```bash
   firebase deploy --only functions
   ```

2. **Generate Firestore Security Rules**

   ```bash
   firebase deploy --only firestore:rules
   ```

3. **Deploy Firebase Hosting**
   ```bash
   firebase deploy --only hosting
   ```

---

## 📋 Available Scripts

```bash
# Development
bun run dev          # Start development server
bun run build        # Build for production
bun run preview      # Preview production build
bun run lint         # Run ESLint

# Alternative with npm
npm run dev
npm run build
npm run preview
npm run lint
```

---

## 🔧 Development Guidelines

### Code Standards

- Use **Bun** package manager as specified in project requirements
- Follow React best practices and hooks patterns
- Implement responsive design for mobile accessibility
- Use TypeScript for type safety
- Follow ESLint rules and fix warnings

### Firebase Security

- Ensure Firebase security rules are properly configured
- Implement proper authentication checks
- Validate user permissions for data access
- Use Firebase Admin SDK for server-side operations

### Testing

- Test across different browsers and devices
- Verify responsive design on mobile devices
- Test Firebase authentication flows
- Validate data persistence and synchronization

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Onochie Igboerika**

- GitHub: [@OIgboerika](https://github.com/OIgboerika)
- Email: igboerikaonochie121@gmail.com

---

## 🙏 Acknowledgments

- **Visily** - UI/UX design platform
- **Firebase** - Backend-as-a-Service
- **Vercel** - Frontend hosting platform
- **Tailwind CSS** - CSS framework
- **React Community** - Open source ecosystem

---

**Note:** This is a capstone project focused on preserving African cultural heritage through modern web technology. The platform is designed to scale across Africa while maintaining cultural sensitivity and local relevance.

**🌍 Preserving African Heritage, One Story at a Time**
