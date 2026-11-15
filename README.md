# ComfyUI-Nodes2-0-Blur-Fix

A lightweight frontend extension for ComfyUI **Nodes 2.0** that improves node sharpness at non-100% canvas zoom levels.

The extension replaces the transform pane's combined `scale3d(...)` and `translate3d(...)` transform with the equivalent individual CSS `translate` and `scale` properties. It preserves ComfyUI's graph zoom and pan values without applying CSS `zoom`.

## Installation

1. Open a terminal in your ComfyUI `custom_nodes` directory.
2. Clone this repository:

   ```bash
   git clone https://github.com/codeman4033/ComfyUI-Nodes2-0-Blur-Fix.git
   ```

3. Restart ComfyUI.
4. Refresh the ComfyUI browser tab.

No Python packages, frontend build steps, or manual configuration are required.

## Requirements

- ComfyUI with **Nodes 2.0** enabled.
- A frontend version that uses the `[data-testid="transform-pane"]` element and the `scale3d(...) translate3d(...)` transform format.

Tested with ComfyUI frontend **1.61.2**. Other frontend versions and browsers have not yet been independently verified.

## How it works

The extension observes the Nodes 2.0 transform pane. When ComfyUI updates its inline transform, the extension reads the uniform scale and pan translation, applies those values through CSS individual transform properties, and clears the combined transform to avoid applying it twice.

The extension does not add or modify nodes, alter workflows, or change ComfyUI installation files.

## License

MIT. See [LICENSE](LICENSE).
