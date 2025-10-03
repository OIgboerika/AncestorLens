# AncestorLens 🌍

**A culturally relevant genealogy platform designed to help African families preserve their heritage through oral traditions, burial site mapping, and family tree documentation.**

## 🎬 DEMO VIDEO

**WATCH THE FRONTEND DEMO:** [Demo Video](https://drive.google.com/file/d/1wljp41jv1SPgqJ_uNIqNwbXvaryf2Axu/view?usp=sharing)

## Description

AncestorLens is a full-stack web application that addresses the unique needs of African genealogy by focusing on features that existing Western genealogy tools often overlook. The platform empowers families to preserve their cultural heritage through:

- **Interactive Family Trees** with photos, bios, and relationships
- **Burial Site Mapping** using GPS coordinates to record ancestral locations
- **Oral Storytelling Archive** for preserving folklore, ancestor stories, and cultural traditions
- **Privacy Controls** with secure authentication and role-based sharing

Originally targeting Nigeria due to its strong oral history traditions, AncestorLens is designed to scale across Africa.

## 🔗 Repository

[GitHub Repository](https://github.com/OIgboerika/AncestorLens.git)

## 🛠️ Tech Stack

- **Frontend:** React (web-based, mobile-responsive)
- **Backend:** Firebase (Authentication, Firestore Database, Storage)
- **Maps Integration:** Google Maps API for geolocation of burial sites
- **Deployment:** Vercel (frontend) + Firebase Hosting (backend)
- **UI Design:** Visily

## 🚀 Environment Setup & Installation

### Prerequisites

- Node.js (version 16 or higher)
- Bun package manager
- Firebase CLI
- Git

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone [your-repository-url]
   cd AncestorLens
   ```

2. **Install dependencies using Bun**

   ```bash
   bun install
   ```

3. **Environment Configuration**

   ```bash
   # Copy environment template
   cp .env.example .env.local

   # Add your configuration values:
   # VITE_API_KEY=your_firebase_config_key
   # VITE_AUTH_DOMAIN=your_project.firebaseapp.com
   # VITE_PROJECT_ID=your_project_id
   # VITE_STORAGE_BUCKET=your_project.appspot.com
   # VITE_MESSAGING_SENDER_ID=your_sender_id
   # VITE_APP_ID=your_app_id
   ```

4. **Firebase Setup**

   ```bash
   # Install Firebase CLI globally
   bun add -g firebase-tools

   # Login to Firebase
   firebase login

   # Initialize Firebase (if not already done)
   firebase init
   ```

5. **Start Development Server**

   ```bash
   bun run dev
   ```

6. **Build for Production**
   ```bash
   bun run build
   ```

## 🎨 Design Mockups

UI designs were created using [Visily](https://app.visily.ai/projects/aec4800f-3c1d-406e-bd6a-4389cb3bcdca/boards/2162941). Below are the key screenshots of the application interfaces:

### Authentication & User Management

- [Sign Up Screen](./Screens/Sign%20Up.png)
- [Log In Screen](./Screens/Log%20In.png)
- [User Profile](./Screens/User%20Profile.png)

### Core Features

- [Dashboard](./Screens/Dashboard.png)
- [Family Tree Overview](./Screens/Family%20Tree.png)
- [Family Tree Builder](./Screens/Family%20Tree%20Builder.png)
- [Family Member Details](<./Screens/Family%20Tree%20(Member%20Details).png>)

### Burial Sites & Cultural Memory

- [Burial Sites Map](./Screens/Burial%20Sites.png)
- [Cultural Memories](./Screens/Cultural%20Memories.png)
- [Cultural Memory Details](./Screens/Cultural%20Memory%20Details.png)
- [Cultural Memories Upload](./Screens/Cultural%20Memories%20Upload.png)

### Privacy & Settings

- [Privacy Settings](./Screens/Privacy%20Settings.png)

## 🚀 Deployment Plan

### Frontend Deployment (Vercel)

1. **Connect Repository to Vercel**

   ```bash
   # Using Vercel CLI
   bun add -g vercel
   vercel login
   vercel
   ```

2. **Configure Environment Variables**

   - Add Firebase configuration variables in Vercel dashboard
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

### Database Setup

- Configure Firestore security rules
- Set up user authentication
- Configure Cloud Storage for file uploads

### Google Maps Integration

- Obtain API key from Google Cloud Console
- Enable Maps JavaScript API
- Configure domain restrictions for security

## 📝 Development Guidelines

- Use **Bun** package manager as specified in project requirements
- Follow React best practices and hooks patterns
- Implement responsive design for mobile accessibility
- Ensure Firebase security rules are properly configured
- Test across different browsers and devices

---

**Note:** This is a capstone project focused on preserving African cultural heritage through modern web technology.
