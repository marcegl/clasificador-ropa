import { useEffect, useMemo, useRef, useState } from 'react'
import { ColadaList } from './components/ColadaList'
import { GarmentCatalog } from './components/GarmentCatalog'
import { Results } from './components/Results'
import { WasherPicker } from './components/WasherPicker'
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
  const resultsRef = useRef<HTMLDivElement>(null)

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

  const totalPieces = garments.reduce((s, g) => s + g.qty, 0)

  return (
    <div className="app">
      <header className="hero">
        <span className="hero-mark" aria-hidden>
          🧺
        </span>
        <h1>Clasificador de Ropa</h1>
        <p>
          Cargá lo que vas a lavar y te armo las tandas: cómo separar por color
          y tela, y qué programa, temperatura y centrifugado usar.
        </p>
      </header>

      <main>
        <WasherPicker value={washerId} onChange={setWasherId} washer={washer} />

        <GarmentCatalog onAdd={addGarment} />

        {garments.length > 0 && (
          <ColadaList
            garments={garments}
            onRemove={removeGarment}
            onClear={() => setGarments([])}
          />
        )}

        {garments.length > 0 ? (
          <div ref={resultsRef}>
            <Results loads={loads} globalNotes={globalNotes} />
          </div>
        ) : (
          <p className="empty">
            <span aria-hidden>👚</span>
            Agregá prendas desde el catálogo para ver tus tandas.
          </p>
        )}
      </main>

      <footer className="footer">
        <p>
          Open source · Las recomendaciones son una guía: respetá siempre la
          etiqueta de cada prenda.
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

      {garments.length > 0 && (
        <div className="summary-bar">
          <span>
            <strong>{totalPieces}</strong> {totalPieces === 1 ? 'prenda' : 'prendas'}
            <span className="dot">·</span>
            <strong>{loads.length}</strong> {loads.length === 1 ? 'tanda' : 'tandas'}
          </span>
          <button
            onClick={() =>
              resultsRef.current?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            Ver tandas ↓
          </button>
        </div>
      )}
    </div>
  )
}
