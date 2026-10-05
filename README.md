# Yash Web Studio

A warm sand, terracotta, and espresso portfolio with three original working front-end concepts and a linked, printable CV. Plain HTML, CSS, and JavaScript. No build step or application dependencies.

## Run

From this directory:

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/`. Use a local HTTP server rather than double-clicking HTML: the demos use JavaScript modules.

## Check

```powershell
node tests/check.mjs
```

The single check covers stay pricing, real calendar dates, room capacity, cart totals, invalid stored carts, invoice validation, money formatting, record filters, CSV formula protection, and local links/assets.

## Projects

| Project | Path | Working interactions |
| --- | --- | --- |
| Casa Sol | `demos/casa-sol/` | Room details, room selection, validated dates and guest counts, stay estimate |
| Morrow Goods | `demos/morrow/` | Category filtering, price sorting, product details, quantity changes, persistent bag, shipping estimate, order preview |
| Ledger Lane | `demos/ledger-lane/` | Calculated totals, search, month/status filters, invoice creation, marking paid, browser persistence, CSV generation |

These are fictional brands and illustrative datasets. They are not client commissions. No booking, order, invoice delivery, payment, email delivery, authentication service, or backend is connected. The shop and dashboard keep their demo state in the visitor's browser only.

The portfolio brief form prepares a text-file download. It does not send leads anywhere. A verified contact route must be added before client outreach.

## CV status

`cv.html` links to all three working demos and their logic files. `yash-web-developer-cv.pdf` is a one-page CV with verified public project links. It describes original concept work and an AI-assisted workflow, not invented employment or qualifications.

The public GitHub account is `singhyashkumar`; the Fiverr account created by the user is `yashweb_studio`. Yash is the display name. Private contact details, education, and employment history have not been inferred or invented.

## Publish to GitHub Pages without a paid domain

The current package is ready for a public repository. Reuse the user's existing GitHub account and check for an existing portfolio repository before creating anything.

1. Upload the contents of this directory, preserving the `assets/`, `demos/`, and `tests/` folders.
2. For an existing user-site repository, preserve unrelated content. Otherwise use a dedicated new portfolio repository. Do not overwrite an existing user site.
3. In repository Settings → Pages, choose **Deploy from a branch**, `main`, and `/(root)`.
4. Wait for a successful Pages deployment and use the actual URL GitHub reports. Verify the homepage, CV, all three demos, and relative asset links on that URL.
5. Regenerate the PDF using that public base URL; replace the local preview copy. Add only account-verified name and contact details. Upload the updated PDF before submitting it to clients.

GitHub Pages supports public repositories on GitHub Free. A `github.io` address is sufficient for starting. [GitHub Pages quickstart](https://docs.github.com/en/pages/quickstart).

Published and verified: [portfolio](https://singhyashkumar.github.io/yash-web-studio/) and [source repository](https://github.com/singhyashkumar/yash-web-studio). The homepage, HTML CV, three demos, images, and logic files returned successful HTTP responses. A paid domain is not required.

## Review evidence

Browser checks were performed on all five pages at 1440, 768, 390, and 320 pixel widths. The invoice table scrolls within its own panel. Reduced-motion styling disables the portfolio floating animation. Native dialogs provide focus management and Escape-to-close behavior.

The browser checks confirmed three-night stay totals of EUR 594 and EUR 1,056 for the selected rooms; the capacity error; product filters and sorting; a two-cup cart total of USD 65; the USD 120 free-shipping threshold; persistence after reload; dashboard search and filters; invoice date validation; fractional INR display; and paid-status updates. No application console errors were captured in those tested flows.

CSV serialization and formula protection pass the runnable check. The in-app browser did not return a file-download event, and no downloaded CSV was found in the checked local download locations. File download delivery therefore remains unverified in that browser. The same download limitation applies to the brief and order-summary controls until checked in regular Chrome.

## Images and type

Two original photographs were created with built-in image generation and converted to WebP for delivery (approximately 246 KB and 157 KB). No human portrait was generated. Font families are requested from Google Fonts, with system fallbacks.

- `assets/casa-sol.webp`: quiet sunlit boutique coastal retreat with terracotta and peach plaster courtyard arches, a small azure pool, palm shadows and a sandy sea vista; premium editorial architecture photography; no people, text, logos, watermarks, UI, or collage.
- `assets/morrow.webp`: premium pottery still life with a sculptural terracotta jug, cream bowl and rust-glazed cup on sandstone plinths; natural sunlight and subtle shadows; tactile espresso, sand, cream and rust palette; no people, words, logos, watermarks, or UI.

AI assistance is disclosed in the portfolio and CV. Concepts, imagery, sample amounts, and test results are kept separate from any claims about client work.
