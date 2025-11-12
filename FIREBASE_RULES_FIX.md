# URGENT: Fix Firebase Security Rules

## The Problem
You're seeing "Missing or insufficient permissions" errors because your Firebase security rules were updated for the hand-down feature and are still blocking access.

## The Solution
You need to update your Firebase security rules in the Firebase Console to allow users to access their own data.

## Steps to Fix:

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com
   - Select your project: `ancestorlens`

2. **Navigate to Firestore Database**
   - Click "Firestore Database" in the left sidebar
   - Click on the "Rules" tab at the top

3. **Replace the rules with this SIMPLE version:**

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

4. **Click "Publish"** to save the rules

5. **Wait 1-2 minutes** for the rules to propagate

6. **Refresh your app** and the permission errors should be gone!

## Important Notes:
- These rules ONLY allow users to access their OWN data (where userId matches their auth.uid)
- NO shared access - completely removed hand-down feature logic
- Simple and secure - exactly as it was before the hand-down feature

## If you still see errors:
1. Hard refresh your browser (Ctrl+Shift+R)
2. Clear browser cache
3. Wait 2-3 minutes for rules to fully propagate
4. Check that you're logged in with the correct account

