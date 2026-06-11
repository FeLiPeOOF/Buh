/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FlowerType {
  id: string;
  name: string;
  scientificName: string;
  meaning: string;
  icon: string;
  color: string;
  svgPath: string; // Used to custom render beautiful SVG models of each flower
}

export interface BouquetItem {
  flower: FlowerType;
  quantity: number;
}

export interface MemoryItem {
  id: string;
  date: string;
  title: string;
  description: string;
  romanticText: string;
  mediaType: "image" | "video" | "placeholder";
  mediaUrl?: string;
  placeholderPreset?: string; // name of preset illustration or gradient
  location?: string;
}

export interface RomanticQuote {
  quote: string;
  author?: string;
}
