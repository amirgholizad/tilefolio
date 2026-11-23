# Contributing

Thanks for helping improve this template. Bug fixes, browser fixes, accessibility improvements and small, well-scoped features are all welcome.

## Ground rules

- **No build step, no dependencies.** The site must keep working when you open `index.html` directly. Please don't add npm packages, bundlers or frameworks.
- **Keep the placeholders.** Anything you commit should use `Your Name`, `example.com`, `you@example.com` and `your-username`. If you're working from your own personalized copy, don't include your real details, photos, resume or social preview image in the pull request.
- **One change per pull request.** Small, focused PRs are much easier to review and merge.
- **Match the existing style.** Plain HTML, CSS and vanilla JavaScript, with 2-space indentation (see `.editorconfig`). Content stays in `content.js`; rendering logic goes in `js/tilefolio.js`.

## Before you open a pull request

Serve the folder locally (`python3 -m http.server 8000`) and check:

- [ ] Chrome, Safari and Firefox on desktop
- [ ] A widescreen and a 4:3 desktop window: the whole tile grid fits on screen without scrolling
- [ ] A portrait phone width (around 375px) and a short landscape screen (430px tall or less). Browser dev tools' device mode is fine.
- [ ] With reduced motion turned on: live tiles stop flipping, tiles don't tilt when pressed, and nothing animates in
- [ ] Keyboard: <kbd>Tab</kbd> reaches every tile, <kbd>Enter</kbd> opens a page, and <kbd>Esc</kbd> closes it with focus back on the tile
- [ ] Deep links: opening `/#projects` directly shows the Projects page, and the browser's Back button closes it
- [ ] No errors in the browser console

For visual changes, add before and after screenshots to the pull request. If the home screen or a page looks different afterwards, update `docs/screenshot.png` or `docs/screenshot-overlay.png` too (1440×900).

## Changing the content format

If you add a tile option or a new overlay block type, document it in the comment at the top of `content.js` and in the README tables, so people can use it without reading the renderer.

- **New block types** go in the `blocks` object in `js/tilefolio.js`, with their styles under a `Block:` section in `css/style.css`.
- **Tile sizes** are defined in two places that must agree: `TILE_CELLS` in `js/tilefolio.js` and the `.tile--*` spans in `css/style.css`.
- **Icons** must come from [Font Awesome Free](https://fontawesome.com/search?o=r&m=free), since that's the set the page loads.

## Reporting bugs and ideas

Use the [issue templates](https://github.com/amirgholizad/tilefolio/issues/new/choose). For bugs, include your browser, device and the steps to reproduce.

## License

By contributing, you agree that your contributions are licensed under the project's [MIT License](LICENSE).
