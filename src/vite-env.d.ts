/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_S3_ENDPOINT: string;
  readonly VITE_S3_REGION: string;
  readonly VITE_PUBLIC_BUCKET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
