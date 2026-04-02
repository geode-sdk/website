<script lang="ts">
    import Soggy from "$lib/assets/soggy.png";
    import Sogged from "$lib/assets/sogged.png";
    import Sapphire from "$lib/assets/sapphire.png";

    import Gap from "$lib/components/Gap.svelte";
</script>

<svelte:head>
    <title>Activation | Sapphire</title>
    <meta name="description" content="Activate Sapphire" />
    <meta name="og:image" content={Sapphire} />
</svelte:head>

<Gap size="normal" />

<main>
    <h1>Activate <span class="sapphire-text">Sapphire Pro</span></h1>
    <div class="card">
        <p>
            Thank you for your interest in acquiring a <em>Sapphire Pro</em> license. <br />
            However, we have just received the unfortunate news that
        </p>
        <div class="soggy-img-container">
            <img src={Sogged} alt="you just got sogged!" class="overlay" />
            <img src={Soggy} alt="(soggy cat)" />
        </div>
        <p>
            Happy April Fools :)
        </p>
    </div>
</main>

<style>
    main {
        text-align: center;
    }

    .sapphire-text {
        background: linear-gradient(270deg,rgba(76, 199, 199, 1) 0%, rgba(83, 203, 224, 1) 33%, rgb(101, 168, 232) 66%, rgb(152, 154, 241) 100%);
        background-clip: text;
        color: transparent;
    }

    .card {
        margin-top: 2em;

        display: flex;
        flex-direction: column;
        align-items: center;

        gap: 1em;

        padding: 1em;
        padding-top: 2em;
    }

    .soggy-img-container {
        position: relative;
    }

    .soggy-img-container img {
        width: 15rem;
        border-radius: 0.25rem;
    }

    .soggy-img-container .overlay {
        position: absolute;
        z-index: 10;
    }

    h1 {
        margin: 0;
        font-family: var(--font-heading);
        font-weight: 600;
        color: var(--text-50);
        font-size: var(--font-size-long-title);
    }
</style>