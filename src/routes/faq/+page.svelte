<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import Column from "$lib/components/Column.svelte";
    import FlyIntoView from "$lib/components/FlyIntoView.svelte";
    import Gap from "$lib/components/Gap.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Image from "$lib/components/Image.svelte";
    import Link from "$lib/components/Link.svelte";
    import Row from "$lib/components/Row.svelte";
    import Waves from "$lib/components/Waves.svelte";

    function convertTitle(title: string): string {
        return title
            .replace(/[^\w\s]/g, "")
            .replace(/\s+/g, "-")
            .toLowerCase();
    }

    const faqs = [
        {
            title: "I can't see the geode button",
            description: "Bla bla troubleshoot stuff",
        },
        {
            title: "How do I change mod settings?",
            description:
                "By going to the mods list, you can click on the view button to open the popup for the mod you want to change settings for. There you will find a button to open the settings dialog, listing all of the mod's settings. If the mod is disabled, some settings might not be available.",
        },
        {
            title: "How do I update mods?",
            description:
                "By going to the mods list, you will see an updates tab. There you can see any pending updates.",
        },
        {
            title: "How do I uninstall mods?",
            description:
                "By going to the mod list, you can click on the view button to open the popup for the mod you want to uninstall. There you will find a button to uninstall the mod.",
        },
        {
            title: "Why can't I find certain mods?",
            description:
                "Despite being a cross-platform mod loader, mods are not always available on all platforms. This means some mods may not be available on your platform.",
        },
    ];
</script>

<Waves type="top" />
<Gap size="large" />

<h1>Frequently Asked Questions</h1>

<Column align="stretch">
    <Column>
        <ul>
            {#each faqs as { title }}
                <li><Link href={"#" + convertTitle(title)}>{title}</Link></li>
            {/each}
        </ul>
    </Column>

    {#each faqs as { title, description }}
        <div>
            <h2 id={convertTitle(title)}>{title}</h2>
            <p>{description}</p>
        </div>
    {/each}
</Column>

<Gap size="normal" />

<style lang="scss">
    h1 {
        margin: 0;
        font-family: var(--font-heading);
        font-weight: 600;
        color: var(--text-50);
        font-size: var(--font-size-title);
    }
</style>
