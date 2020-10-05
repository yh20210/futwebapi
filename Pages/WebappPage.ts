import { Page } from "puppeteer";

export abstract class WebappPage {
  protected _page: Page;

  constructor(page: Page) {
    this._page = page;
  }

  async back() {
    try {
      this._page.click(".ut-navigation-button-control");
    } catch (e) {}
  }
}
