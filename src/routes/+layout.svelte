<script lang="ts">
    import { onMount } from 'svelte';
    import { refreshAccessToken, accessTokenStore } from '$lib/auth';

    onMount(() => {
        if (!$accessTokenStore) {
            refreshAccessToken();
        }
    });

</script>

<slot />
