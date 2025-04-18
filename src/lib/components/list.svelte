<!-- Yuri Archive
Copyright (C) 2025 1vers1on

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>. -->

<script lang="ts">
    export let results: {
        id: string;
        filename: string;
        rating: string;
        source: string | null;
        artist: string | null;
        tags: string[];
    }[];

    export let onItemClick: (result: {
        id: string;
        filename: string;
        rating: string;
        source: string | null;
        artist: string | null;
        tags: string[];
    }) => void;
</script>

<div class="results-container">
    {#each results as result}
        <button
            type="button"
            class="result-item"
            on:click={() => onItemClick(result)}
            on:keydown={(e) => e.key === "Enter" && onItemClick(result)}
        >
            <p class="result-title">{result.artist}</p>
            <img
                src={"https://static.liminal.moe/yuri/output_images/" + result.filename}
                alt={result.artist}
                class="result-image"
                style="image-rendering: auto !important;"
                loading="lazy"
            />
        </button>
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
</style>
