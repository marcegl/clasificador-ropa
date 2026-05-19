// ---------------------------------------------------------------------------
// Modelo de dominio del clasificador de ropa.
// ---------------------------------------------------------------------------

/** Familia de tela. Determina programa, temperatura máxima y centrifugado seguro. */
export type Fabric =
  | 'algodon' // remeras, ropa interior de algodón, toallas
  | 'mixto' // algodón/poliéster mezcla, ropa de uso diario
  | 'sintetico' // poliéster, nylon, camperas técnicas
  | 'denim' // jeans, ropa de jean
  | 'deportiva' // ropa técnica con elastano / dry-fit
  | 'delicado' // encajes, lencería, prendas con apliques
  | 'seda' // seda, satén, viscosa fina
  | 'lana' // lana, cashmere, tejidos de punto
  | 'abrigo' // camperas, acolchados, frazadas voluminosas

/** Grupo de color. Clasificación explícita para no mezclar al lavar. */
export type ColorGroup =
  | 'blancos'
  | 'claros'
  | 'colores'
  | 'oscuros'
  | 'negros'

/** Nivel de suciedad: ajusta la temperatura recomendada. */
export type Soil = 'poco' | 'normal' | 'mucho'

export interface Garment {
  id: string
  name: string
  fabric: Fabric
  color: ColorGroup
  soil: Soil
  /** Cantidad de prendas iguales (para estimar la carga). */
  qty: number
}

/** Un programa/modo del lavarropas. */
export interface WasherProgram {
  id: string
  name: string
  /** Familias de tela para las que sirve este programa. */
  fabrics: Fabric[]
  defaultTempC: number
  maxTempC: number
  maxSpinRpm: number
  /** El lavarropas puede secar lo lavado con este programa. */
  canDry: boolean
  notes?: string
}

/** Perfil parametrizable de un lavarropas / lavasecarropas. */
export interface WasherProfile {
  id: string
  brand: string
  model: string
  /** Etiqueta visible en el selector. */
  label: string
  capacityWashKg: number
  /** 0 si el equipo no seca. */
  capacityDryKg: number
  spinSpeeds: number[]
  programs: WasherProgram[]
  /** Aclaración mostrada al usuario (origen de los datos, etc.). */
  disclaimer?: string
}

/** Una tanda de lavado sugerida con prendas compatibles. */
export interface WashLoad {
  id: string
  title: string
  colorGroup: ColorGroup
  garments: Garment[]
  program: WasherProgram
  tempC: number
  spinRpm: number
  canDry: boolean
  /** Avisos: mezclas riesgosas, prendas a lavar aparte, capacidad, etc. */
  warnings: string[]
  tips: string[]
}
