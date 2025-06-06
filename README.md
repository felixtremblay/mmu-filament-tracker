
# MMU Filament Tracker

> ⚠️ **WORK IN PROGRESS** ⚠️  
> This is an unfinished project that was mostly vibe-coded with AI assistance. Expect bugs, missing features, and questionable architectural decisions.

A simple web app for tracking filament purge volumes when using a Prusa MMU (Multi Material Unit).

## What it does

- **Purge Matrix**: Grid showing how much filament to purge when switching from color A to color B
- **Filament Management**: Add/edit filament types and colors
- **Local Storage**: Your data stays in your browser (no cloud, no account needed)

## Running this thing

### Development server
```bash
npm start
```
Then go to `http://localhost:4200/`


### Building
```bash
npm run build
```

### Local development
```bash
npm start
```
Then go to `http://localhost:4200/`

## How to use

1. Add some filament types (brand + type)
2. Add colors for those filament types  
3. Set purge volumes in the matrix
4. Done

## Contributing

Feel free to fork and improve this. Pull requests welcome if you want to fix the mess.

## License

MIT - Do whatever you want with this code.
