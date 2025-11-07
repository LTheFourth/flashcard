# Flashcard HSK - Learn Chinese

A modern flashcard app for learning Chinese vocabulary with Tinder-like swipe interface.

## Features

- 🎯 **HSK 3 & HSK 4 Vocabulary**: Comprehensive vocabulary sets for HSK levels
- 🔄 **Tinder-like Swipe Interface**: Intuitive swipe gestures for learning
- 🌐 **Dual Language Support**: Switch between Chinese-first and Vietnamese-first modes
- 📊 **Progress Tracking**: Monitor your learning progress and statistics
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations
- ⚡ **Performance Optimized**: Built with Vite for fast development and builds
- 📱 **PWA Ready**: Install as a native app on mobile devices
- 🧩 **Component-Based**: Clean React component architecture

## Tech Stack

- **Frontend**: React 18, Vite, CSS3
- **UI Library**: Ant Design (optional fallback)
- **Build Tool**: Vite with optimized bundling
- **Code Quality**: ESLint, Prettier
- **PWA**: Service Worker with offline support

## Quick Start

### Prerequisites

- Node.js 16+ 
- npm 8+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd flashcard-hsk

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development

```bash
# Start development server with hot reload
npm run dev

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Build & Deploy

```bash
# Build for production
npm run build

# Build for GitHub Pages (with correct base path)
npm run build:gh

# Preview production build
npm run preview

# Preview GitHub Pages build locally
npm run preview:gh

# Deploy to GitHub Pages manually
npm run deploy

# Analyze bundle size
npm run analyze

# Clean build directory
npm run clean
```

## 🚀 GitHub Pages Deployment

### Automatic Deployment

This project is configured for automatic deployment to GitHub Pages:

1. **Push to main branch**: The app automatically builds and deploys
2. **Pull requests**: Builds and runs tests but doesn't deploy  
3. **Live URL**: https://lthefourth.github.io/flashcard/

The workflow `.github/workflows/deploy.yml` handles:
- Building the app with correct base path (`/flashcard/`)
- Deploying to GitHub Pages
- Running on every push to main branch

### Manual Deployment

```bash
# Deploy manually to GitHub Pages
npm run deploy
```

### Local Testing

```bash
# Test GitHub Pages build locally
npm run preview:gh
# Opens at http://localhost:3000/flashcard/
```

## Project Structure

```
flashcard-hsk/
├── src/
│   ├── components/          # React components
│   │   ├── HSKLevelSelector.jsx
│   │   ├── LanguageToggle.jsx
│   │   ├── ActionButtons.jsx
│   │   └── Instructions.jsx
│   ├── utils/              # Utility functions
│   │   └── flashcardApp.js  # Main flashcard logic
│   ├── styles/             # CSS styles
│   │   └── index.css
│   ├── assets/             # Static assets
│   ├── App.jsx             # Main React app
│   └── main.jsx            # React entry point
├── public/                 # Public assets
├── dist/                   # Build output
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── .eslintrc.json          # ESLint configuration
├── .prettierrc             # Prettier configuration
└── README.md               # This file
```

## Performance Optimizations

- **Code Splitting**: Automatic chunk splitting for vendor libraries
- **Tree Shaking**: Dead code elimination
- **CSS Optimization**: Minification and autoprefixing
- **Asset Optimization**: Image and font optimization
- **PWA Caching**: Service worker for offline functionality
- **Bundle Analysis**: Built-in bundle size analyzer

## Browser Support

- Chrome 80+
- Firefox 78+
- Safari 14+
- Edge 80+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- React team for the amazing framework
- Vite team for the blazing fast build tool
- Ant Design for the UI components
- Font Awesome for the beautiful icons
