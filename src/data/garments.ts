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
  blancos: 'Blanco',
  claros: 'Claro',
  colores: 'Color vivo',
  oscuros: 'Oscuro',
  negros: 'Negro',
}

/** Ejemplos concretos para que cada color se clasifique bien. */
export const COLOR_EXAMPLES: Record<ColorGroup, string> = {
  blancos: 'blanco puro',
  claros: 'beige, crema, celeste, rosa claro',
  colores: 'rojo, fucsia, naranja, amarillo, verde claro',
  oscuros: 'azul, gris oscuro, bordó, verde oscuro',
  negros: 'negro',
}

/** Color de referencia para las muestras de la UI. */
export const COLOR_SWATCH: Record<ColorGroup, string> = {
  blancos: '#ffffff',
  claros: '#f0d9a8',
  colores: '#e0524d',
  oscuros: '#3a4a66',
  negros: '#191919',
}

export const SOIL_LABELS: Record<Soil, string> = {
  poco: 'Poco sucia',
  normal: 'Normal',
  mucho: 'Muy sucia',
}

/**
 * Guía de colores. Se muestra como interacción dentro de la clasificación
 * (desplegable "¿Cómo agrupé tu ropa?"), no como card fija.
 */
export const COLOR_GUIDE: { icon: string; text: string }[] = [
  {
    icon: '✅',
    text: 'Blancos y claros (beige, crema, pastel) son compatibles: se pueden lavar juntos a 40°.',
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

// ---------------------------------------------------------------------------
// Catálogo de prendas. El usuario elige la PRENDA; la tela se infiere de acá.
// ---------------------------------------------------------------------------

export type GarmentCategory =
  | 'Uso diario'
  | 'Cama y baño'
  | 'Abrigo'
  | 'Deportiva'
  | 'Delicados'

export interface CatalogItem {
  name: string
  icon: string
  fabric: Fabric
  defaultColor: ColorGroup
  category: GarmentCategory
}

export const GARMENT_CATALOG: CatalogItem[] = [
  // Uso diario
  { name: 'Remera', icon: '👕', fabric: 'algodon', defaultColor: 'colores', category: 'Uso diario' },
  { name: 'Camisa', icon: '👔', fabric: 'mixto', defaultColor: 'claros', category: 'Uso diario' },
  { name: 'Pantalón', icon: '👖', fabric: 'mixto', defaultColor: 'oscuros', category: 'Uso diario' },
  { name: 'Jean', icon: '👖', fabric: 'denim', defaultColor: 'oscuros', category: 'Uso diario' },
  { name: 'Buzo / Hoodie', icon: '🧥', fabric: 'algodon', defaultColor: 'colores', category: 'Uso diario' },
  { name: 'Vestido', icon: '👗', fabric: 'sintetico', defaultColor: 'colores', category: 'Uso diario' },
  { name: 'Ropa interior', icon: '🩲', fabric: 'algodon', defaultColor: 'blancos', category: 'Uso diario' },
  { name: 'Medias', icon: '🧦', fabric: 'mixto', defaultColor: 'oscuros', category: 'Uso diario' },

  // Cama y baño
  { name: 'Toalla', icon: '🧺', fabric: 'algodon', defaultColor: 'claros', category: 'Cama y baño' },
  { name: 'Toallón', icon: '🧺', fabric: 'algodon', defaultColor: 'blancos', category: 'Cama y baño' },
  { name: 'Sábanas', icon: '🛏️', fabric: 'algodon', defaultColor: 'blancos', category: 'Cama y baño' },
  { name: 'Funda de almohada', icon: '🛏️', fabric: 'algodon', defaultColor: 'blancos', category: 'Cama y baño' },
  { name: 'Acolchado / Frazada', icon: '🛌', fabric: 'abrigo', defaultColor: 'claros', category: 'Cama y baño' },

  // Abrigo
  { name: 'Campera técnica', icon: '🧥', fabric: 'sintetico', defaultColor: 'negros', category: 'Abrigo' },
  { name: 'Sweater de lana', icon: '🧶', fabric: 'lana', defaultColor: 'colores', category: 'Abrigo' },
  { name: 'Buzo polar', icon: '🧥', fabric: 'sintetico', defaultColor: 'oscuros', category: 'Abrigo' },
  { name: 'Camisa de jean', icon: '👔', fabric: 'denim', defaultColor: 'oscuros', category: 'Abrigo' },

  // Deportiva
  { name: 'Ropa de gym', icon: '🩳', fabric: 'deportiva', defaultColor: 'negros', category: 'Deportiva' },
  { name: 'Calzas', icon: '🩱', fabric: 'deportiva', defaultColor: 'negros', category: 'Deportiva' },
  { name: 'Remera dry-fit', icon: '🎽', fabric: 'deportiva', defaultColor: 'colores', category: 'Deportiva' },

  // Delicados
  { name: 'Lencería', icon: '🩲', fabric: 'delicado', defaultColor: 'negros', category: 'Delicados' },
  { name: 'Blusa de seda', icon: '👚', fabric: 'seda', defaultColor: 'claros', category: 'Delicados' },
  { name: 'Prenda con encaje', icon: '👚', fabric: 'delicado', defaultColor: 'negros', category: 'Delicados' },
]

export const CATEGORY_ORDER: GarmentCategory[] = [
  'Uso diario',
  'Cama y baño',
  'Abrigo',
  'Deportiva',
  'Delicados',
]

export const CATEGORY_ICON: Record<GarmentCategory, string> = {
  'Uso diario': '👕',
  'Cama y baño': '🛏️',
  Abrigo: '🧥',
  Deportiva: '🏃',
  Delicados: '🪡',
}
