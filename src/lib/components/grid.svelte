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

<div class="results-container-grid">
    {#each results as result}
        <button
            type="button"
            class="result-item-grid"
            on:click={() => onItemClick(result)}
            on:keydown={(e) => e.key === "Enter" && onItemClick(result)}
        >
            <p class="result-title-grid">{result.artist}</p>
            <img
                src={"https://static.liminal.moe/yuri/output_images/" + result.filename}
                alt={result.artist}
                class="result-image-grid"
                style="image-rendering: auto !important;"
                loading="lazy"
            />
        </button>
    {/each}
</div>

<style>
    .results-container-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 15px;
        margin-top: 20px;
        padding: 10px;
        border: 3px dashed #ff69b4;
    }

    .result-item-grid {
        padding: 8px;
        border: 2px groove #00ff00;
        background-color: rgba(0, 0, 50, 0.5);
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .result-title-grid {
        font-size: 16px;
        font-weight: bold;
        color: #ffff00;
        margin-bottom: 5px;
        text-overflow: ellipsis;
        overflow: hidden;
        width: 100%;
    }

    .result-image-grid {
        width: 100%;
        height: 150px;
        object-fit: cover;
        margin: 5px 0;
        border: 1px solid #00ff00;
    }

    @media (max-width: 600px) {
        .results-container-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (min-width: 1000px) {
        .results-container-grid {
            grid-template-columns: repeat(4, 1fr);
        }
    }
</style>
