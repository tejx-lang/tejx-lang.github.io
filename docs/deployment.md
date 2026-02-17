# Deployment Guide

This guide explains how to deploy the TejX Homepage to GitHub Pages using GitHub Actions.

## 🚀 Automatic Deployment (Recommended)

The project is configured with a GitHub Actions workflow that automatically deploys the site whenever you push changes to the `main` or `init-release` branches.

### Prerequisites

1.  Your code must be hosted on a GitHub repository.
2.  The repository should have a branch named `main`.

### Setup Steps

1.  **Push your changes**:
    Push the latest version of your code to the `main` branch:

    ```bash
    git push origin main
    ```

2.  **Enable GitHub Pages**:
    - Go to your repository on GitHub.
    - Click on **Settings** in the top navigation bar.
    - Select **Pages** from the left sidebar.
    - Under **Build and deployment > Source**, select **GitHub Actions** from the dropdown menu.

3.  **Monitor the Deployment**:
    - Click on the **Actions** tab at the top of your repository.
    - You should see a workflow named `Deploy to GitHub Pages` running.
    - Once the workflow completes successfully (turns green), your site will be live!

4.  **Access your Site**:
    - Your site will be available at `https://<your-username>.github.io/homepage/`.

## 🛠️ Configuration Details

### Vite Base Path

In `vite.config.ts`, the `base` property is set to `'/tejx-homepage/'`. This ensures that all asset paths (images, scripts, styles) are correctly prefixed for GitHub Pages hosting.

```typescript
export default defineConfig({
  base: "/homepage/",
  // ... other config
});
```

### GitHub Actions Workflow

The workflow file is located at `.github/workflows/deploy.yml`. It handles:

- Checking out the code.
- Setting up the Node.js environment.
- Installing dependencies via `yarn install`.
- Building the project via `yarn build`.
- Uploading the `dist` folder as a deployment primitive.
- Deploying the site using official GitHub Actions.

## 🏗️ Manual Build (Optional)

If you want to build the project locally to verify the output:

1.  Run the build command:
    ```bash
    yarn build
    ```
2.  The production-ready files will be generated in the `dist` directory.

---

For any issues, please check the [GitHub Actions Logs](https://github.com/praveenyadav/tejx-homepage/actions).
