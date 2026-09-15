// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        // interface Locals {}
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }

    interface Window {
        __VM: Array<(admanager: any, scope: any) => void>;
    }

    type Gap = "0" | "tiny" | "small" | "normal" | "large" | "immense";
    type Align = "start" | "center" | "end" | "stretch";
}

export {};
