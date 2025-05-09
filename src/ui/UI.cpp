#include "UI.h"
#include <iostream>

UI::UI() : mWindow(nullptr), mRenderer(nullptr), mRunning(false) {}

UI::~UI() {
    if (mRenderer) SDL_DestroyRenderer(mRenderer);
    if (mWindow) SDL_DestroyWindow(mWindow);
}

void UI::init() {
    // Create window
    mWindow = SDL_CreateWindow(
        "SfxMaker",
        SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED,
        800, 600,
        SDL_WINDOW_SHOWN
    );
    
    if (!mWindow) {
        std::cerr << "Failed to create window: " << SDL_GetError() << std::endl;
        return;
    }
    
    // Create renderer
    mRenderer = SDL_CreateRenderer(mWindow, -1, SDL_RENDERER_ACCELERATED);
    if (!mRenderer) {
        std::cerr << "Failed to create renderer: " << SDL_GetError() << std::endl;
        return;
    }
    
    mRunning = true;
}

void UI::update() {
    SDL_Event event;
    while (SDL_PollEvent(&event)) {
        if (event.type == SDL_QUIT) {
            mRunning = false;
        }
        handleEvent(event);
    }
}

void UI::render() {
    // Clear screen
    SDL_SetRenderDrawColor(mRenderer, 0, 0, 0, 255);
    SDL_RenderClear(mRenderer);
    
    // Render UI elements
    renderButton("Play", 50, 50, 100, 40);
    renderButton("Stop", 50, 100, 100, 40);
    renderSlider(200, 50, 200, 20, 0.5f);
    renderWaveform(50, 200, 700, 200);
    
    // Update screen
    SDL_RenderPresent(mRenderer);
}

void UI::handleEvent(const SDL_Event& event) {
    // Handle mouse clicks, keyboard input, etc.
    if (event.type == SDL_MOUSEBUTTONDOWN) {
        int x, y;
        SDL_GetMouseState(&x, &y);
        // Handle button clicks
    }
}

void UI::renderButton(const std::string& text, int x, int y, int width, int height) {
    SDL_Rect rect = {x, y, width, height};
    SDL_SetRenderDrawColor(mRenderer, 100, 100, 100, 255);
    SDL_RenderFillRect(mRenderer, &rect);
    SDL_SetRenderDrawColor(mRenderer, 255, 255, 255, 255);
    SDL_RenderDrawRect(mRenderer, &rect);
}

void UI::renderSlider(int x, int y, int width, int height, float value) {
    // Draw slider track
    SDL_Rect track = {x, y, width, height};
    SDL_SetRenderDrawColor(mRenderer, 50, 50, 50, 255);
    SDL_RenderFillRect(mRenderer, &track);
    
    // Draw slider handle
    int handleX = x + (int)(width * value);
    SDL_Rect handle = {handleX - 5, y - 5, 10, height + 10};
    SDL_SetRenderDrawColor(mRenderer, 200, 200, 200, 255);
    SDL_RenderFillRect(mRenderer, &handle);
}

void UI::renderWaveform(int x, int y, int width, int height) {
    SDL_Rect rect = {x, y, width, height};
    SDL_SetRenderDrawColor(mRenderer, 30, 30, 30, 255);
    SDL_RenderFillRect(mRenderer, &rect);
    SDL_SetRenderDrawColor(mRenderer, 100, 100, 100, 255);
    SDL_RenderDrawRect(mRenderer, &rect);
} 