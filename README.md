# FiTWM - Food Image Tracker Web Mobile

A Progressive Web App (PWA) for tracking food intake by taking photos of meals. Uses AI-powered image analysis to identify food items and calculate nutritional information.

## Features

- **Meal Tracking**: Log meals by taking photos
- **Nutritional Analysis**: Automatic detection of food items with calorie, protein, carb, and fat calculations
- **Daily Summaries**: View your daily nutritional intake
- **Offline Support**: Works offline with IndexedDB storage
- **PWA**: Installable on mobile devices

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: CSS (custom)
- **State Management**: React Context API
- **Storage**: IndexedDB via custom repository
- **Testing**: Vitest
- **Linting**: ESLint
- **PWA**: Vite PWA Plugin

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Building

```bash
npm run build
```

### Testing

```bash
npm run test
```

### Linting

```bash
npm run lint
```

## Project Structure

```
src/
├── domain/          # Domain types and interfaces
├── nutrition/       # Nutrition analysis logic
├── providers/       # Analysis provider implementations
├── storage/         # IndexedDB storage layer
├── ui/              # React components and context
└── tests/           # Test files
```

## Environment Variables

- `VITE_ANALYSIS_API_URL`: URL for remote analysis API (optional)
- `VITE_USE_REMOTE`: Set to 'true' to use remote analysis provider

## License

MIT
