import React, { useRef, useState } from "react";

const defaultCategory = "UI";

function randomPitch() {
  // Tạo pitch ngẫu nhiên trong khoảng 0.8 - 1.2
  return 0.8 + Math.random() * 0.4;
}

export default function App() {
  const [sounds, setSounds] = useState([]);
  const fileInput = useRef();

  // Thêm file mới
  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const newSounds = files.map((file) => ({
      file,
      name: file.name,
      category: defaultCategory,
      volume: 1,
      loop: 1,
      pitch: 1,
      url: URL.createObjectURL(file),
    }));
    setSounds((prev) => [...prev, ...newSounds]);
  };

  // Chỉnh thông tin từng sound
  const updateSound = (idx, changes) => {
    setSounds((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, ...changes } : s))
    );
  };

  // Phát thử (dùng Audio mặc định, sẽ thay bằng SoLoud sau)
  const playSound = (sound, variation = false) => {
    const audio = new Audio(sound.url);
    audio.volume = sound.volume;
    audio.loop = sound.loop > 1;
    if (variation) {
      audio.playbackRate = randomPitch();
    } else {
      audio.playbackRate = sound.pitch;
    }
    audio.play();
  };

  // Phát tất cả
  const playAll = () => {
    sounds.forEach((s) => playSound(s));
  };

  // Export file (tải về)
  const exportSound = (sound) => {
    const a = document.createElement("a");
    a.href = sound.url;
    a.download = sound.name;
    a.click();
  };

  // Export tất cả
  const exportAll = () => {
    sounds.forEach(exportSound);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-2">QUICK UI</h1>
        <p className="text-center mb-6 text-gray-500">
          An UI Sound All in one for GameDev
        </p>
        <input
          type="file"
          multiple
          accept="audio/*"
          ref={fileInput}
          onChange={handleUpload}
          className="mb-4"
        />
        {sounds.length > 0 && (
          <>
            <table className="w-full mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Tên file</th>
                  <th className="p-2">Phân loại</th>
                  <th className="p-2">Volume</th>
                  <th className="p-2">Lặp</th>
                  <th className="p-2">Play</th>
                  <th className="p-2">Export</th>
                  <th className="p-2">Variation</th>
                </tr>
              </thead>
              <tbody>
                {sounds.map((sound, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-2">{sound.name}</td>
                    <td className="p-2">
                      <input
                        value={sound.category}
                        onChange={(e) =>
                          updateSound(idx, { category: e.target.value })
                        }
                        className="border rounded px-2 py-1 w-24"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={sound.volume}
                        onChange={(e) =>
                          updateSound(idx, { volume: Number(e.target.value) })
                        }
                      />
                      <span className="ml-2">{sound.volume}</span>
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min={1}
                        max={99}
                        value={sound.loop}
                        onChange={(e) =>
                          updateSound(idx, { loop: Number(e.target.value) })
                        }
                        className="border rounded px-2 py-1 w-12"
                      />
                    </td>
                    <td className="p-2">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                        onClick={() => playSound(sound)}
                      >
                        Play
                      </button>
                    </td>
                    <td className="p-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded"
                        onClick={() => exportSound(sound)}
                      >
                        Export
                      </button>
                    </td>
                    <td className="p-2">
                      <button
                        className="bg-purple-500 text-white px-3 py-1 rounded"
                        onClick={() => playSound(sound, true)}
                      >
                        Variation
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex gap-4 justify-end">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={playAll}
              >
                Play All
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={exportAll}
              >
                Export All
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}