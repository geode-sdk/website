<script lang="ts">
    import Image from "./Image.svelte";
    import modOutlines from "$lib/assets/mod-outlines.svg?raw";
</script>

<div>
    {@html modOutlines}
    <Image name="betteredit-logo" alt="" size="10em"></Image>
    <Image name="mega-hack-logo" alt="" size="10em"></Image>
    <Image name="globed-logo" alt="" size="10em"></Image>
</div>

<style lang="scss">
    div {
        padding: 0.65rem;
        width: 20rem;
        // width: clamp(10rem, 50vw, 20rem);
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    div > :global(svg) {
        position: absolute;
        width: 20rem;
        opacity: 15%;
        overflow: visible;

        & > :global(rect) {
            transform-box: fill-box;
            transform-origin: center;
            animation-name: movey;
            animation-duration: 30s;
            animation-iteration-count: infinite;
            animation-timing-function: linear;
            animation-direction: alternate;
        }
        & > :global(rect):nth-child(even) {
            animation-name: movey-2;
        }
        & > :global(rect):nth-child(1),
        & > :global(rect):nth-child(6) {
            animation-delay: 1s;
        }
        & > :global(rect):nth-child(3),
        & > :global(rect):nth-child(5) {
            animation-name: movey-3;
        }
        & > :global(rect):nth-child(3),
        & > :global(rect):nth-child(4) {
            animation-delay: 2s;
        }
    }
    div > :global(div) {
        width: 10em;
        height: 10em;
        filter: drop-shadow(
            0px 0px 1rem color-mix(in srgb, var(--primary-500) 25%, transparent)
        );

        &:nth-of-type(1) {
            animation: 5s ease-in-out 0s infinite alternate both running
                movey-img-1;
            opacity: 80%;
        }
        &:nth-of-type(2) {
            animation: 7s ease-in-out 0.5s infinite alternate both running
                movey-img-2;
            z-index: 1;
        }
        &:nth-of-type(3) {
            animation: 6s ease-in-out 0.3s infinite alternate both running
                movey-img-3;
            opacity: 80%;
        }
    }
    @keyframes movey {
        0% {
        }
        50% {
            transform: translateY(3em) rotate(45deg) scale(90%);
        }
        100% {
            transform: rotate(90deg);
        }
    }
    @keyframes movey-2 {
        0% {
            transform: translateY(-1em);
        }
        50% {
            transform: rotate(20deg);
        }
        100% {
            transform: translateY(3em) rotate(-5deg) scale(85%);
        }
    }
    @keyframes movey-3 {
        0% {
            transform: translateY(-1em) rotate(-105deg) scale(70%);
        }
        50% {
            transform: rotate(-70deg);
        }
        100% {
            transform: translate(1em, 2em) rotate(-5deg) scale(85%);
        }
    }
    @keyframes movey-img-1 {
        0% {
            transform: translateX(0.5em) rotate(-20deg) scale(80%);
        }
        100% {
            transform: translateX(0.25em) translateY(0.25em) rotate(-25deg)
                scale(70%);
        }
    }
    @keyframes movey-img-2 {
        0% {
            transform: translateY(0em);
        }
        100% {
            transform: translateY(-0.25em) scale(110%);
        }
    }
    @keyframes movey-img-3 {
        0% {
            transform: translateX(-0.5em) rotate(20deg) scale(80%);
        }
        100% {
            transform: translateX(-0.25em) translateY(0.25em) rotate(25deg)
                scale(70%);
        }
    }
</style>
