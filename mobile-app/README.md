# Ibnu Portfolio Mobile App

A React Native / Expo mobile application for the Ibnu Portfolio, featuring cross-platform support for Android, iOS, and Web.

## Features

- **Cross-Platform**: Works on Android, iOS, and Web
- **Modern UI**: Beautiful dark theme with smooth animations
- **Offline Support**: Caches data for offline viewing
- **Real-time Updates**: Fetches latest data from the backend API

## Screens

1. **Home** - Overview with stats, featured projects, and quick links
2. **Projects** - Browse all projects with category filtering
3. **About** - Profile, experience, education, and interests
4. **Skills** - Skills with proficiency bars and certifications
5. **Contact** - Contact form and social links

## Tech Stack

- **Framework**: Expo SDK 51 with React Native
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Animations**: React Native Reanimated
- **UI Components**: Custom themed components
- **Icons**: Expo Vector Icons (Ionicons)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. Navigate to the mobile-app directory:
   \`\`\`bash
   cd mobile-app
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Configure the API URL in \`constants/config.ts\`:
   \`\`\`typescript
   export const API_BASE_URL = __DEV__
     ? 'http://localhost:3000'  // Your local Next.js server
     : 'https://your-production-url.com';
   \`\`\`

### Running the App

#### Development

\`\`\`bash
# Start the Expo development server
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios

# Run on Web
npm run web
\`\`\`

#### Building APK for Android

**Prerequisites:**
1. Create an Expo account at https://expo.dev/signup
2. Install EAS CLI: `npm install -g eas-cli`
3. Login: `eas login`

**Build APK:**
```bash
# Initialize EAS (first time only)
eas init

# Build APK (installable file)
npm run build:apk

# Or build App Bundle (for Play Store)
npm run build:android
```

The APK will be built in Expo's cloud (~10-15 mins). Download link will be provided after build completes.

#### Building for iOS

```bash
npm run build:ios
```

#### Building for Web (static export)

```bash
npm run build:web
```

## Project Structure

\`\`\`
mobile-app/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home screen
│   │   ├── projects.tsx   # Projects list
│   │   ├── about.tsx      # About page
│   │   ├── skills.tsx     # Skills page
│   │   └── contact.tsx    # Contact form
│   ├── project/[slug].tsx # Project detail screen
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
├── constants/             # App constants and config
├── hooks/                 # Custom React hooks
├── services/              # API service layer
├── store/                 # Zustand state management
├── types/                 # TypeScript types
└── assets/                # Images, fonts, etc.
\`\`\`

## Backend API Endpoints

The mobile app uses the following API endpoints from the main Next.js application:

| Endpoint | Method | Description |
|----------|--------|-------------|
| \`/api/mobile/summary\` | GET | App summary data |
| \`/api/mobile/profile\` | GET | Profile information |
| \`/api/mobile/projects\` | GET | Project list |
| \`/api/mobile/experience\` | GET | Work experience |
| \`/api/mobile/education\` | GET | Education history |
| \`/api/mobile/skills\` | GET | Skills with proficiency |
| \`/api/mobile/certifications\` | GET | Certifications |
| \`/api/mobile/interests\` | GET | Interest areas |
| \`/api/mobile/contact\` | POST | Submit contact form |

## Customization

### Theming

Edit \`constants/Colors.ts\` to customize the color scheme:

\`\`\`typescript
export const Colors = {
  light: {
    primary: '#2563eb',
    // ... other colors
  },
  dark: {
    primary: '#3b82f6',
    // ... other colors
  },
};
\`\`\`

### Adding New Screens

1. Create a new file in \`app/(tabs)/\` for tab screens
2. Create in \`app/\` for modal or stack screens
3. Expo Router automatically handles routing

## Web Export

The app supports web export for displaying on browsers:

\`\`\`bash
# Development
npm run web

# Production build
npm run build:web
\`\`\`

The built web app will be in the \`dist/\` folder, ready for deployment.

## Environment Variables

Create a \`.env\` file with:

\`\`\`env
EXPO_PUBLIC_API_URL=https://your-api-url.com
\`\`\`

## License

Private - Subkhan Ibnu Aji

## Author

Subkhan Ibnu Aji - [GitHub](https://github.com/subkhanibnuaji)
