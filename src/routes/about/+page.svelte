<script lang="ts">

</script>

<div class="page-container">
    <center>
        <div class="header-banner">
            <blink
                ><span class="star red">★</span><span class="star yellow">★</span
                ><span class="star green">★</span> YURI ARCHIVE
                <span class="star green">★</span><span class="star yellow">★</span
                ><span class="star red">★</span></blink
            >
        </div>

        <h1>
            <div class="title-thingy">
                <img src="star.gif" />
                <marquee scrollamount="10" behavior="alternate">ABOUT THIS SITE!!!</marquee>
                <img src="star.gif" />
            </div>
        </h1>

        <table
            border="1"
            cellpadding="5"
            cellspacing="0"
            bgcolor="#000033"
            style="margin: 15px auto; width: 80%; border: 3px ridge #ff00ff;"
        >
            <tbody>
                <tr>
                    <td align="center" style="border-bottom: 2px solid #00ffff;">
                        <span class="cyan-text" style="font-weight: bold; font-size: 18px;">NAVIGATION</span>
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
            cellpadding="5"
            cellspacing="0"
            bgcolor="#330033"
            style="margin: 20px auto; width: 85%; border: 3px ridge #ff00ff;"
        >
            <tbody>
                <tr>
                    <td align="center">
                        <img src="spinning-heart.gif" alt="spinning heart" />
                        <blink><span class="pink-text">WELCOME TO THE YURI ARCHIVE!</span></blink>
                        <img src="spinning-heart.gif" alt="spinning heart" />
                    </td>
                </tr>
                <tr>
                    <td align="center" class="about-text">
                        ignore this stuff its from chatgpt i need to change it.
                        <p>
                            this site is a super cozy and nostalgic little corner of the web dedicated to archiving everything yuri! (´｡• ᵕ •｡`) ♡
                        </p>
                        <img src="yuri-girls.gif" alt="cute yuri gif" style="margin: 10px 0;" />
                        <p>
                            explore our hand-picked gallery of adorable and romantic manga, anime, images, and fanart from all over the internet ~☆~
                        </p>
                        <p>
                            new stuff is added all the time so please bookmark and check back soon nyaaa!
                        </p>
                    </td>
                </tr>
                <tr>
                    <td align="center">
                        <img src="rainbow-divider.gif" alt="divider" />
                    </td>
                </tr>
                <tr>
                    <td align="center" class="blink-text">
                        <blink>✧･ﾟ: *✧･ﾟ:* 💖 KEEP YURI ALIVE 💖 *:･ﾟ✧*:･ﾟ✧</blink>
                    </td>
                </tr>
            </tbody>
        </table>

        <div style="margin-top: 20px;">
            <img src="https://www.counter12.com/img-248059WcZdAW4104-26.gif" alt="web counter" />
            <div class="blinkies-container">
                <img src="blinky-yuri.gif" alt="yuri blinkie" />
                <img src="blinky-love.gif" alt="love blinkie" />
                <img src="blinky-gay.gif" alt="gay blinkie" />
                <img src="blinky-pixelheart.gif" alt="pixel heart blinkie" />
            </div>
            <table border="0" cellpadding="3" align="center">
                <tbody>
                    <tr>
                        <td><img title="lesbi" style="image-rendering: pixelated;" src="lesbian.png" /></td>
                        <td><img title="hicolor" style="image-rendering: pixelated;" src="hicolor.gif" /></td>
                        <td><img title="trans rights" style="image-rendering: pixelated;" src="transnow2.gif" /></td>
                        <td><img src="netscape1.gif" alt="netscape" width="88" height="31" /></td>
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

    .pink-text {
        color: #ff69b4;
        font-size: 20px;
        font-weight: bold;
    }

    .about-text {
        font-size: 16px;
        padding: 10px;
    }

    .blinkies-container {
        margin: 15px auto;
        display: flex;
        justify-content: center;
        gap: 5px;
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
        50% { opacity: 0; }
    }

    .star.red { color: #ff0000; }
    .star.yellow { color: #ffff00; }
    .star.green { color: #00ff00; }

    .cyan-text { color: #00ffff; }
    .small-gray-text { font-size: 12px; color: #999999; }

    .nav-links {
        display: flex;
        justify-content: center;
        gap: 10px;
    }

    .nav-link {
        color: #00ff00;
        padding: 3px 5px;
        border: 1px outset #00ff00;
        text-decoration: none;
    }

    .nav-link:hover {
        color: #ff00ff;
        background-color: #001100;
        border: 1px inset #ff00ff;
        text-shadow: 0 0 5px #ff00ff;
    }

    .nav-divider {
        color: #ffff00;
    }
</style>
