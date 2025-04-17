<script lang="ts">
    import { onMount } from "svelte";
    import { writable } from "svelte/store";

    type Entry = {
        id: number;
        name: string;
        email?: string;
        website?: string;
        message: string;
        createdAt: string;
    };

    const entries = writable<Entry[]>([]);
    let loading = $state(false);
    let error: Error | null = null;

    let name = $state("");
    let email = $state("");
    let website = $state("");
    let message = $state("");
    let captchaToken = "";
    let captchaHtml = $state("");
    let captchaText = $state("");

    async function loadEntries() {
        try {
            // add a fake entry for testing
            entries.set([
                {
                    id: 1,
                    name: "test",
                    message: "this is a test entry",
                    createdAt: new Date().toISOString(),
                },
            ]);

            loading = true;
            const res = await fetch("/api/guestbook");
            if (!res.ok)
                throw new Error(`Failed to fetch entries: ${res.status}`);
            const data = await res.json();
            entries.set(data);
        } catch (err) {
            console.error("Error loading entries:", err);
            error = err instanceof Error ? err : new Error(String(err));
        } finally {
            loading = false;
        }
    }

    async function submitEntry() {
        if (!name.trim() || !message.trim()) {
            alert("you forgot ur name or message silly!!");
            return;
        }

        try {
            if (!captchaToken) {
                alert("please complete the captcha!");
                return;
            }

            const result = await fetch(
                "/api/captcha",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: captchaToken, text: captchaText }),
                },
            );

            if (!result.ok) {
                const error = await result.json();
                if (error.error == "Captcha failed") {
                    alert("Captcha failed, please try again!");
                } else {
                    throw new Error(`Failed to submit entry: ${result.status}`);
                }
            }

            // await fetch("/api/captcha", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ token: captchaToken, 
            // });

            // await fetch(
            //     "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            //     {
            //         method: "POST",
            //         headers: { "Content-Type": "application/json" },
            //         body: JSON.stringify({
            //             secret: "0x4AAAAAABM5gZ1E3NqJyBqJ",
            //             response: captchaToken,
            //         }),
            //     },
            // );

            const res = await fetch("/api/guestbook", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    website,
                    message,
                    captchaToken,
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                if (error.error == "Captcha failed") {
                    alert("Captcha failed, please try again!");
                } else {
                    throw new Error(`Failed to submit entry: ${res.status}`);
                }
            }

            name = email = website = message = "";
            await loadEntries();
        } catch (err) {
            console.error("Error submitting entry:", err);
            alert("Failed to submit your entry. Please try again!");
        }
    }

    onMount(async () => {
        const response = await fetch(
            "/api/captcha",
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
        );

        if (!response.ok) {
            throw new Error("Failed to fetch captcha");
        }
        const data = await response.json();
        captchaHtml = data.data;
        captchaToken = data.token;

        loadEntries();
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
                <img src="star.gif" />
                <marquee scrollamount="10" behavior="alternate"
                    >GUESBOOK</marquee
                >
                <img src="star.gif" />
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
            bgcolor="#000022"
            style="width: 90%; margin: 10px auto; border: 3px ridge #ff00ff;"
        >
            <tbody>
                <tr>
                    <td>
                        <form on:submit|preventDefault={submitEntry}>
                            <table
                                cellpadding="5"
                                style="margin:auto; width: 300px;"
                            >
                                <tbody>
                                    <tr>
                                        <td class="cyan-text">name*</td>
                                        <td
                                            ><input
                                                bind:value={name}
                                                placeholder="ur name plz :3"
                                                required
                                            /></td
                                        >
                                    </tr>
                                    <tr>
                                        <td class="cyan-text">email</td>
                                        <td
                                            ><input
                                                bind:value={email}
                                                placeholder="email (optional)"
                                            /></td
                                        >
                                    </tr>
                                    <tr>
                                        <td class="cyan-text">website</td>
                                        <td
                                            ><input
                                                bind:value={website}
                                                placeholder="http://ur.cool.site"
                                            /></td
                                        >
                                    </tr>
                                    <tr>
                                        <td class="cyan-text">message*</td>
                                        <td
                                            ><textarea
                                                bind:value={message}
                                                placeholder="say something cute!!"
                                                required
                                                style="resize: none; height: 80px;"
                                            ></textarea></td
                                        >
                                    </tr>
                                    <tr>
                                        <td align="left">
                                            {@html captchaHtml}
                                        </td>
                                        <td align="right">
                                            <input
                                                type="text"
                                                bind:value={captchaText}
                                                placeholder="captcha"
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" align="center">
                                            <button
                                                type="submit"
                                                class="submit-btn"
                                                >sign guestbook</button
                                            >
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                    </td>
                </tr>
            </tbody>
        </table>

        <h2 class="cyan-text">previous entries ✨</h2>

        {#if loading}
            <p>loading... ⏳</p>
        {:else if error}
            <p>uh oh! something broke: {error.message}</p>
        {:else if $entries.length === 0}
            <p>no entries yet... be the first!! uwu</p>
        {:else}
            {#each $entries as entry}
                <div class="guest-entry">
                    <div class="entry-header">
                        <span class="yellow-text">{entry.name}</span>
                        {#if entry.website}
                            — <a
                                href={entry.website}
                                target="_blank"
                                class="entry-link">{entry.website}</a
                            >
                        {/if}
                        <small class="small-gray-text">
                            ({new Date(entry.createdAt).toLocaleString()})
                        </small>
                    </div>
                    <div class="entry-message">{entry.message}</div>
                </div>
            {/each}
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

    .submit-btn {
        padding: 5px 10px;
        cursor: pointer;
        background-color: #ff00ff;
        color: #ffffff;
        border: 2px outset #00ffff;
        font-weight: bold;
    }

    .submit-btn:hover {
        background-color: #00ffff;
        color: #000033;
        border: 2px inset #ff00ff;
    }

    textarea,
    input {
        background-color: #111133;
        border: 1px solid #00ffff;
        color: #ffffff;
        padding: 3px;
        width: 100%;
    }

    .guest-entry {
        margin: 10px auto;
        padding: 10px;
        width: 90%;
        border: 2px dashed #ff00ff;
        background-color: #000022;
        text-align: left;
    }

    .entry-header {
        margin-bottom: 5px;
    }

    .entry-link {
        color: #00ff00;
        text-decoration: underline;
    }

    .entry-link:hover {
        color: #ff69b4;
        text-decoration: underline wavy;
    }

    .entry-message {
        white-space: pre-wrap;
        color: #ffffff;
    }

    .entry-message {
        white-space: pre-wrap;
        color: #ffffff;
    }

    .turnstile-container {
        display: inline-block;
        width: auto;
        min-height: 65px;
    }

    :global(.cf-turnstile iframe) {
        max-width: 100%;
    }
</style>
