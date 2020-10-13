import { ElementHandle, Page } from "puppeteer";
import { ListItemParams } from "../Models/ListItemParams";
import { SearchPlayerParams } from "../Models/SearchPlayerParams";
import { DomUtils } from "../Utils/DomUtils";
import { TimesUtil } from "../Utils/TimeUtil";
import { WebappPage } from "./WebappPage";

export class MarketPage extends WebappPage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<boolean> {
    try {
      await DomUtils.click(this._page, "//button[contains(@class, 'icon-transfer')]");
      await TimesUtil.delay(4000);
      await DomUtils.click(this._page, "//div[contains(@class, 'ut-tile-transfer-market')]");
    } catch (e) {
      return false;
    }
    return true;
  }

  async setPlayerSearchParams(params: SearchPlayerParams) {
    if (params.name) {
      await DomUtils.fillTextInput(this._page, "//*[contains(@class, 'ut-text-input-control')]", params.name, true);
      await DomUtils.click(
        this._page,
        `.//span[contains(@class, 'btn-text')]/following-sibling::span[text()='${params.rating}']`
      );
    }
    if (params.quality) {
      await DomUtils.chooseSelectInput(this._page, "//img[@src='images/SearchFilters/level/any.png']", params.quality);
    }
    if (params.rarity) {
      await DomUtils.chooseSelectInput(this._page, "//img[@src='images/SearchFilters/rarity/any.png']", params.rarity);
    }
    if (params.position) {
      await DomUtils.chooseSelectInput(
        this._page,
        "//img[@src='https://www.ea.com/fifa/ultimate-team/web-app/content/21D4F1AC-91A3-458D-A64E-895AA6D871D1/2021/fut/items/images/mobile/positions/default.png']",
        params.position
      );
    }
    if (params.chemestry) {
      await DomUtils.chooseSelectInput(
        this._page,
        "//img[@src='https://www.ea.com/fifa/ultimate-team/web-app/content/21D4F1AC-91A3-458D-A64E-895AA6D871D1/2021/fut/items/images/mobile/chemistrystyles/list/default.png']",
        params.chemestry
      );
    }
    if (params.nationality) {
      await DomUtils.chooseSelectInput(
        this._page,
        "//img[@src='https://www.ea.com/fifa/ultimate-team/web-app/content/21D4F1AC-91A3-458D-A64E-895AA6D871D1/2021/fut/items/images/mobile/flags/list/default.png']",
        params.nationality
      );
    }
    if (params.league) {
      await DomUtils.chooseSelectInput(
        this._page,
        "//img[@src='https://www.ea.com/fifa/ultimate-team/web-app/content/21D4F1AC-91A3-458D-A64E-895AA6D871D1/2021/fut/items/images/mobile/leagueLogos/dark/default.png']",
        params.league
      );
    }
    if (params.club) {
      await DomUtils.chooseSelectInput(
        this._page,
        "//img[@src='https://www.ea.com/fifa/ultimate-team/web-app/content/21D4F1AC-91A3-458D-A64E-895AA6D871D1/2021/fut/items/images/mobile/clubs/dark/default.png']",
        params.club
      );
      await TimesUtil.delay(500);
    }
    if (params.minBuyNow) {
      await DomUtils.fillTextInput(this._page, "(.//input)[3]", params.minBuyNow.toString(), true);
    }
    if (params.maxBuyNow) {
      await DomUtils.fillTextInput(this._page, "(.//input)[5]", params.maxBuyNow.toString(), true);
    }
  }

  async search() {
    await this._page.click(".call-to-action");
  }

  async buyNow(quantity: number = -1): Promise<ElementHandle[]> {
    if (await DomUtils.doExists(this._page, "//span[contains(@class, 'no-results-icon')]")) {
      return [];
    }
    await this._page.waitForXPath(".//li[contains(@class, 'listFUTItem')]");
    const items = await this._page.$x(".//li[contains(@class, 'listFUTItem')]");
    const availableItems: ElementHandle[] = [];
    for (let i = 0; i < (quantity !== -1 ? quantity : items.length); i++) {
      const item = items[i];
      await item.click();
      await TimesUtil.delay(300);
      if (!(await DomUtils.isDisabled(this._page, "//button[contains(@class, 'buyButton')]", 0))) {
        await DomUtils.click(this._page, "//button[contains(@class, 'buyButton')]");
        await DomUtils.click(this._page, "//span[contains(text(), 'Ok')]");
        availableItems.push(item);
        await TimesUtil.delay(300);
      }
    }
    return availableItems;
  }

  async listOnMarket(items: ElementHandle[], params: ListItemParams) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      await TimesUtil.delay(1500);
      item.click();
      await this._page.waitForXPath(".//span[contains(text(), 'List on Transfer Market')]");
      const [listOptionBtn] = await this._page.$x(".//span[contains(text(), 'List on Transfer Market')]");
      await TimesUtil.delay(1500);
      await listOptionBtn.click();
      await DomUtils.fillTextInput(this._page, "(.//input)[1]", params.startBid.toString(), true);
      await DomUtils.fillTextInput(this._page, "(.//input)[2]", params.buyNow.toString(), true);
      await DomUtils.chooseSelectInput(this._page, ".//div[contains(@class, 'ut-drop-down-control')]", params.duration);
      await DomUtils.click(this._page, "//button[contains(@class, 'call-to-action')]");
      await TimesUtil.delay(1500);
    }
  }
}
