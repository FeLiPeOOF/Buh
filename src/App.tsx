/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Heart, Sparkles, Gift, Calendar, MailOpen, MessageCircleHeart, Trophy, CheckCircle, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import LoveCounter from "./components/LoveCounter";
import MusicPlayer from "./components/MusicPlayer";
import LoveLetter from "./components/LoveLetter";
import BouquetBuilder from "./components/BouquetBuilder";
import Timeline from "./components/Timeline";

interface QuizQuestion {
  id: number;
  question: string;
  choices: string[];
  correctIdx: number;
  funFact: string;
}

const DEFAULT_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: "Quem disse o primeiro 'Eu te amo' da relação?",
    choices: ["Felipe", "Bruna", "Ambos ao mesmo tempo!", "Nenhum dos dois ainda!"],
    correctIdx: 0,
    funFact: "O Felipe não aguentou de tanto amor acumulado no peito e se entregou primeiro!"
  },
  {
    id: 2,
    question: "Qual é o plano preferido do casal para um dia chuvoso?",
    choices: ["Assistir uma série deitadinhos dividindo cobertor", "Sair para jantar num restaurante chique", "Cozinhar uma receita aleatória juntos", "Dormir a tarde toda"],
    correctIdx: 0,
    funFact: "Nada bate o acolhimento de ficar grudadinhos ouvindo o barulhinho da chuva."
  },
  {
    id: 3,
    question: "Sempre que Bruna sorri, o que acontece com Felipe?",
    choices: ["O dia dele fica 1000% melhor", "O coração bate mais forte", "Ele se apaixona ainda mais", "Todas as anteriores estão absolutamente corretas!"],
    correctIdx: 3,
    funFact: "O seu sorriso, Bruna, tem o poder de iluminar qualquer dia cinza!"
  },
  {
    id: 4,
    question: "Em uma viagem de casal, quem é mais provável de organizar os roteiros e conferir as malas?",
    choices: ["Quem é super organizado(a) e faz listas para tudo", "Quem deixa para arrumar na última hora", "Os dois dividem as tarefas igualmente", "Nenhum dos dois (esquecem metade das coisas e compram no caminho)"],
    correctIdx: 0,
    funFact: "Sempre tem um que planeja cada detalhe enquanto o outro confia e curte a jornada!"
  },
  {
    id: 5,
    question: "Se pudessem escolher um superpoder para compartilhar, qual seria o favorito do casal?",
    choices: ["Teletransporte para viajar o mundo de graça", "Ler a mente um do outro", "Parar o tempo nos momentos perfeitos juntos", "Ficar invisíveis para fazer travessuras"],
    correctIdx: 2,
    funFact: "Parar o tempo quando estamos juntos seria o sonho perfeito de qualquer casal apaixonado!"
  },
  {
    id: 6,
    question: "O que acontece na hora de escolher um filme ou série para assistir?",
    choices: ["Decidem em menos de 5 minutos", "Passam 1 hora escolhendo e acabam dormindo", "Sempre assistem o favorito de um deles", "Assistem à mesma série pela décima vez"],
    correctIdx: 1,
    funFact: "A jornada de navegar pelo catálogo já virou um dos nossos passatempos favoritos!"
  },
  {
    id: 7,
    question: "Quem é mais provável de chorar assistindo a um filme ou final de série emocionante?",
    choices: ["Ela, com certeza", "Ele, mesmo tentando disfarçar", "Os dois choram juntos abraçados", "Nenhum, são corações de pedra"],
    correctIdx: 2,
    funFact: "Se emocionar e compartilhar a sensibilidade torna qualquer história muito mais bonita."
  },
  {
    id: 8,
    question: "Qual é o hábito matinal favorito do casal para começar bem o dia?",
    choices: ["Dar um beijo de bom dia antes de levantar", "Preparar um café caprichado juntos", "Ficar enrolando na cama mais 15 minutinhos em silêncio", "Fazer planos animados para o dia todo"],
    correctIdx: 2,
    funFact: "Aqueles minutinhos extras de preguiça e dengo na cama são sagrados e renovam as energias!"
  },
  {
    id: 9,
    question: "Qual é a comida que é impossível o casal recusar em um final de semana?",
    choices: ["Uma pizza bem recheada", "Hambúrguer artesanal com batata frita", "Comida japonesa (Sushi/Temaki)", "Doces e brigadeiro de panela quente"],
    correctIdx: 0,
    funFact: "Pizza é a resposta universal e aconchegante para celebrar qualquer dia da semana!"
  },
  {
    id: 10,
    question: "Quem é o mais esquecido da relação quando se trata de chaves, celular ou carteira?",
    choices: ["Ele, vive perdendo a cabeça", "Ela, sempre esquece onde deixou", "Ambos são super distraídos no dia a dia", "Nenhum dos dois, são super atentos"],
    correctIdx: 0,
    funFact: "Por sorte, sempre tem um no casal que funciona como o rastreador oficial de objetos perdidos!"
  },
  {
    id: 11,
    question: "Qual tipo de elogio ou carinho mais faz o coração derreter?",
    choices: ["Dizer 'você está lindo(a) hoje'", "Falar 'tenho muito orgulho de você'", "Dizer 'minha vida é muito melhor com você'", "Todas as opções juntas!"],
    correctIdx: 3,
    funFact: "Ouvir palavras de carinho e apoio de quem amamos é o melhor combustível para a alma!"
  },
  {
    id: 12,
    question: "Ao receber uma excelente notícia, qual é o primeiro reflexo do casal?",
    choices: ["Dar um grito de alegria e pular", "Sorrir de orelha a orelha em silêncio", "Ligar ou mandar mensagem imediatamente para o outro", "Fazer uma dancinha comemorativa engraçada"],
    correctIdx: 2,
    funFact: "Compartilhar as conquistas com o nosso amor é o que torna tudo verdadeiramente real."
  },
  {
    id: 13,
    question: "Qual é a definição perfeita de um final de semana ideal para o casal?",
    choices: ["Viajar para a praia ou campo", "Maratona de séries com muita comida gostosa", "Sair para dançar ou ver os amigos", "Qualquer lugar ou plano, desde que estejamos juntos!"],
    correctIdx: 3,
    funFact: "A companhia um do outro é o verdadeiro destino de felicidade!"
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"us" | "bouquet" | "timeline" | "quiz">("us");
  
  // Quiz state
  const [quiz, setQuiz] = useState<QuizQuestion[]>(() => {
    const saved = localStorage.getItem("love_quiz_questions");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length === DEFAULT_QUIZ.length) {
        return parsed;
      }
    }
    return DEFAULT_QUIZ;
  });
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  // Floating background hearts list helper
  const hearts = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: `${(i * 17) % 100}%`,
    duration: `${8 + (i % 6)}s`,
    delay: `${i * 0.7}s`,
    size: `${14 + (i % 3) * 6}px`
  }));

  const handleAnswerQuiz = (questionId: number, choiceIdx: number) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: choiceIdx }));
  };

  const checkResults = () => {
    setQuizFinished(true);
  };

  const resetQuiz = () => {
    setUserAnswers({});
    setQuizFinished(false);
  };

  // Helper score calculator
  const score = quiz.reduce((sum, q) => {
    return userAnswers[q.id] === q.correctIdx ? sum + 1 : sum;
  }, 0);

  return (
    <div className="min-h-screen bg-love-50 text-neutral-800 font-sans relative overflow-x-hidden selection:bg-love-200 p-3 md:p-6 lg:p-8">
      
      {/* FLOAT HEARTS BACKGROUND LAYERS */}
      <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none overflow-hidden z-0 bg-transparent">
        {hearts.map((h) => (
          <div
            key={h.id}
            className="floating-heart text-love-400/25"
            style={{
              left: h.left,
              animationDelay: h.delay,
              animationDuration: h.duration,
              fontSize: h.size
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      {/* CORE FRAME CONTAINER FOR BRAND/MAIN HERO IN ONE INTEGRATED BENTO BOX */}
      <header className="relative z-10 max-w-6xl mx-auto mb-6 bg-white/75 backdrop-blur-xl border border-love-100/70 rounded-[28px] p-6 md:p-8 shadow-xs flex flex-col lg:flex-row justify-between items-center gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left flex-1"
        >
          <div className="inline-flex items-center gap-2 bg-love-50 border border-love-100 px-3.5 py-1.5 rounded-full mb-3.5 shadow-2xs">
            <Heart className="h-4 w-4 text-love-500 fill-current animate-pulse" />
            <span className="text-[10px] font-bold text-love-800 tracking-wider uppercase">Portal de Amor • Bruna & Felipe</span>
          </div>

          <h1 className="font-serif font-black tracking-tight text-3xl md:text-5xl text-love-950">
            Para Bruna, Meu Amor
          </h1>
          <p className="font-serif italic text-love-700 font-medium text-sm md:text-base max-w-xl mt-2 select-all leading-relaxed">
            "De cabo a rabo, cada pedacinho da minha vida de namorado é imensamente melhor com você ao meu lado."
          </p>
        </motion.div>

        {/* CUSTOM PREMIUM TAB PANEL BAR */}
        <div className="flex flex-col items-center lg:items-end shrink-0 gap-3">
          <nav className="flex justify-center" id="romance-navigation-bar">
            <div className="bg-love-50/60 p-1.5 rounded-2xl border border-love-100 flex flex-wrap gap-1 shadow-2xs">
              {[
                { id: "us", label: "Nosso Amor ❤️", icon: MailOpen },
                { id: "bouquet", label: "Buquê Digital 💐", icon: Gift },
                { id: "timeline", label: "Nossa História 📖", icon: Calendar },
                { id: "quiz", label: "Nosso Jogo 🧩", icon: MessageCircleHeart }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setQuizFinished(false);
                  }}
                  className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-love-600 to-rose-500 text-white shadow-2xs scale-102"
                      : "text-love-900 hover:text-love-700 hover:bg-love-100/60"
                  }`}
                  id={`tab-btn-${tab.id}`}
                >
                  <tab.icon className="h-3.5 w-3.5 shrink-0" />
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* BODY CONTENT ROUTE DISPATCHER */}
      <main className="relative z-10 max-w-6xl mx-auto px-1 pb-20 mt-2" id="main-content-display">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            
            {/* TAB 1: OUR CORNER (COUNTER, LETTER, MUSIC PLAYER) */}
            {activeTab === "us" && (
              <div className="flex flex-col gap-6" id="tab-our-corner">
                
                {/* First Row: Counters & Highlights */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Anniversary Ticker */}
                  <div className="lg:col-span-7 flex">
                    <LoveCounter />
                  </div>

                  {/* Aesthetic Bento Love Quote */}
                  <div className="lg:col-span-5 bg-gradient-to-tr from-love-600 via-rose-500 to-love-500 rounded-3xl p-6 text-white flex flex-col justify-between shadow-xs border border-love-100/30 overflow-hidden relative min-h-[280px]">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                      <Heart className="h-64 w-64 fill-current text-white -mr-16 -mt-16" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2.5 py-1 rounded-full border border-white/20">
                        Espaço Romântico
                      </span>
                      <h4 className="font-serif italic font-extrabold text-2xl mt-4 leading-relaxed">
                        "Quando você não está por perto, parece que até as rosas choram e o perfume do quarto perde o sentido. Não tenho vergonha de dizer que meu mundo gira em torno do seu sorriso. Você é minha calmaria e, ao mesmo tempo, a tempestade que bagunçou tudo para colocar as coisas no lugar certo."
                      </h4>
                    </div>
                    <div className="mt-6 flex items-center gap-3 relative z-10">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-serif font-black border border-white/20">
                        FN
                      </div>
                      <div>
                        <p className="text-xs font-bold leading-none">Com todo o meu amor,</p>
                        <p className="text-[11px] text-rose-150 mt-1">Seu eterno Felipe</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Second Row: Interactive letter and realtime music synthesizer */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Synthesis Audio player column */}
                  <div className="lg:col-span-5 flex flex-col gap-6" id="audio-panel-box">
                    <div className="bg-white/80 rounded-3xl p-6 border border-love-100/60 shadow-xs">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-serif font-black text-lg text-love-950">Trilha Sonora</h4>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-rose-600 border border-rose-100 uppercase tracking-wider gap-1">
                          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" /> Ao Vivo
                        </span>
                      </div>
                      <p className="text-[11.5px] font-sans text-love-650 leading-relaxed mb-4">
                        Desfrute de nossas trilhas sonoras sintetizadas em tempo real. Cada sequência foi formulada para inspirar aconchego e amor.
                      </p>
                      <MusicPlayer />
                    </div>

                    {/* Sweet instructions about customized template */}
                    <div className="bg-gradient-to-tr from-amber-50 to-orange-50/50 rounded-3xl p-6 border border-amber-100 shadow-xs">
                      <h5 className="font-serif font-bold text-sm text-amber-900 mb-1.5 flex items-center gap-1">
                        ✨ Personalize Sua Página!
                      </h5>
                      <p className="text-[11.5px] font-sans text-amber-800 leading-normal">
                        Este site foi projetado como um <strong>template vivo de amor</strong>. Clique em <strong>'Alterar Data'</strong> acima, ou navegue pelo álbum de memórias para editar textos e enviar suas fotografias! As atualizações ficam salvas no seu aparelho para que Bruna veja exatamente a sua homenagem personalizada.
                      </p>
                    </div>
                  </div>

                  {/* 3D Folding Love letter column */}
                  <div className="lg:col-span-7" id="parchment-letter-box">
                    <div className="bg-white/80 rounded-3xl border border-love-100/60 shadow-xs p-1">
                      <LoveLetter />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: DIGITAL BOUQUET BUILDER */}
            {activeTab === "bouquet" && (
              <div id="tab-flowers-builder">
                <BouquetBuilder />
              </div>
            )}

            {/* TAB 3: SCROLLABLE CHRONOLOGICAL MEMORIES TIMELINE */}
            {activeTab === "timeline" && (
              <div id="tab-album-timeline">
                <Timeline />
              </div>
            )}

            {/* TAB 4: INTERESTING COUPLE TRIVIA QUIZ */}
            {activeTab === "quiz" && (
              <div className="w-full max-w-3xl mx-auto bg-white/70 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-love-100 shadow-sm" id="tab-couple-jeu">
                <div className="text-center mb-8">
                  <span className="text-[10px] font-sans font-bold bg-love-50 text-love-800 py-1 px-2.5 rounded-full border border-love-100 uppercase tracking-widest">
                    Jogo de Afinidade de Casal
                  </span>
                  <h3 className="font-serif font-black text-2xl md:text-3xl text-love-950 mt-2">
                    Nosso Quiz de Amor
                  </h3>
                  <p className="font-sans text-xs md:text-sm text-love-600 mt-1 max-w-md mx-auto leading-relaxed">
                    Será que a Bruna consegue acertar todas as curiosidades do nosso amor? Escolham as respostas juntos e divirtam-se!
                  </p>
                </div>

                <div className="flex flex-col gap-6" id="quiz-questionary-block">
                  {quiz.map((q, idx) => {
                    const chosen = userAnswers[q.id];
                    const isCorrect = chosen === q.correctIdx;
                    
                    return (
                      <div
                        key={q.id}
                        className="p-5 rounded-2xl border bg-white shadow-xs transition duration-300 border-love-100"
                      >
                        <h4 className="font-serif font-bold text-base text-love-950 flex gap-2">
                          <HelpCircle className="h-5 w-5 shrink-0 text-love-400 mt-0.5" />
                          <span>Pergunta {idx + 1}: {q.question}</span>
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                          {q.choices.map((choice, cIdx) => {
                            const isSelected = chosen === cIdx;
                            return (
                              <button
                                key={cIdx}
                                disabled={quizFinished}
                                onClick={() => handleAnswerQuiz(q.id, cIdx)}
                                className={`px-4.5 py-3 rounded-xl border font-sans text-xs text-left transition duration-300 font-bold ${
                                  isSelected
                                    ? "bg-love-600 text-white border-love-600 shadow-xs"
                                    : "bg-love-50/10 text-slate-800 border-slate-100 hover:bg-love-50"
                                } ${quizFinished ? "cursor-not-allowed" : "cursor-pointer"}`}
                              >
                                {choice}
                              </button>
                            );
                          })}
                        </div>

                        {/* Fun fact revealing */}
                        {quizFinished && (
                          <div className={`mt-3 p-3 rounded-xl flex gap-2 items-start text-xs font-sans leading-relaxed ${
                            isCorrect ? "bg-emerald-50 border border-emerald-250 text-emerald-800" : "bg-rose-50 border border-rose-200 text-rose-800"
                          }`}>
                            {isCorrect ? (
                              <>
                                <CheckCircle className="h-4.5 w-4.5 shrink-0 text-emerald-500 mt-0.5" />
                                <div>
                                  <span className="font-bold">Correto!</span> {q.funFact}
                                </div>
                              </>
                            ) : (
                              <>
                                <span className="text-rose-500 font-bold shrink-0">✕</span>
                                <div>
                                  <span className="font-bold">Ups!</span> A resposta correta era: <span className="underline font-bold">{q.choices[q.correctIdx]}</span>. <br/>
                                  <span className="italic mt-1 block opacity-90">{q.funFact}</span>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Score submissions */}
                <div className="mt-8 pt-6 border-t border-love-100/30 flex flex-col items-center">
                  {!quizFinished ? (
                    <button
                      onClick={checkResults}
                      disabled={Object.keys(userAnswers).length < quiz.length}
                      className={`px-8 py-3.5 rounded-2xl font-serif font-bold text-sm shadow-md transition duration-300 ${
                        Object.keys(userAnswers).length < quiz.length
                          ? "bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed"
                          : "bg-love-600 text-white hover:bg-love-700 cursor-pointer"
                      }`}
                      id="finish-quiz-btn"
                    >
                      Verificar Resultados do Amor 🥂
                    </button>
                  ) : (
                    <div className="text-center flex flex-col items-center gap-3">
                      <div className="w-14 h-14 bg-amber-50 rounded-full border border-amber-200 flex items-center justify-center text-amber-500 animate-spin" style={{ animationDuration: "12s" }}>
                        <Trophy className="h-6 w-6" />
                      </div>
                      <h4 className="font-serif font-extrabold text-xl text-love-950">
                        Seu Resultado: {score} de {quiz.length} Acertos!
                      </h4>
                      <p className="text-xs font-sans text-love-650 max-w-sm leading-relaxed">
                        {score === quiz.length 
                          ? "Incrível! Bruna conhece cada detalhe do amor de vocês. Vocês são almas gêmeas perfeitas!" 
                          : "Vocês foram muito bem! O amor não se mede em pontos de quiz, mas sim nos abraços de cada novo amanhecer."}
                      </p>
                      <button
                        onClick={resetQuiz}
                        className="mt-2 text-xs font-sans font-bold text-love-650 hover:text-love-900 border border-love-100 hover:bg-love-50 px-4 py-2 rounded-xl transition"
                        id="reset-quiz-btn"
                      >
                        Refazer Jogo ↩
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* FOOTER SIGN-OFF CREDITS */}
      <footer className="relative z-10 w-full border-t border-love-100/50 py-8 bg-white/20 backdrop-blur-md text-center text-love-500 font-sans text-[11px] font-semibold tracking-wider uppercase mt-12">
        <div className="flex justify-center items-center gap-1.5 mb-1 text-love-600">
          Feito com <Heart className="h-4 w-4 fill-current animate-pulse text-love-500" /> para Bruna • Dia dos Namorados
        </div>
        <div>Felipe & Bruna • Amor para Sempre</div>
      </footer>

    </div>
  );
}
