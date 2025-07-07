export function createContent(
  statblock: HTMLDivElement,
  originalCallout: Element,
) {
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

function createTraits(statblock: HTMLDivElement, originalContent: Element) {
  const statblockTraitList = statblock.createEl("ul", {
    cls: "pf2e-statblock-callout_trait-list",
  });

  sortTraitsNodes(originalContent.querySelectorAll("mark")).forEach(
    (traitNode) => {
      const trait = statblockTraitList.createEl("li", {
        cls: "pf2e-statblock-callout_trait",
      });
      traitNode.childNodes.forEach((child) => {
        trait.appendChild(child.cloneNode(true));
      });
      addTraitTypeClassName(trait);
    },
  );
}

function sortTraitsNodes(traitNodes: NodeListOf<Element>) {
  return [...traitNodes].sort((a, b) => {
    const aParsedTrait = parseTrait(a);
    const bParsedTrait = parseTrait(b);

    if (aParsedTrait.order !== bParsedTrait.order) {
      return aParsedTrait.order - bParsedTrait.order;
    }

    if (aParsedTrait.textContent < bParsedTrait.textContent) return -1;
    if (aParsedTrait.textContent > bParsedTrait.textContent) return 1;

    return 0;
  });
}

function parseTrait(traitNode: Element) {
  const textContent = traitNode.textContent?.trim().toLowerCase() || "";
  const order =
    raritiesSet.has(textContent) || settlementsSet.has(textContent)
      ? 0
      : sizesSet.has(textContent)
        ? 1
        : 2;
  return { textContent, order };
}

const raritiesSet = new Set(["unique", "rare", "uncommon"]);
const sizesSet = new Set([
  "tiny",
  "small",
  "medium",
  "large",
  "huge",
  "gargantuan",
]);
const settlementsSet = new Set(["city", "village", "town", "metropolis"]);

function addTraitTypeClassName(traitElement: Element) {
  const trait = traitElement.textContent?.trim()?.toLowerCase() || "";
  if (raritiesSet.has(trait)) {
    traitElement.classList.add(`pf2e-statblock-callout_trait__${trait}`);
    return;
  }
  if (sizesSet.has(trait)) {
    traitElement.classList.add("pf2e-statblock-callout_trait__size");
    return;
  }
}
