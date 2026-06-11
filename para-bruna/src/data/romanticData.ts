/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FlowerType, MemoryItem, RomanticQuote } from "../types";

export const PRESET_FLOWERS: FlowerType[] = [
  {
    id: "red-rose",
    name: "Rosa Vermelha",
    scientificName: "Rosa rubiginosa",
    meaning: "Amor profundo, paixão ardente e respeito eterno. A rainha das flores para a rainha do meu coração.",
    icon: "rose",
    color: "#e11d48", // rose-600
    svgPath: "M12 2C8.5 2 6 4.5 6 8c0 3.5 2.5 5.5 6 7.5 3.5-2 6-4 6-7.5 0-3.5-2.5-6-6-6zm0 10c-1.5-1-2.5-2-2.5-4 0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5c0 2-1 3-2.5 4z"
  },
  {
    id: "yellow-tulip",
    name: "Tulipa Amarela",
    scientificName: "Tulipa gesneriana",
    meaning: "Amor perfeito, felicidade radiante e o calor do sol que a sua presença traz para os meus dias.",
    icon: "flower-2",
    color: "#eab308", // yellow-500
    svgPath: "M12 4c-3 0-5 3-5 6v4a5 5 0 0 0 10 0v-4c0-3-2-6-5-6zm-1 8c-1-.5-1.5-1.5-1.5-2.5 0-1 1-1.5 1.5-1.5s1.5.5 1.5 1.5c0 1-.5 2-1.5 2.5z"
  },
  {
    id: "sunflower",
    name: "Girassol",
    scientificName: "Helianthus annuus",
    meaning: "Lealdade incondicional, vitalidade e admiração. Assim como o girassol segue a luz, eu sigo o seu sorriso.",
    icon: "sun",
    color: "#f59e0b", // amber-500
    svgPath: "M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"
  },
  {
    id: "lavender",
    name: "Lavanda",
    scientificName: "Lavandula angustifolia",
    meaning: "Paz de espírito, devoção e a calmaria doce que invade minha mente sempre que penso em nós dois.",
    icon: "sparkles",
    color: "#a855f7", // purple-500
    svgPath: "M12 3a1.5 1.5 0 0 0-1.5 1.5v9a1.5 1.5 0 0 0 3 0v-9A1.5 1.5 0 0 0 12 3z"
  },
  {
    id: "white-daisy",
    name: "Margarida Silvestre",
    scientificName: "Bellis perennis",
    meaning: "Pureza, inocência e a beleza das coisas simples. Lembra-me da doçura leve dos nossos risos divididos.",
    icon: "flower",
    color: "#f1f5f9", // slate-100 (renders with golden core)
    svgPath: "M12 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm7-9a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM1 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0z"
  },
  {
    id: "orchid",
    name: "Orquídea Rara",
    scientificName: "Orchidaceae",
    meaning: "Beleza sofisticada, força feminina, desejo e a raridade preciosa do nosso encontro de almas.",
    icon: "crown",
    color: "#ec4899", // pink-500
    svgPath: "M12 2a4 4 0 0 0-4 4c0 3 4 8 4 8s4-5 4-4a4 4 0 0 0-4-4z"
  }
];

export const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: "1",
    date: "12 de Outubro de 2024",
    title: "O Nosso Começo",
    description: "Aquele primeiro instante em que nossos olhares se cruzaram.",
    romanticText: "Bruna, aquele dia mudou minha perspectiva de felicidade. Nunca imaginei que aquele 'olá' despretensioso seria o primeiro passo para o amor mais lindo que eu já senti. O seu sorriso me desarmou por completo e, de alguma forma mágica, eu soube que pertencia a você.",
    mediaType: "placeholder",
    placeholderPreset: "rose-love",
    location: "São Paulo, Brasil"
  },
  {
    id: "2",
    date: "12 de Novembro de 2024",
    title: "O Nosso Primeiro Beijo",
    description: "Um instante suspenso em que o tempo pareceu parar.",
    romanticText: "O frio na barriga, a respiração acelerada e a certeza absoluta de que seus lábios se encaixavam perfeitamente nos meus. Foi ali, naquele milésimo de segundo de silêncio, que meu coração sussurrou: 'É ela'.",
    mediaType: "placeholder",
    placeholderPreset: "pink-sunset",
    location: "Parque da Cidade"
  },
  {
    id: "3",
    date: "25 de Dezembro de 2024",
    title: "Primeiro Natal Juntos",
    description: "Celebrando o calor da nossa união sob as luzes brilhantes.",
    romanticText: "Dividir o final de ano com você fez com que qualquer pisca-pisca empalidecesse perto do brilho do seu olhar. O melhor presente que eu poderia receber já estava deitado ao meu lado, sorrindo e me enchendo de paz.",
    mediaType: "placeholder",
    placeholderPreset: "gold-glow",
    location: "Minha Casa"
  },
  {
    id: "4",
    date: "14 de Fevereiro de 2025",
    title: "Planos Para o Futuro",
    description: "Sonhando acordados com cada pedacinho do nosso amanhã.",
    romanticText: "Traçar metas, escolher as cores da nossa futura sala e rir de piadas bobas enquanto planejamos nossas próximas viagens. Bruna, construir caminhos com você é minha aventura preferida. Quero caminhar de mãos dadas contigo até estarmos velhinhos.",
    mediaType: "placeholder",
    placeholderPreset: "violet-ambient",
    location: "Jantar Especial"
  }
];

export const ROMANTIC_QUOTES: RomanticQuote[] = [
  { quote: "Amar não é olhar um para o outro, é olhar juntos na mesma direção.", author: "Antoine de Saint-Exupéry" },
  { quote: "Você é o verso mais lindo que a vida já escreveu no meu destino.", author: "Meu Coração" },
  { quote: "Se eu tivesse que escolher entre respirar e amar você, eu usaria meu último sopro de vida para dizer: Te amo.", author: "Felipe" },
  { quote: "E no meio de tanta gente, meu coração escolheu você para ser meu lar.", author: "Para Bruna" },
  { quote: "O amor é composto por uma única alma habitando dois corpos.", author: "Aristóteles" }
];
