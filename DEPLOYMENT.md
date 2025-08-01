# 🚀 Zizo_MediVerse Vercel Deployment Guide

This guide provides step-by-step instructions for deploying your Zizo_MediVerse Next.js application to Vercel.

---

### Prerequisites

1.  **Vercel Account**: You need a Vercel account. You can sign up for free at [vercel.com](https://vercel.com).
2.  **Git Repository**: Your project code must be in a Git repository (e.g., on GitHub, GitLab, or Bitbucket).
3.  **Firebase Project**: You must have an active Firebase project with all the necessary services (Authentication, Firestore) enabled.

---

### Step 1: Push Your Project to a Git Repository

If you haven't already, push your project to a remote Git repository on a platform supported by Vercel.

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repository-url>
git push -u origin main
```

---

### Step 2: Configure Environment Variables

This is the most critical step. Your application relies on environment variables to connect to Firebase securely. Vercel needs these keys to build and run your project.

#### A. Prepare Your Service Account Key

The `serviceAccountKey.json` file contains sensitive credentials and **should not be committed to Git**. Instead, we will store its contents in a single environment variable.

1.  Open your `serviceAccountKey.json` file.
2.  Copy the **entire content** of the file to your clipboard. It will look like a large block of JSON.

#### B. Add Environment Variables to Vercel

1.  Go to your Vercel Dashboard.
2.  Create a new project by clicking **"Add New... > Project"**.
3.  Import the Git repository you created in Step 1.
4.  Before deploying, navigate to the **"Environment Variables"** section.
5.  Add the following variables:

    | Variable Name                     | Value                                                        |
    | --------------------------------- | ------------------------------------------------------------ |
    | `FIREBASE_SERVICE_ACCOUNT_JSON`   | Paste the entire content of your `serviceAccountKey.json` file here. |
    | `NEXT_PUBLIC_FIREBASE_API_KEY`    | Your Firebase project's `apiKey`.                            |
    | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Your Firebase project's `authDomain`.                        |
    | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Your Firebase project's `projectId`.                         |
    | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Your Firebase project's `storageBucket`.                     |
    | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Your Firebase project's `messagingSenderId`.                 |
    | `NEXT_PUBLIC_FIREBASE_APP_ID`     | Your Firebase project's `appId`.                             |

    *You can find the `NEXT_PUBLIC_*` values in your Firebase project settings under "General" > "Your apps" > "Web app" > "SDK setup and configuration".*

---

### Step 3: Deploy

1.  With your repository imported and environment variables set, go back to the project overview on Vercel.
2.  Click the **"Deploy"** button.
3.  Vercel will automatically detect that this is a Next.js project, install dependencies, and build your application.

Once the deployment is complete, Vercel will provide you with a URL where you can access your live Zizo_MediVerse application.

---

### Important Notes

*   **Firebase Rules**: Ensure your Firestore Security Rules are properly configured for production to prevent unauthorized data access.
*   **Seed Script**: The `npm run seed` command is for local development. Do not run it on your production database unless you intend to populate it with test data.
*   **Troubleshooting**: If your deployment fails, check the "Build Logs" on Vercel for any errors. Most issues are related to missing environment variables or build configuration problems.
