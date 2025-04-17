<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { getRandom } from "$lib/api";
    let today = null;

    onMount(async () => {
        const response = await getRandom();
        goto(`/post/${response}`);
    });
</script>
