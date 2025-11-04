<script lang="ts">
    import type { ServerModDeveloper } from "$lib/api/models/mod-developer";
    import Link from "./Link.svelte";

    interface Props {
        developer: ServerModDeveloper;
    }

    let { developer }: Props = $props();
</script>

<Link href={`/mods?developer=${developer.username}`} --link-color="var(--accent-300)">
    {developer.display_name}
</Link>
