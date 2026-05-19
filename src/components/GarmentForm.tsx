import { useState } from 'react'
import {
  COLOR_LABELS,
  FABRIC_LABELS,
  GARMENT_PRESETS,
  SOIL_LABELS,
} from '../data/garments'
import type { ColorGroup, Fabric, Garment, Soil } from '../lib/types'

interface Props {
  onAdd: (g: Omit<Garment, 'id'>) => void
}

const FABRICS = Object.keys(FABRIC_LABELS) as Fabric[]
const COLORS = Object.keys(COLOR_LABELS) as ColorGroup[]
const SOILS = Object.keys(SOIL_LABELS) as Soil[]

export function GarmentForm({ onAdd }: Props) {
  const [name, setName] = useState('')
  const [fabric, setFabric] = useState<Fabric>('algodon')
  const [color, setColor] = useState<ColorGroup>('colores')
  const [soil, setSoil] = useState<Soil>('normal')
  const [qty, setQty] = useState(1)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({ name: name.trim() || 'Prenda', fabric, color, soil, qty })
    setName('')
    setQty(1)
  }

  return (
    <section className="card">
      <h2>Agregá tu ropa</h2>

      <div className="presets">
        {GARMENT_PRESETS.map((p) => (
          <button
            key={p.name}
            type="button"
            className="preset"
            onClick={() =>
              onAdd({
                name: p.name,
                fabric: p.fabric,
                color: p.color,
                soil: 'normal',
                qty: 1,
              })
            }
          >
            + {p.name}
          </button>
        ))}
      </div>

      <form className="garment-form" onSubmit={submit}>
        <label className="field">
          <span className="field-label">Prenda</span>
          <input
            type="text"
            value={name}
            placeholder="Ej: Remera de algodón"
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="field">
          <span className="field-label">Tela</span>
          <select value={fabric} onChange={(e) => setFabric(e.target.value as Fabric)}>
            {FABRICS.map((f) => (
              <option key={f} value={f}>
                {FABRIC_LABELS[f]}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field-label">Color</span>
          <select value={color} onChange={(e) => setColor(e.target.value as ColorGroup)}>
            {COLORS.map((c) => (
              <option key={c} value={c}>
                {COLOR_LABELS[c]}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field-label">Suciedad</span>
          <select value={soil} onChange={(e) => setSoil(e.target.value as Soil)}>
            {SOILS.map((s) => (
              <option key={s} value={s}>
                {SOIL_LABELS[s]}
              </option>
            ))}
          </select>
        </label>

        <label className="field qty">
          <span className="field-label">Cantidad</span>
          <input
            type="number"
            min={1}
            max={50}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
          />
        </label>

        <button type="submit" className="btn-primary">
          Agregar
        </button>
      </form>
    </section>
  )
}
