# Stripe Catalog Reference (LIVE mode — account: Insanely Wicked Web)

Created 2026-08-20 via Stripe MCP. All prices one-time USD.

## Products & prices
| Product | Price | Product ID | Price ID |
|---|---|---|---|
| Complete Business Mastery + Resource Pack | $47 | prod_V6ki48HpJBASqY | price_1U6XCvEUuXAf9uyBHh5EoJKE |
| From Zero to Online Income + Workbook | $17 | prod_V6kiAxwqTRXWag | price_1U6XDIEUuXAf9uyBpfAbs4CM |
| Stuck No More | $19 | prod_V6kiRNw6EXkYUk | price_1U6XDMEUuXAf9uyBdxhZeLkY |
| The Digital Tapestry | $19 | prod_V6kio3SIdZg2GS | price_1U6XDQEUuXAf9uyBlPcvw5Sa |
| Penny's Piggy Bank (ebook + audiobook) | $12 | prod_V6kjNuChycZdvM | price_1U6XDaEUuXAf9uyBqqKjiHko |
| Princess Penny's Problem-Solving Party | $12 | prod_V6kjOVVzHy3blK | price_1U6XE0EUuXAf9uyBFrzhlzwx |
| The Business Starter Stack | $54 | prod_V6kjPh8G879SLV | price_1U6XE4EUuXAf9uyBM5XrwegN |
| The Clear Head Stack | $29 | prod_V6kjEoDKHt64B2 | price_1U6XECEUuXAf9uyByuv6olTX |
| Penny's Story Stack | $19 | prod_V6kjaLlL4Ohz0q | price_1U6XEGEUuXAf9uyBGxLCG7vT |
| The Everything Stack | $79 | prod_V6kkMmzUsYnGx6 | price_1U6XEWEUuXAf9uyBy4cuRexQ |
| DoodleAI | $97 | prod_V6kkHwIFxJ27qm | price_1U6XEcEUuXAf9uyBJU83rfx8 |

## Live promotion codes
| Code | Discount | Restricted to |
|---|---|---|
| SAVE25 | $25 off → $72 | DoodleAI only |
| DOODLE48 | $48 off → $49 (exit offer; license floor — never lower) | DoodleAI only |
| MASTERY10 | $10 off → $37 (exit offer) | Complete Business Mastery only |
| STACK10 | 10% off (exit offer) | All Wicked Stacks products (not DoodleAI) |

## Payment links — PENDING account activation
Live payment links can't be created until Stripe account activation is
complete (business profile + bank account at dashboard.stripe.com).
Once activated: create one payment link per price above with
`allow_promotion_codes: true` and a hosted-confirmation message pointing
buyers to their email, then paste each URL into `buyUrl` in
`src/products.ts`.
