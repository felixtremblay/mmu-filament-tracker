# Filament Tracker

A modern Angular webapp for tracking 3D printing filament purge volumes for Prusa MMU (Multi Material Unit). This application helps users manage the amount of filament that needs to be purged when switching between different filament types and colors during multi-material printing.

## Features

# Filament Tracker

A modern Angular webapp for tracking 3D printing filament purge volumes for Prusa MMU (Multi Material Unit). This application helps users manage the amount of filament that needs to be purged when switching between different filament types and colors during multi-material printing.

## ✨ Features

### 📊 Purge Matrix
- **Interactive Matrix**: Visual grid showing purge volumes required when switching from one filament color to another
- **Color-Coded Display**: Each color is represented with visual circles and numbered for easy identification
- **Inline Editing**: Click any cell to edit purge volumes directly in the matrix
- **Input Validation**: Automatic validation of purge volume inputs (0-999 mm³)
- **Default Values**: One-click button to set all purge volumes to default configuration (65 mm³)
- **Responsive Design**: Matrix adapts to different screen sizes for mobile and desktop use
- **Legend**: Clear explanation of matrix symbols and color coding

### 🎨 Filament Colors
- **Complete CRUD Operations**: Add, edit, and delete filament colors
- **Visual Color Management**: Interactive color picker for precise color selection
- **Type Association**: Link colors to specific filament types
- **Inline Editing**: Edit color names and types directly in the table
- **Color Preview**: Live preview of colors with clickable color circles
- **Smart Validation**: Prevents empty color names and validates input
- **Cascading Updates**: Purge matrix automatically updates when colors are modified

### 🏷️ Filament Types
- **Brand and Type Management**: Organize filaments by brand and specific type
- **Auto-Generated Names**: Full names automatically created from brand + type
- **Inline Editing**: Edit brand and type information directly in the table
- **Input Validation**: Prevents empty fields and maintains data integrity
- **Cascading Deletes**: Safely removes associated colors and purge data when types are deleted
- **Real-time Updates**: Changes instantly reflected across all related components

### 💾 Data Persistence
- **Local Storage**: All data persists in browser's local storage
- **Auto-Save**: Changes are automatically saved as you type
- **Default Data**: Pre-populated with sample filament types and colors
- **SSR Compatible**: Works with Angular's server-side rendering
- **Data Integrity**: Maintains relationships between types, colors, and purge volumes

### 🎨 Modern UI/UX
- **Angular Material Design**: Clean, professional interface following Material Design principles
- **Tabbed Navigation**: Easy switching between Purge Matrix, Colors, and Types
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Dark Theme Elements**: Modern color scheme with good contrast
- **Interactive Elements**: Hover effects, focus states, and smooth transitions
- **Confirmation Dialogs**: User-friendly confirmations for destructive actions

## Quick Start

### Development server

To start a local development server, run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Building

To build the project run:

```bash
npm run build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Project Structure

```
src/
├── app/
│   ├── components/           # UI Components
│   │   ├── main.component.ts      # Main app with tabs
│   │   ├── purge-matrix/          # Purge matrix view
│   │   ├── filament-colors/       # Color management
│   │   └── filament-types/        # Type management
│   ├── models/              # Data models and interfaces
│   │   └── filament.models.ts     # FilamentType, FilamentColor, PurgeMatrix
│   └── services/            # Business logic
│       └── filament-data.service.ts # Data management with local storage
```

## Usage

1. **Define Filament Types**: Start by creating filament types in the "Filament Types" tab
2. **Add Colors**: Create specific colors for your filaments in the "Filament Colors" tab
3. **Set Purge Volumes**: Use the "Purge Matrix" tab to configure purge volumes between color transitions

## Technology Stack

- **Angular 20+** with standalone components
- **Angular Material** for UI components
- **SCSS** for styling
- **TypeScript** for type safety
- **Local Storage** for data persistence
- **Angular Signals** for reactive state management

## Development

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.1.

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
