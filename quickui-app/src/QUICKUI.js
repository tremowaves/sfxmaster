import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { Plus } from 'lucide-react';

export default function QuickUI() {
  // State để lưu trữ danh sách âm thanh
  const [audioTracks, setAudioTracks] = useState([]);
  // State để lưu trữ trạng thái playing
  const [playingState, setPlayingState] = useState({});
  // State để lưu trữ pitch variation
  const [pitchVariation, setPitchVariation] = useState({});
  // State để lưu trữ trạng thái export
  const [exportingState, setExportingState] = useState({});
  // State để lưu trữ tiến trình export all
  const [exportAllProgress, setExportAllProgress] = useState(0);
  
  // Refs để truy cập các player âm thanh
  const [repeatState, setRepeatState] = useState({});
  const playerRefs = useRef({});
  
  // Các loại âm thanh
  const soundTypes = [
    "SfxFootstep",
    "SfxWeapon",
    "SfxEnvironment",
    "UIMain",
    "Bgm",
    "Sfx Character"
  ];

  // Hiệu ứng để khởi tạo Tone.js
  useEffect(() => {
    Tone.start();
    return () => {
      // Dọn dẹp khi component unmount
      Object.values(playerRefs.current).forEach(player => {
        if (player) player.dispose();
      });
    };
  }, []);

  // Hàm để xử lý upload file âm thanh
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      // Đọc file và tạo AudioBuffer
      const arrayBuffer = await file.arrayBuffer();
      const audioContext = new AudioContext();
      const decodedBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Tạo buffer Tone.js
      const buffer = new Tone.Buffer().fromArray(
        decodedBuffer.getChannelData(0),
        decodedBuffer.sampleRate
      );
      
      // Tạo track mới
      const newTrack = {
        id: Date.now().toString(),
        name: file.name,
        type: '',
        buffer,
        volume: -10,
        pitch: 0,
        playCount: 1,
        mixed: false
      };
      
      setAudioTracks(prev => [...prev, newTrack]);
      
      // Tạo player mới cho track này
      const player = new Tone.Player(buffer).toDestination();
      player.volume.value = -10; // Mặc định volume
      
      // Lưu player vào refs
      playerRefs.current[newTrack.id] = player;
    } catch (error) {
      console.error("Error loading audio file:", error);
      alert("Không thể tải file âm thanh. Vui lòng thử lại với file khác.");
    }
  };

  // Hàm để phát âm thanh
  const playSound = (trackId) => {
    const player = playerRefs.current[trackId];
    if (player) {
      // Áp dụng pitch variation nếu có
      if (pitchVariation[trackId]) {
        player.playbackRate = Math.pow(2, pitchVariation[trackId] / 12);
      }
      player.start();
      setPlayingState(prev => ({ ...prev, [trackId]: true }));
      
      player.onstop = () => {
        setPlayingState(prev => ({ ...prev, [trackId]: false }));
      };
    }
  };

  // Hàm để dừng âm thanh
  const stopSound = (trackId) => {
    const player = playerRefs.current[trackId];
    if (player) {
      player.stop();
      setPlayingState(prev => ({ ...prev, [trackId]: false }));
    }
  };

  // Hàm để thêm pitch variation
  const addPitchVariation = (trackId, value) => {
    setPitchVariation(prev => ({ ...prev, [trackId]: value }));
    const player = playerRefs.current[trackId];
    if (player) player.playbackRate = Math.pow(2, value / 12);
  };

  // Hàm chuyển AudioBuffer thành WAV Blob
  function bufferToWav(buffer) {
    const numOfChan = buffer.numberOfChannels,
      length = buffer.length * numOfChan * 2 + 44,
      bufferArray = new ArrayBuffer(length),
      view = new DataView(bufferArray),
      channels = [],
      sampleRate = buffer.sampleRate;
    let offset = 0, pos = 0;

    function setUint16(data) {
      view.setUint16(pos, data, true);
      pos += 2;
    }
    function setUint32(data) {
      view.setUint32(pos, data, true);
      pos += 4;
    }

    // write WAVE header
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"

    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // length = 16
    setUint16(1); // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(sampleRate);
    setUint32(sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2);
    setUint16(16);

    setUint32(0x61746164); // "data" - chunk
    setUint32(length - pos - 4);

    // write interleaved data
    for (let i = 0; i < buffer.numberOfChannels; i++)
      channels.push(buffer.getChannelData(i));

    let sample = 0;
    while (offset < buffer.length) {
      for (let i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = (0.5 + sample * 32767) | 0;
        view.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }
    return new Blob([bufferArray], { type: "audio/wav" });
  }

  // Hàm tải file WAV
  function downloadWavBlob(wavBlob, filename = 'sound.wav') {
    const url = URL.createObjectURL(wavBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  // Hàm export với variation sử dụng Tone.Recorder
  const exportWithVariation = async (track, pitchVariation, onStatus) => {
    try {
      if (onStatus) onStatus('loading');
      // Tạo recorder
      const recorder = new Tone.Recorder();
      // Tạo player từ buffer
      const player = new Tone.Player(track.buffer).toDestination();
      let chainStart = player;
      // Nếu có variation, thêm hiệu ứng pitch shift
      if (pitchVariation && pitchVariation !== 0) {
        const pitchShift = new Tone.PitchShift({ pitch: pitchVariation }).toDestination();
        player.disconnect();
        player.connect(pitchShift);
        chainStart = pitchShift;
      }
      // Kết nối vào recorder
      chainStart.connect(recorder);
      // Đảm bảo âm thanh đã tải
      await Tone.loaded();
      // Bắt đầu ghi
      recorder.start();
      // Phát âm thanh
      player.start();
      // Đợi phát xong
      await new Promise(resolve => setTimeout(resolve, player.buffer.duration * 1000 + 500));
      // Dừng ghi và lấy blob
      const recording = await recorder.stop();
      // Tạo URL và tải file
      const fileName = `${track.name.replace(/\.[^/.]+$/, '')}_var${pitchVariation > 0 ? '+' + pitchVariation : pitchVariation}.wav`;
      const url = URL.createObjectURL(recording);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
      if (onStatus) onStatus('success', fileName);
    } catch (error) {
      if (onStatus) onStatus('error', error);
      console.error('Lỗi khi export:', error);
    }
  };

  // Hàm để export tất cả âm thanh
  const exportAllSounds = async () => {
    if (audioTracks.length === 0) return;
    setExportAllProgress(0);
    for (let i = 0; i < audioTracks.length; i++) {
      await exportWithVariation(audioTracks[i], pitchVariation[audioTracks[i].id] || 0, (status, info) => {
        setExportAllProgress(((i + 1) / audioTracks.length) * 100);
        if (status === 'success') alert(`Đã xuất file ${info} thành công!`);
        if (status === 'error') alert('Lỗi khi xuất file. Vui lòng thử lại.');
      });
    }
    setExportAllProgress(0);
    alert("Đã xuất tất cả file thành công!");
  };

  // Hàm để xử lý khi người dùng xóa một track
  const removeTrack = (trackId) => {
    // Xóa player
    if (playerRefs.current[trackId]) {
      playerRefs.current[trackId].dispose();
      delete playerRefs.current[trackId];
    }
    
    // Xóa track khỏi state
    setAudioTracks(prev => prev.filter(track => track.id !== trackId));
    
    // Xóa trạng thái playing
    setPlayingState(prev => {
      const newState = { ...prev };
      delete newState[trackId];
      return newState;
    });
  };

  // Hàm để chọn type cho track
  const selectType = (trackId, type) => {
    setAudioTracks(prev => 
      prev.map(track => 
        track.id === trackId ? { ...track, type } : track
      )
    );
  };

  // Hàm để cập nhật volume của track
  const updateVolume = (trackId, value) => {
    // Cập nhật state
    setAudioTracks(prev => 
      prev.map(track => 
        track.id === trackId ? { ...track, volume: value } : track
      )
    );
    
    // Cập nhật player
    if (playerRefs.current[trackId]) {
      playerRefs.current[trackId].volume.value = value;
    }
  };

  // Hàm để cập nhật số lần phát
  const updatePlayCount = (trackId, value) => {
    setAudioTracks(prev => 
      prev.map(track => 
        track.id === trackId ? { ...track, playCount: value } : track
      )
    );
  };

  // Hàm để kích hoạt chế độ mix
  const activateMixMode = (trackId) => {
    setAudioTracks(prev => 
      prev.map(track => 
        track.id === trackId ? { ...track, mixed: true } : track
      )
    );
  };

  // Hàm để phát tất cả các âm thanh
  const playAllSounds = () => {
    audioTracks.forEach(track => {
      const player = playerRefs.current[track.id];
      if (player) {
        player.start();
        setPlayingState(prev => ({ ...prev, [track.id]: true }));
        
        player.onstop = () => {
          setPlayingState(prev => ({ ...prev, [track.id]: false }));
        };
      }
    });
  };

  // State để hiển thị trạng thái export từng track
  const [exportStatus, setExportStatus] = useState({});

  // Hiển thị ứng dụng
  return (
    <div className="max-w-5xl mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="bg-green-50 py-4 px-6 rounded-md mb-6 text-center">
        <h1 className="text-3xl font-bold text-black">SFX MAKER</h1>
        <p className="text-xl text-black">An UI Sound All in one for GameDev</p>
      </div>

      <div className="mb-6">
        <button 
          onClick={() => document.getElementById('fileInput').click()} 
          className="flex items-center gap-2 border border-gray-300 bg-white px-4 py-2 rounded-md hover:bg-gray-100"
        >
          <Plus size={18} /> Upload audio
        </button>
        <input 
          id="fileInput" 
          type="file" 
          accept="audio/*" 
          onChange={handleFileUpload} 
          className="hidden" 
        />
      </div>

      {/* List of audio tracks dưới dạng bảng đúng yêu cầu */}
      <table className="min-w-full bg-white border border-gray-200 mt-4">
        <thead>
          <tr>
            <th className="px-2 py-1 border">Tên file</th>
            <th className="px-2 py-1 border">Phân loại</th>
            <th className="px-2 py-1 border">Volume</th>
            <th className="px-2 py-1 border">Lặp</th>
            <th className="px-2 py-1 border">Play/Stop</th>
            <th className="px-2 py-1 border">Variation</th>
            <th className="px-2 py-1 border">Export</th>
          </tr>
        </thead>
        <tbody>
          {audioTracks.map((track) => (
            <tr key={track.id}>
              <td className="px-2 py-1 border">{track.name}</td>
              <td className="px-2 py-1 border">
                <select value={track.type} onChange={e => selectType(track.id, e.target.value)} className="border rounded px-1 py-0.5">
                  <option value="">Chọn loại</option>
                  {soundTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </td>
              <td className="px-2 py-1 border">
                <input
                  type="range"
                  min="-40"
                  max="0"
                  value={track.volume}
                  onChange={e => updateVolume(track.id, Number(e.target.value))}
                  className="w-32"
                />
                <span className="ml-2">{track.volume}</span>
              </td>
              <td className="px-2 py-1 border">
                <button
                  onClick={() => {
                    setRepeatState(prev => ({
                      ...prev,
                      [track.id]: !prev[track.id]
                    }));
                    const player = playerRefs.current[track.id];
                    if (player) player.loop = !repeatState[track.id];
                    console.log("Set repeat for", track.id, "to", !repeatState[track.id]);
                  }}
                  style={{
                    background: repeatState[track.id] ? '#34d399' : '#e5e7eb',
                    color: repeatState[track.id] ? '#fff' : '#000',
                    borderRadius: 4,
                    padding: '2px 12px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                  title={repeatState[track.id] ? 'Đang lặp vô hạn' : 'Bật lặp vô hạn'}
                >
                  {repeatState[track.id] ? '🔁 Repeat' : 'Repeat'}
                </button>
              </td>
              <td className="px-2 py-1 border">
                {playingState[track.id] ? (
                  <button
                    onClick={() => stopSound(track.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
                  </button>
                ) : (
                  <button
                    onClick={() => playSound(track.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>
                  </button>
                )}
              </td>
              <td className="px-2 py-1 border">
                <div className="flex gap-1">
                  {[-3, -2, -1, 0, 1, 2, 3].map(value => (
                    <button
                      key={value}
                      onClick={() => addPitchVariation(track.id, value)}
                      className={`px-2 rounded ${pitchVariation[track.id] === value ? 'bg-purple-500 text-white' : 'bg-purple-100 hover:bg-purple-200'}`}
                    >
                      {value > 0 ? `+${value}` : value}
                    </button>
                  ))}
                </div>
              </td>
              <td className="px-2 py-1 border">
                <button
                  onClick={async () => {
                    setExportStatus(prev => ({ ...prev, [track.id]: 'loading' }));
                    await exportWithVariation(track, pitchVariation[track.id] || 0, (status, info) => {
                      setExportStatus(prev => ({ ...prev, [track.id]: status }));
                      if (status === 'success') alert(`Đã xuất file ${info} thành công!`);
                      if (status === 'error') alert('Lỗi khi xuất file. Vui lòng thử lại.');
                    });
                  }}
                  className={`bg-green-500 text-white px-3 py-1 rounded ${exportStatus[track.id] === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={exportStatus[track.id] === 'loading'}
                >
                  {exportStatus[track.id] === 'loading' ? 'Đang xuất...' : 'Export'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Global controls */}
      {audioTracks.length > 0 && (
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex gap-4 justify-end">
            <button 
              onClick={playAllSounds}
              className="px-6 py-2 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              PLAY ALL
            </button>
            <button 
              onClick={exportAllSounds}
              className="px-6 py-2 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              EXPORT ALL
            </button>
          </div>
          
          {/* Progress bar for export all */}
          {exportAllProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${exportAllProgress}%` }}
              ></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
