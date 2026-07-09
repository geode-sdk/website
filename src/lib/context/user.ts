import type { ServerDeveloperProfile } from "$lib/api/models/base";
import { createContext } from "svelte";

export const [getUserContext, setUserContext] = createContext<ServerDeveloperProfile | null>();
