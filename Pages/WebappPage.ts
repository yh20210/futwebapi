import { Page } from "puppeteer";
import { DomUtils } from "../Utils/DomUtils";

export abstract class WebappPage {
  protected _page: Page;

  constructor(page: Page) {
    this._page = page;
  }

  async back() {
    try {
      DomUtils.click(this._page, "//button[@class='ut-navigation-button-control']")
    } catch (e) {}
  }
}
