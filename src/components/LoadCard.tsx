import { COLOR_SWATCH } from '../data/garments'
import type { WashLoad } from '../lib/types'

export function LoadCard({ load, index }: { load: WashLoad; index: number }) {
  return (
    <article
      className="card load"
      style={{ borderLeftColor: load.colorHex, borderLeftWidth: 5 }}
    >
      <header className="load-head">
        <span className="load-index">Tanda {index + 1}</span>
        {load.isFirstWash && <span className="badge-new">🆕 Primer lavado</span>}
      </header>

      <div className="color-banner">
        <span
          className="color-dot"
          style={{ background: load.colorHex }}
          aria-hidden
        />
        <div>
          <strong className="color-name">{load.colorBucketLabel}</strong>
          <p className="color-rule">{load.colorRule}</p>
        </div>
      </div>

      <h3 className="load-title">{load.title}</h3>

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
            {g.isNew && <span className="tag-new">nueva</span>}
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
          {t}
        </p>
      ))}
    </article>
  )
}
