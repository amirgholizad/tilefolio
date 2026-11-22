/**
 * Tilefolio renderer.
 * Builds the header, tile grid and overlays from window.TILEFOLIO (content.js).
 * You shouldn't need to edit this file to customize your site.
 */
(function () {
  "use strict";

  const config = window.TILEFOLIO;
  if (!config) {
    console.error("Tilefolio: window.TILEFOLIO is missing. Make sure content.js loads before js/tilefolio.js.");
    return;
  }

  const tiles = Array.isArray(config.tiles) ? config.tiles : [];
  const overlayTiles = new Map();
  // Grid cells each tile size covers (a small tile is one cell).
  const TILE_CELLS = { small: 1, medium: 4, wide: 8, large: 16 };
  const TILE_SIZES = Object.keys(TILE_CELLS);
  const PROFILE_CELLS = 12; // the profile block is 6x2, see .profile in style.css
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const byId = (id) => document.getElementById(id);
  const overlay = byId("overlay");
  const panel = byId("overlay-panel");
  const content = byId("overlay-content");
  const tileNav = byId("tiles");
  const grid = byId("start"); // the grid that holds the profile and the tiles
  const home = document.querySelector(".home");
  // Made inert while an overlay is open, so focus stays in the dialog.
  const background = [home];

  /* ---------------------------------------------------------------------------
     DOM helpers
     ------------------------------------------------------------------------ */

  // el("a", { class: "x", href: "/", style: { "--accent": "red" } }, [child, "text"])
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs || {})) {
      if (value == null || value === false) continue;
      if (key === "class") node.className = value;
      else if (key === "text") node.textContent = value;
      else if (key === "style") {
        for (const [prop, val] of Object.entries(value)) {
          if (val != null && val !== "") node.style.setProperty(prop, val);
        }
      } else node.setAttribute(key, value === true ? "" : value);
    }
    for (const child of [].concat(children == null ? [] : children)) {
      if (child == null || child === false || child === "") continue;
      node.append(child);
    }
    return node;
  }

  const icon = (classes) => (classes ? el("i", { class: classes, "aria-hidden": "true" }) : null);

  const isExternal = (url) => /^https?:\/\//i.test(url);
  const isMailOrPhone = (url) => /^(mailto|tel):/i.test(url);

  function linkAttrs(url) {
    return isExternal(url) ? { href: url, target: "_blank", rel: "noopener noreferrer" } : { href: url };
  }

  function renderLink(link, className) {
    if (!link || !link.url) return null;
    return el("a", { class: className, ...linkAttrs(link.url), text: link.label || link.url });
  }

  /* ---------------------------------------------------------------------------
     Overlay blocks
     ------------------------------------------------------------------------ */

  const blocks = {
    text(block) {
      const image = block.image;
      return el("div", { class: "block block-text" + (image ? " has-image" : "") }, [
        el("div", { class: "block-text-body" }, (block.paragraphs || []).map((p) => el("p", { text: p }))),
        image &&
          el("figure", { class: "block-text-figure" }, [
            el("img", { src: image.src, alt: image.alt || "", loading: "lazy" }),
            image.caption && el("figcaption", { text: image.caption }),
          ]),
      ]);
    },

    cards(block) {
      const items = block.items || [];
      const columns = Math.min(Math.max(block.columns || items.length || 1, 1), 3);
      return el(
        "div",
        { class: "block block-cards", style: { "--columns": String(columns) } },
        items.map((item) => {
          const link = item.link && item.link.url ? item.link : null;
          const children = [
            item.icon && el("span", { class: "card-icon" }, [icon(item.icon)]),
            el("div", { class: "card-body" }, [
              el("h3", { class: "card-title", text: item.title }),
              item.text && el("p", { class: "card-text", text: item.text }),
              link && el("span", { class: "card-link", text: link.label || link.url }),
            ]),
          ];
          // A linked item is one big tappable row, like a Windows Phone list.
          return link
            ? el("a", { class: "card", ...linkAttrs(link.url) }, children)
            : el("div", { class: "card" }, children);
        })
      );
    },

    badges(block) {
      return el(
        "div",
        { class: "block block-badges" },
        (block.groups || []).map((group) =>
          el("section", { class: "badge-group" }, [
            group.title && el("h3", { class: "badge-group-title", text: group.title }),
            el("ul", { class: "badge-list" }, (group.items || []).map((name) => el("li", { class: "badge", text: name }))),
          ])
        )
      );
    },

    projects(block) {
      const layout = block.layout === "grid" ? "grid" : "rows";
      return el(
        "div",
        { class: "block block-projects block-projects--" + layout },
        (block.items || []).map((item) => {
          let media = null;
          if (item.video) {
            media = el("iframe", {
              class: "project-media",
              src: item.video,
              title: item.title,
              loading: "lazy",
              allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
              allowfullscreen: true,
            });
          } else if (item.image) {
            media = el("img", { class: "project-media", src: item.image, alt: "", loading: "lazy" });
          }
          const tech = Array.isArray(item.tech) && item.tech.length ? item.tech.join(" · ") : null;
          const link = item.link && item.link.url ? item.link : null;
          // Grid items with a link (and no video player inside) are fully clickable.
          const wholeLink = layout === "grid" && link && !item.video;
          const body = el("div", { class: "project-body" }, [
            el("h3", { class: "project-title", text: item.title }),
            item.description && el("p", { class: "project-description", text: item.description }),
            tech && el("p", { class: "project-tech", text: tech }),
            wholeLink
              ? el("span", { class: "project-link", text: link.label || link.url })
              : renderLink(link, "project-link"),
          ]);
          const className = "project" + (media ? " has-media" : "");
          return wholeLink
            ? el("a", { class: className, ...linkAttrs(link.url) }, [media, body])
            : el("article", { class: className }, [media, body]);
        })
      );
    },
  };

  function renderOverlayContent(tile) {
    const nodes = [el("h2", { class: "overlay-title", id: "overlay-title", text: tile.overlay.title || tile.title })];
    for (const block of tile.overlay.blocks || []) {
      const render = blocks[block.type];
      if (render) nodes.push(render(block));
      else console.warn(`Tilefolio: unknown block type "${block.type}" in tile "${tile.id}".`);
    }
    // --i staggers the slide-in animation of each block.
    nodes.forEach((node, i) => node.style.setProperty("--i", String(i)));
    return nodes;
  }

  /* ---------------------------------------------------------------------------
     Page: header, tiles, footer
     ------------------------------------------------------------------------ */

  function renderProfile(profile) {
    byId("profile-name").textContent = profile.name || "";
    byId("profile-tagline").textContent = profile.tagline || "";

    byId("overlay-app-title").textContent = profile.name || "";

    const avatar = byId("profile-avatar");
    if (profile.avatar) avatar.src = profile.avatar;
    else avatar.remove();

    const socials = profile.socials || [];
    if (!socials.length) {
      byId("socials").remove();
      return;
    }
    byId("socials").replaceChildren(
      ...socials.map((social) =>
        el("a", { class: "social-link", ...linkAttrs(social.url), "aria-label": social.label, title: social.label }, [
          icon(social.icon),
        ])
      )
    );
  }

  function tileSize(tile) {
    if (!tile.size) return "medium";
    if (TILE_SIZES.includes(tile.size)) return tile.size;
    console.warn(`Tilefolio: tile "${tile.id}" has unknown size "${tile.size}". Use one of: ${TILE_SIZES.join(", ")}.`);
    return "medium";
  }

  function renderTile(tile, index, size) {
    const isLink = Boolean(tile.href);
    // Live tiles flip to show the subtitle. Small tiles are icon-only.
    const hasBack = Boolean(tile.subtitle) && size !== "small";
    let attrs;
    if (!isLink) attrs = { href: "#" + encodeURIComponent(tile.id), "aria-haspopup": "dialog" };
    else if (isMailOrPhone(tile.href)) attrs = { href: tile.href };
    else attrs = { href: tile.href, target: "_blank", rel: "noopener noreferrer" };

    return el(
      "a",
      {
        class: `tile tile--${size}` + (hasBack ? " has-back" : ""),
        "data-tile": tile.id,
        title: size === "small" ? tile.title : null,
        draggable: "false",
        style: { "--tile-color": tile.color, "--i": String(Math.min(index, 14)) },
        ...attrs,
      },
      [
        el("div", { class: "tile-label" }, [
          el("h2", { class: "tile-title", text: tile.title }),
          isLink && attrs.target && el("span", { class: "tile-external", "aria-hidden": "true", text: "↗" }),
        ]),
        el("div", { class: "tile-faces" }, [
          el("div", { class: "tile-face tile-face--front" }, [icon(tile.icon && "tile-icon " + tile.icon)]),
          hasBack &&
            el("div", { class: "tile-face tile-face--back" }, [el("p", { class: "tile-subtitle", text: tile.subtitle })]),
        ]),
      ]
    );
  }

  let usedCells = PROFILE_CELLS;

  function renderTiles() {
    const seen = new Set();
    const nodes = [];
    for (const tile of tiles) {
      if (!tile.id) {
        console.warn("Tilefolio: skipping a tile without an `id`.", tile);
        continue;
      }
      if (seen.has(tile.id)) console.warn(`Tilefolio: duplicate tile id "${tile.id}".`);
      seen.add(tile.id);

      if (tile.overlay) overlayTiles.set(tile.id, tile);
      else if (!tile.href) console.warn(`Tilefolio: tile "${tile.id}" has neither \`overlay\` nor \`href\`.`);

      const size = tileSize(tile);
      usedCells += TILE_CELLS[size];
      nodes.push(renderTile(tile, nodes.length + 1, size)); // index 0 is the profile
    }
    tileNav.replaceChildren(...nodes);
  }

  function renderFooter(text) {
    const footer = byId("footer-text");
    if (text) footer.textContent = text.replace("{year}", String(new Date().getFullYear()));
    else footer.remove();
  }

  /* ---------------------------------------------------------------------------
     Tile sizing
     One grid cell (a "small" tile) is --tile-unit pixels square.
     Fitting (desktop, tablets): try each column count, and keep the one that
     gives the biggest tiles while the whole grid fits on screen. Wide screens
     get more columns, tall screens fewer, so little space goes unused.
     Scrolling (phones, short screens): --cols comes from the CSS and the grid
     fills the width.
     ------------------------------------------------------------------------ */

  const FIT_COLUMNS = [6, 8, 10, 12];
  const MIN_UNIT = 56; // below this, stop shrinking and let the grid scroll
  const MAX_UNIT = 240; // keeps tiles from getting huge on very large monitors

  const px = (value) => parseFloat(value) || 0;

  // How many rows the grid needs with `cols` columns. This depends only on the
  // column count and tile sizes, not on the unit, so it can be measured first.
  function countRows(cols) {
    grid.style.setProperty("--cols", String(cols));
    const tracks = getComputedStyle(grid).gridTemplateRows;
    return tracks === "none" ? 0 : tracks.split(" ").length;
  }

  function layoutTiles() {
    const homeStyle = getComputedStyle(home);
    const gap = px(getComputedStyle(grid).columnGap);
    const width = home.clientWidth - px(homeStyle.paddingLeft) - px(homeStyle.paddingRight);
    const height = home.clientHeight - px(homeStyle.paddingTop) - px(homeStyle.paddingBottom);
    const unitFor = (cols) => (width - (cols - 1) * gap) / cols;
    let best = null;

    if (homeStyle.getPropertyValue("--fit").trim() === "1") {
      for (const cols of FIT_COLUMNS) {
        const rows = countRows(cols);
        if (!rows) continue;
        const byHeight = Math.max((height - (rows - 1) * gap) / rows, MIN_UNIT);
        const unit = Math.min(unitFor(cols), byHeight, MAX_UNIT);
        // Gaps inside the grid count against a layout, so a column count that
        // leaves holes needs noticeably bigger tiles to win.
        const score = unit * Math.sqrt(Math.min(usedCells / (cols * rows), 1));
        if (!best || score > best.score + 0.5) best = { cols, unit, score };
      }
    }

    if (best) {
      grid.style.setProperty("--cols", String(best.cols));
    } else {
      grid.style.removeProperty("--cols");
      const cols = parseInt(getComputedStyle(grid).getPropertyValue("--cols"), 10) || 6;
      best = { cols, unit: Math.min(unitFor(cols), MAX_UNIT) };
    }

    const unit = Math.max(Math.floor(best.unit), 1);
    const root = document.documentElement.style;
    root.setProperty("--tile-unit", unit + "px");
    root.setProperty("--grid-width", best.cols * unit + (best.cols - 1) * gap + "px");
  }

  let layoutQueued = false;
  function queueLayout() {
    if (layoutQueued) return;
    layoutQueued = true;
    requestAnimationFrame(() => {
      layoutQueued = false;
      layoutTiles();
    });
  }

  /* ---------------------------------------------------------------------------
     Live tiles: every few seconds a random tile flips to show its subtitle.
     ------------------------------------------------------------------------ */

  function startLiveTiles() {
    const liveTiles = [...tileNav.querySelectorAll(".tile.has-back")];
    if (!liveTiles.length) return;

    setInterval(() => {
      if (reducedMotion.matches || document.hidden || currentId) return;
      const idle = liveTiles.filter((tile) => !tile.classList.contains("is-flipped"));
      if (!idle.length) return;
      const tile = idle[Math.floor(Math.random() * idle.length)];
      tile.classList.add("is-flipped");
      setTimeout(() => tile.classList.remove("is-flipped"), 3500 + Math.random() * 2500);
    }, 2800);
  }

  /* ---------------------------------------------------------------------------
     Tilt: pressing a tile pushes it in toward the pointer, like Windows Phone.
     ------------------------------------------------------------------------ */

  const TILT_DEGREES = 8;

  function tiltOnPress(event) {
    if (event.button !== 0 || reducedMotion.matches) return;
    const target = event.target.closest(".tile, a.card, a.project");
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1; // -1 (left) to 1 (right)
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1; // -1 (top) to 1 (bottom)
    const perspective = Math.round(Math.max(rect.width, rect.height) * 3);
    target.style.transform =
      `perspective(${perspective}px) rotateX(${(-y * TILT_DEGREES).toFixed(2)}deg) ` +
      `rotateY(${(x * TILT_DEGREES).toFixed(2)}deg) scale(0.97)`;

    const release = () => {
      target.style.transform = "";
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      target.removeEventListener("pointerleave", release);
    };
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    target.addEventListener("pointerleave", release);
  }

  /* ---------------------------------------------------------------------------
     Overlay + hash routing
     Tiles are plain links to "#id", so overlays are deep-linkable, open in a
     new tab with cmd/ctrl-click, and close with the browser's Back button.
     ------------------------------------------------------------------------ */

  let currentId = null;
  // True when the overlay was opened by in-page navigation, meaning there is a
  // history entry behind it that "close" can go back to.
  let canGoBack = false;

  function openOverlay(id) {
    const tile = overlayTiles.get(id);
    if (!tile || currentId === id) return;

    currentId = id;
    content.replaceChildren(...renderOverlayContent(tile));
    panel.style.setProperty("--accent", tile.color || "");
    panel.scrollTop = 0;
    overlay.hidden = false;
    document.body.classList.add("overlay-open");
    background.forEach((region) => region && (region.inert = true));
    panel.focus();
  }

  function closeOverlay() {
    if (!currentId) return;
    const tileLink = tileNav.querySelector(`[data-tile="${CSS.escape(currentId)}"]`);

    currentId = null;
    overlay.hidden = true;
    content.replaceChildren(); // also stops any playing video
    document.body.classList.remove("overlay-open");
    background.forEach((region) => region && (region.inert = false));
    if (tileLink) tileLink.focus({ preventScroll: true });
  }

  function requestClose() {
    if (!currentId) return;
    const goBack = canGoBack;
    closeOverlay();
    if (goBack) history.back();
    else history.replaceState(null, "", location.pathname + location.search);
  }

  function route() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (overlayTiles.has(id)) openOverlay(id);
    else closeOverlay();
  }

  /* ---------------------------------------------------------------------------
     Init
     ------------------------------------------------------------------------ */

  renderProfile(config.profile || {});
  renderTiles();
  renderFooter(config.footer);
  layoutTiles();
  new ResizeObserver(queueLayout).observe(home);
  startLiveTiles();
  document.addEventListener("pointerdown", tiltOnPress);

  overlay.addEventListener("click", (event) => {
    if (event.target.closest("[data-close]")) requestClose();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && currentId) requestClose();
  });

  window.addEventListener("hashchange", () => {
    canGoBack = true;
    route();
  });

  route();
})();
