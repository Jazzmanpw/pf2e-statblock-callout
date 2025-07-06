import { Plugin } from "obsidian";

export default class PF2StatblockCalloutPlugin extends Plugin {
  override async onload() {
    this.registerMarkdownPostProcessor((element) => {
      const statblockCallout = element.querySelector(
        "[data-callout=statblock]",
      );
      if (statblockCallout) {
        const statblock = element.createDiv({ cls: "pf2e-statblock-callout" });

        const [name, level] = statblockCallout
          .querySelector(".callout-title-inner")
          ?.textContent?.split("|") ?? ["Name"];
        const statblockHeader = statblock.createDiv({
          cls: "pf2e-statblock-callout-header",
        });
        statblockHeader.createDiv({
          cls: "pf2e-statblock-callout-name",
          text: name,
        });
        statblockHeader.createDiv({
          cls: "pf2e-statblock-callout-level",
          text: level,
        });

        const calloutContent =
          statblockCallout.querySelector(".callout-content");

        if (calloutContent) {
          const statblockTraitList = statblock.createEl("ul", {
            cls: "pf2e-statblock-callout-traits",
          });
          [...calloutContent.querySelectorAll("mark")]
            .sort((a, b) => {
              const aTextContent = a.textContent?.trim() || "";
              const bTextContent = b.textContent?.trim() || "";
              if (aTextContent < bTextContent) return -1;
              if (aTextContent > bTextContent) return 1;
              return 0;
            })
            .forEach((traitNode) => {
              const trait = statblockTraitList.createEl("li", { cls: "trait" });
              traitNode.childNodes.forEach((child) => {
                trait.appendChild(child.cloneNode(true));
              });
            });

          calloutContent.childNodes.forEach((child) => {
            if (
              child instanceof HTMLParagraphElement &&
              child.querySelector("mark")
            ) {
              return;
            }
            if (child instanceof HTMLHRElement) {
              statblock.appendChild(child.cloneNode());
            }
            if (child instanceof HTMLUListElement) {
              const statblockContentList = child.cloneNode(
                true,
              ) as HTMLUListElement;
              statblockContentList.classList.add(
                "pf2e-statblock-callout-content-list",
              );
              statblockContentList.querySelectorAll("ul").forEach((ul) => {
                ul.classList.add("pf2e-statblock-callout-content-list");
              });
              statblock.appendChild(statblockContentList);
            }
          });
        }

        statblockCallout.remove();
      }
    });
  }
}
