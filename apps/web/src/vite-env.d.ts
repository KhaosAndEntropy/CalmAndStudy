/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAINTENANCE_MODE?: string;
  readonly VITE_DONATION_PIX_KEY?: string;
  readonly VITE_DONATION_PIX_NAME?: string;
  readonly VITE_DONATION_PIX_CITY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
