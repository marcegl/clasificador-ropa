import type { CSSProperties } from 'react'
import { COLOR_SWATCH } from '../data/garments'
import type { WashLoad } from '../lib/types'

export function LoadCard({ load, index }: { load: WashLoad; index: number }) {
  const cardStyle = {
    '--load-color': load.colorHex,
  } as unknown as CSSProperties

  return (
    <article className="card load" style={cardStyle}>
      <header className="load-head">
        <span className="load-index">Tanda {index + 1}</span>
        {load.isFirstWash && <span className="badge-new">🆕 Primer lavado</span>}
      </header>

      <div className="color-banner">
        <span className="color-dot" aria-hidden />
        <div>
          <strong className="color-name">{load.colorBucketLabel}</strong>
          <p className="color-rule">{load.colorRule}</p>
        </div>
      </div>

      <div className="panel">
        <div className="panel-program">
          <small>Programa</small>
          <strong>{load.program.name}</strong>
        </div>
        <div className="panel-stats">
          <div className="stat">
            <strong>{load.tempC}°</strong>
            <small>temp.</small>
          </div>
          <div className="stat">
            <strong>{load.spinRpm > 0 ? load.spinRpm : '—'}</strong>
            <small>rpm</small>
          </div>
          <div className="stat">
            <strong className={load.canDry ? 'ok' : 'no'}>
              {load.canDry ? 'Sí' : 'No'}
            </strong>
            <small>secar</small>
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
          {w}
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
