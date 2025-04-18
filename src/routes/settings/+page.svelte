<script lang="ts">
    import { onMount } from "svelte";
    import { userSettings } from "$lib/globalState";
    import { registerUser, accessTokenStore, loginUser } from "$lib/auth";

    let settings = {
        theme: "dark",
        animations: true,
        showStats: true,
        enableTips: true,
    };

    let loggedIn = $state(false);
    let username = $state("");
    let password = $state("");
    let confirmPassword = $state("");
    let displayName = $state("");
    let showRegisterForm = $state(false);

    let captchaHtml = $state("");
    let captchaValue = $state("");

    let captchaToken = "";

    function saveSettings() {
        localStorage.setItem("userSettings", JSON.stringify(settings));
        alert("settings saved! yay!! ☆*:.｡.o(≧▽≦)o.｡.:*☆");
    }

    onMount(async () => {
        let response = await fetch("/api/captcha", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        accessTokenStore.subscribe((token) => {
            if (token) {
                loggedIn = true;
            }
        });

        const data = await response.json();
        captchaHtml = data.data;
        captchaToken = data.token;
    });

    async function login() {
        if (username && password) {
            try {
                await loginUser(username, password);
                loggedIn = true;
                displayName = username;
            } catch (error) {
                if (error instanceof Error) {
                    alert("Login failed: " + error.message);
                } else {
                    alert("Login failed: " + error);
                }
            }
        } else {
            alert("Please fill in all fields.");
        }
    }

    async function register() {
        if (username && password && confirmPassword) {
            if (password === confirmPassword) {
                loggedIn = true;
                displayName = username;
                let response = await fetch("/api/captcha", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token: captchaToken,
                        text: captchaValue,
                    }),
                });

                if (response.ok) {
                    try {
                        await registerUser(username, password, captchaToken);
                    } catch (error) {
                        if (error instanceof Error) {
                            alert("Registration failed: " + error.message);
                        } else {
                            alert("Registration failed: " + error);
                        }
                    }
                } else {
                    alert("Captcha verification failed. Please try again.");
                }
            } else {
                alert("Passwords do not match.");
            }
        } else {
            alert("Please fill in all fields.");
        }
    }

    function logout() {
        loggedIn = false;
        username = "";
        password = "";
        displayName = "";
        alert("Logged out successfully!");
    }
</script>

