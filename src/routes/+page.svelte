<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import Grid from "$lib/components/grid.svelte";
    import { getUserFavorites } from "$lib/api.js";
    import Marquee from "$lib/components/marquee.svelte";
    let { data } = $props();

    let searchQuery = $state("");
    let suggestions: any = $state([]);
    let showSuggestions = $state(false);
    let isLoading = $state(false);
    let selectedIndex = $state(-1);
    let searchTimeout: NodeJS.Timeout | null = null;
    let searchType = $state("random");
    let lastWord = $state("");
    let searchInput: HTMLInputElement;
    let suggestionContainer = $state<HTMLDivElement | null>(null);
    let favoritesShown = $state(false);
    let favorites = $state([]);

    const popularSearches = data.popularSearches;

    async function fetchSuggestions() {
        const words = searchQuery.split(" ");
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

        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        const words = searchQuery.split(" ");
        lastWord = words[words.length - 1];

        if (lastWord.length >= 1) {
            searchTimeout = setTimeout(() => {
                fetchSuggestions();
            }, 200); // Reduced delay for more responsiveness
        } else {
            suggestions = [];
            showSuggestions = false;
        }
    }

    function selectSuggestion(tag: string) {
        const words = searchQuery.split(" ");
        words[words.length - 1] = tag + " "; // Add space after selection
        searchQuery = words.join(" ");
        showSuggestions = false;
        searchInput.focus(); // Keep focus on input after selection
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (!showSuggestions || suggestions.length === 0) return;

        if (event.key === "ArrowDown") {
            event.preventDefault();
            selectedIndex = (selectedIndex + 1) % suggestions.length;
            scrollSuggestionIntoView();
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            selectedIndex =
                selectedIndex <= 0 ? suggestions.length - 1 : selectedIndex - 1;
            scrollSuggestionIntoView();
        } else if (event.key === "Enter" && selectedIndex >= 0) {
            event.preventDefault();
            selectSuggestion(suggestions[selectedIndex].tag);
        } else if (event.key === "Tab" && selectedIndex >= 0) {
            event.preventDefault();
            selectSuggestion(suggestions[selectedIndex].tag);
        } else if (event.key === "Escape") {
            event.preventDefault();
            showSuggestions = false;
        }
    }

    function scrollSuggestionIntoView() {
        if (suggestionContainer && selectedIndex >= 0) {
            const selectedElement = suggestionContainer.children[
                selectedIndex
            ] as HTMLElement;
            if (selectedElement) {
                selectedElement.scrollIntoView({ block: "nearest" });
            }
        }
    }

    function handleFocus() {
        if (lastWord.length >= 1 && !showSuggestions) {
            fetchSuggestions();
        }
    }

    function handleBlur(event: FocusEvent) {
        if (
            suggestionContainer &&
            !suggestionContainer.contains(event.relatedTarget as Node)
        ) {
            setTimeout(() => {
                showSuggestions = false;
            }, 150);
        }
    }

    function handleSearch() {
        if (searchQuery.trim()) {
            goto(
                `/results?tags=${encodeURIComponent(searchQuery.trim())}&page=1&limit=25&order=${searchType}`,
            );
        }
    }

    interface TagStat {
        tag: string;
        count: number;
    }

    let stats = $state({
        totalYuri: 0,
        totalTags: 0,
        averageTagsPerPost: 0,
        topTags: [] as TagStat[],
    });

    onMount(async () => {
        try {
            const res = await fetch("/api/stats");
            if (res.ok) {
                stats = await res.json();
            }
            
            setTimeout(async () => {
                const userFavorites = await getUserFavorites();
                if (userFavorites) {
                    favorites = userFavorites;
                    if (favorites.length > 0) {
                        favoritesShown = true;
                    }
                }
            }, 1000);

        } catch (err) {
            console.error("failed to load stats meow", err);
        }
    });
</script>

