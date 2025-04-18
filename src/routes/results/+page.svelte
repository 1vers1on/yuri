<script lang="ts">
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import { userSettings } from "$lib/globalState";
    import { getPosts } from "$lib/api";
    import { goto } from "$app/navigation";
    import Grid from "$lib/components/grid.svelte";
    import List from "$lib/components/list.svelte";
    

    let { data } = $props();

    interface PostResult {
        id: string;
        filename: string;
        rating: string;
        source: string | null;
        artist: string | null;
        tags: string[];
    }

    interface Results {
        posts: PostResult[];
        nResults: number;
    }

    let results: Results = data;

    let query = $state("");
    let page = $state(1);
    let limit = $state(25);
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

            // results = await getPosts(query, page, limit, order);

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

    function show(result: PostResult): void {
        goto(`/post/${result.id}`);
    }
</script>

<div class="page-container">
    <center>
        <header class="header-banner">
            <div class="blink">
                <span class="star red">★</span><span class="star yellow">★</span
                ><span class="star green">★</span> YURI ARCHIVE
                <span class="star green">★</span><span class="star yellow"
                    >★</span
                ><span class="star red">★</span>
            </div>
        </header>

        <h1>
            <div class="title-thingy">
                <img src="/star.gif" alt="star" />
                <marquee scrollamount="10" behavior="alternate">RESULTS</marquee
                >
                <img src="/star.gif" alt="star" />
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
                        <nav class="nav-links">
                            <a href="/" class="nav-link">[HOME]</a>
                            <span class="nav-divider">★</span>
                            <a href="/random" class="nav-link">[RANDOM]</a>
                            <span class="nav-divider">★</span>
                            <a href="/today" class="nav-link">[TODAY]</a>
                            <span class="nav-divider">★</span>
                            <a href="/about" class="nav-link">[ABOUT]</a>
                            <span class="nav-divider">★</span>
                            <a href="/settings" class="nav-link">[SETTINGS]</a>
                        </nav>
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
                                role="button"
                                tabindex="0"
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
            <div class="blink">
                <p class="cyan-text">LOADING...</p>
            </div>
        {:else if $userSettings.gridLayout}
            <Grid results={results.posts} onItemClick={show} />
        {:else}
            <List results={results.posts} onItemClick={show} />
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
                                alt="lesbian"
                                title="lesbi"
                                style="image-rendering: pixelated;"
                                src="/lesbian.png"
                                loading="lazy"
                            /></td
                        >
                        <td
                            ><img
                                alt="hicolor"
                                title="hicolor"
                                style="image-rendering: pixelated;"
                                src="/hicolor.gif"
                                loading="lazy"
                            /></td
                        >
                        <td
                            ><img
                                alt="trans rights"
                                title="trans rights"
                                style="image-rendering: pixelated;"
                                src="/transnow2.gif"
                                loading="lazy"
                            /></td
                        >
                        <td
                            ><img
                                src="/netscape1.gif"
                                alt="netscape"
                                width="88"
                                height="31"
                                loading="lazy"
                            /></td
                        >
                    </tr>
                </tbody>
            </table>
        </div>

        <footer class="footer">
            <p>© 1vers1on. all rights reserved.</p>
            <p class="small-gray-text">powered by trans catgirl whimpering</p>
        </footer>
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
        background: url("/wallstars.gif") repeat;
        margin: 0;
        padding: 0;
        min-height: 100vh;
        background: transparent;
    }

    :global(html) {
        margin: 0;
        padding: 0;
        height: 100%;
        background: url("/wallstars.gif");
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

    .blink {
        animation: blinker 1s step-start infinite;
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
