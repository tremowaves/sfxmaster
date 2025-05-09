#include <emscripten.h>
#include <emscripten/html5.h>
#include <SDL2/SDL.h>
#include "soloud.h"
#include "soloud_wav.h"
#include "AudioManager.h"
#include "UI.h"

// Global variables
SoLoud::Soloud gSoloud;
AudioManager gAudioManager;
UI gUI;

// Main loop function
void main_loop() {
    // Process audio
    gSoloud.update();
    
    // Update UI
    gUI.update();
}

int main(int argc, char* argv[]) {
    // Initialize SDL
    if (SDL_Init(SDL_INIT_VIDEO | SDL_INIT_AUDIO) < 0) {
        return -1;
    }
    
    // Initialize SoLoud
    gSoloud.init();
    
    // Initialize audio manager
    gAudioManager.init(&gSoloud);
    
    // Initialize UI
    gUI.init();
    
    // Set up main loop
    emscripten_set_main_loop(main_loop, 0, 1);
    
    return 0;
} 