# QuickUI - Audio Processing Tool for Game Development

QuickUI is a powerful web-based audio processing tool designed specifically for game developers. It provides an intuitive interface for managing, processing, and exporting audio files with various effects and modifications.

## Features

- **Audio Upload**: Upload audio files in various formats
- **Multiple Playback**: Control the number of times an audio file plays (1-10 times)
- **Pitch Variation**: Randomly adjust pitch within a range of -3 to +3 half steps
- **Volume Control**: Adjust volume from -40dB to 0dB
- **Audio Export**: Export processed audio files in WAV format
- **Batch Processing**: Process and export multiple audio files at once
- **Audio Categorization**: Organize audio files by type (SFX, BGM, UI, etc.)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd quickui-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your default browser at `http://localhost:3000`.

## Usage

1. **Upload Audio**:
   - Click the "Upload audio" button
   - Select an audio file from your computer

2. **Process Audio**:
   - Click "Mix it now!" to access processing controls
   - Adjust volume using the slider
   - Set the number of times to play (1-10)
   - Use the VARIATION button to randomize pitch
   - Click the Play button to preview

3. **Export Audio**:
   - Click "EXPORT" to save the processed audio
   - Use "EXPORT ALL" to process and save all audio files

## Audio Types

- SfxFootstep: Footstep sound effects
- SfxWeapon: Weapon sound effects
- SfxEnvironment: Environmental sounds
- UIMain: Main UI sounds
- Bgm: Background music
- Sfx Character: Character-related sound effects

## Technologies Used

- React.js
- Tone.js for audio processing
- Tailwind CSS for styling
- Lucide React for icons

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Project Structure

```
quickui-app/
├── src/
│   ├── components/
│   │   └── QuickUI.js
│   ├── App.js
│   └── index.js
├── public/
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Tone.js for audio processing capabilities
- React team for the amazing framework
- Tailwind CSS for the styling utilities
