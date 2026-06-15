/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ChangeEvent } from "react";
import { INITIAL_MEMORIES } from "../data/romanticData";
import { MemoryItem } from "../types";
import { Calendar, Heart, MapPin, Edit3, Trash2, PlusCircle, Check, Image, Video, Sparkles, Upload, Maximize2, X, Download } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const PRESET_GRADIENTS: Record<string, string> = {
  "rose-love": "from-rose-400 via-pink-400 to-rose-500",
  "pink-sunset": "from-orange-300 via-rose-300 to-indigo-400",
  "gold-glow": "from-amber-200 via-orange-300 to-yellow-400",
  "violet-ambient": "from-purple-400 via-fuchsia-350 to-indigo-500"
};

export default function Timeline() {
  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    try {
      const saved = sessionStorage.getItem("love_timeline_memories_v2");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Restore initial mediaUrl if it was omitted to save sessionStorage space
          return parsed.map((mem) => {
            const initial = INITIAL_MEMORIES.find((i) => i.id === mem.id);
            if (initial && mem.mediaUrl === undefined) {
              return { ...mem, mediaUrl: initial.mediaUrl };
            }
            return mem;
          });
        }
      }
    } catch (e) {
      console.error("Failed to load memories from sessionStorage:", e);
    }
    return INITIAL_MEMORIES;
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields for currently edited memory
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editRomText, setEditRomText] = useState("");
  const [editLoc, setEditLoc] = useState("");
  const [editMediaType, setEditMediaType] = useState<"image" | "video" | "placeholder">("placeholder");
  const [editMediaUrl, setEditMediaUrl] = useState("");
  const [editPreset, setEditPreset] = useState("rose-love");
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);

  // Save memories to sessionStorage
  useEffect(() => {
    try {
      const sanitizedMemories = memories.map((mem) => {
        const initial = INITIAL_MEMORIES.find((i) => i.id === mem.id);
        if (initial && initial.mediaUrl === mem.mediaUrl) {
          // Omit the mediaUrl if it matches the initial default memory's image to save space
          const { mediaUrl, ...rest } = mem;
          return rest;
        }
        return mem;
      });
      sessionStorage.setItem("love_timeline_memories_v2", JSON.stringify(sanitizedMemories));
    } catch (e) {
      console.error("Failed to save memories to sessionStorage:", e);
    }
  }, [memories]);

  // Escape key to close lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedMemory(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const startEditing = (mem: MemoryItem) => {
    setEditingId(mem.id);
    setEditTitle(mem.title);
    setEditDate(mem.date);
    setEditDesc(mem.description);
    setEditRomText(mem.romanticText);
    setEditLoc(mem.location || "");
    setEditMediaType(mem.mediaType);
    setEditMediaUrl(mem.mediaUrl || "");
    setEditPreset(mem.placeholderPreset || "rose-love");
  };

  const handleSaveEdit = () => {
    if (!editTitle || !editDate) return;
    setMemories((prev) =>
      prev.map((item) =>
        item.id === editingId
          ? {
            ...item,
            title: editTitle,
            date: editDate,
            description: editDesc,
            romanticText: editRomText,
            location: editLoc,
            mediaType: editMediaType,
            mediaUrl: editMediaUrl,
            placeholderPreset: editPreset
          }
          : item
      )
    );
    setEditingId(null);
  };

  const handleDeleteMemory = (id: string) => {
    if (confirm("Quer mesmo apagar este momento da linha do tempo?")) {
      setMemories((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleAddNewMemory = () => {
    const newId = String(Date.now());
    const newMemory: MemoryItem = {
      id: newId,
      title: "Nosso Novo Momento",
      date: "Hoje ✨",
      description: "Escreva uma breve frase sobre este dia.",
      romanticText: "Bruna, este espaço é todo nosso. Clique em 'Editar' para adicionar nossos textos reais, fotos, vídeos, localizações e preencher o álbum da nossa história com lembranças inesquecíveis.",
      mediaType: "placeholder",
      placeholderPreset: "gold-glow",
      location: "Local Especial"
    };
    setMemories((prev) => [...prev, newMemory]);
    startEditing(newMemory);
  };

  // Base64 file uploader logic for local photos
  const handleLocalImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("A imagem selecionada é muito grande! Pense em carregar fotos com menos de 2MB para garantir a performance e compatibilidade de armazenamento.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setEditMediaType("image");
        setEditMediaUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleExportMemories = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(memories, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "memorias-buh.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportMemories = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result as string);
        if (Array.isArray(imported)) {
          setMemories(imported);
          alert("Memórias importadas com sucesso! Não se esqueça de salvar/atualizar.");
        } else {
          alert("Erro: O arquivo selecionado não contém um formato de memórias válido.");
        }
      } catch (err) {
        alert("Erro ao ler o arquivo JSON.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4" id="romantic-timeline-container">

      {/* HEADER CRUMB */}
      <div className="text-center mb-12">
        <span className="font-sans text-xs bg-love-50 text-love-700 px-3.5 py-1.5 rounded-full border border-love-100/50 font-bold uppercase tracking-wider">
          A Nossa Álbum de Retratos
        </span>
        <h2 className="font-serif font-black text-3xl md:text-5xl text-love-950 mt-3 tracking-tight">
          Nossa Linha do Tempo
        </h2>
        <p className="font-sans text-[13px] md:text-sm text-love-600 max-w-lg mx-auto mt-2 leading-relaxed">
          Navegue pelas datas mais marcantes da nossa história. Você pode trocar os textos, fazer upload das suas fotos e adicionar novos episódios.
        </p>
      </div>

      {/* CORE TIMELINE VERTICAL PATH */}
      <div className="relative border-l-2 border-love-200/50 ml-4 md:ml-32 pl-6 md:pl-10 pb-8 flex flex-col gap-12" id="timeline-list">

        <AnimatePresence initial={false}>
          {memories.map((mem, index) => {
            const isLeft = index % 2 === 0;
            return (
              <motion.div
                key={mem.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="relative flex flex-col gap-1.5"
                id={`timeline-item-${mem.id}`}
              >
                {/* Visual marker heart shape directly in the line */}
                <span className="absolute -left-[35px] md:-left-[51px] top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white border-2 border-love-350 shadow-sm text-love-500 z-10 hover:scale-110 transition-transform">
                  <Heart className="h-3 w-3 fill-current" />
                </span>

                {/* Left floating exact Date label layout (Desktop only) */}
                <div className="hidden md:block absolute -left-[185px] w-36 text-right top-1 text-love-800">
                  <span className="text-xs font-sans font-bold uppercase tracking-wider">{mem.date}</span>
                  {mem.location && (
                    <span className="flex items-center justify-end gap-1 text-[10.5px] text-love-400 mt-0.5">
                      <MapPin className="h-3 w-3" /> {mem.location}
                    </span>
                  )}
                </div>

                {/* CONTENT MEMORY BLOCK */}
                <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 md:p-6 border border-love-105/30 glow-love hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">

                  {/* Title & mobile specifics */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-love-50 pb-3 mb-4 gap-2">
                    <div>
                      <span className="md:hidden text-xs font-sans font-bold text-love-600 block mb-0.5">
                        {mem.date} {mem.location && `• ${mem.location}`}
                      </span>
                      <h3 className="font-serif font-bold text-xl text-love-950">{mem.title}</h3>
                      <p className="font-sans text-xs text-love-500 font-medium italic mt-0.5">{mem.description}</p>
                    </div>

                    {/* Operational controls */}
                    <div className="flex gap-1.5 self-start md:self-center" id={`controls-${mem.id}`}>
                      <button
                        onClick={() => startEditing(mem)}
                        className="inline-flex items-center gap-1.5 text-[10.5px] bg-love-50 hover:bg-love-100 text-love-700 py-1.5 px-3 rounded-lg border border-love-100/30 font-bold transition"
                      >
                        <Edit3 className="h-3 w-3" /> Configurar / Editar
                      </button>
                      <button
                        onClick={() => handleDeleteMemory(mem.id)}
                        className="text-neutral-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition"
                        title="Apagar Memória"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* MEDIA DISPLAY PORTAL */}
                  <div className="w-full h-56 md:h-72 rounded-2xl overflow-hidden mb-4 bg-love-50 flex items-center justify-center relative border border-love-100/10 shadow-xs" id={`media-view-${mem.id}`}>
                    {mem.mediaType === "placeholder" ? (
                      <div className={`w-full h-full bg-gradient-to-tr ${PRESET_GRADIENTS[mem.placeholderPreset || "rose-love"]} flex flex-col items-center justify-center p-6 text-white text-center rounded-2xl`}>
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 4 }}
                        >
                          <Sparkles className="h-10 w-10 opacity-75 mb-3" />
                        </motion.div>
                        <span className="font-serif italic font-semibold text-lg max-w-sm px-4">
                          "O amor encontra caminhos de luz nos lugares mais doces."
                        </span>
                        <span className="text-[10px] uppercase font-sans tracking-widest font-bold opacity-60 mt-3 flex items-center gap-1">
                          <Image className="h-3 w-3" /> Carregue sua foto real clicando em editar
                        </span>
                      </div>
                    ) : mem.mediaType === "image" ? (
                      <div
                        className="w-full h-full relative group cursor-zoom-in overflow-hidden rounded-2xl"
                        onClick={() => setSelectedMemory(mem)}
                      >
                        <img
                          src={mem.mediaUrl}
                          alt={mem.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            // Handle error with a nice default illustration
                            (e.target as any).src = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1000";
                          }}
                        />
                        {/* Hover Zoom Overlay */}
                        <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="bg-white/95 text-neutral-800 text-[11px] font-sans font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                            <Maximize2 className="h-3 w-3 text-love-600" />
                            Ver foto inteira
                          </span>
                        </div>
                      </div>
                    ) : (
                      <video
                        src={mem.mediaUrl}
                        controls
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    )}
                  </div>

                  {/* DEEP ROMANTIC DEDICATION WRITING */}
                  <div className="bg-love-50/20 border-l-3 border-love-400 p-4 rounded-r-2xl font-sans text-xs md:text-[13px] leading-relaxed text-love-900 font-medium">
                    <p className="whitespace-pre-line">
                      {mem.romanticText}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* RECTANGLE BLOCK TO ADD A MEMORY CAROUSEL CHIP */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
          <button
            onClick={handleAddNewMemory}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-love-600 to-rose-500 hover:from-love-700 hover:to-rose-600 text-white font-serif font-bold text-sm shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            id="add-memory-milestone-btn"
          >
            <PlusCircle className="h-4.5 w-4.5" /> Adicionar Nova Memória ou Foto Juntos 💖
          </button>
          <button
            onClick={() => {
              if (confirm("Deseja restaurar a linha do tempo para a versão padrão do código? Isso apagará qualquer alteração não salva no código do projeto.")) {
                try {
                  sessionStorage.removeItem("love_timeline_memories_v2");
                } catch (e) {
                  console.error("Failed to remove memories from sessionStorage:", e);
                }
                setMemories(INITIAL_MEMORIES);
              }
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-serif font-semibold text-xs transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            id="reset-memory-milestone-btn"
          >
            <Trash2 className="h-4 w-4" /> Restaurar Versão Padrão 🔄
          </button>
        </div>

        {/* EXPORT / IMPORT BACKUP ACTIONS */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-3">
          <button
            onClick={handleExportMemories}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-600 font-sans text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="Baixar backup das memórias para enviar ou salvar"
          >
            <Download className="h-3.5 w-3.5" /> Exportar Memórias (Backup)
          </button>

          <label
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-600 font-sans text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="Carregar arquivo de memórias exportado por outro aparelho"
          >
            <Upload className="h-3.5 w-3.5" /> Importar Memórias (Arquivo)
            <input
              type="file"
              accept=".json"
              onChange={handleImportMemories}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* EDIT MODAL DRAWER OVERLAY */}
      <AnimatePresence>
        {editingId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
            id="memory-edit-backdrop"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white w-full max-w-lg rounded-3xl p-6 border border-love-100 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <h3 className="font-serif font-black text-xl text-love-950 mb-3 flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-amber-500" /> Customizar Momento
              </h3>
              <p className="text-xs font-sans text-love-500 mb-5 leading-normal">
                Altere os textos ou carregue uma foto do seu computador. Todas as alterações serão sincronizadas localmente.
              </p>

              <div className="flex flex-col gap-4">
                {/* Title and Date row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-sans font-bold text-neutral-500 uppercase tracking-wide block mb-1">Título</label>
                    <input
                      type="text"
                      className="w-full px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-love-400"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-sans font-bold text-neutral-500 uppercase tracking-wide block mb-1">Data</label>
                    <input
                      type="text"
                      placeholder="Ex: 12 de Out 2024"
                      className="w-full px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-love-400"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* Subtitle description and location row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-sans font-bold text-neutral-500 uppercase tracking-wide block mb-1">Legenda Curta</label>
                    <input
                      type="text"
                      className="w-full px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-love-400"
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-sans font-bold text-neutral-500 uppercase tracking-wide block mb-1">Localização (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ex: São Paulo, Brasil"
                      className="w-full px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-love-400"
                      value={editLoc}
                      onChange={(e) => setEditLoc(e.target.value)}
                    />
                  </div>
                </div>

                {/* DEEP ROMANTIC TEXT FIELD (BRAZIL PORTUGUESE) */}
                <div>
                  <label className="text-[10px] font-sans font-bold text-neutral-500 uppercase tracking-wide block mb-1">
                    Declaração de Amor Crônica (Portuguese)
                  </label>
                  <textarea
                    rows={4}
                    className="w-full p-3 text-xs md:text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-love-400 leading-relaxed font-sans text-neutral-850"
                    placeholder="Escreva sua dedicatória de amor"
                    value={editRomText}
                    onChange={(e) => setEditRomText(e.target.value)}
                  />
                </div>

                {/* MEDIA DEFINITIONS ROW */}
                <div className="border hover:border-love-50 p-4.5 rounded-2xl flex flex-col gap-3">
                  <label className="text-[10px] font-sans font-bold text-love-700 uppercase tracking-wider">
                    Mídia: Escolha de Ilustração ou Foto Real
                  </label>

                  <div className="flex gap-2 mb-1" id="media-type-selector">
                    {[
                      { id: "placeholder", label: "Ilustração", icon: Sparkles },
                      { id: "image", label: "Foto Real", icon: Image }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setEditMediaType(opt.id as any)}
                        className={`flex-1 py-1.5 flex items-center justify-center gap-1 border rounded-lg font-sans text-xs font-bold transition ${editMediaType === opt.id
                          ? "bg-love-600 text-white border-love-600"
                          : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
                          }`}
                      >
                        <opt.icon className="h-3.5 w-3.5" />
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {editMediaType === "placeholder" ? (
                    <div>
                      <span className="text-[10px] font-sans text-neutral-400 block mb-1.5">Escolha o Tema de Cores do Gradiente:</span>
                      <div className="flex gap-2">
                        {Object.keys(PRESET_GRADIENTS).map((key) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setEditPreset(key)}
                            className={`w-10 h-10 rounded-xl border-2 transition bg-gradient-to-r ${PRESET_GRADIENTS[key]} ${editPreset === key ? "border-neutral-900 scale-105" : "border-transparent opacity-65"
                              }`}
                            title={key}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2.5">
                      {/* FILE INPUT UPLOADER FOR REAL IMAGES */}
                      <div className="bg-love-50/20 border border-dashed border-love-200 rounded-xl p-3 text-center flex flex-col items-center justify-center">
                        <Upload className="h-5 w-5 text-love-500 animate-pulse mb-1.5" />
                        <label className="text-xs font-sans font-bold text-love-700 cursor-pointer hover:underline block">
                          Fazer Upload de Foto do Aparelho
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLocalImageUpload}
                            className="hidden"
                          />
                        </label>
                        <span className="text-[9.5px] text-neutral-400 font-sans mt-0.5">Tipos aceitos: JPG, PNG, WEBP (Máx: 2MB)</span>
                      </div>

                      {/* URL alternative input selector */}
                      <div>
                        <span className="text-[10px] font-sans text-neutral-400 block mb-1">Ou cole uma URL / Endereço de Imagem da Web:</span>
                        <input
                          type="text"
                          placeholder="Cole URL da Imagem ex: https://exemplo.com/bruna.jpg"
                          className="w-full px-3 py-1.5 text-[11px] bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none"
                          value={editMediaUrl.startsWith("data:") ? "" : editMediaUrl}
                          onChange={(e) => {
                            setEditMediaUrl(e.target.value);
                            setEditMediaType("image");
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2 border-t border-neutral-100">
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-sans text-xs font-bold rounded-xl transition"
                  >
                    Descartar Alterações
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 py-2.5 bg-love-600 hover:bg-love-700 text-white font-sans text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1"
                  >
                    <Check className="h-4 w-4" /> Atualizar Momento ✨
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIGHTBOX MODAL FOR FULL SCREEN VIEW */}
      <AnimatePresence>
        {selectedMemory !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMemory(null)}
            className="fixed inset-0 bg-neutral-950/90 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-4 cursor-zoom-out"
            id="timeline-lightbox-backdrop"
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedMemory(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 text-white/75 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition duration-300 z-10 cursor-pointer"
              aria-label="Fechar"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Content Container */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
              className="relative max-w-4xl w-full flex flex-col items-center gap-4 cursor-default"
            >
              {selectedMemory.mediaType === "image" && (
                <img
                  src={selectedMemory.mediaUrl}
                  alt={selectedMemory.title}
                  className="max-h-[70vh] md:max-h-[75vh] w-auto max-w-full rounded-2xl shadow-2xl object-contain border border-white/10"
                  onError={(e) => {
                    (e.target as any).src = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1000";
                  }}
                />
              )}

              {/* Caption details block */}
              <div className="text-center text-white max-w-2xl px-4 mt-2">
                <span className="text-xs font-sans font-bold text-rose-350 uppercase tracking-widest block mb-1">
                  {selectedMemory.date} {selectedMemory.location && `• ${selectedMemory.location}`}
                </span>
                <h4 className="font-serif font-black text-xl md:text-2xl text-white">{selectedMemory.title}</h4>
                {selectedMemory.description && (
                  <p className="font-sans text-xs md:text-sm text-neutral-300 mt-1 italic">
                    {selectedMemory.description}
                  </p>
                )}
                {selectedMemory.romanticText && (
                  <p className="font-sans text-[11px] md:text-xs text-neutral-400 mt-3.5 max-w-lg mx-auto bg-white/5 backdrop-blur-xs p-3.5 rounded-xl border border-white/5 whitespace-pre-line text-left leading-relaxed">
                    {selectedMemory.romanticText}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
