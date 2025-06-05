# Copilot Instructions for Filament Tracker

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is an Angular webapp for tracking 3D printing filament purge volumes for Prusa MMU (Multi Material Unit). The application helps users manage the amount of filament that needs to be purged when switching between different filament types and colors during multi-material printing.

## Key Features
1. **Purge Matrix**: A matrix showing purge volumes required when switching from one filament to another
2. **Filament Colors**: Management of filament colors with associated filament types and color names
3. **Filament Types**: Management of filament types defined by brand and type

## Architecture
- Angular 20+ with Angular Material for UI components
- Standalone components with signal-based state management
- Local storage for data persistence
- Responsive design with modern UI/UX

## Code Style Guidelines
- Use Angular standalone components
- Implement reactive forms with Angular Material
- Use Angular signals for state management
- Follow Angular style guide conventions
- Use SCSS for styling with Angular Material theming
- Implement proper TypeScript types and interfaces

## Data Models
- FilamentType: brand, type, fullName
- FilamentColor: filamentType, colorName, color (hex)
- PurgeMatrix: 2D array of purge volumes indexed by filament colors
