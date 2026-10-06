import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  VideoOff,
  Sliders,
  Check
} from 'lucide-react';

interface OreaVideoPlayerProps {
  videoUrl?: string;
  exerciseName: string;
  className?: string;
}

export const OreaVideoPlayer: React.FC<OreaVideoPlayerProps> = ({
  videoUrl,
  exerciseName,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);

  // If no video URL provided, explicitly display the unavailable status per Rule #23
  if (!videoUrl) {
    return (
      <div className={`w-full min-h-[260px] rounded-3xl bg-slate-900 border border-slate-800 p-6 flex flex-col items-center justify-center text-center text-slate-400 space-y-3 ${className}`}>
        <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500">
          <VideoOff className="w-6 h-6" />
        </div>
        <div className="space-y-1 max-w-sm">
          <p className="text-sm font-bold text-slate-300">
            Démonstration vidéo indisponible pour le moment.
          </p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Consultez le modèle 3D interactif ou les instructions pas-à-pas détaillées ci-dessous.
          </p>
        </div>
      </div>
    );
  }

  // Check if YouTube embed URL
  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');

  if (isYouTube) {
    return (
      <div className={`w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl ${className}`}>
        <div className="relative aspect-video w-full">
          <iframe
            src={videoUrl}
            title={`Démonstration vidéo : ${exerciseName}`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Démonstration vidéo : {exerciseName}</span>
          <span className="text-[11px] text-orange-400 font-bold">Lecteur vidéo officiel</span>
        </div>
      </div>
    );
  }

  // HTML5 native video player with complete real controls
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const changeSpeed = (rate: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col group ${className}`}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onError={() => setHasError(true)}
        className="w-full aspect-video object-cover cursor-pointer"
        onClick={togglePlay}
        playsInline
      />

      {hasError ? (
        <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
          <p className="text-sm font-bold text-red-400">Impossible de lire la vidéo.</p>
          <p className="text-xs text-slate-500 mt-1">Consultez la démonstration 3D ou les instructions.</p>
        </div>
      ) : (
        <div className="px-4 py-3 bg-slate-900/95 border-t border-slate-800 space-y-2">
          {/* Progress Seek Bar */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-mono w-8 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1.5 bg-slate-800 accent-orange-500 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 font-mono w-8">
              {formatTime(duration)}
            </span>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                className="p-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              </button>

              <button
                type="button"
                onClick={toggleMute}
                className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={isMuted ? 'Activer le son' : 'Couper le son'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Speed & Fullscreen */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                {[0.75, 1, 1.25, 1.5].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => changeSpeed(rate)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      playbackRate === rate ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={toggleFullscreen}
                className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Plein écran"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
