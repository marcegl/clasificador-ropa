import { COLOR_LABELS, COLOR_SWATCH, FABRIC_LABELS } from '../data/garments'
import type { Garment } from '../lib/types'

interface Props {
  garments: Garment[]
  onRemove: (id: string) => void
  onClear: () => void
}

export function ColadaList({ garments, onRemove, onClear }: Props) {
  const total = garments.reduce((s, g) => s + g.qty, 0)

  return (
    <section className="card">
      <div className="section-title between">
        <div className="title-left">
          <span className="step-num">3</span>
          <h2>Mi colada</h2>
          <span className="count-pill">{total}</span>
        </div>
        <button type="button" className="btn-ghost" onClick={onClear}>
          Vaciar
        </button>
      </div>

      <ul className="colada-list">
        {garments.map((g) => (
          <li key={g.id} className="colada-item">
            <span
              className="swatch lg"
              style={{ background: COLOR_SWATCH[g.color] }}
              aria-hidden
            />
            <div className="colada-info">
              <span className="g-name">
                {g.name}
                {g.qty > 1 && <span className="qty-badge">×{g.qty}</span>}
                {g.isNew && <span className="tag-new">nueva</span>}
              </span>
              <span className="muted xs">
                {FABRIC_LABELS[g.fabric]} · {COLOR_LABELS[g.color]}
              </span>
            </div>
            <button
              type="button"
              className="btn-x"
              aria-label={`Quitar ${g.name}`}
              onClick={() => onRemove(g.id)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
