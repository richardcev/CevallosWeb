# Cevallos Web

Página de servicios en español construida con Astro, Tailwind CSS 4 y JavaScript nativo. Segunda iteración visual: fondos blancos y azules suaves, acento #007ea7 y footer #003249. HTML estático, fuentes locales Poppins e Inter, imágenes WebP responsive y componentes reutilizables.

## Ejecutar

Requiere Node.js 22.12 o superior.

```sh
npm ci
npm run dev
```

Abrir http://127.0.0.1:4321.

## Producción

```sh
npm run build
npm run preview
```

La salida estática se genera en `dist/`. Publicar su contenido en el hosting elegido.

**Dominio pendiente de confirmar:** `astro.config.mjs` usa temporalmente `https://softagile.net`, el dominio de los enlaces proporcionados. Antes de publicar, definir `SITE_URL` con el dominio real; controla canonical, Open Graph, datos estructurados, sitemap y robots.txt. En PowerShell:

```powershell
$env:SITE_URL = 'https://tu-dominio.com'
npm run build
```

## Organización

- `src/pages/index.astro`: contenido y composición de la página.
- `src/components/`: navegación móvil, botones de texto, iconos, preguntas frecuentes, carrusel de tecnologías y composición de interfaces del hero.
- `src/data/content.ts`: servicios, beneficios, preguntas frecuentes y enlaces.
- `src/layouts/Layout.astro`: SEO, fuentes y animaciones con movimiento reducido.
- `src/styles/global.css`: paleta, estilos responsive y Tailwind.
- `src/assets/`: fotografía profesional (únicamente en Sobre mí) y cuatro imágenes de servicios y negocios suministradas por el cliente. Se conservan sus colores; Astro genera variantes optimizadas durante el build.
- `public/logo-original.png`: copia intacta del logo suministrado; `logo.webp` y `favicon.png` son derivados optimizados.
- `scripts/prepare-assets.mjs`: regeneración opcional de logo, favicon e imagen social.

## Verificación

Con el servidor de desarrollo o preview activo:

```sh
npm run test
```

Usa Chrome instalado (o `BROWSER_CHANNEL=msedge`) y Playwright con axe-core. Comprueba cinco anchos (320–1440 px), menú móvil, teclado, acordeón exclusivo, avance y extremos del carrusel, imágenes sin filtros, botones sin iconos, enlaces internos, metadatos, errores de recursos y accesibilidad automatizada. Guarda capturas en `test-results/`. `TEST_URL` permite cambiar el servidor de destino.

Los botones de WhatsApp conservan el número indicado. Instagram se presenta como pendiente sin crear un enlace falso. Los enlaces externos abren en una pestaña nueva con `noopener noreferrer`.

El carrusel utiliza archivos SVG a color alojados en `public/technologies/`, sin filtros ni recoloración CSS. Arranca automáticamente al cargar y repite la pista en un ciclo infinito sin mostrar controles ni conteo. Se puede desplazar con gestos táctiles, trackpad o teclado (flechas, Inicio y Fin); se pausa al pasar el cursor o enfocarlo y respeta el movimiento reducido.

No hay analítica, formularios que almacenen datos ni dependencias remotas de fuentes o imágenes en tiempo de ejecución.
