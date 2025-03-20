/// <reference types="vite/client" />

declare const __APP_NAME__: string;
declare const __APP_VERSION__: string;
declare const __APP_DESCRIPTION__: string;
declare const __BUILD_DATE__: string;

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
