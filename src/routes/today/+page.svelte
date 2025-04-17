<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { getToday } from "$lib/api";
    let today = null;

    onMount(async () => {
        const response = await getToday();
        goto(`/post/${response}`);
    });
</script>
