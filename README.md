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

# Preview production build
npm run preview

# Analyze bundle size
npm run analyze

# Clean build directory
npm run clean
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
