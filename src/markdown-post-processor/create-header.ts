export function createHeader(
  statblock: HTMLDivElement,
  originalCallout: Element,
) {
  const statblockHeader = statblock.createDiv({
    cls: "pf2e-statblock-callout_header",
  });

  const statblockName = statblockHeader.createDiv({
    cls: "pf2e-statblock-callout_name",
  });

  const statblockLevel = statblockHeader.createDiv({
    cls: "pf2e-statblock-callout_level",
  });

  let currentTarget = statblockName;

  originalCallout
    .querySelector(".callout-title-inner")
    ?.childNodes.forEach((node) => {
      if (
        currentTarget === statblockName &&
        node instanceof Text &&
        node.wholeText.includes("|")
      ) {
        const [name, level] = node.wholeText.split("|");
        if (name) {
          statblockName.appendChild(document.createTextNode(name));
        }
        if (level) {
          statblockLevel.appendChild(document.createTextNode(level));
        }
        currentTarget = statblockLevel;
      } else {
        currentTarget.appendChild(node.cloneNode(true));
      }
    });
}