<div class="page-container">
    <center>
        <div class="header-banner">
            <div class="blink"><span class="star red">★</span><span class="star yellow"
                    >★</span
                ><span class="star green">★</span> YURI ARCHIVE
                <span class="star green">★</span><span class="star yellow"
                    >★</span
                ><span class="star red">★</span></div
            >
        </div>

        <h1>
            <div class="title-thingy">
                <img src="/star.gif" alt="star" />
                <Marquee scrollamount="10" behavior="alternate"
                    >YURI ARCHIVE</Marquee>
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
        <table
            border="1"
            cellpadding="10"
            cellspacing="0"
            bgcolor="#000000"
            style="margin-top: 20px; border: 3px ridge #00ff00;"
        >
            <tbody>
                <tr>
                    <td>
                        <form onsubmit={e => { e.preventDefault(); handleSearch(); }}>
                            <div class="autocomplete-wrapper">
                                <input
                                    type="text"
                                    name="q"
                                    bind:value={searchQuery}
                                    bind:this={searchInput}
                                    oninput={handleInput}
                                    onkeydown={handleKeyDown}
                                    onblur={handleBlur}
                                    onfocus={handleFocus}
                                    style="width: 200px; background-color: #000; color: #0f0; border: 2px inset #0f0;"
                                    autocomplete="off"
                                    placeholder="Search tags..."
                                />
                                {#if isLoading}
                                    <div class="loading-indicator">
                                        <span class="blink-text"
                                            >LOADING...</span
                                        >
                                    </div>
                                {/if}
                                {#if showSuggestions}
                                    <div
                                        class="suggestion-list"
                                        bind:this={suggestionContainer}
                                    >
                                        {#each suggestions as suggestion, i}
                                            <div
                                                role="option"
                                                aria-selected={i === selectedIndex}
                                                tabindex="0"
                                                class="suggestion-item {i ===
                                                selectedIndex
                                                    ? 'selected'
                                                    : ''}"
                                                onmousedown={() =>
                                                    selectSuggestion(
                                                        suggestion.tag,
                                                    )}
                                                onmouseenter={() =>
                                                    (selectedIndex = i)}
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
                                value="SEARCH"
                                style="background-color: #000; color: #f0f; font-weight: bold; border: 2px outset #f0f;"
                            />
                        </form>
                    </td>
                </tr>
            </tbody>
        </table>

        <table
            border="0"
            cellspacing="5"
            cellpadding="2"
            style="margin-top: 10px; width: 80%;"
        >
            <tbody>
                <tr>
                    <td colspan="4" align="center" class="cyan-text"
                        >Search Options:</td
                    >
                </tr>
                <tr>
                    <td align="center"
                        ><input
                            type="radio"
                            name="search_type"
                            value="random"
                            bind:group={searchType}
                            checked
                        /> random</td
                    >
                    <td align="center"
                        ><input
                            type="radio"
                            name="search_type"
                            value="ordered"
                            bind:group={searchType}
                        /> ordered</td
                    >
                    <!-- <td align="center"
                        ><input
                            type="radio"
                            name="search_type"
                            value="nothing"
                            bind:group={searchType}
                        /> nothing</td
                    >
                    <td align="center"
                        ><input
                            type="radio"
                            name="search_type"
                            value="more nothing"
                            bind:group={searchType}
                        /> more nothing</td
                    > -->
                </tr>
            </tbody>
        </table>

        <div class="popular-searches">
            <table
                border="1"
                cellpadding="5"
                cellspacing="0"
                width="80%"
                bgcolor="#000033"
            >
                <tbody>
                    <tr>
                        <td align="center" class="yellow-text"
                            >POPULAR SEARCHES</td
                        >
                    </tr>
                    <tr>
                        <td>
                            <Marquee
                                direction="up"
                                scrollamount="2"
                                height="60px"
                            >
                                <div class="green-text">
                                    {#each popularSearches as search}
                                        {search}<br />
                                    {/each}
                                </div>
                            </Marquee>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        {#if favoritesShown}
            <div
                style="margin-top: 20px; width: 80%; margin-left: auto; margin-right: auto;"
            >
                <div class="yellow-text" style="margin-bottom: 10px;">
                    <h3>FAVORITES</h3>
                    </div>
                <Grid
                    results={favorites}
                    onItemClick={(item) =>
                        goto(`/post/${item.id}`)
                    }
                />
            </div>
        {/if}

        <div
            class="search-tips"
            style="margin-top: 20px; border: 2px dashed #ff00ff; padding: 10px; width: 80%; margin-left: auto; margin-right: auto;"
        >
            <h3 class="cyan-text">SEARCH TIPS</h3>
            <ul
                style="text-align: left; color: #ffffff; list-style-type: square;"
            >
                <li>Add + to require words</li>
                <li>Add - to exclude terms</li>
            </ul>
        </div>

        <div
            style="margin-top: 20px; padding: 10px; border: 2px dotted #00ffff; width: 80%; margin-left: auto; margin-right: auto; background-color: rgba(0, 0, 0, 0.7);"
        >
            <h3 class="yellow-text">SITE STATS</h3>
            <p>
                Total Yuri Posts: <span class="green-text"
                    >{stats.totalYuri}</span
                >
            </p>
            <p>Total Tags: <span class="green-text">{stats.totalTags}</span></p>
            <p>
                Average Tags per Post: <span class="green-text"
                    >{stats.averageTagsPerPost.toFixed(2)}</span
                >
            </p>

            <h4 class="cyan-text" style="margin-top: 10px;">Top 10 Tags:</h4>
            <ul style="text-align: left; color: #ffffff;">
                {#each stats.topTags as tag}
                    <li>
                        <span class="green-text">{tag.tag}</span> — {tag.count} posts
                    </li>
                {/each}
            </ul>
        </div>

        <div class="buttons" style="margin-top: 20px;">
            <a href="/guestbook">
                <img src="/bguestbook.gif" alt="guestbook" />
            </a>
            <br />
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
                            /></td
                        >
                        <td
                            ><img
                                alt="hicolor"
                                title="hicolor"
                                style="image-rendering: pixelated;"
                                src="/hicolor.gif"
                            /></td
                        >
                        <td
                            ><img
                                alt="trans rights"
                                title="trans rights"
                                style="image-rendering: pixelated;"
                                src="/transnow2.gif"
                            /></td
                        >
                        <td
                            ><img
                                src="/netscape1.gif"
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
        font-family: "Times New Roman", Times, serif;
    }
    :global(body) {
        color: white;
        margin: 0;
        padding: 0;
        width: 100%;
        image-rendering: pixelated;
        min-height: 100%;
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

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .page-container {
        padding-top: 20px;
        padding-bottom: 20px;
        text-align: center;
        max-width: 800px;
        margin: 0 auto;
        border: 5px ridge #00ffff;
        background-color: rgba(0, 0, 0, 0.8);
    }

    .title-thingy {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }

    a:hover {
        color: #ff69b4;
        text-decoration: underline wavy hotpink;
    }

    input {
        font-family: monospace;
    }

    .header-banner {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 15px;
    }

    .popular-searches {
        margin-top: 20px;
    }

    .blink {
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

    .autocomplete-wrapper {
        position: relative;
        display: inline-block;
        margin-right: 5px;
    }

    .suggestion-list {
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 100;
        width: 100%;
        max-height: 200px;
        overflow-y: auto;
        background-color: #000033;
        border: 2px solid #00ffff;
        box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        scroll-behavior: smooth;
    }

    .suggestion-item {
        padding: 5px 8px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        color: #00ff00;
        text-align: left;
        border-bottom: 1px dotted #004400;
    }

    .suggestion-item:last-child {
        border-bottom: none;
    }

    .suggestion-item:hover {
        background-color: #001133;
    }

    .suggestion-item.selected {
        background-color: #002244;
        color: #ffff00;
    }

    .post-count {
        color: #00cccc;
        margin-left: 10px;
    }

    .loading-indicator {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background-color: #000022;
        padding: 5px;
        border: 1px solid #00ffff;
        text-align: center;
        z-index: 101;
    }

    .blink-text {
        animation: blinker 0.8s step-start infinite;
        color: #ff00ff;
    }
</style>
