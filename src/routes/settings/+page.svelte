<script lang="ts">
    import { onMount } from "svelte";
    import { userSettings } from "$lib/stores";
    let settings = {
        theme: "dark",
        animations: true,
        showStats: true,
        enableTips: true,
    };

    function saveSettings() {
        // replace this with real persistence later
        localStorage.setItem("userSettings", JSON.stringify(settings));
        alert("settings saved! yay!! ☆*:.｡.o(≧▽≦)o.｡.:*☆");
    }

    onMount(() => {
        const saved = localStorage.getItem("userSettings");
        if (saved) {
            settings = JSON.parse(saved);
        }
    });
</script>

<div class="page-container">
    <center>
        <div class="header-banner">
            <blink>
                <span class="star red">★</span>
                <span class="star yellow">★</span>
                <span class="star green">★</span> YURI ARCHIVE
                <span class="star green">★</span>
                <span class="star yellow">★</span>
                <span class="star red">★</span>
            </blink>
        </div>

        <h1 class="title-thingy">
            <img src="star.gif" />
            <marquee scrollamount="10" behavior="alternate">SETTINGS</marquee>
            <img src="star.gif" />S
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

        <form on:submit|preventDefault={saveSettings}>
            <table
                border="1"
                cellpadding="10"
                cellspacing="0"
                bgcolor="#000000"
                style="border: 3px ridge #ff69b4; width: 80%;"
            >
                <tbody>
                    <tr>
                        <td class="cyan-text" colspan="2" align="center">
                            site preferences
                        </td>
                    </tr>
                    <tr>
                        <td>Allow NSFW</td>
                        <td>
                            <input
                                type="checkbox"
                                bind:checked={$userSettings.nsfw}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Grid Layout</td>
                        <td>
                            <input
                                type="checkbox"
                                bind:checked={$userSettings.gridLayout}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>

        <div class="sidebar" style="margin-top: 30px;">
            <img src="Under_Construction_Bar.gif" alt="Under Construction" />
            <p style="color: #ff00ff; font-size: 18px;">
                More settings soon (maybe...)
            </p>
            <img src="Under_Construction_Bar.gif" alt="Under Construction" />
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
    select,
    input[type="checkbox"] {
        background-color: #000;
        color: #00ff00;
        font-family: monospace;
        border: 2px inset #00ff00;
    }

    button:hover {
        background-color: #001100;
        color: #ff00ff;
        text-shadow: 0 0 5px #ff00ff;
    }

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
</style>
