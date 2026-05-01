# CloudNotes 📝

CloudNotes is a secure, minimalist markdown editor for your private thoughts. Built with a focus on privacy and simplicity, it allows you to write, manage, and sync your notes across devices with ease.

## 🚀 Features

- **Secure Markdown Editing:** A distraction-free markdown rich text editor with real-time markdown preview.
- **AWS Powered Sync:** Seamlessly synchronize your notes across all your devices using AWS Amplify Gen 2.
- **Private by Design:** Individual uuid keys and secure storage ensure your data belongs only to you.
- **Cloud Library:** Manage your markdown notes from a centralized dashboard.
- **File Portability:** Import existing `.md` files or download your current for use in other applications.
- **Responsive Interface:** A modern, clean UI for a great user experience.

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Editor Engine:** [Tiptap](https://tiptap.dev/) (Headless WYSIWYG Editor)
- **Icons:** [Lucide React](https://lucide.dev/)

### Backend & Infrastructure (AWS Amplify Gen 2)
- **Authentication:** [Amazon Cognito](https://aws.amazon.com/cognito/) (Email-based login)
- **Database:** [Amazon DynamoDB](https://aws.amazon.com/dynamodb/) (Note metadata)
- **Storage:** [Amazon S3](https://aws.amazon.com/s3/) (Markdown file storage)

## 🏗️ Project Structure

```text
├── amplify/               # AWS Amplify backend definitions (Auth, Data, Storage)
├── app/                   # Next.js App Router source code
│   ├── components/        # Reusable UI components (Editor, Navbar, etc.)
│   ├── dashboard/         # User notes management dashboard
│   ├── edit/              # Markdown editor pages
│   └── login/             # Authentication pages
├── public/                # Static assets
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or later)
- AWS Account (for backend deployment)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/aws-cloud-notes.git
   cd aws-cloud-notes
   ```

2. Install dependencies:

   ```bash

   npm install
   ```

3. Initialize Amplify:

* Follow [this guide from AWS Amplify](https://docs.amplify.aws/nextjs/start/account-setup/) to get setup!

   ```bash
   npx ampx sandbox
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---
Built with ❤️ using [AWS Amplify](https://aws.amplify.com/) and [Next.js](https://nextjs.org/).
