#pragma once

#include <SDL2/SDL.h>
#include <string>

class UI {
public:
    UI();
    ~UI();
    
    void init();
    void update();
    void render();
    void handleEvent(const SDL_Event& event);
    
private:
    SDL_Window* mWindow;
    SDL_Renderer* mRenderer;
    bool mRunning;
    
    // UI elements
    void renderButton(const std::string& text, int x, int y, int width, int height);
    void renderSlider(int x, int y, int width, int height, float value);
    void renderWaveform(int x, int y, int width, int height);
}; 