# Map Maker

A simple, vector-based map drawing application for creating custom maps with intuitive tools.

## Features

### Drawing Modes

1. **Paths Mode** - Draw continuous vector paths representing:
   - 🛣️ Roads
   - 🛤️ Highways
   - 🚂 Railroads
   - 💧 Rivers
   - 🥾 Hiking trails
   - 🚇 Subways
   - 🚴 Bike paths

2. **Shapes Mode** - Draw rectangular areas representing:
   - 🌳 Parks
   - 🌊 Bodies of water
   - 🏞️ Wilderness preserves

3. **Select Mode** - (Coming soon) Select and edit existing elements

## Technology Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Graphics**: SVG (Scalable Vector Graphics)
- **Styling**: CSS

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
# Build the application
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
# Preview the production build locally
npm run preview
```

## Usage

1. **Select a Mode**: Choose between Paths, Shapes, or Select mode using the buttons at the top of the toolbar
2. **Choose a Tool**: Select the type of element you want to draw from the toolbar
3. **Draw**: 
   - For paths: Click and drag on the canvas to draw continuous lines
   - For shapes: Click and drag to create rectangular areas
4. **Repeat**: Continue drawing to build your custom map

## Project Structure

```
mapmaker/
├── src/
│   ├── components/
│   │   ├── Canvas.tsx      # Main drawing canvas component
│   │   ├── Canvas.css
│   │   ├── Toolbar.tsx     # Tool selection sidebar
│   │   └── Toolbar.css
│   ├── App.tsx             # Main application component
│   ├── App.css
│   ├── main.tsx            # Application entry point
│   ├── index.css           # Global styles
│   └── vite-env.d.ts       # TypeScript declarations
├── index.html              # HTML entry point
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies
```

## License

MIT License - see [LICENSE](LICENSE) file for details