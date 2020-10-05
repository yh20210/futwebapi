import { Page } from "puppeteer";
import { SearchPlayerParams } from "../Models/SearchPlayerParams";
import { FormsUtil } from "../Utils/FormsUtil";
import { TimesUtil } from "../Utils/TimeUtil";
import { WebappPage } from "./WebappPage";

export class MarketPage extends WebappPage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<boolean> {
    try {
      await TimesUtil.delay(1000);
      await this._page.waitForSelector(".icon-transfer");
      await this._page.click(".icon-transfer");
      await TimesUtil.delay(1500);
      await this._page.waitForSelector(".ut-tile-transfer-market");
      await this._page.click(".ut-tile-transfer-market");
      await TimesUtil.delay(1500);
    } catch (e) {
      return false;
    }
    return true;
  }

  async setPlayerSearchParams(params: SearchPlayerParams) {
    if (params.name) {
      await FormsUtil.fillTextInput(this._page, "//*[contains(@class, 'ut-text-input-control')]", params.name, true);
      await this._page.waitForSelector(".btn-text");
      await this._page.click(".btn-text");
    }
    if (params.quality) {
      await FormsUtil.chooseSelectInput(this._page, "img[src='images/SearchFilters/level/any.png']", params.quality);
      TimesUtil.delay(500);
    }
    if (params.rarity) {
      await FormsUtil.chooseSelectInput(this._page, "img[src='images/SearchFilters/rarity/any.png']", params.rarity);
      TimesUtil.delay(500);
    }
    if (params.position) {
      await FormsUtil.chooseSelectInput(
        this._page,
        "img[src='https://www.ea.com/fifa/ultimate-team/web-app/content/21D4F1AC-91A3-458D-A64E-895AA6D871D1/2021/fut/items/images/mobile/positions/default.png']",
        params.position
      );
      TimesUtil.delay(500);
    }
    if (params.chemestry) {
      await FormsUtil.chooseSelectInput(
        this._page,
        "img[src='https://www.ea.com/fifa/ultimate-team/web-app/content/21D4F1AC-91A3-458D-A64E-895AA6D871D1/2021/fut/items/images/mobile/chemistrystyles/list/default.png']",
        params.chemestry
      );
      TimesUtil.delay(500);
    }
    if (params.nationality) {
      await FormsUtil.chooseSelectInput(
        this._page,
        "img[src='https://www.ea.com/fifa/ultimate-team/web-app/content/21D4F1AC-91A3-458D-A64E-895AA6D871D1/2021/fut/items/images/mobile/flags/list/default.png']",
        params.nationality
      );
      TimesUtil.delay(500);
    }
    if (params.league) {
      await FormsUtil.chooseSelectInput(
        this._page,
        "img[src='https://www.ea.com/fifa/ultimate-team/web-app/content/21D4F1AC-91A3-458D-A64E-895AA6D871D1/2021/fut/items/images/mobile/leagueLogos/dark/default.png']",
        params.league
      );
      TimesUtil.delay(500);
    }
    if (params.club) {
      await FormsUtil.chooseSelectInput(
        this._page,
        "img[src='https://www.ea.com/fifa/ultimate-team/web-app/content/21D4F1AC-91A3-458D-A64E-895AA6D871D1/2021/fut/items/images/mobile/clubs/dark/default.png']",
        params.club
      );
    }
    if (params.minBuyNow) {
      await FormsUtil.fillTextInput(this._page, "(.//input)[3]", params.minBuyNow.toString(), true);
    }
    if (params.maxBuyNow) {
      await FormsUtil.fillTextInput(this._page, "(.//input)[5]", params.maxBuyNow.toString(), true);
    }
  }

  async search() {
    await this._page.click(".call-to-action");
  }
}
