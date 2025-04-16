<script lang="ts">
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";

    interface Post {
        id: number;
        title: string;
        tags: string[];
        image: string;
        description?: string;
        uploadDate?: string;
        author?: string;
    }

    let post: Post = $state({
        id: 1,
        title: "Loading...",
        tags: [],
        image: "",
    });

    let isLoading = $state(true);
    let notFound = $state(false);
    let previousPath = "";

    function goBack() {
        if (previousPath) {
            goto(previousPath);
        } else {
            goto("/");
        }
    }

    onMount(async () => {
        const currentPath = window.location.pathname;
        const referrer = document.referrer;

        const isInternal = referrer.startsWith(window.location.origin);

        if (isInternal) {
            previousPath = new URL(referrer).pathname;
        }

        if (!browser) return;

        try {
            const params = new URLSearchParams(window.location.search);
            const id = params.get("id");

            // if (!id) {
            //     notFound = true;
            //     return;
            // }

            post = {
                id: 1,
                title: "test",
                tags: ["test", "test"],
                image: "https://placecats.com/800/600",
                uploadDate: "2025-03-15",
                author: "test",
            };
            isLoading = false;
        } catch (err) {
            console.error("Error fetching post:", err);
            notFound = true;
        }
    });
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
                <marquee scrollamount="10" behavior="alternate"
                    >YURI ARCHIVE</marquee
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
                            <a href="/upload" class="nav-link">[RANDOM]</a>
                            <span class="nav-divider">★</span>
                            <a href="/random" class="nav-link">[TODAY]</a>
                            <span class="nav-divider">★</span>
                            <a href="/about" class="nav-link">[ABOUT]</a>
                            <span class="nav-divider">★</span>
                            <a href="/settings" class="nav-link">[SETTINGS]</a>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        {#if isLoading}
            <div class="loading-container">
                <blink><p class="cyan-text">LOADING POST...</p></blink>
            </div>
        {:else if notFound}
            <div class="not-found-container">
                <h2 class="red-text gap">POST NOT FOUND</h2>
                <p class="gap">The requested post could not be found.</p>
                <button class="nav-link gap" onclick={goBack}> [BACK] </button>
            </div>
        {:else}
            <div class="post-container">
                <h2 class="post-title yellow-text">{post.title}</h2>

                {#if post.author || post.uploadDate}
                    <div class="post-meta">
                        {#if post.author}<span class="green-text"
                                >by: {post.author}</span
                            >{/if}
                        {#if post.uploadDate}<span class="cyan-text"
                                >date: {post.uploadDate}</span
                            >{/if}
                    </div>
                {/if}

                <div class="post-image-container">
                    <img src={post.image} alt={post.title} class="post-image" />
                </div>

                {#if post.description}
                    <div class="post-description">
                        <p>{post.description}</p>
                    </div>
                {/if}

                <div class="post-tags">
                    {#each post.tags as tag}
                        <a href={`/results?tags=${tag}`} class="tag">{tag}</a>
                    {/each}
                </div>

                <div class="post-actions">
                    <button class="action-button">
                        <span class="star yellow">★</span> FAVORITE
                    </button>
                    <button class="action-button">
                        <span class="star green">★</span> DOWNLOAD
                    </button>
                    <button class="action-button">
                        <span class="star red">★</span> SHARE
                    </button>
                </div>

                <div class="back-link">
                    <button class="nav-link" onclick={goBack}> [BACK] </button>
                </div>
            </div>
        {/if}

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
        font-family: "Times New Roman", Times, serif;
    }
    :global(body) {
        color: white;
        background: url("wallstars.gif") repeat;
        margin: 0;
        padding: 0;
        min-height: 100vh;
        width: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        image-rendering: pixelated;
    }

    :global(html) {
        margin: 0;
        padding: 0;
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

    button {
        background-color: #000;
        color: #fff;
        border: 2px outset #00ffff;
        padding: 5px 10px;
        cursor: pointer;
        font-family: monospace;
        text-decoration: none;
    }

    button:hover,
    a:hover {
        color: #ff69b4;
    }

    input {
        font-family: monospace;
    }

    .header-banner {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 15px;
    }

    blink {
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

    .red-text {
        color: #ff0000;
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

    /* Post specific styles */
    .post-container {
        padding: 15px;
        margin: 20px auto;
        border: 3px dashed #ff69b4;
        width: 90%;
        max-width: 700px;
        background-color: rgba(0, 0, 50, 0.5);
    }

    .post-title {
        font-size: 24px;
        margin-bottom: 10px;
        text-shadow: 0 0 5px #ffff00;
    }

    .post-image-container {
        margin: 15px auto;
        padding: 5px;
        border: 2px ridge #00ff00;
        background-color: rgba(0, 0, 0, 0.5);
    }

    .post-image {
        max-width: 100%;
        max-height: 70vh;
    }

    .post-description {
        padding: 10px;
        margin: 10px 0;
        font-style: italic;
        background-color: rgba(0, 0, 0, 0.7);
        border: 1px solid #00ffff;
    }

    .post-meta {
        display: flex;
        justify-content: space-around;
        margin-bottom: 15px;
        font-size: 14px;
        border-top: 1px dotted #00ffff;
        border-bottom: 1px dotted #00ffff;
        padding: 5px;
    }

    .post-tags {
        margin: 15px 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 5px;
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
        text-decoration: none;
    }

    .tag:hover {
        background-color: #00ff00;
        color: #000080;
        text-decoration: none;
    }

    .post-actions {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin: 15px 0;
        flex-wrap: wrap;
    }

    .action-button {
        background-color: #000;
        color: #fff;
        border: 2px outset #00ffff;
        padding: 5px 10px;
        cursor: pointer;
        font-family: monospace;
    }

    .action-button:hover {
        background-color: #001133;
        border-color: #ff69b4;
    }

    .back-link {
        margin: 15px 0 5px;
    }

    .loading-container {
        padding: 40px 0;
        font-size: 24px;
    }

    .gap {
        margin: 10px 0;
    }
</style>
