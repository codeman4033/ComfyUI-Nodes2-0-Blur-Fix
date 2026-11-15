import { app } from "../../scripts/app.js";

app.registerExtension({
    name: "ComfyUI.Nodes2_0_Blur_Fix",

    setup() {
        const patchTransformPane = (pane) => {
            if (!pane) return;

            const transform = pane.style.transform;

            let match = /scale3d\(([\d.]+),\s*[\d.]+,\s*[\d.]+\)\s*translate3d\(([-\d.]+)px,\s*([-\d.]+)px,\s*0(?:px)?\)/.exec(transform)

            if (!match) return;

            let [, camZ, camX, camY] = match;
            const scale = Number(camZ);
            const tx = Number(camX);
            const ty = Number(camY);

            // Preserve the original transform's effective screen-space translation.
            pane.style.translate = `${tx * scale}px ${ty * scale}px`;
            pane.style.scale = String(scale);

            // Avoid applying the original transform a second time.
            pane.style.transform = "none";
        };

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.target.matches?.('[data-testid="transform-pane"]')) {
                    patchTransformPane(mutation.target);
                }
            }
        });

        observer.observe(document.body, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ["style"],
        });

        document
            .querySelectorAll('[data-testid="transform-pane"]')
            .forEach(patchTransformPane);
    },
});
