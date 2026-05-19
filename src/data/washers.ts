import type { WasherProfile } from '../lib/types'

// ---------------------------------------------------------------------------
// Perfiles de lavarropas. Es la parte PARAMETRIZABLE de la app:
// el clasificador solo recomienda programas que existan en el perfil elegido.
//
// Para agregar tu lavarropas: copiá un objeto, cambiá id/brand/model y la
// lista de `programs`. Lo demás (UI y lógica) se adapta solo.
// ---------------------------------------------------------------------------

/**
 * Lavasecarropas LG — referencia del proyecto.
 * LAVA 12 KG / SECA 7 KG · Silver · modelo WD12VVC4S6C.
 *
 * Los valores son una aproximación razonable de los programas típicos de
 * los lavasecarropas LG de carga frontal. Ante la duda, mirá el manual:
 * temperaturas y centrifugado pueden variar según firmware/mercado.
 */
const lgWd12vvc4s6c: WasherProfile = {
  id: 'lg-wd12vvc4s6c',
  brand: 'LG',
  model: 'WD12VVC4S6C',
  label: 'LG Lavasecarropas 12kg/7kg (WD12VVC4S6C)',
  capacityWashKg: 12,
  capacityDryKg: 7,
  spinSpeeds: [0, 400, 600, 800, 1000, 1200, 1400],
  disclaimer:
    'Valores aproximados de los programas LG de carga frontal. Verificá con el manual de tu equipo.',
  programs: [
    {
      id: 'algodon',
      name: 'Algodón',
      fabrics: ['algodon', 'mixto'],
      defaultTempC: 40,
      maxTempC: 95,
      maxSpinRpm: 1400,
      canDry: true,
      notes: 'Para prendas resistentes. Sube la temperatura solo si están muy sucias.',
    },
    {
      id: 'eco-40-60',
      name: 'Algodón Eco 40-60',
      fabrics: ['algodon', 'mixto'],
      defaultTempC: 40,
      maxTempC: 60,
      maxSpinRpm: 1400,
      canDry: true,
      notes: 'Programa eficiente para cargas normales poco sucias.',
    },
    {
      id: 'mixto',
      name: 'Mixto / Uso diario',
      fabrics: ['mixto', 'algodon', 'sintetico'],
      defaultTempC: 40,
      maxTempC: 60,
      maxSpinRpm: 1000,
      canDry: true,
      notes: 'Cargas variadas de uso cotidiano.',
    },
    {
      id: 'sinteticos',
      name: 'Sintéticos',
      fabrics: ['sintetico', 'mixto'],
      defaultTempC: 40,
      maxTempC: 60,
      maxSpinRpm: 800,
      canDry: true,
      notes: 'Poliéster, nylon y mezclas. Centrifugado moderado para evitar arrugas.',
    },
    {
      id: 'ropa-cama',
      name: 'Ropa de cama / Grande',
      fabrics: ['algodon', 'mixto', 'abrigo'],
      defaultTempC: 40,
      maxTempC: 60,
      maxSpinRpm: 1000,
      canDry: true,
      notes: 'Sábanas, acolchados y prendas voluminosas. No sobrecargar el tambor.',
    },
    {
      id: 'antialergico',
      name: 'Antialérgico / Higienizar (vapor)',
      fabrics: ['algodon', 'mixto'],
      defaultTempC: 60,
      maxTempC: 60,
      maxSpinRpm: 1400,
      canDry: true,
      notes: 'Vapor a alta temperatura. Ideal para ropa de bebé o alérgicos. Solo telas resistentes.',
    },
    {
      id: 'deportiva',
      name: 'Ropa deportiva',
      fabrics: ['deportiva', 'sintetico'],
      defaultTempC: 30,
      maxTempC: 40,
      maxSpinRpm: 800,
      canDry: false,
      notes: 'Telas técnicas con elastano. Mejor secar al aire para no dañar la fibra.',
    },
    {
      id: 'oscuro-jean',
      name: 'Ropa oscura / Jean',
      fabrics: ['denim'],
      defaultTempC: 30,
      maxTempC: 40,
      maxSpinRpm: 800,
      canDry: false,
      notes: 'Lavar del revés para conservar el color. Evitar secado a máquina (encoge).',
    },
    {
      id: 'delicados',
      name: 'Delicados',
      fabrics: ['delicado', 'seda'],
      defaultTempC: 30,
      maxTempC: 30,
      maxSpinRpm: 400,
      canDry: false,
      notes: 'Lencería, encajes y prendas con apliques. Usar bolsa de lavado.',
    },
    {
      id: 'lana',
      name: 'Lana',
      fabrics: ['lana'],
      defaultTempC: 30,
      maxTempC: 30,
      maxSpinRpm: 400,
      canDry: false,
      notes: 'Solo lana lavable a máquina. Nunca secar a máquina (apelmaza y encoge).',
    },
    {
      id: 'rapido-30',
      name: 'Rápido 30',
      fabrics: ['mixto', 'sintetico', 'algodon'],
      defaultTempC: 30,
      maxTempC: 40,
      maxSpinRpm: 800,
      canDry: false,
      notes: 'Cargas chicas y poco sucias. No para manchas difíciles.',
    },
  ],
}

