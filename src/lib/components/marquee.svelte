<script module lang="ts">
    type Direction = "left" | "right" | "up" | "down";
    type Behavior = "scroll" | "slide" | "alternate";
    
    interface Position {
        x?: number;
        y?: number;
    }

    interface AnimationConfig {
        keyframes: Array<{ transform: string }>;
        duration: number;
    }
</script>

<script lang="ts">
    let { 
        direction = "left" as Direction,
        behavior = "scroll" as Behavior,
        scrollamount = "50",
        loop = true, 
        pauseOnHover = false,
        height = "100%",
        children
    } = $props();

    let container = $state<HTMLDivElement | null>(null);
    let content = $state<HTMLDivElement | null>(null);
    let animation = $state<Animation | undefined>(undefined);

    function calculateAnimation(): AnimationConfig | null {
        if (!container || !content) return null;

        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        const contentWidth = content.offsetWidth;
        const contentHeight = content.offsetHeight;

        let start: Position = {};
        let end: Position = {};

        switch (direction) {
            case "left":
                start.x = containerWidth;
                end.x = -contentWidth;
                break;
            case "right":
                start.x = -contentWidth;
                end.x = containerWidth;
                break;
            case "up":
                start.y = containerHeight;
                end.y = -contentHeight;
                break;
            case "down":
                start.y = -contentHeight;
                end.y = containerHeight;
                break;
        }

        const distance =
            direction === "left" || direction === "right"
                ? Math.abs((end.x ?? 0) - (start.x ?? 0))
                : Math.abs((end.y ?? 0) - (start.y ?? 0));

        return {
            keyframes: [
                { transform: `translate(${start.x ?? 0}px, ${start.y ?? 0}px)` },
                { transform: `translate(${end.x ?? 0}px, ${end.y ?? 0}px)` },
            ],
            duration: (distance / parseFloat(scrollamount)) * 1000,
        };
    }

    function startAnimation(): void {
        if (!content) return;
        const config = calculateAnimation();
        if (!config) return;

        animation = content.animate(config.keyframes, {
            duration: config.duration,
            iterations: behavior === "slide" ? 1 : loop ? Infinity : 1,
            direction: behavior === "alternate" ? "alternate" : "normal",
            easing: "linear",
        });

        if (behavior === "slide") {
            animation.onfinish = () => {
                if (!content) return;
                const finalTransform = config.keyframes[1].transform;
                content.style.transform = finalTransform;
            };
        }

        if (pauseOnHover && container) {
            container.addEventListener("mouseenter", pause);
            container.addEventListener("mouseleave", resume);
        }
    }

    function pause(): void {
        animation?.pause();
    }
    
    function resume(): void {
        animation?.play();
    }

    $effect(() => {
        if (container && content) {
            startAnimation();
        }

        return () => {
            if (animation) {
                animation.cancel();
            }
            if (container && pauseOnHover) {
                container.removeEventListener("mouseenter", pause);
                container.removeEventListener("mouseleave", resume);
            }
        };
    });
</script>

<div class="marquee-container" bind:this={container} style="height: {height};">
    <div class="marquee-content" bind:this={content}>
        {@render children?.()}
    </div>
</div>

<style>
    .marquee-container {
        overflow: hidden;
        position: relative;
        width: 100%;
        height: 100%;
    }

    .marquee-content {
        position: absolute;
        white-space: nowrap;
        will-change: transform;
    }
</style>
