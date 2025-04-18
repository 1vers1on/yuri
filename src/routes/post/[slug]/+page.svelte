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
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import {
        getPost,
        addUserFavorite,
        removeUserFavorite,
        isPostFavorite,
    } from "$lib/api";
    import { favorites } from "$lib/globalState";

    const { data } = $props();

    interface Post {
        id: string;
        tags: string[];
        filename: string;
        description?: string;
        uploadDate?: string;
        author?: string;
    }

    let post: Post = data;

    let isLoading = $state(false);
    let notFound = $state(false);

    function goBack() {
        window.history.back();
        setTimeout(() => goto(window.location.href), 100);
    }

    function download() {
        const a = document.createElement("a");
        a.href = `/api/post/${post.id}/download`;
        a.download = post.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function share() {
        const shareData = {
            title: "YURI ARCHIVE",
            text: "Check out this image",
            url: window.location.href,
        };

        if (navigator.share) {
            navigator
                .share(shareData)
                .then(() => console.log("Post shared successfully"))
                .catch((error) => console.error("Error sharing post:", error));
        } else {
            alert("Sharing not supported on this browser.");
        }
    }

    let isFavorite = $state(false);
    let favoriteText = $state("FAVORITE");

    $effect(() => {
        favoriteText = isFavorite ? "UNFAVORITE" : "FAVORITE";
    });

    async function toggleFavorite() {
        if (isFavorite) {
            await removeUserFavorite(post.id);
        } else {
            await addUserFavorite(post.id);
        }
        isFavorite = await isPostFavorite(post.id);
    }

    onMount(async () => {
        if (!browser) return;
        setTimeout(async () => {
            isFavorite = await isPostFavorite(post.id);
        }, 100);
    });

    function getFullImageUrl(filename: string) {
        return browser
            ? new URL(
                  `https://static.liminal.moe/yuri/output_images/${filename}`,
                  window.location.origin,
              ).toString()
            : `https://static.liminal.moe/yuri/output_images/${filename}`;
    }
</script>

<svelte:head>
    {#if !notFound && post}
        <title>{post.tags.slice(0, 3).join(", ")} - Yuri Archive</title>
        <meta
            name="description"
            content={post.description ||
                `Yuri artwork featuring ${post.tags.slice(0, 5).join(", ")}`}
        />
        <meta name="keywords" content={post.tags.join(", ")} />

        <meta
            property="og:title"
            content={`${post.tags.slice(0, 3).join(", ")} - Yuri Archive`}
        />
        <meta
            property="og:description"
            content={post.description ||
                `Yuri artwork featuring ${post.tags.slice(0, 5).join(", ")}`}
        />
        <meta property="og:type" content="image" />
        <meta
            property="og:url"
            content={`https://yuri.liminal.moe/post/${post.id}`}
        />
        <meta property="og:image" content={getFullImageUrl(post.filename)} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
            name="twitter:title"
            content={`${post.tags.slice(0, 3).join(", ")} - Yuri Archive`}
        />
        <meta
            name="twitter:description"
            content={post.description ||
                `Yuri artwork featuring ${post.tags.slice(0, 5).join(", ")}`}
        />
        <meta name="twitter:image" content={getFullImageUrl(post.filename)} />

        <link
            rel="canonical"
            href={`https://yuri.liminal.moe/post/${post.id}`}
        />

        <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageObject",
            "name": `Yuri Archive: ${post.tags.slice(0, 3).join(", ")}`,
            "description": post.description || `Yuri artwork with tags: ${post.tags.join(", ")}`,
            "contentUrl": getFullImageUrl(post.filename),
            "datePublished": post.uploadDate || new Date().toISOString(),
            "author": post.artist ? { "@type": "Person", "name": post.artist } : undefined,
            "keywords": post.tags.join(", "),
            "isPartOf": {
                "@type": "WebSite",
                "name": "Yuri Archive",
                "url": "https://yuri.liminal.moe"
            }
        })}
        </script>
    {/if}
</svelte:head>

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
                <marquee scrollamount="10" behavior="alternate"
                    >YURI ARCHIVE</marquee
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

        {#if isLoading}
            <div class="loading-container">
                <div class="blink">
                    <p class="cyan-text">LOADING POST...</p>
                </div>
            </div>
        {:else if notFound}
            <div class="not-found-container">
                <h2 class="red-text gap">POST NOT FOUND</h2>
                <p class="gap">The requested post could not be found.</p>
                <button class="nav-link gap" onclick={goBack}> [BACK] </button>
            </div>
        {:else}
            <div class="post-container">
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
                    <img
                        src={getFullImageUrl(post.filename)}
                        alt="Post"
                        class="post-image"
                        style="image-rendering: auto !important;"
                        loading="eager"
                    />
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
                    <button class="action-button" onclick={toggleFavorite}>
                        <span class="star yellow">★</span>
                        {favoriteText}
                    </button>
                    <button class="action-button" onclick={download}>
                        <span class="star green">★</span> DOWNLOAD
                    </button>
                    <button class="action-button" onclick={share}>
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
            <p>© 1vers1on.</p>
            <p class="small-gray-text">powered by trans catgirl whimpering</p>
        </footer>
    </center>
</div>

<style>
    * {
        font-family: "Times New Roman", Times, serif;
    }
    :global(body) {
        color: white;
        background: url("/wallstars.gif") repeat;
        margin: 0;
        padding: 0;
        min-height: 100vh;
        width: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        image-rendering: pixelated;
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

    .header-banner {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 15px;
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
