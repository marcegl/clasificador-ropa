import { useEffect, useMemo, useState } from 'react'
import { GarmentForm } from './components/GarmentForm'
import { LoadCard } from './components/LoadCard'
import { WasherPicker } from './components/WasherPicker'
import { COLOR_LABELS, COLOR_SWATCH, FABRIC_LABELS } from './data/garments'
import { DEFAULT_WASHER_ID, getWasher } from './data/washers'
import { classify } from './lib/classifier'
import type { Garment } from './lib/types'

const STORAGE_KEY = 'clasificador-ropa:v1'

interface PersistedState {
  washerId: string
  garments: Garment[]
}

function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as PersistedState
  } catch {
    /* ignora storage corrupto */
  }
  return { washerId: DEFAULT_WASHER_ID, garments: [] }
}

const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)

export default function App() {
  const initial = useMemo(loadState, [])
  const [washerId, setWasherId] = useState(initial.washerId)
  const [garments, setGarments] = useState<Garment[]>(initial.garments)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ washerId, garments }))
  }, [washerId, garments])

  const washer = getWasher(washerId)
  const { loads, globalNotes } = useMemo(
    () => classify(garments, washer),
    [garments, washer],
  )

  const addGarment = (g: Omit<Garment, 'id'>) =>
    setGarments((prev) => [...prev, { ...g, id: uid() }])

  const removeGarment = (id: string) =>
    setGarments((prev) => prev.filter((g) => g.id !== id))

  return (
    <div className="app">
      <header className="hero">
        <h1>🧺 Clasificador de Ropa</h1>
        <p>
          Cargá lo que vas a lavar y te armo las tandas: cómo separar por{' '}
          <strong>color</strong> y <strong>tela</strong>, y qué programa,
          temperatura y centrifugado usar.
        </p>
      </header>

      <main>
        <WasherPicker value={washerId} onChange={setWasherId} washer={washer} />

        <GarmentForm onAdd={addGarment} />

        {garments.length > 0 && (
          <section className="card">
            <div className="list-head">
              <h2>Tu ropa ({garments.length})</h2>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setGarments([])}
              >
                Vaciar todo
              </button>
            </div>
            <ul className="garment-list">
              {garments.map((g) => (
                <li key={g.id}>
                  <span
                    className="swatch"
                    style={{ background: COLOR_SWATCH[g.color] }}
                    aria-hidden
                  />
                  <span className="g-name">{g.name}</span>
                  <span className="muted small">
                    {FABRIC_LABELS[g.fabric]} · {COLOR_LABELS[g.color]}
                    {g.qty > 1 ? ` · ×${g.qty}` : ''}
                  </span>
                  <button
                    type="button"
                    className="btn-x"
                    aria-label={`Quitar ${g.name}`}
                    onClick={() => removeGarment(g.id)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {loads.length > 0 && (
          <section className="results">
            <h2>Tandas recomendadas</h2>
            {globalNotes.map((n) => (
              <p key={n} className="alert info">
                {n}
              </p>
            ))}
            <div className="loads">
              {loads.map((load, i) => (
                <LoadCard key={load.id} load={load} index={i} />
              ))}
            </div>
          </section>
        )}

        {garments.length === 0 && (
          <p className="empty">
            Agregá prendas con los botones rápidos o el formulario para ver las
            tandas recomendadas.
          </p>
        )}
      </main>

      <footer className="footer">
        <p>
          Proyecto open source · Las recomendaciones son una guía: respetá
          siempre la etiqueta de cada prenda.
        </p>
        <p>
          <a
            href="https://github.com/marcegl/clasificador-ropa"
            target="_blank"
            rel="noreferrer"
          >
            Código en GitHub
          </a>
        </p>
      </footer>
    </div>
  )
}
