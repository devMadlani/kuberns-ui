# Kuberns - Cloud Deployment Platform

A modern, production-ready React + TypeScript frontend for a cloud deployment platform similar to Kuberns.

## 🚀 Features

- **2-Step Wizard Flow**: Create new apps with a streamlined, user-friendly wizard
- **GitHub/GitLab Integration**: Connect version control systems (mock implementation)
- **Repository Selection**: Choose organization, repository, and branch
- **App Configuration**: Set app name, region, and framework
- **Plan Selection**: Choose from Starter, Pro, or Enterprise plans
- **Database Setup**: Optional database connection with multiple types
- **Port Configuration**: Random or custom port assignment
- **Environment Variables**: Dynamic management of environment variables

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** components (custom implementation)
- **React Hook Form** (ready to use)
- **Zod** validation (ready to use)
- **Lucide React** for icons
- **Vite** for build tooling

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Project Structure

```
kuberns-app/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui base components
│   │   ├── GitHubConnectCard.tsx
│   │   ├── RepositorySelector.tsx
│   │   ├── AppDetailsForm.tsx
│   │   ├── PlanSelector.tsx
│   │   ├── DatabaseToggle.tsx
│   │   ├── PortConfiguration.tsx
│   │   ├── EnvVariablesEditor.tsx
│   │   ├── Screen1.tsx
│   │   ├── Screen2.tsx
│   │   └── Layout.tsx
│   ├── data/
│   │   └── mockData.ts      # Mock data for dropdowns
│   ├── types/
│   │   └── index.ts         # TypeScript type definitions
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## 🎨 Design Features

- **Light Theme**: Clean, modern SaaS dashboard design
- **Responsive**: Works on desktop, tablet, and mobile
- **Accessible**: Proper labels, ARIA attributes, and keyboard navigation
- **Smooth Transitions**: Polished user experience
- **Professional Typography**: Clear, readable fonts

## 📝 Usage

1. **Screen 1 - Create New App**:
   - Connect GitHub/GitLab
   - Select organization, repository, and branch
   - Fill in app details (name, region, framework)
   - Choose a plan
   - Optionally connect a database
   - Click "Set Up Env Variables" to proceed

2. **Screen 2 - Environment & Port Setup**:
   - Configure port (random or custom)
   - Add/edit/delete environment variables
   - Click "Finish my Setup" to complete

## 🔧 Customization

All components are modular and reusable. You can easily:
- Modify mock data in `src/data/mockData.ts`
- Customize styles via Tailwind classes
- Add validation using React Hook Form + Zod
- Integrate with real APIs

## 📄 License

MIT
