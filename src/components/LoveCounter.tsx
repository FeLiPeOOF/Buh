/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Heart, Calendar, Clock, Edit2, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TimeDifference {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
}

export default function LoveCounter() {
  const [startDateStr, setStartDateStr] = useState(() => {
    const saved = localStorage.getItem("anniversary_date");
    return saved || "2026-04-17T00:00:00";
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempDate, setTempDate] = useState(startDateStr.split("T")[0]);
  const [timeDiff, setTimeDiff] = useState<TimeDifference | null>(null);

  // Calculate live time difference
  useEffect(() => {
    const calculateTime = () => {
      const anniversary = new Date(startDateStr);
      const now = new Date();
      
      const diffMs = now.getTime() - anniversary.getTime();
      
      if (isNaN(diffMs) || diffMs < 0) {
        setTimeDiff({
          years: 0,
          months: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalDays: 0
        });
        return;
      }

      const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      // Detailed structure calculation
      let years = now.getFullYear() - anniversary.getFullYear();
      let months = now.getMonth() - anniversary.getMonth();
      let days = now.getDate() - anniversary.getDate();
      
      if (days < 0) {
        months -= 1;
        // get days in previous month
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
      }
      
      if (months < 0) {
        years -= 1;
        months += 12;
      }

      const hours = now.getHours() - anniversary.getHours();
      const minutes = now.getMinutes() - anniversary.getMinutes();
      const seconds = now.getSeconds() - anniversary.getSeconds();
      
      // Normalize negative details
      let normHours = hours;
      let normMinutes = minutes;
      let normSeconds = seconds;
      
      if (normSeconds < 0) {
        normSeconds += 60;
        normMinutes -= 1;
      }
      if (normMinutes < 0) {
        normMinutes += 60;
        normHours -= 1;
      }
      if (normHours < 0) {
        normHours += 24;
        // Days already adjusted at higher levels but for a simplified, extremely smooth real-time ticking:
      }

      // Safe ticking values
      const currentAnnivInThisYear = new Date(now.getFullYear(), anniversary.getMonth(), anniversary.getDate(), anniversary.getHours(), anniversary.getMinutes(), anniversary.getSeconds());
      let daysDiff = Math.floor((now.getTime() - currentAnnivInThisYear.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff < 0) {
        const lastAnniv = new Date(now.getFullYear() - 1, anniversary.getMonth(), anniversary.getDate(), anniversary.getHours(), anniversary.getMinutes(), anniversary.getSeconds());
        daysDiff = Math.floor((now.getTime() - lastAnniv.getTime()) / (1000 * 60 * 60 * 24));
      }

      // Re-normalize to exact values for a gorgeously ticking ticker
      const secondsPassed = Math.floor((diffMs / 1000) % 60);
      const minutesPassed = Math.floor((diffMs / (1000 * 60)) % 60);
      const hoursPassed = Math.floor((diffMs / (1000 * 60 * 60)) % 24);

      setTimeDiff({
        years: Math.max(0, years),
        months: Math.max(0, months),
        days: Math.max(0, days),
        hours: Math.max(0, hoursPassed),
        minutes: Math.max(0, minutesPassed),
        seconds: Math.max(0, secondsPassed),
        totalDays: Math.max(0, totalDays)
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [startDateStr]);

  const saveDate = () => {
    if (!tempDate) return;
    const cleanDate = `${tempDate}T00:00:00`;
    setStartDateStr(cleanDate);
    localStorage.setItem("anniversary_date", cleanDate);
    setIsEditing(false);
  };

  // Safe formatting helpers for pluralization in Portuguese
  const formatUnit = (val: number, singular: string, plural: string) => {
    return `${val} ${val === 1 ? singular : plural}`;
  };

  return (
    <div id="love-counter-box" className="w-full max-w-4xl mx-auto bg-white/40 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-love-100/60 shadow-sm relative overflow-hidden">
      {/* Visual glowing elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-love-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-rose-100 rounded-full blur-3xl opacity-50" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="text-love-500 bg-love-50 p-4 rounded-full relative"
          id="counter-heart-wrapper"
        >
          <Heart className="h-8 w-8 fill-current" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-love-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-love-500"></span>
          </span>
        </motion.div>

        <h2 className="font-serif font-bold text-3xl md:text-4xl text-love-900 mt-4 tracking-tight leading-tight">
          Nosso Tempo de Amor
        </h2>
        <p className="font-sans text-sm text-love-600 font-medium max-w-md mt-2 leading-relaxed">
          Bruna & Felipe, contando cada batida de coração, cada risada e cada segundo de cumplicidade.
        </p>

        {timeDiff ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 w-full mt-8 max-w-3xl" id="counter-grid">
            {[
              { label: "Anos", val: timeDiff.years, desc: "anos de cumplicidade" },
              { label: "Meses", val: timeDiff.months, desc: "meses perfeitos" },
              { label: "Dias", val: timeDiff.days, desc: "dias incríveis" },
              { label: "Horas", val: timeDiff.hours, desc: "horas de carinho" },
              { label: "Minutos", val: timeDiff.minutes, desc: "minutos juntinhos" },
              { label: "Segundos", val: timeDiff.seconds, desc: "segundos de paixão" }
            ].map((unit, index) => (
              <motion.div
                key={unit.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="bg-white rounded-2xl p-4 border border-love-100/40 shadow-sm flex flex-col items-center justify-center min-h-[110px]"
              >
                <span className="font-serif text-3xl md:text-4xl font-extrabold text-love-600 tabular-nums">
                  {unit.val}
                </span>
                <span className="font-sans text-xs font-semibold text-love-900 tracking-wider uppercase mt-1">
                  {unit.label}
                </span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-love-600" />
          </div>
        )}

        {timeDiff && (
          <p className="text-sm font-sans font-semibold text-love-700 bg-love-50 px-5 py-2.5 rounded-full border border-love-100 mt-6 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            Já se passaram <span className="font-bold underline text-love-900">{timeDiff.totalDays.toLocaleString()} dias</span> que conheci a minha outra metade!
          </p>
        )}

        {/* Anniversary edit panel */}
        <div className="mt-8 pt-6 border-t border-love-100/30 w-full max-w-sm">
          <AnimatePresence mode="wait">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 text-xs font-sans font-bold text-love-500 hover:text-love-800 hover:bg-love-50 px-4 py-2 rounded-xl border border-love-100/40 transition duration-300"
                id="edit-anniversary-btn"
              >
                <Calendar className="h-3.5 w-3.5" />
                Alterar Data de Início ({new Date(startDateStr).toLocaleDateString("pt-BR")})
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/80 p-4 rounded-2xl border border-love-200 shadow-sm flex flex-col gap-3"
              >
                <label className="text-xs font-sans font-bold text-love-700 text-left">
                  Escolha o dia em que o amor começou:
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={tempDate}
                    onChange={(e) => setTempDate(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm bg-love-50 border border-love-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-love-400 text-love-900"
                    id="anniversary-input"
                  />
                  <button
                    onClick={saveDate}
                    className="p-2 bg-love-600 text-white rounded-xl hover:bg-love-700 transition"
                    title="Confirmar"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
