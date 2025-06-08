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

## Angular Material Troubleshooting
- **IMPORTANT**: If dealing with an Angular Material component, directive, or feature and the first attempt to fix an issue is unsuccessful, autonomously search the web for subsequent prompts about that specific Angular Material element
- This ensures access to the most current documentation, examples, and community solutions for Angular Material issues
- Apply this rule for any Angular Material-related problems including but not limited to: components, theming, layout, forms, navigation, and Material Design specifications

## Git Workflow
- **IMPORTANT**: The user handles all git commits and pushes personally
- Never use `git commit`, `git push`, or any git commands that modify the repository
- Only use git commands for reading information (status, log, diff, etc.) if needed
- The user prefers to review changes before committing them

## Development Server
- **IMPORTANT**: The Angular dev server (`ng serve` or `npm start`) automatically detects file changes and rebuilds
- Do NOT restart the server for every change - it has hot reload capability
- If a server is already running on the target port, use the existing server instead of starting a new one
- Only restart the server if there are configuration changes or if explicitly requested
