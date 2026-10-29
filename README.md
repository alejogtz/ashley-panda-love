# Para Ashley · Panda Love Catcher

Un mini sitio estático para GitHub Pages: atrapá panditas, ositas y corazones para desbloquear mensajes de amor para Ashley.

## Qué incluye

- `index.html` — página principal del juego.
- `styles.css` — estilos responsive, accesibles y sin dependencias externas.
- `script.js` — lógica del mini juego.
- `design/ashley-panda-love/` — tres direcciones visuales usadas como exploración de diseño.

## Ejecutar localmente

Abrí `index.html` directamente en el navegador, o servilo con cualquier servidor estático:

```bash
python3 -m http.server 8000
```

Después entrá a <http://localhost:8000>.

## Publicar en GitHub Pages

1. Creá un repositorio en GitHub, por ejemplo `ashley-panda-love`.
2. Subí estos archivos al repositorio.
3. En GitHub, andá a **Settings → Pages**.
4. En **Build and deployment**, elegí **Deploy from a branch**.
5. Seleccioná la rama `main` y la carpeta `/root`.
6. Guardá. GitHub te va a mostrar la URL pública cuando termine el deploy.

## Personalizar mensajes

Editá el arreglo `loveMessages` en `script.js`. Cada texto nuevo se convierte en una cartita desbloqueable.
