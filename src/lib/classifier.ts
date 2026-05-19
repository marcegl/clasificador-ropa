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
type ColorBucket = 'BLANCOS' | 'CLAROS' | 'COLOR' | 'OSCUROS'

const COLOR_BUCKET: Record<ColorGroup, ColorBucket> = {
  blancos: 'BLANCOS',
  claros: 'CLAROS',
  colores: 'COLOR',
  oscuros: 'OSCUROS',
  negros: 'OSCUROS',
}

const COLOR_BUCKET_LABEL: Record<ColorBucket, string> = {
  BLANCOS: 'Blancos',
  CLAROS: 'Claros (beige, crema, pastel)',
  COLOR: 'Colores vivos',
  OSCUROS: 'Oscuros y negros',
}

/** Por qué estos colores van juntos / separados. */
const COLOR_BUCKET_RULE: Record<ColorBucket, string> = {
  BLANCOS:
    'Los blancos van solos para no opacarse. Si querés una sola tanda, podés sumarles claros (beige/crema) a 40°.',
  CLAROS:
    'Beige, crema y pastel van juntos. Lejos de colores vivos y oscuros para que no se manchen.',
  COLOR:
    'Colores vivos juntos y del revés. Nunca con blancos ni claros: pueden teñirlos.',
  OSCUROS:
    'Oscuros y negros juntos, del revés y en frío para que no destiñan sobre lo claro.',
}

const COLOR_BUCKET_HEX: Record<ColorBucket, string> = {
  BLANCOS: '#f8fafc',
  CLAROS: '#fde68a',
  COLOR: '#ef4444',
  OSCUROS: '#1e293b',
}

/** El primer lavado se aísla solo para colores vivos y oscuros nuevos. */
function needsFirstWash(bucket: ColorBucket): boolean {
  return bucket === 'COLOR' || bucket === 'OSCUROS'
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
  const esClaro = bucket === 'BLANCOS' || bucket === 'CLAROS'
  if (maxSoil >= 2 && family === 'resistente' && esClaro) {
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
    const bucket = COLOR_BUCKET[g.color]
    // Las prendas de color nuevas se aíslan en su propia tanda de primer lavado.
    const firstWash = !!g.isNew && needsFirstWash(bucket)
    const key = `${FABRIC_FAMILY[g.fabric]}|${bucket}|${firstWash ? 'NEW' : 'STD'}`
    const list = groups.get(key) ?? []
    list.push(g)
    groups.set(key, list)
  }

  const loads: WashLoad[] = []

  for (const [key, items] of groups) {
    const [family, bucket, phase] = key.split('|') as [
      Family,
      ColorBucket,
      'NEW' | 'STD',
    ]
    const isFirstWash = phase === 'NEW'
    const fabrics = new Set<Fabric>(items.map((i) => i.fabric))
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
        title: `${COLOR_BUCKET_LABEL[bucket]} · ${FAMILY_LABEL[family]}`,
        colorGroup: items[0].color,
        colorBucketLabel: COLOR_BUCKET_LABEL[bucket],
        colorRule: COLOR_BUCKET_RULE[bucket],
        colorHex: COLOR_BUCKET_HEX[bucket],
        isFirstWash,
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
    if (isFirstWash) {
      warnings.push(
        '🆕 Primer lavado de prendas nuevas de color: lavalas solas o solo con colores iguales. ' +
          'La tela suelta tinte las primeras veces y puede manchar lo demás.',
      )
      tips.push(
        'Probá si destiñe: humedecé un rincón y pasale un paño blanco. Si lo tiñe, lavala siempre aparte.',
      )
    } else if (bucket === 'COLOR' || bucket === 'OSCUROS') {
      tips.push(
        '⚠️ Del revés y en frío: el calor y el roce hacen que estos colores destiñan sobre otras prendas.',
      )
      tips.push(
        '💡 Si alguna prenda es nueva, marcala como "nueva" para que su primer lavado vaya aparte.',
      )
    }
    if (bucket === 'BLANCOS') {
      tips.push(
        '✅ Blancos solos, sin nada de color. Para mantenerlos blancos podés sumar un blanqueador suave.',
      )
    }
    if (bucket === 'CLAROS') {
      tips.push(
        '✅ Claros (beige, crema, pastel) juntos. Se pueden combinar con blancos a 40° si querés una sola tanda.',
      )
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
    const prendasTxt = `${totalQty} ${totalQty === 1 ? 'prenda' : 'prendas'}`
    const title = isFirstWash
      ? `Primer lavado · ${COLOR_BUCKET_LABEL[bucket]} (${prendasTxt})`
      : `${COLOR_BUCKET_LABEL[bucket]} · ${FAMILY_LABEL[family]} (${prendasTxt})`
    loads.push({
      id: key,
      title,
      colorGroup: items[0].color,
      colorBucketLabel: COLOR_BUCKET_LABEL[bucket],
      colorRule: COLOR_BUCKET_RULE[bucket],
      colorHex: COLOR_BUCKET_HEX[bucket],
      isFirstWash,
      garments: items,
      program,
      tempC,
      spinRpm,
      canDry,
      warnings,
      tips,
    })
  }

  // Orden sugerido: primero blancos (agua limpia), después claros, color y
  // oscuros; las tandas de primer lavado de prendas nuevas, al final.
  const order: Record<ColorBucket, number> = {
    BLANCOS: 0,
    CLAROS: 1,
    COLOR: 2,
    OSCUROS: 3,
  }
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
    const [fa, , pa] = a.id.split('|') as [Family, ColorBucket, string]
    const [fb, , pb] = b.id.split('|') as [Family, ColorBucket, string]
    const firstA = pa === 'NEW' ? 1 : 0
    const firstB = pb === 'NEW' ? 1 : 0
    const ca = COLOR_BUCKET[a.colorGroup]
    const cb = COLOR_BUCKET[b.colorGroup]
    return (
      firstA - firstB ||
      order[ca] - order[cb] ||
      familyOrder[fa] - familyOrder[fb]
    )
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
      'Orden recomendado: blancos → claros → colores → oscuros. Delicados, lana y primer lavado de prendas nuevas, al final.',
    )
  }
  if (loads.some((l) => l.isFirstWash)) {
    globalNotes.push(
      'Hay prendas nuevas de color: las puse en una tanda de "primer lavado" aparte para que no tiñan al resto.',
    )
  }

  return { loads, globalNotes }
}

export { FABRIC_LABELS, COLOR_LABELS }
