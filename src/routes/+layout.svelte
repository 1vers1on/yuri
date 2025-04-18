<script lang="ts">
    import { onMount } from "svelte";
    import { refreshAccessToken, accessTokenStore } from "$lib/auth";
    import { page } from "$app/stores";

    onMount(() => {
        if (!$accessTokenStore) {
            refreshAccessToken();
        }
    });

    const canonicalUrl = `https://yuri.liminal.moe${$page.url.pathname}`;
</script>

<svelte:head>
    <title>Yuri Archive - Largest Collection of Yuri Artwork</title>
    <meta
        name="description"
        content="Browse the largest collection of yuri artwork online. Search by artist, tags, or rating. Free to access with no sign-up required."
    />
    <meta
        name="keywords"
        content="yuri, yuri archive, anime, lgbtq, lgbtqia+, lesbian art, anime girls, digital art, girl love"
    />

    <meta
        property="og:title"
        content="Yuri Archive - Largest Collection of Yuri Artwork"
    />
    <meta
        property="og:description"
        content="Browse the largest collection of yuri artwork online. Search by artist, tags, or rating."
    />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:site_name" content="Yuri Archive" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta
        name="twitter:title"
        content="Yuri Archive - Largest Collection of Yuri Artwork"
    />
    <meta
        name="twitter:description"
        content="Browse the largest collection of yuri artwork online. Search by artist, tags, or rating."
    />

    <link rel="canonical" href={canonicalUrl} />
</svelte:head>

<slot />
