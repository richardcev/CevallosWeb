# Verificación — segunda iteración visual — 29 de septiembre de 2026

## Resultado

- `npm run build`: correcto; Astro Check sin errores, advertencias ni sugerencias. Salida estática en `dist/`.
- `npm test` contra desarrollo y producción: correcto.
- Anchos revisados: 320, 375, 768, 1024 y 1440 píxeles, sin desbordamiento horizontal.
- axe-core: sin infracciones automatizadas WCAG 2 A/AA y 2.1 AA en los cinco anchos.
- Menú: apertura, cierre con Escape y cierre al elegir un enlace.
- Carrusel: arranque automático, ciclo infinito sobre una pista duplicada, sin botones ni conteo visibles, desplazamiento táctil/trackpad y teclado (flechas, Inicio y Fin) en los cinco anchos. Se pausa con cursor o foco y respeta `prefers-reduced-motion`.
- Botones de texto sin iconos; hero sin fotografía; retrato únicamente en Sobre mí; fotografías y logotipos sin filtros de color.
- Tres imágenes específicas en servicios y la imagen de compras online en público objetivo. Copias locales de los archivos suministrados.
- Acordeón: exclusividad de las seis preguntas y manejo con teclado.
- Una sola etiqueta h1, idioma español, ocho secciones, nueve beneficios y doce tecnologías.
- Imágenes cargadas, enlaces internos válidos, contenido disponible sin JavaScript y sin errores JavaScript ni respuestas HTTP de error en recursos locales.
- Revisión visual mediante capturas de escritorio, tablet y móvil en `test-results/`.
- Fuentes e imágenes locales; fotos responsive optimizadas por Astro entre aproximadamente 10 y 58 kB por variante.
- Paleta visual renovada: blanco, #ccdbdc, #9ad1d4 y #80ced7 en superficies suaves; #007ea7 como acento; #003249 en tipografía y footer. Únicamente el footer tiene fondo oscuro. Los colores naturales de fotografías y marcas se conservan.

Las pruebas automáticas no equivalen a una auditoría manual completa de accesibilidad ni a mediciones de Core Web Vitals con usuarios reales.

## Enlaces externos

Comprobados en la primera iteración mediante solicitudes HTTP siguiendo redirecciones. Esta segunda iteración conserva las mismas URLs:

| Destino | Resultado |
| --- | --- |
| Tres páginas de servicios de Softagile | HTTP 200 |
| Página de contacto de Softagile | HTTP 200 |
| WordPress Ecuador | HTTP 200 |
| WhatsApp del número proporcionado | HTTP 200, redirección a api.whatsapp.com |
| Canal de YouTube proporcionado | HTTP 200 |
| Perfil de LinkedIn proporcionado | HTTP 999: bloquea consultas automatizadas; dirección conservada sin modificar |

Instagram permanece como texto pendiente. Teléfono y correo utilizan `tel:` y `mailto:`.

## Configuración pendiente antes de publicar

Confirmar el dominio y definir `SITE_URL`. El dominio provisional `https://softagile.net` se tomó de los enlaces suministrados, sin asumir que sea el destino definitivo. Esta configuración genera canonical, Open Graph, JSON-LD, robots.txt y sitemap. No se ha publicado el sitio.
