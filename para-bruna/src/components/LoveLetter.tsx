/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Mail, ArrowDown, Sparkles, Heart, FileText, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function LoveLetter() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [letterContent, setLetterContent] = useState(() => {
    const saved = localStorage.getItem("romantic_love_letter");
    return saved || "Minha linda Bruna,\n\nEscrever para você é como tentar traduzir em palavras o nascer do sol: faltam termos para descrever tamanha beleza, calor e paz.\n\nDesde que você entrou na minha vida, os dias ganharam mais cor, os risos ficaram mais altos e o futuro finalmente passou a ter a cara que eu sempre sonhei. Cada detalhe seu — a sua risada doce, o jeito que seu olhar encontra o meu nos momentos de silêncio e o aconchego do seu abraço — me faz ter a certeza absoluta de que sou a pessoa mais sortuda do universo por poder amar você.\n\nObrigado por ser minha parceira de aventuras, minha melhor amiga e o grande amor da minha vida. Que este seja apenas mais um dentre as centenas de Dias dos Namorados que comemoraremos bem juntinhos.\n\nCom todo o amor que cabe na minha alma,\nSeu Felipe ❤️";
  });

  const handleSaveLetter = () => {
    localStorage.setItem("romantic_love_letter", letterContent);
    setIsEditing(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-10 px-4 flex flex-col items-center" id="love-letter-section">
      
      {/* Visual Seal Card Trigger */}
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="closed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg cursor-pointer"
            onClick={() => setIsOpen(true)}
            id="envelope-closed-trigger"
          >
            {/* ENVELOPE DECORATIVE SHELL */}
            <div className="bg-amber-100 hover:bg-amber-150 rounded-3xl p-8 border-2 border-amber-200/60 shadow-lg flex flex-col items-center text-center relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              
              {/* Envelope diagonal triangles */}
              <div className="absolute top-0 inset-x-0 h-40 bg-linear-to-b from-amber-50 to-amber-100/30 clip-path-polygon" />
              
              <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100/50 flex items-center justify-center text-love-500 mb-6 shadow-sm relative group-hover:scale-105 transition-transform duration-300">
                {/* Sealing wax stamp heart emoji */}
                <span className="text-2xl">💌</span>
                <span className="absolute inset-0 rounded-full border-2 border-love-500 animate-ping opacity-25 group-hover:scale-110" />
              </div>

              <h3 className="font-serif font-black text-xl md:text-2xl text-amber-900 tracking-tight leading-none mb-1">
                Uma Carta para Você, Bruna
              </h3>
              <p className="font-sans text-[11px] md:text-xs text-amber-700/80 font-bold uppercase tracking-wider mb-4">
                Selada com amor • Toque para abrir
              </p>
              
              <p className="font-serif italic text-sm text-amber-800 leading-relaxed max-w-sm mt-3 opacity-90">
                "Não existem palavras suficientes no dicionário que possam expressar o que meu peito transborda por você..."
              </p>

              <div className="mt-6 text-love-500 flex items-center gap-1.5 text-xs font-sans font-bold bg-white/80 px-4 py-2 rounded-full border border-amber-200">
                <Sparkles className="h-3.5 w-3.5 animate-pulse text-amber-500" /> Clicar para Abrir Carta
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="opened"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="w-full max-w-2xl bg-[#fdfaf2] border border-amber-200 rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden"
            id="letter-opened-card"
          >
            {/* Visual fairy lights decor on parchment paper */}
            <div className="absolute top-4 inset-x-4 flex justify-between px-4 pointer-events-none opacity-40">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping inline-block" style={{ animationDelay: `${i * 0.4}s` }} />
              ))}
            </div>

            <div className="flex justify-between items-center border-b border-amber-200/50 pb-4 mb-6">
              <span className="font-sans text-xs font-bold text-amber-700 uppercase tracking-widest flex items-center gap-1.5">
                <FileText className="h-4 w-4" /> Carta Escrita à Mão
              </span>
              
              {/* Operational controls */}
              <div className="flex gap-1.5">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs font-sans font-semibold text-amber-850 hover:text-amber-950 hover:bg-amber-100/55 border border-amber-200 py-1.5 px-3.5 rounded-lg transition"
                >
                  {isEditing ? "Cancelar" : "Editar Carta ✍️"}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-sans font-semibold text-neutral-500 hover:text-neutral-800 py-1.5 px-3 transition"
                >
                  Fechar Carta
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!isEditing ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-serif italic text-[14.5px] md:text-[16px] text-neutral-800 leading-relaxed whitespace-pre-wrap pr-3 max-h-120 overflow-y-auto"
                >
                  {letterContent}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-3"
                >
                  <label className="text-[10px] font-sans font-bold text-amber-800 uppercase tracking-wider block">
                    Escreva o que o seu coração sente por Bruna:
                  </label>
                  <textarea
                    rows={12}
                    value={letterContent}
                    onChange={(e) => setLetterContent(e.target.value)}
                    className="w-full bg-amber-50/20 font-sans text-xs md:text-sm text-neutral-800 border border-amber-300 rounded-2xl p-4 focus:ring-1 focus:ring-amber-500 focus:outline-none focus:bg-white leading-relaxed pr-3 font-medium"
                    id="love-letter-editor-text"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleSaveLetter}
                      className="px-5 py-2.5 bg-amber-805 bg-amber-800 text-white font-sans text-xs font-bold rounded-xl hover:bg-amber-900 transition flex items-center gap-1.5 shadow-xs"
                    >
                      <Check className="h-4 w-4" /> Salvar Mensagem Carta 💌
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-rose-100 rounded-full blur-2xl opacity-40 pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
