import { createContent } from "./create-content";
import { createHeader } from "./create-header";

export function markdownPostProcessor(element: HTMLElement) {
  const originalCallout = element.querySelector("[data-callout=statblock]");
  if (originalCallout) {
    const statblock = element.createDiv({ cls: "pf2e-statblock-callout" });

    createHeader(statblock, originalCallout);

    createContent(statblock, originalCallout);

    originalCallout.remove();
  }
}
