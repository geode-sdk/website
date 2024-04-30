<script lang="ts">
    const alignment = {
        'left':    'start',
        'center':  'center',
        'right':   'end',
        'stretch': 'stretch',
    }
    export let align: keyof typeof alignment = 'center';
    export let gap: Gap = 'normal';
    export let wrap: boolean = false;
</script>

<div style="--wrap: {wrap ? 'wrap' : 'nowrap'}; --gap: var(--gap-{gap}); --align: {alignment[align]}"><slot/></div>

<style lang="scss">
    div {
        display: flex;
        flex-direction: column;
        flex-wrap: var(--wrap);
        gap: var(--gap);
        align-items: var(--align);
    }
</style>
