import '@nubolab-ffwd/svelte-fluent/types';
import { SvelteFluent } from '@nubolab-ffwd/svelte-fluent';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            locales: string[];
            fluent: SvelteFluent;
        }
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }

    type Gap = "0" | "tiny" | "small" | "normal" | "large" | "immense";
    type Align = "start" | "center" | "end" | "stretch";
}

export {};
