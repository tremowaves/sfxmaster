# SFX Maker

A powerful sound effect creation and manipulation tool that combines C++ audio processing with a modern web interface.

## Project Structure

```
./
├── cpp/                  # C++ components
│   ├── src/             # C++ source code
│   │   ├── audio/       # Audio processing code
│   │   ├── ui/          # UI-related code
│   │   └── main.cpp     # Main entry point
│   ├── build/           # C++ build artifacts
│   └── CMakeLists.txt   # C++ build configuration
├── src/                 # Web application source
│   ├── components/      # React components
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   └── App.js          # Main application component
├── public/             # Static assets
├── scripts/            # Build scripts
├── soloud/             # SoLoud audio engine
└── .htaccess           # Web server configuration
```

## Prerequisites

- C++17 compatible compiler
- CMake 3.15 or higher
- Node.js 16.x or higher
- npm or yarn

## Building the Project

### C++ Components

```bash
# Navigate to C++ directory
cd cpp

# Create and enter build directory
mkdir -p build && cd build

# Configure and build
cmake ..
make

# Run the application
./sfxmaker
```

### Web Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Development

- C++ code is in the `cpp/src/` directory
- Web application code is in `src/`
- Use `cpp/build/` directory for C++ build artifacts
- Web app build output goes to `dist/`

## Features

- Real-time audio visualization
- Sound effect manipulation
- Modern, responsive UI
- Cross-browser compatibility

## Tech Stack

- React.js
- Tailwind CSS
- Web Audio API
- SoLoud Audio Engine
- C++17

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 