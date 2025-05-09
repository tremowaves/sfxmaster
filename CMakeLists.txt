cmake_minimum_required(VERSION 3.13)
project(SfxMaker)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Add Emscripten specific settings
if(EMSCRIPTEN)
    set(CMAKE_EXECUTABLE_SUFFIX ".html")
    set(CMAKE_EXECUTABLE_SUFFIX_CXX ".html")
    
    # Add Emscripten specific flags
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s USE_WEBGL2=1 -s ALLOW_MEMORY_GROWTH=1")
    
    # Enable WebAssembly
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s WASM=1")
    
    # Add SoLoud specific flags
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s USE_SDL=2")
endif()

# SoLoud source files
set(SOUND_SOURCES
    soloud/src/audiosource/ay.cpp
    soloud/src/audiosource/biquadresonantfilter.cpp
    soloud/src/audiosource/bus.cpp
    soloud/src/audiosource/dcremovalfilter.cpp
    soloud/src/audiosource/echofilter.cpp
    soloud/src/audiosource/fftfilter.cpp
    soloud/src/audiosource/fftfilter_instance.cpp
    soloud/src/audiosource/flangerfilter.cpp
    soloud/src/audiosource/freeverbfilter.cpp
    soloud/src/audiosource/lofifilter.cpp
    soloud/src/audiosource/modplug.cpp
    soloud/src/audiosource/monotone.cpp
    soloud/src/audiosource/noise.cpp
    soloud/src/audiosource/openmpt.cpp
    soloud/src/audiosource/queue.cpp
    soloud/src/audiosource/robotizefilter.cpp
    soloud/src/audiosource/sfxr.cpp
    soloud/src/audiosource/speech.cpp
    soloud/src/audiosource/tedsid.cpp
    soloud/src/audiosource/vic.cpp
    soloud/src/audiosource/vizsn.cpp
    soloud/src/audiosource/wav.cpp
    soloud/src/audiosource/waveshaperfilter.cpp
    soloud/src/audiosource/wavstream.cpp
    soloud/src/core/soloud.cpp
    soloud/src/core/soloud_audiosource.cpp
    soloud/src/core/soloud_bus.cpp
    soloud/src/core/soloud_core_3d.cpp
    soloud/src/core/soloud_core_basicops.cpp
    soloud/src/core/soloud_core_faderops.cpp
    soloud/src/core/soloud_core_filterops.cpp
    soloud/src/core/soloud_core_getters.cpp
    soloud/src/core/soloud_core_setters.cpp
    soloud/src/core/soloud_core_voiceops.cpp
    soloud/src/core/soloud_fader.cpp
    soloud/src/core/soloud_fft.cpp
    soloud/src/core/soloud_fft_lut.cpp
    soloud/src/core/soloud_file.cpp
    soloud/src/core/soloud_filter.cpp
    soloud/src/core/soloud_misc.cpp
    soloud/src/core/soloud_queue.cpp
    soloud/src/core/soloud_thread.cpp
    soloud/src/filter/soloud_biquadresonantfilter.cpp
    soloud/src/filter/soloud_dcremovalfilter.cpp
    soloud/src/filter/soloud_echofilter.cpp
    soloud/src/filter/soloud_fftfilter.cpp
    soloud/src/filter/soloud_flangerfilter.cpp
    soloud/src/filter/soloud_freeverbfilter.cpp
    soloud/src/filter/soloud_lofifilter.cpp
    soloud/src/filter/soloud_robotizefilter.cpp
    soloud/src/filter/soloud_waveshaperfilter.cpp
)

# Create SoLoud library
add_library(soloud STATIC ${SOUND_SOURCES})

# Add source files
set(SOURCES
    src/main.cpp
    src/audio/AudioManager.cpp
    src/ui/UI.cpp
)

# Create executable
add_executable(${PROJECT_NAME} ${SOURCES})

# Link libraries
target_link_libraries(${PROJECT_NAME} PRIVATE soloud)

# Include directories
target_include_directories(${PROJECT_NAME} PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}/src
    ${CMAKE_CURRENT_SOURCE_DIR}/soloud/include
)

target_include_directories(soloud PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/soloud/include
) 