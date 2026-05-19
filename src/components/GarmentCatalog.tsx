import { useState } from 'react'
import {
  CATEGORY_ICON,
  CATEGORY_ORDER,
  COLOR_EXAMPLES,
  COLOR_LABELS,
  COLOR_SWATCH,
  FABRIC_LABELS,
  GARMENT_CATALOG,
  SOIL_LABELS,
  type CatalogItem,
  type GarmentCategory,
} from '../data/garments'
import type { ColorGroup, Fabric, Garment, Soil } from '../lib/types'

interface Props {
  onAdd: (g: Omit<Garment, 'id'>) => void
}

const COLORS = Object.keys(COLOR_LABELS) as ColorGroup[]
const SOILS = Object.keys(SOIL_LABELS) as Soil[]
const FABRICS = Object.keys(FABRIC_LABELS) as Fabric[]

export function GarmentCatalog({ onAdd }: Props) {
  const [category, setCategory] = useState<GarmentCategory>('Uso diario')
  const [selected, setSelected] = useState<CatalogItem | null>(null)

  // Estado del configurador (lo que no se puede inferir de la prenda).
  const [color, setColor] = useState<ColorGroup>('colores')
  const [soil, setSoil] = useState<Soil>('normal')
  const [qty, setQty] = useState(1)
  const [isNew, setIsNew] = useState(false)
  const [fabric, setFabric] = useState<Fabric>('algodon')
  const [showAdjust, setShowAdjust] = useState(false)

  const open = (item: CatalogItem) => {
    setSelected(item)
    setColor(item.defaultColor)
    setFabric(item.fabric)
    setSoil('normal')
    setQty(1)
    setIsNew(false)
    setShowAdjust(false)
  }

  const confirm = () => {
    if (!selected) return
    onAdd({ name: selected.name, fabric, color, soil, qty, isNew })
    setSelected(null)
  }

  const items = GARMENT_CATALOG.filter((i) => i.category === category)

  return (
    <section className="card">
      <div className="section-title">
        <span className="step-num">2</span>
        <h2>Agregá tu ropa</h2>
      </div>
      <p className="muted small section-sub">
        Elegí la prenda. La tela la deduzco sola; vos solo decime el color.
      </p>

      <div className="cat-tabs" role="tablist">
        {CATEGORY_ORDER.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={category === c}
            className={`cat-tab ${category === c ? 'active' : ''}`}
            onClick={() => setCategory(c)}
          >
            <span aria-hidden>{CATEGORY_ICON[c]}</span> {c}
          </button>
        ))}
      </div>

      <div className="garment-grid">
        {items.map((item) => (
          <button
            key={item.name}
            className={`garment-chip ${selected?.name === item.name ? 'picked' : ''}`}
            onClick={() => open(item)}
          >
            <span className="garment-icon" aria-hidden>
              {item.icon}
            </span>
            <span>{item.name}</span>
          </button>
        ))}
      </div>

      {selected && (
        <div className="configurator" role="group" aria-label={`Configurar ${selected.name}`}>
          <div className="config-head">
            <span className="garment-icon big" aria-hidden>
              {selected.icon}
            </span>
            <div>
              <strong>{selected.name}</strong>
              <p className="muted small">Tela: {FABRIC_LABELS[fabric]}</p>
            </div>
            <button
              className="btn-x"
              aria-label="Cancelar"
              onClick={() => setSelected(null)}
            >
              ✕
            </button>
          </div>

          <div className="config-field">
            <span className="field-label">Color</span>
            <div className="swatches">
              {COLORS.map((c) => (
                <button
                  key={c}
                  className={`swatch-btn ${color === c ? 'on' : ''}`}
                  onClick={() => setColor(c)}
                  title={COLOR_EXAMPLES[c]}
                  aria-pressed={color === c}
                >
                  <span
                    className="swatch-color"
                    style={{ background: COLOR_SWATCH[c] }}
                    aria-hidden
                  />
                  <span className="swatch-name">{COLOR_LABELS[c]}</span>
                </button>
              ))}
            </div>
            <p className="muted xs">{COLOR_EXAMPLES[color]}</p>
          </div>

          <div className="config-row">
            <div className="config-field">
              <span className="field-label">Suciedad</span>
              <div className="segmented">
                {SOILS.map((s) => (
                  <button
                    key={s}
                    className={`seg ${soil === s ? 'on' : ''}`}
                    onClick={() => setSoil(s)}
                    aria-pressed={soil === s}
                  >
                    {SOIL_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>

            <div className="config-field">
              <span className="field-label">Cantidad</span>
              <div className="stepper">
                <button
                  aria-label="Menos"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span>{qty}</span>
                <button
                  aria-label="Más"
                  onClick={() => setQty((q) => Math.min(50, q + 1))}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <button
            className={`pill-toggle ${isNew ? 'on' : ''}`}
            onClick={() => setIsNew((v) => !v)}
            aria-pressed={isNew}
          >
            🆕 Es nueva
            <span className="muted xs"> · 1er lavado aparte si es de color</span>
          </button>

          <button
            className="adjust-toggle"
            onClick={() => setShowAdjust((v) => !v)}
          >
            {showAdjust ? '▾' : '▸'} Ajustes (cambiar tela)
          </button>
          {showAdjust && (
            <label className="config-field">
              <span className="field-label">Tela</span>
              <select
                value={fabric}
                onChange={(e) => setFabric(e.target.value as Fabric)}
              >
                {FABRICS.map((f) => (
                  <option key={f} value={f}>
                    {FABRIC_LABELS[f]}
                  </option>
                ))}
              </select>
            </label>
          )}

          <button className="btn-primary" onClick={confirm}>
            Agregar a la colada
          </button>
        </div>
      )}
    </section>
  )
}
