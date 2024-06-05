<script lang="ts">
    export let size: 'small' | 'normal' = 'normal';
</script>

<span class={size}></span>

<style lang="scss">
    span {
        border: 0px solid var(--text-50);
        border-bottom-color: transparent;
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
        &.small {
            width: 1.5rem;
            height: 1.5rem;
            border-width: .2rem;
        }
        &.normal {
            width: 3rem;
            height: 3rem;
            border-width: .4rem;
        }
    }
    @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
