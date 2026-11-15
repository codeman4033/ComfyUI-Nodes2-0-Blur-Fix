import { app } from "../../scripts/app.js";

app.registerExtension({
    name: "ComfyUI.Nodes2_0_Blur_Fix",

    setup() {
        const patchTransformPane = (pane) => {
            if (!pane) return;

            const transform = pane.style.transform;
            const match = transform.match(
                /scale3d\(([-\d.]+),\s*([-\d.]+),\s*([-\d.]+)\)\s*translate3d\(([^)]+)\)/
            );

            if (!match) return;

            const [, sx, sy, sz, translation] = match;
            const scale = Number(sx);

            if (
                !Number.isFinite(scale) ||
                Math.abs(scale - Number(sy)) > 0.00001 ||
                Math.abs(scale - Number(sz)) > 0.00001
            ) {
                return;
            }

            const [tx, ty] = translation.split(",").map((value) => parseFloat(value));

            if (!Number.isFinite(tx) || !Number.isFinite(ty)) return;

            // Keep the same matrix while expressing it through transform functions.
            // The scaled translation preserves the original screen-space position.
            pane.style.transform = `translate3d(${tx * scale}px, ${ty * scale}px, 0px) scale3d(${scale}, ${scale}, 1)`;
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
