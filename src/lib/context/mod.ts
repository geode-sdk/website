import type { ServerMod } from "$lib/api/models/mod";
import { createContext } from "svelte";

export const [getModContext, setModContext] = createContext<ServerMod>();
