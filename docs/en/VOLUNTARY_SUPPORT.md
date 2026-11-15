# Voluntary support

The Room of Calm and Study remains free and open. If it has been useful and you wish — and are able — you may support it voluntarily by Pix. There is no subscription, reward, exclusive content, or pressure to contribute.

## How it works

- **Support the project** is available in both study modes and in the footer.
- The QR code and Pix payment string are created in the browser; no external QR service receives the key.
- Before confirming, check the recipient name and amount in your banking app.
- The project does not receive transfer confirmations or store donor or banking data.
- Pix goes to the person responsible for the project. It is not a charitable donation, and no tax benefit is promised.

## Cloudflare Pages configuration

Set these build variables and publish a new build to show the QR:

```text
VITE_DONATION_PIX_KEY=public-pix-receiving-key
VITE_DONATION_PIX_NAME=RECIPIENT NAME
VITE_DONATION_PIX_CITY=CITY
```

The recipient name is limited to 25 characters and the city to 15. If values are missing or invalid, the page remains available and explains that Pix is not configured.

Values prefixed with `VITE_` are included in the JavaScript delivered to browsers. They are **not secrets** after publishing. Only use the public Pix destination intended to receive contributions; never put passwords, tokens, or private credentials here.

Support never changes access to content, editorial review, sources, recommendations, or catalog priorities.
