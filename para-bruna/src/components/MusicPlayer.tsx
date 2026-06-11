/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Music, Volume2, Sparkles, VolumeX } from "lucide-react";
import { motion } from "motion/react";

interface Song {
  title: string;
  tempo: number;
  notes: number[];
}

const SONGS: Song[] = [
  {
    title: "Melodia para Bruna",
    tempo: 120,
    notes: [60, 64, 67, 72, 69, 72, 67, 64, 57, 60, 64, 69, 65, 69, 64, 60, 55, 59, 62, 67, 64, 67, 62, 59, 53, 57, 60, 65, 64, 60, 59, 55],
  },
  {
    title: "Valsa Romântica",
    tempo: 90,
    notes: [60, 67, 72, 64, 67, 72, 62, 67, 71, 65, 67, 71, 57, 64, 69, 60, 64, 69, 55, 62, 67, 59, 62, 67, 53, 60, 65, 57, 60, 65, 52, 59],
  },
  {
    title: "Coração Pulsante (Lofi)",
    tempo: 140,
    notes: [64, 64, 64, 67, 65, 64, 62, 60, 62, 62, 62, 65, 64, 62, 60, 59, 60, 60, 60, 64, 62, 60, 59, 57, 59, 60, 62, 64, 62, 60, 62, 67],
  }
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [freqs, setFreqs] = useState<number[]>([15, 15, 15, 15, 15, 15, 15, 15, 15, 15]);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const currentNoteIndexRef = useRef(0);

  const activeSong = SONGS[currentSongIndex];

  // Frequency bar simulator for high performance & reliability
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setFreqs(Array.from({ length: 12 }, () => Math.floor(Math.random() * 45) + 5));
      }, 100);
    } else {
      setFreqs(Array.from({ length: 12 }, () => 5));
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Synthesizer scheduler using Web Audio API
  const playNote = (midiNote: number, time: number) => {
    if (!audioCtxRef.current || isMuted) return;

    // Convert MIDI to frequency
    const freq = Math.pow(2, (midiNote - 69) / 12) * 440;

    const osc = audioCtxRef.current.createOscillator();
    const gainNode = audioCtxRef.current.createGain();

    // Soft sine and triangle mix for flute/music box sweet sound
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, time);

    // Warm envelope
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.12, time + 0.05); // attack
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 1.2); // decay/release

    osc.connect(gainNode);
    gainNode.connect(audioCtxRef.current.destination);

    osc.start(time);
    osc.stop(time + 1.3);
  };

  const scheduleNextNote = () => {
    if (!audioCtxRef.current || !isPlaying) return;

    const lookAheadTime = 0.3; // schedule ahead
    const noteDuration = 60 / activeSong.tempo; // time of one note in seconds

    // Schedule current note
    const notes = activeSong.notes;
    const note = notes[currentNoteIndexRef.current];
    const time = audioCtxRef.current.currentTime + 0.05;

    playNote(note, time);

    // Increment
    currentNoteIndexRef.current = (currentNoteIndexRef.current + 1) % notes.length;

    // Schedule next call
    timerRef.current = window.setTimeout(() => {
      scheduleNextNote();
    }, noteDuration * 1000);
  };

  const togglePlay = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }

    if (isPlaying) {
      // Pause
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsPlaying(false);
    } else {
      // Play
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      currentNoteIndexRef.current = 0;
      scheduleNextNote();
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentSongIndex]);

  const handleNextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % SONGS.length);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div id="music-player-container" className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-love-100 glow-love max-w-sm mx-auto shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-love-50 rounded-xl text-love-500">
            <Music className={`h-5 w-5 ${isPlaying ? "animate-spin" : ""}`} style={{ animationDuration: "12s" }} id="player-music-icon" />
          </div>
          <div>
            <h4 className="font-serif font-semibold text-love-900 text-sm md:text-base flex items-center gap-1.5 leading-tight">
              {activeSong.title}
              {isPlaying && <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />}
            </h4>
            <p className="text-[11px] font-sans text-love-500 font-medium tracking-wide uppercase mt-0.5">
              {isPlaying ? "Sintetizando Melodia..." : "Música de Fundo"}
            </p>
          </div>
        </div>

        <button 
          onClick={toggleMute}
          className="text-love-400 hover:text-love-600 p-2 rounded-lg hover:bg-love-50 transition-colors"
          title={isMuted ? "Ativar som" : "Desativar som"}
          id="player-mute-btn"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>

      {/* Visualizer bars */}
      <div className="flex items-end justify-center gap-1 h-12 bg-love-50/50 rounded-xl px-4 py-2 mb-4 border border-love-100/50" id="audio-visualizer">
        {freqs.map((height, i) => (
          <motion.div
            key={i}
            className="w-1.5 bg-gradient-to-t from-love-400 to-love-500 rounded-full"
            animate={{ height: `${height}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          />
        ))}
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          onClick={handleNextSong}
          className="text-xs font-sans text-love-600 hover:text-love-900 font-medium py-2 px-3 hover:bg-love-50 rounded-xl border border-love-100/30 transition duration-300"
          id="player-next-song-btn"
        >
          Próxima Música ↪
        </button>

        <button
          onClick={togglePlay}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-sans text-sm font-semibold shadow-sm transition duration-300 ${
            isPlaying
              ? "bg-love-100 text-love-700 hover:bg-love-200"
              : "bg-love-600 text-white hover:bg-love-700 hover:shadow-md"
          }`}
          id="player-toggle-btn"
        >
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4 fill-current" /> Pausar
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-current" /> Ouvir Música
            </>
          )}
        </button>
      </div>
    </div>
  );
}
