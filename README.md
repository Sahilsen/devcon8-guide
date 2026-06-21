# Devcon 8 India — Mumbai Field Guide

An unofficial, single-page **city guide for attendees of Devcon 8** in Mumbai, India.
Built to help people coming from across the city, around India, and the rest of the world land smoothly, get to the venue, eat well on any diet, and explore Maximum City without the rookie mistakes.

**Event:** Devcon 8 · Nov 3–6, 2026 · Jio World Convention Centre, Bandra Kurla Complex (BKC), Mumbai · (just before Diwali on Nov 8).

🔗 **Live site:** https://sahilsen.github.io/devcon8-guide/

> ⚠️ **Unofficial.** This guide is a community project and is **not affiliated with or endorsed by the Ethereum Foundation or Devcon**. Always confirm dates, venue, visa rules, prices, and the official programme on [devcon.org](https://devcon.org/en/).

---

## What's inside

A single scrolling page with nine sections, each place linking straight to Google Maps:

| # | Section | Covers |
|---|---------|--------|
| 01 | **Getting to the venue** | Airport, Metro Line 3, local trains, autos, taxis, ride-hailing, traffic warnings |
| 02 | **Hotels** | In-BKC, Bandra, Andheri and budget options, by price and distance |
| 03 | **Food** | Filterable by **vegetarian, vegan, dairy-free, Jain, kosher, halal, non-veg** (meat type named), with a spice meter |
| 04 | **Water & health** | Tap-water warning, what's safe to drink, tummy kit, pharmacies & hospitals |
| 05 | **SIM, data & money** | eSIM vs local SIM, UPI, cash, ATMs, currency, plugs |
| 06 | **Things to do** | Landmarks, day trips, shopping, Diwali |
| 07 | **Web3 in India** | Crypto tax reality (30% + 1% TDS), meetups, coworking, key safety |
| 08 | **Street smart** | Safety, smoking/drinking/drugs laws, getting around, emergency numbers |
| 09 | **Good to know** | Visa, weather, time zone, language (Hindi & Marathi phrases), etiquette, accessibility |

## Accessibility

Accessibility is built in, not bolted on. A toolbar (bottom-left) offers:

- **Text size** (3 levels)
- **High contrast** mode
- **Underline links** mode
- **Reduce motion** (also auto-detects your OS setting; disables the hero ripple and the ticker)
- **Read aloud** — text-to-speech that reads the guide section by section, highlighting and scrolling as it goes (for blind / low-vision users)

Plus a "skip to content" link, visible keyboard focus, ARIA labels on map links and the spice meters, a real `<main>` landmark, and decorative graphics hidden from screen readers. Preferences are saved per-device.

## Design

Warm, lightweight "earthen" theme (beige + terracotta / ochre / olive), with faint **line-art silhouettes of Mumbai landmarks** behind the content — the Bandra-Worli Sea Link, Gateway of India, Taj Mahal Palace, the Imperial twin towers, Rajabai Clock Tower, and the Municipal (BMC) building. The hero title layers **मुंबई** as a rippling cast shadow behind "Mumbai."

---

## Project structure

```
.
├── index.html     # the entire page (markup + inline landmark SVGs + ripple filter)
├── styles.css     # theme, layout, landmark + accessibility styles
├── app.js         # diet filter, mobile nav, a11y toolbar, read-aloud, ARIA helpers
├── .nojekyll      # tell GitHub Pages to skip Jekyll (plain static site)
├── README.md
└── CONTRIBUTING.md
```

No build step, no dependencies to install. The only external resource is Google Fonts (loaded via CDN).

## Run it locally

Because everything is static, you can just open the file:

```bash
open index.html        # macOS
```

Or serve it (recommended, so relative paths and fonts behave like production):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy (GitHub Pages)

This repo is served by GitHub Pages from the **`main` branch, root folder**. Any push to `main` redeploys automatically within a minute or two.

If you fork it, enable Pages under **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`**.

> Note: `styles.css` and `app.js` are linked with a `?v=N` cache-busting query. Bump that number when you change CSS/JS so returning visitors get the new version (see [CONTRIBUTING.md](CONTRIBUTING.md)).

## Contributing

Found an out-of-date price, a closed restaurant, a better route, or want to add a spot? Contributions are very welcome — see **[CONTRIBUTING.md](CONTRIBUTING.md)** for how the page is structured and how to add cards, links, and landmarks.

## License

Content and code are provided as-is for the community. If you reuse it, please keep the "unofficial / verify the details" disclaimer.
