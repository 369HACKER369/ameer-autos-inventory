// Workaround for dexie.d.ts TS1540 error with 'module' keyword
// This re-exports dexie types without the problematic declaration
declare module 'dexie' {
  export * from 'dexie/dist/dexie';
}
