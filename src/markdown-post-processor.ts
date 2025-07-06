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
  const { name, level, actionIcon } = parseHeader(
    originalCallout.querySelector(".callout-title-inner"),
  );

  const statblockHeader = statblock.createDiv({
    cls: "pf2e-statblock-callout_header",
  });

  const statblockName = statblockHeader.createDiv({
    cls: "pf2e-statblock-callout_name",
    text: name,
  });
  if (actionIcon) {
    statblockName.appendChild(actionIcon);
  }

  statblockHeader.createDiv({
    cls: "pf2e-statblock-callout_level",
    text: level,
  });
}

function parseHeader(originalTitleContent: Element | null) {
  if (!originalTitleContent?.textContent) {
    return { name: "Name" };
  }
  const [rawName, level] = originalTitleContent.textContent.split("|");
  const actionIcon = originalTitleContent.querySelector(".pf2-actions");
  return {
    name: actionIcon?.textContent
      ? rawName.replace(actionIcon.textContent || "", "")
      : rawName,
    level,
    actionIcon,
  };
}

function createContent(statblock: HTMLDivElement, originalCallout: Element) {
  const originalContent = originalCallout.querySelector(".callout-content");

  if (!originalContent) {
    return;
  }

  createTraits(statblock, originalContent);

  originalContent.childNodes.forEach((child) => {
    if (child instanceof HTMLParagraphElement) {
      if (!child.querySelector("mark")) {
        const statblockContentParagraph = child.cloneNode(
          true,
        ) as HTMLParagraphElement;
        statblockContentParagraph.classList.add(
          "pf2e-statblock-callout_content-paragraph",
        );
        statblock.appendChild(statblockContentParagraph);
      }
      return;
    }

    if (child instanceof HTMLUListElement) {
      const statblockContentList = child.cloneNode(true) as HTMLUListElement;
      statblockContentList.classList.add("pf2e-statblock-callout_content-list");
      statblock.appendChild(statblockContentList);
      return;
    }

    statblock.appendChild(child.cloneNode(true));
  });
}
