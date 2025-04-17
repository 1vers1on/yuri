<script lang="ts">
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import { userSettings } from "$lib/stores";
    import { getPosts } from "$lib/api";
    import { goto } from "$app/navigation";

    interface ResultItem {
        id: number;
        artist: string;
        tags: string[];
        filename: string;
    }

    interface Results {
        posts: ResultItem[];
        nResults: number;
    }

    let results: Results = $state({
        posts: [
            {
                id: 1,
                artist: "test",
                tags: ["test", "test", "test"],
                filename: "https://placecats.com/neo/300/200",
            },
            {
                id: 2,
                artist: "test",
                tags: ["test", "test"],
                filename: "https://placecats.com/millie/300/200",
            },
        ],
        nResults: 2,
    });

    let query = "";
    let page = 1;
    let limit = 25;
    let order = "random";
    let searching = $state(true);
    let totalPages = $state(1);
    let gridLayout = $state(false);

    let suggestions: any = $state([]);
    let showSuggestions = $state(false);
    let isLoading = $state(false);
    let selectedIndex = $state(-1);
    let searchTimeout: NodeJS.Timeout | null = null;
    let lastWord = "";

    onMount(async () => {
        if (!browser) return;

        totalPages = results.nResults;

        try {
            const params = new URLSearchParams(window.location.search);
            if (params.has("tags")) {
                query = params.get("tags") || "";
            }
            if (params.has("page")) {
                const pageFromUrl = parseInt(params.get("page") || "1");
                if (!isNaN(pageFromUrl)) {
                    page = pageFromUrl;
                }
            }
            if (params.has("limit")) {
                const limitFromUrl = parseInt(params.get("limit") || "25");
                if (!isNaN(limitFromUrl)) {
                    limit = limitFromUrl;
                }
            }
            if (params.has("order")) {
                order = params.get("order") || "random";
            }

            updateURL(query, page, limit, order);

            results = await getPosts(query, page, limit, order);

            searching = false;
        } catch (err) {
            console.error("Error parsing URL params:", err);
        }
    });

    function updateURL(q: string, p: number, l: number, order: string): void {
        if (!browser) return;

        let params = new URLSearchParams();
        if (q) params.set("tags", q);
        params.set("page", p.toString());
        params.set("limit", l.toString());
        params.set("order", order);
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, "", newUrl);
    }

    async function fetchSuggestions() {
        const words = query.split(" ");
        lastWord = words[words.length - 1];

        if (lastWord.length < 1) {
            suggestions = [];
            showSuggestions = false;
            return;
        }

        isLoading = true;
        try {
            const response = await fetch(
                `/api/tags?q=${encodeURIComponent(lastWord)}`,
            );
            if (response.ok) {
                const data = await response.json();
                suggestions = data;
                showSuggestions = data.length > 0;
            } else {
                suggestions = [];
                showSuggestions = false;
            }
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            suggestions = [];
            showSuggestions = false;
        } finally {
            isLoading = false;
        }
    }

    function handleInput() {
        selectedIndex = -1;
        const words = query.split(" ");
        lastWord = words[words.length - 1];

        if (lastWord.length >= 1) {
            if (searchTimeout) clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                fetchSuggestions();
            }, 300);
        } else {
            suggestions = [];
            showSuggestions = false;
        }
    }

    function selectSuggestion(tag: string) {
        const words = query.split(" ");
        words[words.length - 1] = tag;
        query = words.join(" ");
        showSuggestions = false;
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (!showSuggestions || suggestions.length === 0) return;

        if (event.key === "ArrowDown") {
            event.preventDefault();
            selectedIndex = (selectedIndex + 1) % suggestions.length;
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            selectedIndex =
                selectedIndex <= 0 ? suggestions.length - 1 : selectedIndex - 1;
        } else if (event.key === "Enter" && selectedIndex >= 0) {
            event.preventDefault();
            selectSuggestion(suggestions[selectedIndex].tag);
        } else if (event.key === "Escape") {
            showSuggestions = false;
        }
    }

    function handleBlur() {
        setTimeout(() => {
            showSuggestions = false;
        }, 200);
    }

    function search(event: Event): void {
        event.preventDefault();
        searching = true;
        page = 1;
        setTimeout(() => {
            searching = false;
        }, 500);
    }

    function prevPage(): void {
        if (page > 1) page--;
    }
    function nextPage(): void {
        if (page < totalPages) page++;
    }

    function show(result: ResultItem): void {
        goto(`/single?id=${result.id}`);
    }
</script>

