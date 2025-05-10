import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { SoloudWrapper } from '../utils/SoloudWrapper';

const SOUND_TYPES = [
  'Bgm',
  'Sfx Character',
  'Sfx Environment',
  'SfxFootstep',
  'SfxWeapon',
  'UIMain',
];

const QuickUI = () => {
  const [tracks, setTracks] = useState([]);
  const [soloud, setSoloud] = useState(null);
  const [isPlayingId, setIsPlayingId] = useState(null);

  useEffect(() => {
    const initSoloud = async () => {
      const soloudInstance = new SoloudWrapper();
      await soloudInstance.init();
      setSoloud(soloudInstance);
    };
    initSoloud();
    return () => { if (soloud) soloud.cleanup(); };
    // eslint-disable-next-line
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && soloud) {
      setTracks([
        ...tracks,
        {
          id: Date.now(),
          name: file.name,
          type: '',
          file,
          volume: 1,
          repeat: 1,
        },
      ]);
    }
  };

  const handleTypeChange = (trackId, value) => {
    setTracks(tracks.map(track => track.id === trackId ? { ...track, type: value } : track));
  };

  const handleVolumeChange = (trackId, value) => {
    setTracks(tracks.map(track => track.id === trackId ? { ...track, volume: value } : track));
  };

  const handleRepeatChange = (trackId, value) => {
    setTracks(tracks.map(track => track.id === trackId ? { ...track, repeat: value } : track));
  };

  const handleRemoveTrack = (trackId) => {
    setTracks(tracks.filter(track => track.id !== trackId));
  };

  const handlePlay = async (track) => {
    if (!soloud) return;
    await soloud.loadSound(track.file);
    setIsPlayingId(track.id);
    for (let i = 0; i < track.repeat; i++) {
      soloud.play();
      // Giả lập delay, thực tế nên lấy duration file
      await new Promise(res => setTimeout(res, 1000));
    }
    setIsPlayingId(null);
  };

  // Dummy export: chỉ tải file gốc (có thể thay bằng xử lý WAV thực tế nếu cần)
  const handleExport = (track) => {
    const url = URL.createObjectURL(track.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = track.name.replace(/\.[^/.]+$/, '') + '.wav';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePlayAll = async () => {
    for (const track of tracks) {
      await handlePlay(track);
    }
  };

  const handleExportAll = () => {
    tracks.forEach(track => handleExport(track));
  };

  return (
    <div style={{ background: '#f7f7fb', minHeight: '100vh', padding: '32px 0' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #0001', padding: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: 1, marginBottom: 8, textAlign: 'center' }}>QUICK UI</h1>
        <div style={{ textAlign: 'center', color: '#666', marginBottom: 32 }}>An UI Sound All in one for GameDev</div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end', marginBottom: 32 }}>
          <Input type="file" accept="audio/*" onChange={handleFileUpload} style={{ flex: 1 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {tracks.map(track => (
            <div key={track.id} style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#f3f3fa', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px #0001' }}>
              <div style={{ flex: 2, minWidth: 120 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{track.name}</div>
                <Input
                  value={track.type}
                  onChange={e => handleTypeChange(track.id, e.target.value)}
                  list={`type-list-${track.id}`}
                  placeholder="Type"
                  style={{ marginBottom: 4 }}
                />
                <datalist id={`type-list-${track.id}`}>
                  {SOUND_TYPES.map(type => <option key={type} value={type} />)}
                </datalist>
              </div>
              <div style={{ flex: 2, minWidth: 180 }}>
                <Label>Volume</Label>
                <Slider
                  value={[track.volume]}
                  onValueChange={v => handleVolumeChange(track.id, v[0])}
                  min={0}
                  max={1}
                  step={0.01}
                />
              </div>
              <div style={{ flex: 1, minWidth: 80 }}>
                <Label>Repeat</Label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={track.repeat}
                  onChange={e => handleRepeatChange(track.id, Math.max(1, Math.min(10, Number(e.target.value))))}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 120 }}>
                <Button onClick={() => handlePlay(track)} disabled={isPlayingId === track.id}>
                  {isPlayingId === track.id ? 'Playing...' : '▶️ Play'}
                </Button>
                <Button variant="secondary" onClick={() => handleExport(track)}>
                  ⬇️ Export
                </Button>
              </div>
              <Button variant="destructive" onClick={() => handleRemoveTrack(track.id)} style={{ marginLeft: 8 }}>
                ✖
              </Button>
            </div>
          ))}
        </div>
        {tracks.length > 0 && (
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 40 }}>
            <Button size="lg" onClick={handlePlayAll}>▶️ PLAY ALL</Button>
            <Button size="lg" variant="secondary" onClick={handleExportAll}>⬇️ EXPORT ALL</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickUI; 