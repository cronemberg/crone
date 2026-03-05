// src/app.d.ts

declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            // ✅ Adicionamos a definição aqui para o TS parar de reclamar
            lang: string;
        }
        // interface PageData {}
        // interface Platform {}
    }
}

export {};