<div class="page-container">
    <center>
        <header class="header-banner">
            <div class="blink">
                <span class="star red">★</span>
                <span class="star yellow">★</span>
                <span class="star green">★</span> YURI ARCHIVE
                <span class="star green">★</span>
                <span class="star yellow">★</span>
                <span class="star red">★</span>
            </div>
        </header>

        <h1 class="title-thingy">
            <img src="/star.gif" alt="star" />
            <marquee scrollamount="10" behavior="alternate">SETTINGS</marquee>
            <img src="/star.gif" alt="star" />
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

        <table
            border="1"
            cellpadding="10"
            cellspacing="0"
            bgcolor="#000033"
            style="border: 3px ridge #ff00ff; width: 80%; margin-bottom: 20px;"
        >
            <tbody>
                <tr>
                    <td class="pink-text" colspan="2" align="center">
                        <div class="blink">☆</div>
                        <span style="font-weight: bold; font-size: 18px;"
                            >ACCOUNT MANAGEMENT</span
                        >
                        <div class="blink">☆</div>
                    </td>
                </tr>
                {#if !loggedIn}
                    {#if !showRegisterForm}
                        <tr>
                            <td colspan="2">
                                <form
                                    onsubmit={(e) => {
                                        e.preventDefault();
                                        login();
                                    }}
                                >
                                    <table width="100%">
                                        <tbody>
                                            <tr>
                                                <td align="right" width="40%"
                                                    >username:</td
                                                >
                                                <td align="left">
                                                    <input
                                                        type="text"
                                                        bind:value={username}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="right">password:</td>
                                                <td align="left">
                                                    <input
                                                        type="password"
                                                        bind:value={password}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td
                                                    colspan="2"
                                                    align="center"
                                                    style="padding-top: 10px;"
                                                >
                                                    <button
                                                        type="submit"
                                                        class="glowing-button"
                                                        >LOGIN</button
                                                    >
                                                    <button
                                                        type="button"
                                                        class="glowing-button"
                                                        onclick={() =>
                                                            (showRegisterForm = true)}
                                                        >REGISTER</button
                                                    >
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </form>
                            </td>
                        </tr>
                    {:else}
                        <tr>
                            <td colspan="2">
                                <form
                                    onsubmit={(e) => {
                                        e.preventDefault();
                                        register();
                                    }}
                                >
                                    <table width="100%">
                                        <tbody>
                                            <tr>
                                                <td align="right" width="40%"
                                                    >username:</td
                                                >
                                                <td align="left">
                                                    <input
                                                        type="text"
                                                        bind:value={username}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="right">password:</td>
                                                <td align="left">
                                                    <input
                                                        type="password"
                                                        bind:value={password}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="right"
                                                    >confirm password:</td
                                                >
                                                <td align="left">
                                                    <input
                                                        type="password"
                                                        bind:value={
                                                            confirmPassword
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="right">
                                                    {@html captchaHtml}
                                                </td>
                                                <td align="left">
                                                    <input
                                                        type="text"
                                                        bind:value={
                                                            captchaValue
                                                        }
                                                        placeholder="Enter captcha"
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td
                                                    colspan="2"
                                                    align="center"
                                                    style="padding-top: 10px;"
                                                >
                                                    <button
                                                        type="submit"
                                                        class="glowing-button"
                                                        >CREATE ACCOUNT</button
                                                    >
                                                    <button
                                                        type="button"
                                                        class="glowing-button"
                                                        onclick={() =>
                                                            (showRegisterForm = false)}
                                                        >BACK TO LOGIN</button
                                                    >
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </form>
                            </td>
                        </tr>
                    {/if}
                {:else}
                    <tr>
                        <td colspan="2">
                            <div class="profile-section">
                                <div class="profile-header">
                                    <span
                                        class="yellow-text"
                                        style="font-size: 18px;"
                                        >welcome back, {displayName}!</span
                                    >
                                </div>

                                <table width="100%" class="profile-options">
                                    <tbody>
                                        <tr>
                                            <td align="center" width="40%"
                                                >this does nothing yet</td
                                            >
                                        </tr>
                                        <!-- <tr>
                                            <td align="right"
                                                >change password:</td
                                            >
                                            <td align="left">
                                                <button class="small-button"
                                                    >CHANGE</button
                                                >
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="right"
                                                >notification settings:</td
                                            >
                                            <td align="left">
                                                <input
                                                    type="checkbox"
                                                    checked
                                                /> receive updates
                                            </td>
                                        </tr> -->
                                        <!-- <tr>
                                            <td
                                                colspan="2"
                                                align="center"
                                                style="padding-top: 15px;"
                                            >
                                                <button
                                                    class="glowing-button"
                                                    on:click={logout}
                                                    >LOGOUT</button
                                                >
                                            </td>
                                        </tr> -->
                                    </tbody>
                                </table>
                            </div>
                        </td>
                    </tr>
                {/if}
            </tbody>
        </table>

        <form
            onsubmit={(e) => {
                e.preventDefault();
                saveSettings();
            }}
        >
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
                        <td>Default tags</td>
                        <td>
                            <input
                                type="text"
                                bind:value={$userSettings.defaultTags}
                                placeholder="e.g. yuri, cute"
                            />
                        </td></tr
                    >
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
            <img src="/Under_Construction_Bar.gif" alt="Under Construction" />
            <p style="color: #ff00ff; font-size: 18px;">
                More settings soon (maybe...)
            </p>
            <img src="/Under_Construction_Bar.gif" alt="Under Construction" />
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

    .profile-section {
        padding: 5px;
    }

    .profile-header {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin-bottom: 5px;
    }

    .profile-options {
        border-top: 1px dashed #ff00ff;
        padding-top: 10px;
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
