import { Plugin } from "obsidian";
import { markdownPostProcessor } from "./markdown-post-processor";

export default class PF2StatblockCalloutPlugin extends Plugin {
  override async onload() {
    this.registerMarkdownPostProcessor(markdownPostProcessor);
  }
}
