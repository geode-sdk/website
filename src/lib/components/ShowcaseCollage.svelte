<script lang="ts">
    import Image from "./Image.svelte";
</script>

<div>
    <Image name="globed-screenshot" alt="" style="glow"></Image>
    <Image name="globed-page" alt="" style="glow"></Image>
</div>

<style lang="scss">
    div {
        padding: 0.65rem;
        height: 20rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        & > :global(*) {
            width: clamp(8rem, 30vw, 13rem);
        }
        & > :global(*:first-child) {
            animation: 7s ease-in-out 0s infinite alternate both running top-img;
            z-index: 1;
        }
        & > :global(*:last-child) {
            animation: 6s ease-in-out 1s infinite alternate both running bottom-img;
        }
    }
    @keyframes top-img {
        0% {
            transform: translate(3em, -2em) scale(200%) rotate(-15deg);
        }
        100% {
            transform: translate(3em, -2em) scale(190%) rotate(-10deg);
        }
    }
    @keyframes bottom-img {
        0% {
            transform: translate(-0.5em, +5em) scale(160%) rotate(10deg);
        }
        100% {
            transform: translate(-0.5em, +5em) scale(140%) rotate(7deg);
        }
    }
</style>
