#include "AudioManager.h"

AudioManager::AudioManager() : mSoloud(nullptr) {}

AudioManager::~AudioManager() {
    mSounds.clear();
}

void AudioManager::init(SoLoud::Soloud* soloud) {
    mSoloud = soloud;
}

void AudioManager::loadSound(const std::string& filename) {
    auto sound = std::make_unique<SoLoud::Wav>();
    sound->load(filename.c_str());
    mSounds.push_back(std::move(sound));
}

void AudioManager::playSound(int handle) {
    if (handle >= 0 && handle < mSounds.size()) {
        mSoloud->play(*mSounds[handle]);
    }
}

void AudioManager::stopSound(int handle) {
    if (handle >= 0 && handle < mSounds.size()) {
        mSoloud->stop(*mSounds[handle]);
    }
}

void AudioManager::setVolume(int handle, float volume) {
    if (handle >= 0 && handle < mSounds.size()) {
        mSounds[handle]->setVolume(volume);
    }
}

void AudioManager::setPitch(int handle, float pitch) {
    if (handle >= 0 && handle < mSounds.size()) {
        mSounds[handle]->setRelativePlaySpeed(pitch);
    }
} 