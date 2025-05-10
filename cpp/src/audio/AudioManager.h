#pragma once

#include "soloud.h"
#include "soloud_wav.h"
#include <string>
#include <vector>
#include <memory>

class AudioManager {
public:
    AudioManager();
    ~AudioManager();
    
    void init(SoLoud::Soloud* soloud);
    void loadSound(const std::string& filename);
    void playSound(int handle);
    void stopSound(int handle);
    void setVolume(int handle, float volume);
    void setPitch(int handle, float pitch);
    
private:
    SoLoud::Soloud* mSoloud;
    std::vector<std::unique_ptr<SoLoud::Wav>> mSounds;
}; 