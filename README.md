# Caixin Kang · Research Studio

A Bauhaus 3D academic homepage with a full illustrated CV, available in English, Chinese, and Japanese. Static HTML, CSS and JavaScript; no build step or remote JavaScript dependencies.

## Preview

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://localhost:4173/. Run `npm run check` to check the JavaScript modules.

## Navigation

- The default view is an interactive 3D studio. Use the directory or select an object to explore the research, profile, news and academic record.
- The Résumé button opens the full illustrated CV. Direct links include `?lang=zh#cv`, `?lang=ja#cv` and `?lang=en#cv/read`.
- Clicking a painting opens the corresponding research direction. Clicking the caption asks for confirmation before opening the original artwork in a new tab.
- Ambient motion, lighting and music have separate controls. The wall clock follows Tokyo time. Music starts after a touch or click; blocked first attempts can retry on later interactions. Loading remains cancellable, and manual pause is respected. The full-length web audio copies raise the quiet opening for small speakers; original recordings remain in audio/.

## GitHub Pages

Serve the `master` branch at the repository root. The committed `.nojekyll` file keeps this a static site, including the locally bundled Three.js modules. The site uses relative asset paths and does not require npm installation or a build.

The homepage entry is `index.html`; the original academic HTML is retained under `academic/`. Existing repository history and legacy source files are preserved.

## Content and credits

- `assets/data.js`, `assets/profile-details.js`, `assets/paper-details.js`: academic content, publication order, authors and illustrations.
- `assets/i18n.js`, `assets/content-translations.js`: language-specific interface and profile text.
- `assets/room.js`, `assets/room-ui.js`, `assets/studio-art.js`: scene, interaction and gallery surfaces.
- `assets/resume-content.js`: illustrated CV shared by the room panels and résumé view.
- `ART-CREDITS.md`, `art-credits.html`, `CREDITS.txt`: artwork and other asset attributions. Font licenses are included in `assets/fonts/`.

After changing Chinese or Japanese text, verify local font coverage. `scripts/subset-fonts.py` rebuilds subsets from the corresponding full Noto fonts using fonttools and brotli. The Japanese supplement and its source record are in `assets/fonts/`; its characters must remain covered if the font configuration changes.

The visitor map is provided by MapMyVisitors and requires access to that external service. The TV globe is decorative, not live visitor data.
