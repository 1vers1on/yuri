<script lang="ts">
    export let results: {
        id: number;
        artist: string;
        tags: string[];
        filename: string;
    }[];

    export let onItemClick: (result: {
        id: number;
        artist: string;
        tags: string[];
        filename: string;
    }) => void;
</script>

<div class="results-container">
    {#each results as result}
        <div class="result-item" on:click={() => onItemClick(result)}>
            <p class="result-title">{result.artist}</p>
            <img
                src={result.filename}
                alt={result.artist}
                class="result-image"
                style="image-rendering: auto !important;"
            />
            <!-- <div class="tags">
                {#each result.tags as tag}
                    <span class="tag">{tag}</span>
                {/each}
            </div> -->
        </div>
    {/each}
</div>

<style>
    .results-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 20px;
        padding: 10px;
        border: 3px dashed #ff69b4;
    }

    .result-item {
        padding: 8px;
        border: 2px groove #00ff00;
        background-color: rgba(0, 0, 50, 0.5);
        cursor: pointer;
    }

    .result-title {
        font-size: 18px;
        font-weight: bold;
        color: #ffff00;
    }

    .result-image {
        width: 100%;
        max-width: 300px;
        margin-top: 10px;
    }

    .tag {
        display: inline-block;
        background-color: #0f0;
        color: black;
        padding: 2px 5px;
        margin: 2px;
        font-size: 12px;
        border-radius: 4px;
        font-family: monospace;
    }
</style>
