// FIX: Removed the reference to "vite/client" which was causing a "Cannot find type definition file" error.
// The interfaces below manually provide the necessary types for `import.meta.env`, resolving
// potential "Property 'env' does not exist on type 'ImportMeta'" errors.
interface ImportMetaEnv {
    readonly VITE_FIREBASE_API_KEY: string;
    readonly VITE_FIREBASE_AUTH_DOMAIN: string;
    readonly VITE_FIREBASE_PROJECT_ID: string;
    readonly VITE_FIREBASE_STORAGE_BUCKET: string;
    readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
    readonly VITE_FIREBASE_APP_ID: string;
    readonly VITE_FIREBASE_MEASUREMENT_ID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
