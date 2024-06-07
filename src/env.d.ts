/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly PASSWORD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}