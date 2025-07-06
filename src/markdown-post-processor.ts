import { createTraits } from "./create-traits";

export function markdownPostProcessor(element: HTMLElement) {
  const originalCallout = element.querySelector("[data-callout=statblock]");
  if (originalCallout) {
    const statblock = element.createDiv({ cls: "pf2e-statblock-callout" });

    createHeader(statblock, originalCallout);

    createContent(statblock, originalCallout);

    originalCallout.remove();
  }
}

function createHeader(statblock: HTMLDivElement, originalCallout: Element) {
  const [name, level] = originalCallout
    .querySelector(".callout-title-inner")
    ?.textContent?.split("|") ?? ["Name"];
  const statblockHeader = statblock.createDiv({
    cls: "pf2e-statblock-callout_header",
  });
  statblockHeader.createDiv({
    cls: "pf2e-statblock-callout_name",
    text: name,
  });
  statblockHeader.createDiv({
    cls: "pf2e-statblock-callout_level",
    text: level,
  });
}

function createContent(statblock: HTMLDivElement, originalCallout: Element) {
  const originalContent = originalCallout.querySelector(".callout-content");

  if (!originalContent) {
    return;
  }

  createTraits(statblock, originalContent);

  originalContent.childNodes.forEach((child) => {
    if (child instanceof HTMLParagraphElement && child.querySelector("mark")) {
      return;
    }

    if (child instanceof HTMLUListElement) {
      const statblockContentList = child.cloneNode(true) as HTMLUListElement;
      statblockContentList.classList.add("pf2e-statblock-callout_content-list");
      statblock.appendChild(statblockContentList);
      return;
    }

    statblock.appendChild(child.cloneNode());
  });
}
