# Snake Game

A classic Snake Game implemented as a responsive web application. This project is unique as it was developed entirely using AI assistance, showcasing the capabilities of modern AI in software development.

## Description

This is a modern implementation of the classic Snake Game, featuring:
- Responsive design that works on both desktop and mobile devices
- Touch controls for mobile devices
- High score tracking using local storage
- Clean, minimalist UI
- Comprehensive test coverage

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository

2. Install dependencies
```bash
npm install
```

### Running the Game

1. Start the development server
```bash
npm run dev
```

2. Build for production
```bash
npm run build
```

3. Preview production build
```bash
npm run preview
```

## Testing

This project includes multiple types of tests to ensure code quality and functionality:

### Unit Tests

Run unit tests using Jest:
```bash
npm test
```

### End-to-End Tests

1. Open Cypress test runner:
```bash
npm run test:e2e
```

2. Run Cypress tests in Headless Chrome:
```bash
npm run test:e2e:chrome
```

## Game Controls

### Desktop
- Arrow keys or WASD to control snake direction
- Space bar to restart game after game over

### Mobile
- Swipe in any direction to control the snake
- Tap the restart button after game over

## Technical Details

- Built with vanilla JavaScript
- Uses HTML5 Canvas for rendering
- Responsive design using CSS3
- Vite as build tool
- Jest for unit testing
- Cypress for E2E testing

## License

This project is licensed under the MIT License - see the LICENSE file for details.