/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { PRESET_FLOWERS } from "../data/romanticData";
import { FlowerType, BouquetItem } from "../types";
import { Gift, Sparkles, Heart, Plus, Minus, Trash2, HeartHandshake, Eye } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import RealFlowerSvg from "./RealFlowerSvg";
import BouquetVisualizer from "./BouquetVisualizer";

export default function BouquetBuilder() {
  const [bouquet, setBouquet] = useState<BouquetItem[]>(() => {
    // Start with a cute preset bouquet: 3 Rosas Vermelhas and 2 Girassóis
    return [
      { flower: PRESET_FLOWERS[0], quantity: 3 },
      { flower: PRESET_FLOWERS[2], quantity: 2 }
    ];
  });

  const [wrapType, setWrapType] = useState<string>("velvet-rose");
  const [ribbonType, setRibbonType] = useState<string>("gold-satin");
  const [cardMessage, setCardMessage] = useState<string>(
    "Para a pessoa mais especial da minha vida. Bruna, que este buquê digital represente um pedacinho de todo o carinho, admiração e amor profundo que sinto por você todos os dias. Você é o meu maior presente."
  );
  const [isPresented, setIsPresented] = useState(false);

  const WRAPPING_OPTS = [
    { id: "velvet-rose", label: "Veludo Rosa", bg: "bg-rose-100 border-rose-300", styling: "#fda4af" },
    { id: "kraft", label: "Papel Kraft Clássico", bg: "bg-amber-100 border-amber-300", styling: "#f59e0b" },
    { id: "minimalist-glass", label: "Vaso de Vidro Moderno", bg: "bg-sky-50 border-sky-200", styling: "#7dd3fc" },
    { id: "lace", label: "Renda de Seda Branca", bg: "bg-neutral-50 border-neutral-200", styling: "#e5e5e5" }
  ];

  const RIBBON_OPTS = [
    { id: "gold-satin", label: "Cetim Dourado ✨", color: "#f59e0b" },
    { id: "red-silk", label: "Seda Vermelha ❤️", color: "#dc2626" },
    { id: "pink-organza", label: "Organza Rosa 🌸", color: "#f472b6" },
    { id: "none", label: "Rústico (Sem Fita) 🌿", color: "transparent" }
  ];

  const addFlower = (flower: FlowerType) => {
    setBouquet((prev) => {
      const existing = prev.find((item) => item.flower.id === flower.id);
      if (existing) {
        return prev.map((item) =>
          item.flower.id === flower.id
            ? { ...item, quantity: Math.min(20, item.quantity + 1) }
            : item
        );
      }
      return [...prev, { flower, quantity: 1 }];
    });
  };

  const removeFlower = (flowerId: string) => {
    setBouquet((prev) => {
      const existing = prev.find((item) => item.flower.id === flowerId);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.flower.id === flowerId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter((item) => item.flower.id !== flowerId);
    });
  };

  const deleteFromBouquet = (flowerId: string) => {
    setBouquet((prev) => prev.filter((item) => item.flower.id !== flowerId));
  };

  const clearBouquet = () => {
    setBouquet([]);
  };

  const totalFlowerCount = bouquet.reduce((sum, item) => sum + item.quantity, 0);

  // Compile full emotional translation list for Bruna
  const compiledMeanings = bouquet.filter(item => item.quantity > 0).map(item => {
    return {
      name: item.flower.name,
      quantity: item.quantity,
      meaning: item.flower.meaning,
      color: item.flower.color
    };
  });

  return (
    <div id="bouquet-builder-root" className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* LEFT: FLORIST STUDIO (Controls & Bouquet Compilation) */}
      <div className="lg:col-span-7 flex flex-col gap-6" id="florist-studio-controls">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-love-100 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <Gift className="h-5.5 w-5.5 text-love-600" />
            <h3 className="font-serif font-bold text-xl text-love-900">Estúdio de Flores do Felipe</h3>
          </div>
          <p className="text-xs font-sans text-love-600 font-medium md:text-sm">
            Clique nas flores abaixo para adicioná-las ao buquê da Bruna. Cada flor carrega um sentimento e significado especial.
          </p>

          {/* FLOWER PICKER GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 mt-5" id="florist-picker-grid">
            {PRESET_FLOWERS.map((flower) => (
              <button
                key={flower.id}
                onClick={() => addFlower(flower)}
                className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-love-50/50 hover:bg-love-50 border border-love-100/30 hover:border-love-200 transition-all duration-300 relative overflow-hidden"
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110"
                >
                  <RealFlowerSvg id={flower.id} className="w-14 h-14 filter drop-shadow-md" />
                </div>
                <span className="text-xs font-sans font-bold text-love-900">{flower.name}</span>
                <span className="text-[9.5px] text-love-500 font-serif italic mt-0.5 leading-tight text-center px-1">
                  {flower.scientificName}
                </span>

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-love-600 text-white rounded-full p-0.5 shadow-sm">
                  <Plus className="h-3.5 w-3.5" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* CUSTOMIZATION BUNDLES */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-love-100 shadow-sm flex flex-col gap-5">
          <h4 className="font-serif font-bold text-base text-love-900 border-b border-love-100/40 pb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            Embalagem & Detalhes Românticos
          </h4>

          {/* Wrap type */}
          <div>
            <label className="text-xs font-sans font-bold text-love-800 uppercase tracking-wider block mb-2.5">
              Material de Embrulho
            </label>
            <div className="grid grid-cols-2 gap-2" id="wrap-options-grid">
              {WRAPPING_OPTS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setWrapType(opt.id)}
                  className={`px-3.5 py-2.5 rounded-xl border font-sans text-xs font-semibold text-center transition duration-300 ${
                    wrapType === opt.id
                      ? "bg-love-600 text-white border-love-600 shadow-sm"
                      : "bg-love-50/20 text-love-900 border-love-100 hover:bg-love-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ribbon type */}
          <div>
            <label className="text-xs font-sans font-bold text-love-800 uppercase tracking-wider block mb-2.5">
              Laço de Fita
            </label>
            <div className="grid grid-cols-2 gap-2" id="ribbon-options-grid">
              {RIBBON_OPTS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setRibbonType(opt.id)}
                  className={`px-3.5 py-2.5 rounded-xl border font-sans text-xs font-semibold text-center transition duration-300 ${
                    ribbonType === opt.id
                      ? "bg-love-600 text-white border-love-600 shadow-sm"
                      : "bg-love-50/20 text-love-900 border-love-100 hover:bg-love-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Postal Card message */}
          <div>
            <label className="text-xs font-sans font-bold text-love-800 uppercase tracking-wider block mb-2">
              Mensagem do Cartão de Bruna
            </label>
            <textarea
              value={cardMessage}
              onChange={(e) => setCardMessage(e.target.value)}
              rows={4}
              maxLength={400}
              placeholder="Escreva uma bela dedicatória para Bruna..."
              className="w-full bg-love-50/30 font-sans text-xs md:text-sm text-love-900 border border-love-100/65 rounded-2xl p-4 focus:ring-2 focus:ring-love-400 focus:outline-none focus:bg-white transition-all leading-relaxed"
              id="card-message-input"
            />
            <div className="flex justify-between items-center mt-1.5 px-1">
              <span className="text-[10px] text-love-500 font-sans">Todos os textos podem ser editados</span>
              <span className="text-[10.5px] text-love-500 font-mono tracking-wide">{cardMessage.length}/400 caract.</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: INTERACTIVE BOUQUET VIEWER & DYNAMIC SUMMARY */}
      <div className="lg:col-span-5 flex flex-col gap-6" id="bouquet-preview-panel">
        
        {/* PHYSICAL BOUQUET DEPICTION CANVAS */}
        <div className="bg-gradient-to-b from-love-50/30 to-love-100/30 backdrop-blur-md rounded-3xl p-6 border border-love-100/80 shadow-sm overflow-hidden flex flex-col items-center justify-between min-h-[500px] relative">
          
          <div className="absolute top-4 left-4 z-10 bg-white/95 border border-love-100/50 py-1.5 px-3 rounded-full text-[11px] font-sans font-bold text-love-700 flex items-center gap-1.5 shadow-xs">
            <Eye className="h-3 w-3" /> Bouquet Live Preview
          </div>

          {/* CANVAS FLOWER MATRIX */}
          <div className="w-full flex-1 flex flex-col items-center justify-center relative min-h-[380px] mt-2">
            <AnimatePresence mode="wait">
              {totalFlowerCount === 0 ? (
                <motion.div 
                  key="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-love-400 py-10"
                >
                  <Heart className="h-8 w-8 mx-auto mb-2.5 animate-pulse text-love-200" />
                  <p className="font-serif font-bold text-sm text-love-900">Seu vaso está vazio</p>
                  <p className="font-sans text-[11px] text-love-500 max-w-xs px-4 mt-1 leading-normal">
                    Selecione flores acima para preencher o buquê mais bonito para ela.
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  key="bouquet-ready"
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.85, opacity: 0 }}
                  className="relative w-80 h-[380px] flex items-center justify-center"
                >
                  <BouquetVisualizer
                    bouquet={bouquet}
                    wrapType={wrapType}
                    ribbonType={ribbonType}
                    className="w-80 h-[380px]"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ACTIVE FLOWER MANAGEMENT BOARD */}
          {bouquet.length > 0 && (
            <div className="w-full bg-white/95 rounded-2xl p-4 border border-love-100/50 mt-4 z-10">
              <div className="flex justify-between items-center text-xs font-sans font-bold text-love-900 border-b border-love-50 pb-2 mb-2">
                <span>Flores no Buquê ({totalFlowerCount})</span>
                <button
                  onClick={clearBouquet}
                  className="text-love-400 hover:text-love-600 transition flex items-center gap-1 text-[11px]"
                >
                  <Trash2 className="h-3 w-3" /> Limpar tudo
                </button>
              </div>

              <div className="max-h-36 overflow-y-auto flex flex-col gap-1.5 pr-1" id="bouquet-added-flowers-list">
                {bouquet.map((item) => (
                  <div
                    key={item.flower.id}
                    className="flex justify-between items-center p-1.5 rounded-xl bg-love-50/20 hover:bg-love-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 flex items-center justify-center">
                        <RealFlowerSvg id={item.flower.id} className="w-7 h-7" />
                      </div>
                      <span className="text-[11.5px] font-sans font-bold text-love-900">{item.flower.name}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => removeFlower(item.flower.id)}
                        className="bg-love-100 hover:bg-love-200 text-love-700 p-1 rounded-lg transition"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="font-mono text-xs font-bold text-love-900 tracking-tight w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addFlower(item.flower)}
                        className="bg-love-100 hover:bg-love-200 text-love-700 p-1 rounded-lg transition"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => deleteFromBouquet(item.flower.id)}
                        className="text-neutral-400 hover:text-rose-600 p-1 transition ml-1"
                        title="Remover"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DELIVER LAUNCH BUTTON */}
          <button
            onClick={() => setIsPresented(true)}
            disabled={totalFlowerCount === 0}
            className={`w-full py-3.5 rounded-2xl font-serif font-bold text-sm transition-all duration-300 mt-4 flex items-center justify-center gap-2 shadow-sm ${
              totalFlowerCount === 0
                ? "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200"
                : "bg-love-600 text-white hover:bg-love-700 hover:shadow-md cursor-pointer hover:-translate-y-0.5"
            }`}
            id="deliver-bouquet-btn"
          >
            <HeartHandshake className="h-4.5 w-4.5" /> Entregar este Buquê para Bruna
          </button>
        </div>
      </div>

      {/* DETAILED LINGUAGEM DAS FLORES (MEANINGS BENTO CRUMB) */}
      <div className="lg:col-span-12" id="bouquet-symbolism-bento">
        {bouquet.length > 0 && (
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-love-100/40 shadow-sm">
            <h4 className="font-serif font-bold text-base text-love-950 flex items-center gap-2 mb-4">
              <Heart className="h-4 w-4 text-love-500 fill-current" />
              O Significado do seu Buquê (A Linguagem Secreta das Flores)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {compiledMeanings.map((m, i) => (
                <div key={i} className="bg-white border border-love-100/30 rounded-2xl p-4 flex gap-3 shadow-xs">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5" 
                    style={{ backgroundColor: m.color === '#f1f5f9' ? '#cbd5e1' : m.color }}
                  >
                    <span className="font-serif text-[11px] font-bold">{m.quantity}x</span>
                  </div>
                  <div>
                    <h5 className="font-sans font-bold text-xs text-love-900 flex items-center gap-1.5">
                      {m.name} <span className="font-normal text-[10px] text-love-500">(Significado)</span>
                    </h5>
                    <p className="text-[11.5px] font-sans text-love-650 mt-1 leading-relaxed">
                      "{m.meaning}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* THE ROMANTIC EXPERIENTIAL OVERLAY: BOUQUET DELIVERY PRESENTATION */}
      <AnimatePresence>
        {isPresented && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-900/98 backdrop-blur-lg z-50 flex flex-col items-center justify-center p-4 md:p-6"
            id="experiential-delivery-overlay"
          >
            {/* Heart particles cluster */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden origin-center text-love-500/10">
              {Array.from({ length: 18 }).map((_, i) => (
                <div 
                  key={i} 
                  className="floating-heart"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 10}s`,
                    animationDuration: `${Math.random() * 8 + 10}s`,
                    fontSize: `${Math.random() * 20 + 20}px`
                  }}
                >
                  ❤️
                </div>
              ))}
            </div>

            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white w-full max-w-xl rounded-3xl p-6 md:p-8 border border-love-200 shadow-2xl relative z-10 overflow-hidden flex flex-col items-center text-center my-auto"
            >
              <div 
                className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-rose-500 via-pink-400 to-amber-400" 
              />

              <div className="w-16 h-16 rounded-full bg-love-50 flex items-center justify-center text-love-600 mb-4 shadow-sm animate-bounce">
                <Heart className="h-8 w-8 fill-current" />
              </div>

              <h3 className="font-serif font-extrabold text-2xl md:text-3xl text-love-950 leading-tight">
                Flores para Você, Bruna!
              </h3>
              <p className="text-xs font-sans text-love-500 font-semibold uppercase tracking-widest mt-1">
                Enviado com Carinho do Seu Felipe
              </p>

              {/* RENDER DYNAMIC COMPACT BOUQUET */}
              <div className="h-56 w-56 flex items-center justify-center relative mt-4 mb-4 border border-love-100/60 bg-love-50/20 rounded-full shadow-inner overflow-hidden">
                <BouquetVisualizer
                  bouquet={bouquet}
                  wrapType={wrapType}
                  ribbonType={ribbonType}
                  className="w-56 h-[270px] absolute -bottom-6"
                  isMini={true}
                />
              </div>

              {/* COMPILING STATISTICS */}
              <p className="text-xs font-sans text-love-600 leading-tight mb-4 tracking-wide font-medium bg-love-50/50 py-1.5 px-3 rounded-full border border-love-100/30">
                Uma linda seleção de <span className="font-bold text-love-900">{totalFlowerCount} flores</span> especiais.
              </p>

              {/* HANDWRITTEN POSTCARD PORTFOLIO */}
              <div className="w-full bg-amber-50/40 border border-amber-200 rounded-2xl p-5 relative shadow-xs text-left mb-6 font-serif italic text-sm text-amber-950 leading-relaxed max-h-48 overflow-y-auto">
                <div className="absolute top-2.5 right-3 w-7 h-9 border border-amber-200 rounded p-0.5 bg-white text-center text-[8px] font-sans text-love-500 uppercase flex items-center justify-center leading-none">
                  Love<br/>Mail
                </div>
                <p className="whitespace-pre-wrap font-sans text-xs md:text-[13px] leading-relaxed pr-6 text-neutral-800">
                  "{cardMessage}"
                </p>
                <div className="mt-4 text-right pr-6 font-serif italic text-love-800 font-bold text-xs">
                  com todo o meu amor, Felipe.
                </div>
              </div>

              {/* CLOSE BUTTON */}
              <button
                onClick={() => setIsPresented(false)}
                className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl font-sans text-xs font-bold transition-all"
                id="close-presentation-btn"
              >
                Voltar ao Estúdio
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
