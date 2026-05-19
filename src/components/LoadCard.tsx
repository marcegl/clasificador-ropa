import { COLOR_SWATCH } from '../data/garments'
import type { WashLoad } from '../lib/types'

export function LoadCard({ load, index }: { load: WashLoad; index: number }) {
  return (
    <article className="card load">
      <header className="load-head">
        <span className="load-index">Tanda {index + 1}</span>
        <h3>{load.title}</h3>
      </header>

      <div className="load-program">
        <div className="program-main">
          <span className="program-name">{load.program.name}</span>
          <div className="program-stats">
            <span className="stat">
              <strong>{load.tempC}°</strong>
              <small>temperatura</small>
            </span>
            <span className="stat">
              <strong>{load.spinRpm > 0 ? `${load.spinRpm}` : '—'}</strong>
              <small>centrifugado (rpm)</small>
            </span>
            <span className="stat">
              <strong className={load.canDry ? 'ok' : 'no'}>
                {load.canDry ? 'Sí' : 'No'}
              </strong>
              <small>se puede secar</small>
            </span>
          </div>
        </div>
      </div>

      <ul className="load-garments">
        {load.garments.map((g) => (
          <li key={g.id}>
            <span
              className="swatch"
              style={{ background: COLOR_SWATCH[g.color] }}
              aria-hidden
            />
            {g.name}
            {g.qty > 1 && <span className="muted"> ×{g.qty}</span>}
          </li>
        ))}
      </ul>

      {load.warnings.map((w) => (
        <p key={w} className="alert warn">
          ⚠ {w}
        </p>
      ))}
      {load.tips.map((t) => (
        <p key={t} className="alert tip">
          💡 {t}
        </p>
      ))}
    </article>
  )
}
