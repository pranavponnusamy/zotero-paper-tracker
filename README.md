# Zotero Paper Tracker

Vibe coded for fun :)

A simple web application to track the reading status of your Zotero papers.

## Features

- Connect to your Zotero library using your User ID and an API Key.
- Fetches all your papers from your Zotero library.
- Mark papers as "read" or "unread".
- Read papers are visually distinguished with a strikethrough.
- Toggle the visibility of read papers.
- Your Zotero credentials are saved in your browser's local storage for convenience.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/)
- Zotero OAuth credentials (see below)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd zotero-paper-tracker
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

3.  Create a `.env.local` file in the root directory with the following variables:
    ```
    # Zotero OAuth credentials
    # Get these by creating a new application at https://www.zotero.org/oauth/apps
    ZOTERO_CLIENT_KEY=your_zotero_client_key
    ZOTERO_CLIENT_SECRET=your_zotero_client_secret

    # This should be at least 32 characters long
    SECRET_COOKIE_PASSWORD=complex_password_at_least_32_characters_long

    # Base URL for OAuth callback
    NEXT_PUBLIC_BASE_URL=http://localhost:3000
    ```

## Usage

1.  Run the development server:
    ```bash
    npm run dev
    ```

2.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

3.  To use the application, you will need to log in with your Zotero account.

### Setting up Zotero OAuth

1. Go to [https://www.zotero.org/oauth/apps](https://www.zotero.org/oauth/apps)
2. Click "Register a new application"
3. Fill in the application details:
   - Application Name: Zotero Paper Tracker (or any name you prefer)
   - Application Website: http://localhost:3000 (for local development)
   - Application Description: A simple web application to track the reading status of your Zotero papers.
   - Callback URL: http://localhost:3000/api/auth/callback
   - Application Type: Client
4. Click "Register Application"
5. Copy the "Client Key" and "Client Secret" to your `.env.local` file

## Deployment

This is a [Next.js](https://nextjs.org/) application and can be easily deployed to [Vercel](https://vercel.com/).

1.  Push your code to a Git repository (e.g., GitHub, GitLab, Bitbucket).

2.  Go to the [Vercel dashboard](https://vercel.com/new) and import your repository.

3.  Vercel will automatically detect that this is a Next.js project and configure the build settings for you.

4.  Add the environment variables from your `.env.local` file to the Vercel project settings.

5.  Click "Deploy" and your application will be live in a few moments.

