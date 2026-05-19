import type {
  ColorGroup,
  Fabric,
  Garment,
  WasherProfile,
  WasherProgram,
  WashLoad,
} from './types'
import { COLOR_LABELS, FABRIC_LABELS } from '../data/garments'

// ---------------------------------------------------------------------------
// Motor de clasificación: agrupa prendas en tandas compatibles y elige el
// programa, temperatura y centrifugado según el lavarropas seleccionado.
// ---------------------------------------------------------------------------

/** Familia de lavado: prendas de la misma familia se lavan juntas. */
type Family = 'resistente' | 'sintetico' | 'deportiva' | 'jean' | 'delicado' | 'lana' | 'abrigo'

const FABRIC_FAMILY: Record<Fabric, Family> = {
  algodon: 'resistente',
  mixto: 'resistente',
  sintetico: 'sintetico',
  deportiva: 'deportiva',
  denim: 'jean',
  delicado: 'delicado',
  seda: 'delicado',
  lana: 'lana',
  abrigo: 'abrigo',
}

const FAMILY_LABEL: Record<Family, string> = {
  resistente: 'Algodón / Resistente',
  sintetico: 'Sintéticos',
  deportiva: 'Deportiva',
  jean: 'Jean / Oscuros',
  delicado: 'Delicados',
  lana: 'Lana',
  abrigo: 'Abrigos / Voluminoso',
}

/** Bucket de color: dos colores en distinto bucket NO se mezclan. */
type ColorBucket = 'CLAROS' | 'COLOR' | 'OSCUROS'

const COLOR_BUCKET: Record<ColorGroup, ColorBucket> = {
  blancos: 'CLAROS',
  claros: 'CLAROS',
  colores: 'COLOR',
  oscuros: 'OSCUROS',
  negros: 'OSCUROS',
}

const COLOR_BUCKET_LABEL: Record<ColorBucket, string> = {
  CLAROS: 'Blancos y claros',
  COLOR: 'Colores',
  OSCUROS: 'Oscuros y negros',
}

/** Familias que NO conviene secar en secarropas. */
const NO_MACHINE_DRY: ReadonlySet<Family> = new Set<Family>([
  'lana',
  'delicado',
  'jean',
  'deportiva',
  'abrigo',
])

/** Peso estimado por prenda (kg) para aproximar la carga del tambor. */
const FABRIC_WEIGHT_KG: Record<Fabric, number> = {
  algodon: 0.25,
  mixto: 0.3,
  sintetico: 0.25,
  denim: 0.7,
  deportiva: 0.2,
  delicado: 0.1,
  seda: 0.1,
  lana: 0.4,
  abrigo: 1.5,
}

function snapSpin(target: number, available: number[]): number {
  const options = [...available].sort((a, b) => a - b)
  let best = options[0] ?? 0
  for (const rpm of options) if (rpm <= target) best = rpm
  return best
}

/** Elige el mejor programa del lavarropas para una familia/conjunto de telas. */
function pickProgram(
  fabrics: Set<Fabric>,
  washer: WasherProfile,
): WasherProgram | null {
  let best: WasherProgram | null = null
  let bestScore = -1
  let bestSize = Infinity
  for (const program of washer.programs) {
    const overlap = program.fabrics.filter((f) => fabrics.has(f)).length
    if (overlap === 0) continue
    // Más cobertura de las telas del grupo gana; a igualdad, el programa más
    // específico (con menos telas) gana.
    if (
      overlap > bestScore ||
      (overlap === bestScore && program.fabrics.length < bestSize)
    ) {
      best = program
      bestScore = overlap
      bestSize = program.fabrics.length
    }
  }
  return best
}

function recommendTemp(
  program: WasherProgram,
  bucket: ColorBucket,
  family: Family,
  maxSoil: number,
): number {
  let temp = program.defaultTempC

  // Color: cuanto más oscuro/vivo, más frío para no desteñir.
  if (bucket === 'OSCUROS') temp = Math.min(temp, 30)
  else if (bucket === 'COLOR') temp = Math.min(temp, 40)

  // Suciedad: sube temperatura solo en telas resistentes y claras.
  if (maxSoil >= 2 && family === 'resistente' && bucket === 'CLAROS') {
    temp = Math.max(temp, 60)
  } else if (maxSoil >= 2 && family === 'resistente') {
    temp = Math.max(temp, 40)
  } else if (maxSoil === 0) {
    temp = Math.min(temp, 30)
  }

  // Telas frágiles: nunca por encima de 30°.
  if (family === 'delicado' || family === 'lana') temp = Math.min(temp, 30)

  return Math.min(temp, program.maxTempC)
}

const SOIL_RANK = { poco: 0, normal: 1, mucho: 2 } as const

export interface ClassifyResult {
  loads: WashLoad[]
  /** Avisos globales (capacidad total, recomendación de orden, etc.). */
  globalNotes: string[]
}

