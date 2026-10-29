# Para Ashley · Panda Love Catcher

Un mini sitio estático para GitHub Pages: atrapá panditas, ositas y corazones para desbloquear mensajes de amor para Ashley.

## Qué incluye

- `index.html` — página principal del catcher romántico.
- `styles.css` — estilos del catcher responsive, accesible y sin dependencias externas.
- `script.js` — lógica del catcher.
- `playground.html` — segunda página inspirada más directamente en Poteto: panditas/ositas móviles con cartitas secretas.
- `playground.css` — estilos del jardín fullscreen y personajes volteables.
- `playground.js` — lógica del playground, personaje de la suerte, confetti y replay.
- `design/ashley-panda-love/` — tres direcciones visuales usadas como exploración de diseño.

## Ejecutar localmente

Abrí `index.html` directamente en el navegador, o servilo con cualquier servidor estático:

```bash
python3 -m http.server 8000
```

Después entrá a <http://localhost:8000>.

Páginas disponibles:

- <http://localhost:8000/> — catcher romántico.
- <http://localhost:8000/playground.html> — playground de panditas/ositas con cartitas secretas.

## Publicar en GitHub Pages

1. Creá un repositorio en GitHub, por ejemplo `ashley-panda-love`.
2. Subí estos archivos al repositorio.
3. En GitHub, andá a **Settings → Pages**.
4. En **Build and deployment**, elegí **Deploy from a branch**.
5. Seleccioná la rama `main` y la carpeta `/root`.
6. Guardá. GitHub te va a mostrar la URL pública cuando termine el deploy.

## Personalizar mensajes

Editá el arreglo `loveMessages` en `script.js` para el catcher.

Para la página inspirada en Poteto, editá el arreglo `messages` en `playground.js`. Cada texto corresponde a una pandita/osita del jardín.
