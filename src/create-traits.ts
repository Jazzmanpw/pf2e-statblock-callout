export function createTraits(
  statblock: HTMLDivElement,
  originalContent: Element,
) {
  const statblockTraitList = statblock.createEl("ul", {
    cls: "pf2e-statblock-callout_traits",
  });

  sortTraitsNodes(originalContent.querySelectorAll("mark")).forEach(
    (traitNode) => {
      const trait = statblockTraitList.createEl("li");
      traitNode.childNodes.forEach((child) => {
        trait.appendChild(child.cloneNode(true));
      });
    },
  );
}

function sortTraitsNodes(traitNodes: NodeListOf<Element>) {
  return [...traitNodes].sort((a, b) => {
    const aTextContent = a.textContent?.trim() || "";
    const bTextContent = b.textContent?.trim() || "";
    if (aTextContent < bTextContent) return -1;
    if (aTextContent > bTextContent) return 1;
    return 0;
  });
}
