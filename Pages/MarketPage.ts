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
      await FormsUtil.chooseSelectInput(this._page, "//img[@src='images/SearchFilters/level/any.png']", params.quality);
      TimesUtil.delay(500);
    }
    if (params.rarity) {
      await FormsUtil.chooseSelectInput(this._page, "//img[@src='images/SearchFilters/rarity/any.png']", params.rarity);
      TimesUtil.delay(500);
    }
    if (params.position) {
      await FormsUtil.chooseSelectInput(
        this._page,
        "//img[@src='https://www.ea.com/fifa/ultimate-team/web-app/content/21D4F1AC-91A3-458D-A64E-895AA6D871D1/2021/fut/items/images/mobile/positions/default.png']",
        params.position
      );
      TimesUtil.delay(500);
    }
    if (params.chemestry) {
      await FormsUtil.chooseSelectInput(
        this._page,
        "//img[@src='https://www.ea.com/fifa/ultimate-team/web-app/content/21D4F1AC-91A3-458D-A64E-895AA6D871D1/2021/fut/items/images/mobile/chemistrystyles/list/default.png']",
        params.chemestry
      );
      TimesUtil.delay(500);
    }
    if (params.nationality) {
      await FormsUtil.chooseSelectInput(
        this._page,
        "//img[@src='https://www.ea.com/fifa/ultimate-team/web-app/content/21D4F1AC-91A3-458D-A64E-895AA6D871D1/2021/fut/items/images/mobile/flags/list/default.png']",
        params.nationality
      );
      TimesUtil.delay(500);
    }
    if (params.league) {
      await FormsUtil.chooseSelectInput(
        this._page,
        "//img[@src='https://www.ea.com/fifa/ultimate-team/web-app/content/21D4F1AC-91A3-458D-A64E-895AA6D871D1/2021/fut/items/images/mobile/leagueLogos/dark/default.png']",
        params.league
      );
      TimesUtil.delay(500);
    }
    if (params.club) {
      await FormsUtil.chooseSelectInput(
        this._page,
        "//img[@src='https://www.ea.com/fifa/ultimate-team/web-app/content/21D4F1AC-91A3-458D-A64E-895AA6D871D1/2021/fut/items/images/mobile/clubs/dark/default.png']",
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

  async buyNow(quantity: number = -1) {
    await this._page.waitForXPath(".//li[contains(@class, 'listFUTItem')]");
    const items = await this._page.$x(".//li[contains(@class, 'listFUTItem')]");
    for (let i = 0; i < (quantity !== -1 ? quantity : items.length); i++) {
      const item = items[i];
      item.click();
      await this._page.waitForXPath(".//button[contains(@class, 'buyButton')]");
      const [buyNowBtn] = await this._page.$x(".//button[contains(@class, 'buyButton')]");
      buyNowBtn.click();
      await this._page.waitForXPath(".//span[contains(text(), 'Ok')]");
      const [okBtn] = await this._page.$x(".//span[contains(text(), 'Ok')]");
      okBtn.click();
    }
  }

  async listOnMarket(startPrice: number, buyNowPrice: number, duration: string) {
    await this._page.waitForXPath(".//span[contains(text(), 'List on Transfer Market')]");
    const [listOptionBtn] = await this._page.$x(".//span[contains(text(), 'List on Transfer Market')]");
    listOptionBtn.click();
    await FormsUtil.fillTextInput(this._page, "(.//input)[1]", startPrice.toString(), true);
    await FormsUtil.fillTextInput(this._page, "(.//input)[2]", buyNowPrice.toString(), true);
    await FormsUtil.chooseSelectInput(this._page, ".//div[contains(@class, 'ut-drop-down-control')]", duration);
    await this._page.waitForXPath("//button[contains(@class, 'call-to-action')]");
    const [listBtn] = await this._page.$x("//button[contains(@class, 'call-to-action')]");
    listBtn.click();
  }
}