<div class="page-container">
    <center>
        <div class="header-banner">
            <blink
                ><span class="star red">★</span><span class="star yellow"
                    >★</span
                ><span class="star green">★</span> YURI ARCHIVE
                <span class="star green">★</span><span class="star yellow"
                    >★</span
                ><span class="star red">★</span></blink
            >
        </div>

        <h1>
            <div class="title-thingy">
                <img src="star.gif" alt="star" />
                <marquee scrollamount="10" behavior="alternate">RESULTS</marquee
                >
                <img src="star.gif" alt="star" />
            </div>
        </h1>

        <table
            border="1"
            cellpadding="5"
            cellspacing="0"
            bgcolor="#000033"
            style="margin: 15px auto; width: 80%; border: 3px ridge #ff00ff; height: min-content;"
        >
            <tbody>
                <tr>
                    <td
                        align="center"
                        style="border-bottom: 2px solid #00ffff;"
                    >
                        <span
                            class="cyan-text"
                            style="font-weight: bold; font-size: 18px;"
                            >NAVIGATION</span
                        >
                    </td>
                </tr>
                <tr>
                    <td align="center">
                        <div class="nav-links">
                            <a href="/" class="nav-link">[HOME]</a>
                            <span class="nav-divider">★</span>
                            <a href="/random" class="nav-link">[RANDOM]</a>
                            <span class="nav-divider">★</span>
                            <a href="/today" class="nav-link">[TODAY]</a>
                            <span class="nav-divider">★</span>
                            <a href="/about" class="nav-link">[ABOUT]</a>
                            <span class="nav-divider">★</span>
                            <a href="/settings" class="nav-link">[SETTINGS]</a>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <form onsubmit={search}>
            <div class="autocomplete-wrapper">
                <input
                    type="text"
                    bind:value={query}
                    placeholder="search tags..."
                    style="width: 200px; background-color: #000; color: #0f0; border: 2px inset #0f0;"
                    oninput={handleInput}
                    onkeydown={handleKeyDown}
                    onblur={handleBlur}
                    autocomplete="off"
                />
                {#if isLoading}
                    <div class="loading-indicator">
                        <span class="blink-text">LOADING...</span>
                    </div>
                {/if}
                {#if showSuggestions}
                    <div class="suggestion-list">
                        {#each suggestions as suggestion, i}
                            <div
                                class="suggestion-item {i === selectedIndex
                                    ? 'selected'
                                    : ''}"
                                onmousedown={() =>
                                    selectSuggestion(suggestion.tag)}
                            >
                                <span>{suggestion.tag}</span>
                                <span class="post-count"
                                    >[{suggestion.count}]</span
                                >
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
            <input
                type="submit"
                value="search again"
                style="background-color: #000; color: #f0f; font-weight: bold; border: 2px outset #f0f;"
            />
        </form>

        {#if searching}
            <blink>
                <p class="cyan-text">LOADING...</p>
            </blink>
        {:else if $userSettings.gridLayout}
            <div class="results-container-grid">
                {#each results.posts as result}
                    <div
                        class="result-item-grid"
                        onclick={() => show(result)}
                    >
                        <p class="result-title-grid">{result.artist}</p>
                        <img
                            src={"http://localhost:3001/" + result.filename}
                            alt={result.artist}
                            class="result-image-grid"
                            style="image-rendering: auto !important;"
                        />
                    </div>
                {/each}
            </div>
        {:else}
            <div class="results-container">
                {#each results.posts as result}
                    <div class="result-item" onclick={() => show(result)}>
                        <p class="result-title">{result.artist}</p>
                        <img
                            src={"http://localhost:3001/" + result.filename}
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
        {/if}

        <div class="pagination">
            <button onclick={prevPage} disabled={page <= 1}>prev</button>
            <span>page {page} of {totalPages}</span>
            <button onclick={nextPage} disabled={page >= totalPages}
                >next</button
            >
            <span
                >| limit:
                <input
                    type="number"
                    min="1"
                    bind:value={limit}
                    style="width: 50px;"
                />
            </span>
        </div>

        <div class="buttons" style="margin-top: 20px;">
            <div>
                <img
                    src="https://www.counter12.com/img-248059WcZdAW4104-26.gif"
                    alt="web counter free"
                />
            </div>
            <table border="0" cellpadding="3" align="center">
                <tbody>
                    <tr>
                        <td
                            ><img
                                title="lesbi"
                                style="image-rendering: pixelated;"
                                src="lesbian.png"
                            /></td
                        >
                        <td
                            ><img
                                title="hicolor"
                                style="image-rendering: pixelated;"
                                src="hicolor.gif"
                            /></td
                        >
                        <td
                            ><img
                                title="trans rights"
                                style="image-rendering: pixelated;"
                                src="transnow2.gif"
                            /></td
                        >
                        <td
                            ><img
                                src="netscape1.gif"
                                alt="netscape"
                                width="88"
                                height="31"
                            /></td
                        >
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="footer">
            <p>© 1vers1on. all rights reserved.</p>
            <p class="small-gray-text">powered by trans catgirl whimpering</p>
        </div>
    </center>
</div>

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: "Times New Roman", Times, serif;
    }
    :global(body) {
        color: white;
        background: url("wallstars.gif") repeat;
        margin: 0;
        padding: 0;
        min-height: 100vh;
        background: transparent;
    }

    :global(html) {
        margin: 0;
        padding: 0;
        height: 100%;
        background: url("wallstars.gif");
        background-repeat: repeat;
        background-attachment: fixed;
        background-size: auto;
    }
    .page-container {
        padding: 20px;
        max-width: 800px;
        margin: auto;
        border: 5px ridge #00ffff;
        background-color: rgba(0, 0, 0, 0.8);
        text-align: center;
    }
    .header-banner {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 15px;
        text-align: center;
    }
    .results-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 20px;
        padding: 10px;
        border: 3px dashed #ff69b4;
    }
    .result-item {
        /* margin-bottom: 15px; */
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
    .pagination {
        margin-top: 20px;
    }
    .pagination button {
        background-color: #000;
        color: #f0f;
        border: 2px outset #f0f;
        padding: 5px 10px;
        margin: 0 5px;
    }
    .lightbox-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    .lightbox-content {
        background: #111;
        padding: 20px;
        border: 3px ridge #ff69b4;
        position: relative;
        text-align: center;
    }
    .lightbox-content img {
        max-width: 90vw;
        max-height: 80vh;
    }
    .close-button {
        position: absolute;
        top: 5px;
        right: 10px;
        font-size: 24px;
        cursor: pointer;
        color: #ff69b4;
    }
    .blink-animation {
        animation: blinker 1s step-start infinite;
    }
    @keyframes blinker {
        50% {
            opacity: 0;
        }
    }
    .star.red {
        color: #ff0000;
    }
    .star.yellow {
        color: #ffff00;
    }
    .star.green {
        color: #00ff00;
    }
    .cyan-text {
        color: #00ffff;
    }
    .yellow-text {
        color: #ffff00;
    }
    .green-text {
        color: #00ff00;
    }
    .small-gray-text {
        font-size: 12px;
        color: #999999;
    }
    .title-thingy {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }
    .scrolling-title {
        font-size: 24px;
        font-weight: bold;
        color: #ff69b4;
        animation: scroll-text 8s linear infinite alternate;
    }
    .star-icon {
        color: #ffff00;
        font-size: 24px;
    }
    @keyframes scroll-text {
        0% {
            transform: translateX(-20px);
        }
        100% {
            transform: translateX(20px);
        }
    }

    .autocomplete-wrapper {
        position: relative;
        display: inline-block;
        vertical-align: middle;
    }

    .suggestion-list {
        position: absolute;
        width: 200px;
        max-height: 200px;
        overflow-y: auto;
        background: #000;
        border: 2px solid #0f0;
        z-index: 100;
        left: 0;
        text-align: left;
    }

    .suggestion-item {
        padding: 5px;
        cursor: pointer;
        color: #0f0;
        display: flex;
        justify-content: space-between;
    }

    .suggestion-item.selected {
        background-color: #003300;
    }

    .suggestion-item:hover {
        background-color: #002200;
    }

    .post-count {
        color: #888;
        font-size: 0.8em;
    }

    .loading-indicator {
        position: absolute;
        top: 100%;
        left: 0;
        background: #000;
        padding: 3px;
        border: 1px solid #0f0;
        z-index: 100;
    }

    blink {
        animation: blinker 1s step-start infinite;
    }

    .results-container-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 15px;
        margin-top: 20px;
        padding: 10px;
        border: 3px dashed #ff69b4;
        /* width: 100%; */
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

    .tags-grid {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        max-width: 100%;
        overflow: hidden;
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

    .nav-links {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
        padding: 5px;
    }

    .nav-link {
        color: #00ff00;
        text-decoration: none;
        font-weight: bold;
        transition: all 0.2s;
        padding: 3px 5px;
        border: 1px outset #00ff00;
    }

    .nav-link:hover {
        color: #ff00ff;
        background-color: #001100;
        border: 1px inset #ff00ff;
        text-shadow: 0 0 5px #ff00ff;
        text-decoration: none;
    }

    .nav-divider {
        color: #ffff00;
    }
</style>
