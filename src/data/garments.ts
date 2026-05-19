import type { ColorGroup, Fabric, Soil } from '../lib/types'

export const FABRIC_LABELS: Record<Fabric, string> = {
  algodon: 'Algodón',
  mixto: 'Mixto (algodón/poliéster)',
  sintetico: 'Sintético (poliéster/nylon)',
  denim: 'Jean / Denim',
  deportiva: 'Deportiva (dry-fit/elastano)',
  delicado: 'Delicado (encaje/lencería)',
  seda: 'Seda / Satén / Viscosa',
  lana: 'Lana / Tejido de punto',
  abrigo: 'Abrigo voluminoso',
}

export const COLOR_LABELS: Record<ColorGroup, string> = {
  blancos: 'Blancos',
  claros: 'Claros / Pastel',
  colores: 'Colores vivos',
  oscuros: 'Oscuros',
  negros: 'Negros',
}

/** Ejemplos concretos para que cada color se clasifique bien. */
export const COLOR_EXAMPLES: Record<ColorGroup, string> = {
  blancos: 'blanco puro',
  claros: 'beige, crema, celeste, rosa claro, gris claro',
  colores: 'rojo, fucsia, naranja, amarillo, verde claro',
  oscuros: 'azul, gris oscuro, bordó, verde oscuro, marrón',
  negros: 'negro',
}

/** Color de referencia para mostrar un punto en la UI. */
export const COLOR_SWATCH: Record<ColorGroup, string> = {
  blancos: '#f8fafc',
  claros: '#fde68a',
  colores: '#ef4444',
  oscuros: '#475569',
  negros: '#0f172a',
}

/** Guía fija de colores que se muestra siempre en la UI. */
export const COLOR_GUIDE: { icon: string; text: string }[] = [
  {
    icon: '✅',
    text: 'Blancos y claros (beige, crema, pastel) son compatibles: podés lavarlos juntos a 40°.',
  },
  {
    icon: '⚠️',
    text: 'Colores vivos y oscuros van aparte de los claros: pueden teñirlos. Lavalos del revés.',
  },
  {
    icon: '💡',
    text: 'Prenda de color nueva: el primer lavado, sola o solo con colores iguales (puede destiñir).',
  },
]

export const SOIL_LABELS: Record<Soil, string> = {
  poco: 'Poco sucia',
  normal: 'Normal',
  mucho: 'Muy sucia / manchas',
}

export interface GarmentPreset {
  name: string
  fabric: Fabric
  color: ColorGroup
}

/** Prendas frecuentes para agregar con un toque. */
export const GARMENT_PRESETS: GarmentPreset[] = [
  { name: 'Remera', fabric: 'algodon', color: 'colores' },
  { name: 'Remera blanca', fabric: 'algodon', color: 'blancos' },
  { name: 'Camisa', fabric: 'mixto', color: 'claros' },
  { name: 'Jean', fabric: 'denim', color: 'oscuros' },
  { name: 'Pantalón', fabric: 'mixto', color: 'oscuros' },
  { name: 'Buzo / Hoodie', fabric: 'algodon', color: 'colores' },
  { name: 'Campera técnica', fabric: 'sintetico', color: 'negros' },
  { name: 'Ropa de gym', fabric: 'deportiva', color: 'negros' },
  { name: 'Ropa interior', fabric: 'algodon', color: 'blancos' },
  { name: 'Medias', fabric: 'mixto', color: 'oscuros' },
  { name: 'Toalla', fabric: 'algodon', color: 'claros' },
  { name: 'Toallón', fabric: 'algodon', color: 'blancos' },
  { name: 'Sábanas', fabric: 'algodon', color: 'blancos' },
  { name: 'Acolchado', fabric: 'abrigo', color: 'claros' },
  { name: 'Sweater de lana', fabric: 'lana', color: 'colores' },
  { name: 'Lencería', fabric: 'delicado', color: 'negros' },
  { name: 'Blusa de seda', fabric: 'seda', color: 'claros' },
  { name: 'Vestido', fabric: 'sintetico', color: 'colores' },
]
