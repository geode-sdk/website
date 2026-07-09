import type { ServerDeveloperProfile } from "$lib/api/models/base";
import { createContext } from "svelte";

const [getUserContextValue, setUserContext] = createContext<() => ServerDeveloperProfile | null>();

export { setUserContext };

export function getUserContext(): ServerDeveloperProfile | null {
    return getUserContextValue()();
}
