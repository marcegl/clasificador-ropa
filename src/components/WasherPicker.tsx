import { WASHERS } from '../data/washers'
import type { WasherProfile } from '../lib/types'

interface Props {
  value: string
  onChange: (id: string) => void
  washer: WasherProfile
}

export function WasherPicker({ value, onChange, washer }: Props) {
  return (
    <section className="card washer">
      <div className="section-title">
        <span className="step-num">1</span>
        <h2>Tu lavarropas</h2>
      </div>

      <label className="config-field">
        <span className="field-label">Modelo</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Elegí tu lavarropas"
        >
          {WASHERS.map((w) => (
            <option key={w.id} value={w.id}>
              {w.label}
            </option>
          ))}
        </select>
      </label>

      <div className="washer-specs">
        <span className="chip">Lava {washer.capacityWashKg} kg</span>
        <span className="chip">
          {washer.capacityDryKg > 0 ? `Seca ${washer.capacityDryKg} kg` : 'Sin secado'}
        </span>
        <span className="chip">{washer.programs.length} programas</span>
        <span className="chip">Hasta {Math.max(...washer.spinSpeeds)} rpm</span>
      </div>

      {washer.disclaimer && <p className="muted xs">ⓘ {washer.disclaimer}</p>}
    </section>
  )
}
