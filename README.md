# 🧺 Clasificador de Ropa

Web open source para **clasificar la ropa antes de lavar** y elegir el
**programa de lavado correcto**. Cargás las prendas (tipo, tela, color y nivel
de suciedad) y la app las agrupa en **tandas compatibles**, separando por
**color** y **tela**, y te dice qué programa, temperatura y centrifugado usar
en tu lavarropas.

🔗 **Demo:** https://marcegl.github.io/clasificador-ropa/

## ¿Qué hace?

- **Clasificación por color** (blancos/claros, colores, oscuros/negros): evita
  que la ropa destiña al mezclar.
- **Clasificación por tela**: agrupa por familia (algodón, sintéticos, jean,
  delicados, lana, etc.) y elige el programa adecuado.
- **Recomendación de modo**: programa, temperatura, centrifugado y si se puede
  secar a máquina, según el lavarropas elegido.
- **Avisos inteligentes**: prendas a lavar aparte, riesgo de encogimiento,
  carga estimada del tambor, orden recomendado de las tandas.
- **Perfiles de lavarropas parametrizables**: el lavarropas de referencia es el
  **LG Lavasecarropas 12 kg / 7 kg (WD12VVC4S6C)**, pero se puede elegir otro o
  agregar el tuyo.

## Lavarropas y parametrización

Los modos de lavado dependen del lavarropas. Cada equipo es un perfil en
[`src/data/washers.ts`](src/data/washers.ts) con su lista de programas
(`fabrics`, `defaultTempC`, `maxTempC`, `maxSpinRpm`, `canDry`). El clasificador
**solo recomienda programas que existan en el perfil elegido**.

Para agregar tu lavarropas:

1. Copiá un objeto `WasherProfile` en `src/data/washers.ts`.
2. Cambiá `id`, `brand`, `model`, capacidades y la lista de `programs`.
3. Agregalo al array `WASHERS`. Aparece automáticamente en el selector.

> Los valores del perfil LG son una aproximación de los programas típicos de
> carga frontal. **Ante la duda, seguí la etiqueta de la prenda y el manual de
> tu equipo.**

## Desarrollo

Requiere Node 18+.

```bash
npm install
npm run dev      # servidor local
npm run build    # build de producción a dist/
npm run preview  # previsualizar el build
```

## Stack

Vite + React + TypeScript. Sin backend: todo corre en el navegador y el estado
se guarda en `localStorage`.

## Deploy

Push a `main` dispara el workflow de GitHub Actions
([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) que publica en
GitHub Pages.

## Contribuir

Es open source (MIT). Se agradecen PRs con:

- Perfiles de más lavarropas.
- Mejoras en las reglas de clasificación.
- Más prendas en los presets.

## Licencia

[MIT](LICENSE)
