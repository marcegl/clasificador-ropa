import { useState } from 'react'
import { COLOR_GUIDE } from '../data/garments'
import type { WashLoad } from '../lib/types'
import { LoadCard } from './LoadCard'

interface Props {
  loads: WashLoad[]
  globalNotes: string[]
}

export function Results({ loads, globalNotes }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <section className="results">
      <div className="section-title between">
        <div className="title-left">
          <span className="step-num">4</span>
          <h2>Tandas recomendadas</h2>
          <span className="count-pill solid">{loads.length}</span>
        </div>
        <button
          type="button"
          className={`why-btn ${open ? 'on' : ''}`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          ¿Cómo agrupé tu ropa? {open ? '▾' : '▸'}
        </button>
      </div>

      {open && (
        <div className="why-panel">
          <p className="why-lead">
            Separo por <strong>tela</strong> (para usar el programa correcto) y
            por <strong>color</strong> (para que nada destiña):
          </p>
          <ul className="guide-list">
            {COLOR_GUIDE.map((g) => (
              <li key={g.text}>
                <span className="guide-icon" aria-hidden>
                  {g.icon}
                </span>
                <span>{g.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {globalNotes.map((n) => (
        <p key={n} className="alert info">
          {n}
        </p>
      ))}

      <div className="loads">
        {loads.map((load, i) => (
          <div
            key={load.id}
            className="reveal"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <LoadCard load={load} index={i} />
          </div>
        ))}
      </div>
    </section>
  )
}