/** Lavarropas genérico de carga frontal SIN secarropas. */
const genericFrontLoad: WasherProfile = {
  id: 'generico-frontal',
  brand: 'Genérico',
  model: 'Carga frontal',
  label: 'Lavarropas genérico (carga frontal, sin secado)',
  capacityWashKg: 8,
  capacityDryKg: 0,
  spinSpeeds: [0, 400, 600, 800, 1000, 1200],
  programs: [
    {
      id: 'algodon',
      name: 'Algodón',
      fabrics: ['algodon', 'mixto'],
      defaultTempC: 40,
      maxTempC: 90,
      maxSpinRpm: 1200,
      canDry: false,
    },
    {
      id: 'sinteticos',
      name: 'Sintéticos',
      fabrics: ['sintetico', 'mixto', 'deportiva'],
      defaultTempC: 40,
      maxTempC: 60,
      maxSpinRpm: 800,
      canDry: false,
    },
    {
      id: 'colores',
      name: 'Color / Mixto',
      fabrics: ['mixto', 'algodon', 'denim'],
      defaultTempC: 30,
      maxTempC: 40,
      maxSpinRpm: 1000,
      canDry: false,
    },
    {
      id: 'delicados',
      name: 'Delicados',
      fabrics: ['delicado', 'seda', 'lana'],
      defaultTempC: 30,
      maxTempC: 30,
      maxSpinRpm: 600,
      canDry: false,
      notes: 'Si tu equipo tiene programa de lana específico, usalo para lana.',
    },
    {
      id: 'rapido',
      name: 'Rápido',
      fabrics: ['mixto', 'sintetico', 'algodon'],
      defaultTempC: 30,
      maxTempC: 40,
      maxSpinRpm: 800,
      canDry: false,
    },
  ],
}

/** Lavarropas genérico de carga superior (automático argentino típico). */
const genericTopLoad: WasherProfile = {
  id: 'generico-superior',
  brand: 'Genérico',
  model: 'Carga superior',
  label: 'Lavarropas genérico (carga superior)',
  capacityWashKg: 7,
  capacityDryKg: 0,
  spinSpeeds: [0, 600, 800, 1000],
  programs: [
    {
      id: 'normal',
      name: 'Normal / Algodón',
      fabrics: ['algodon', 'mixto', 'denim'],
      defaultTempC: 30,
      maxTempC: 60,
      maxSpinRpm: 1000,
      canDry: false,
    },
    {
      id: 'sinteticos',
      name: 'Sintéticos',
      fabrics: ['sintetico', 'mixto', 'deportiva'],
      defaultTempC: 30,
      maxTempC: 40,
      maxSpinRpm: 800,
      canDry: false,
    },
    {
      id: 'delicado',
      name: 'Delicado / Suave',
      fabrics: ['delicado', 'seda', 'lana'],
      defaultTempC: 20,
      maxTempC: 30,
      maxSpinRpm: 600,
      canDry: false,
    },
  ],
}

export const WASHERS: WasherProfile[] = [
  lgWd12vvc4s6c,
  genericFrontLoad,
  genericTopLoad,
]

export const DEFAULT_WASHER_ID = lgWd12vvc4s6c.id

export function getWasher(id: string): WasherProfile {
  return WASHERS.find((w) => w.id === id) ?? WASHERS[0]
}
