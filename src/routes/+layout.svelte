<svelte:head>
    <title>Yuri Archive</title>
    <meta name="description" content="Browse the largest collection of yuri (i think its the largest at least." />
    <meta name="keywords" content="yuri, archive, anime, lgbtq, lgbtqia+" />
    <meta property="og:title" content="Yuri Archive" />
    <meta property="og:description" content="Browse the largest collection of yuri (i think its the largest at least." />
    <meta property="og:type" content="website" />
</svelte:head>

<script lang="ts">
    import { onMount } from "svelte";
    import { refreshAccessToken, accessTokenStore } from "$lib/auth";

    onMount(() => {
        if (!$accessTokenStore) {
            refreshAccessToken();
        }
    });
</script>

<slot />