export function classify(
  garments: Garment[],
  washer: WasherProfile,
): ClassifyResult {
  const groups = new Map<string, Garment[]>()
  for (const g of garments) {
    const key = `${FABRIC_FAMILY[g.fabric]}|${COLOR_BUCKET[g.color]}`
    const list = groups.get(key) ?? []
    list.push(g)
    groups.set(key, list)
  }

  const loads: WashLoad[] = []

  for (const [key, items] of groups) {
    const [family, bucket] = key.split('|') as [Family, ColorBucket]
    const fabrics = new Set<Fabric>(items.map((i) => i.fabric))
    const colors = new Set<ColorGroup>(items.map((i) => i.color))
    const maxSoil = Math.max(...items.map((i) => SOIL_RANK[i.soil]))
    const warnings: string[] = []
    const tips: string[] = []

    const program = pickProgram(fabrics, washer)

    if (!program) {
      warnings.push(
        `Tu lavarropas no tiene un programa para ${FAMILY_LABEL[family].toLowerCase()}. ` +
          'Lavá estas prendas a mano con agua fría.',
      )
      loads.push({
        id: key,
        title: `${FAMILY_LABEL[family]} · ${COLOR_BUCKET_LABEL[bucket]}`,
        colorGroup: items[0].color,
        garments: items,
        program: {
          id: 'manual',
          name: 'Lavado a mano',
          fabrics: [...fabrics],
          defaultTempC: 20,
          maxTempC: 30,
          maxSpinRpm: 0,
          canDry: false,
        },
        tempC: 20,
        spinRpm: 0,
        canDry: false,
        warnings,
        tips,
      })
      continue
    }

    const tempC = recommendTemp(program, bucket, family, maxSoil)

    // Centrifugado seguro según familia, limitado por el programa y el equipo.
    let spinTarget = program.maxSpinRpm
    if (family === 'delicado' || family === 'lana') spinTarget = Math.min(spinTarget, 400)
    else if (family === 'jean' || family === 'sintetico') spinTarget = Math.min(spinTarget, 800)
    const spinRpm = snapSpin(spinTarget, washer.spinSpeeds)

    const canDry =
      washer.capacityDryKg > 0 && program.canDry && !NO_MACHINE_DRY.has(family)

    // --- Avisos por color (clasificación explícita por color) ---
    if (bucket === 'CLAROS' && colors.has('blancos') && colors.has('claros')) {
      tips.push(
        'Tenés blancos y claros juntos. Para que los blancos no se opaquen, lo ideal es lavarlos en una tanda aparte.',
      )
    }
    if (bucket === 'OSCUROS' || bucket === 'COLOR') {
      tips.push('Lavá del revés y no dejes la ropa mojada amontonada para evitar que destiña.')
    }
    if (colors.has('colores') || family === 'jean') {
      tips.push('Si alguna prenda es nueva o de color fuerte, su primer lavado hacelo solo.')
    }

    // --- Avisos por tela ---
    if (program.notes) tips.push(program.notes)
    if (family === 'delicado') tips.push('Usá una bolsa de lavado para proteger las prendas.')
    if (family === 'lana')
      warnings.push('No secar en secarropas ni centrifugar fuerte: la lana se apelmaza y encoge.')
    if (family === 'jean')
      tips.push('El jean encoge con calor: evitá agua caliente y secado a máquina.')
    if (family === 'deportiva')
      tips.push('Sin suavizante: tapa los poros de la tela técnica. Secar al aire.')

    // --- Aviso de carga del grupo ---
    const groupKg = items.reduce(
      (sum, i) => sum + FABRIC_WEIGHT_KG[i.fabric] * i.qty,
      0,
    )
    if (groupKg > washer.capacityWashKg) {
      warnings.push(
        `Esta tanda pesa ~${groupKg.toFixed(1)} kg y supera los ${washer.capacityWashKg} kg ` +
          'del tambor. Dividila en dos.',
      )
    }

    const totalQty = items.reduce((s, i) => s + i.qty, 0)
    loads.push({
      id: key,
      title: `${FAMILY_LABEL[family]} · ${COLOR_BUCKET_LABEL[bucket]} (${totalQty} ${
        totalQty === 1 ? 'prenda' : 'prendas'
      })`,
      colorGroup: items[0].color,
      garments: items,
      program,
      tempC,
      spinRpm,
      canDry,
      warnings,
      tips,
    })
  }

  // Orden sugerido: primero claros (agua limpia), después color y oscuros,
  // y al final delicados/lana.
  const order: Record<ColorBucket, number> = { CLAROS: 0, COLOR: 1, OSCUROS: 2 }
  const familyOrder: Record<Family, number> = {
    resistente: 0,
    sintetico: 1,
    deportiva: 2,
    jean: 3,
    abrigo: 4,
    delicado: 5,
    lana: 6,
  }
  loads.sort((a, b) => {
    const [fa] = a.id.split('|') as [Family]
    const [fb] = b.id.split('|') as [Family]
    const ca = COLOR_BUCKET[a.colorGroup]
    const cb = COLOR_BUCKET[b.colorGroup]
    return order[ca] - order[cb] || familyOrder[fa] - familyOrder[fb]
  })

  const globalNotes: string[] = []
  const totalKg = garments.reduce(
    (sum, g) => sum + FABRIC_WEIGHT_KG[g.fabric] * g.qty,
    0,
  )
  if (garments.length > 0) {
    globalNotes.push(
      `Carga total estimada: ~${totalKg.toFixed(1)} kg en ${loads.length} ${
        loads.length === 1 ? 'tanda' : 'tandas'
      }.`,
    )
  }
  if (loads.length > 1) {
    globalNotes.push(
      'Orden recomendado: empezá por los blancos/claros y dejá oscuros y delicados para el final.',
    )
  }

  return { loads, globalNotes }
}

export { FABRIC_LABELS, COLOR_LABELS }
