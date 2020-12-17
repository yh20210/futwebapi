import { By, WebDriver } from "selenium-webdriver";
import IMarketPage from "../Interfaces/IMarketPage";
import { IListItemOptions } from "../Interfaces/IListItemOptions";
import { ISearchPlayerOptions } from "../Interfaces/ISearchPlayerOptions";
import { ISearchConsumableOptions } from "../Interfaces/ISearchConsumableOptions";
import Logger from "./Logger";
import Util from "./Util";
import { Page } from "./Page";

export default class MarketPage extends Page implements IMarketPage {
  private _logger: Logger;
  private _util: Util;

  public constructor(driver: WebDriver, logger: Logger, util: Util) {
    super(driver);
    this._logger = logger;
    this._util = util;
  }

  public async goto() {
    try {
      await this._driver.executeScript(
        "window.services.Item.marketRepository.isCacheExpired = () => true;"
      );
      await this._util.updateFindTimeout(20000);
      const xGotoMarket = By.xpath("//button[contains(@class, 'icon-transfer')]");
      const gotoMarketBtn = await this._driver.findElement(xGotoMarket);
      await this._util
        .clickPreventShield(gotoMarketBtn)
        .catch((e) => this._logger.error(e));
    } catch (e) {
      await this._util.checkIfOtherDevice();
      await this._util.checkIfHaveClub();
    }
  }

  public async gotoSearch() {
    await this._util.updateFindTimeout(20000);
    await this._util.checkIfBlocked();
    const xGotoSearch = By.xpath("//div[contains(@class, 'ut-tile-transfer-market')]");
    const gotoSearchBtn = await this._driver.findElement(xGotoSearch);
    await this._util
      .clickPreventShield(gotoSearchBtn)
      .catch((e) => this._logger.error(e));
  }

  public async nextSearchPage() {
    try {
      const xNextBtn = By.xpath("//button[contains(@class, 'next')]");
      const nextBtn = await this._driver.findElement(xNextBtn);
      await this._util.clickPreventShield(nextBtn);
      await this._util.sleep(300);
    } catch (e) {}
  }

  public async gotoTransferList() {
    const xGotoTransferList = By.xpath("//button[contains(@class, 'icon-transfer')]");
    const gotoTransferList = await this._driver.findElement(xGotoTransferList);
    await gotoTransferList.click().catch((e) => this._logger.error(e));
  }

  public async setSearchPlayerOptions(options: ISearchPlayerOptions) {
    const xSelectString = "(//div[contains(@class, 'ut-search-filter-control--row')])";
    const xPlayerTab = By.xpath("//button[contains(text(),'Players')]");
    const xNameInput = By.xpath("//input[contains(@placeholder, 'Player Name')]");
    const xQualitySelect = By.xpath(xSelectString + "[1]");
    const xRaritySelect = By.xpath(xSelectString + "[2]");
    const xPositionSelect = By.xpath(xSelectString + "[3]");
    const xChemistrySelect = By.xpath(xSelectString + "[4]");
    const xNationalitySelect = By.xpath(xSelectString + "[5]");
    const xLeagueSelect = By.xpath(xSelectString + "[6]");
    const xClubSelect = By.xpath(xSelectString + "[7]");
    const xMinBidInput = By.xpath("(//input)[2]");
    const xMaxBidInput = By.xpath("(//input)[3]");
    const xMinBuyNowInput = By.xpath("(//input)[4]");
    const xMaxBuyNowInput = By.xpath("(//input)[5]");

    const playersTab = await this._driver.findElement(xPlayerTab);
    await playersTab.click();
    const nameInput = await this._driver.findElement(xNameInput);
    const qualitySelect = await this._driver.findElement(xQualitySelect);
    const raritySelect = await this._driver.findElement(xRaritySelect);
    const positionSelect = await this._driver.findElement(xPositionSelect);
    const chemSelect = await this._driver.findElement(xChemistrySelect);
    const nationSelect = await this._driver.findElement(xNationalitySelect);
    const leagueSelect = await this._driver.findElement(xLeagueSelect);
    const clubSelect = await this._driver.findElement(xClubSelect);
    const minBidInput = await this._driver.findElement(xMinBidInput);
    const maxBidInput = await this._driver.findElement(xMaxBidInput);
    const minBuyNowInput = await this._driver.findElement(xMinBuyNowInput);
    const maxBuyNowInput = await this._driver.findElement(xMaxBuyNowInput);

    if (options.name) {
      await this._util.sendKeysPreventShield(options.name, nameInput);
      const xPlayerOption = By.xpath("//span[contains(@class, 'btn-text')]");
      const playerOption = await this._driver.findElement(xPlayerOption);
      await playerOption.click().catch((e) => this._logger.error(e));
    }
    options.quality && (await this._util.selectOption(options.quality, qualitySelect));
    options.rarity && (await this._util.selectOption(options.rarity, raritySelect));
    options.position && (await this._util.selectOption(options.position, positionSelect));
    options.chem && (await this._util.selectOption(options.chem, chemSelect));
    options.nation && (await this._util.selectOption(options.nation, nationSelect));
    options.league && (await this._util.selectOption(options.league, leagueSelect));
    options.club && (await this._util.selectOption(options.club, clubSelect));
    options.minBid &&
      (await this._util.sendKeysPreventShield(options.minBid, minBidInput));
    options.maxBid &&
      (await this._util.sendKeysPreventShield(options.maxBid, maxBidInput));
    options.minBuyNow &&
      (await this._util.sendKeysPreventShield(options.minBuyNow, minBuyNowInput));
    options.maxBuyNow &&
      (await this._util.sendKeysPreventShield(options.maxBuyNow, maxBuyNowInput));
  }

  public async setSearchConsumableOptions(options: ISearchConsumableOptions) {
    const xSelectString = "(//div[contains(@class, 'ut-search-filter-control--row')])";
    const xConsumablesTab = By.xpath("//button[contains(text(), 'Consumables')]");
    const xTypeSelect = By.xpath(xSelectString + "[1]");
    const xQualitySelect = By.xpath(xSelectString + "[2]");
    const xSubtypeSelect = By.xpath(xSelectString + "[3]");
    const xMinBidInput = By.xpath("(//input)[2]");
    const xMaxBidInput = By.xpath("(//input)[3]");
    const xMinBuyNowInput = By.xpath("(//input)[4]");
    const xMaxBuyNowInput = By.xpath("(//input)[5]");

    const consumablesTab = await this._driver.findElement(xConsumablesTab);
    await consumablesTab.click();
    const typeSelect = await this._driver.findElement(xTypeSelect);
    const qualitySelect = await this._driver.findElement(xQualitySelect);
    const subtypeSelect = await this._driver.findElement(xSubtypeSelect).catch();
    const minBidInput = await this._driver.findElement(xMinBidInput);
    const maxBidInput = await this._driver.findElement(xMaxBidInput);
    const minBuyNowInput = await this._driver.findElement(xMinBuyNowInput);
    const maxBuyNowInput = await this._driver.findElement(xMaxBuyNowInput);

    options.type && (await this._util.selectOption(options.type, typeSelect));
    options.quality && (await this._util.selectOption(options.quality, qualitySelect));
    options.subtype &&
      subtypeSelect &&
      (await this._util.selectOption(options.subtype, subtypeSelect));

    options.minBid &&
      (await this._util.sendKeysPreventShield(options.minBid, minBidInput));
    options.maxBid &&
      (await this._util.sendKeysPreventShield(options.maxBid, maxBidInput));
    options.minBuyNow &&
      (await this._util.sendKeysPreventShield(options.minBuyNow, minBuyNowInput));
    options.maxBuyNow &&
      (await this._util.sendKeysPreventShield(options.maxBuyNow, maxBuyNowInput));
  }

  public async search() {
    this._util.httpHook();
    await this._driver.executeScript("this.services.User.requestMassInfo()");
    const xSearchBtn = By.xpath("//button[contains(@class, 'call-to-action')]");
    const searchBtn = await this._driver.findElement(xSearchBtn);
    await searchBtn.click().catch((e) => this._logger.error(e));
  }

  //This function should be assigned by library users
  public onSearchHttpIntercept(data: any) {}

  public async buyNow(quantity: number = -1, maxBuyNowConfirm: number) {
    const xResultItems = By.xpath("//li[contains(@class, 'listFUTItem')]");
    await this._util.updateFindTimeout(2000);
    let resultItems = await this._driver.findElements(xResultItems);
    await this._util.updateFindTimeout(20000);

    if (resultItems.length === 0) return 0;
    if (quantity !== -1) resultItems = resultItems.slice(0, quantity);

    for (var item of resultItems) {
      this._util.clickPreventShield(item);

      const xOkBuyNowBtn = By.xpath("//span[contains(text(), 'Ok')]");
      const xBuyNowBtn = By.xpath("//button[contains(@class, 'buyButton')]");
      await this._util.sleep(100);
      const buyNowBtn = await this._driver.findElement(xBuyNowBtn);
      const buyNowBtnDisabled = await buyNowBtn.getAttribute("disabled");
      const buyNowBtnClassName = await buyNowBtn.getAttribute("className");
      const itemPrice = (await buyNowBtn.getText())
        .replace("Buy Now for", "")
        .replace(",", "")
        .trim();
      if (buyNowBtnDisabled !== null || buyNowBtnClassName.includes("disabled")) {
        return;
      }

      const itemClassName = await item.getAttribute("className");
      if (itemClassName.includes("expired")) {
        return;
      }

      if (parseInt(itemPrice) <= maxBuyNowConfirm) {
        await this._util.clickPreventShield(buyNowBtn);
        const okBuyNowBtn = await this._driver.findElement(xOkBuyNowBtn);
        await this._util.clickPreventShield(okBuyNowBtn);
        await this._util.sleep(600);
      }
      return resultItems.length;
    }
  }

  //This function should be implemented by library users
  public onBuyNowHttpIntercept(data: any) {}

  public async listOnMarket(options: IListItemOptions) {
    const xWonItems = By.xpath("//li[contains(@class, 'won')]");
    await this._util.updateFindTimeout(1000);
    const wonItems = await this._driver.findElements(xWonItems);
    await this._util.updateFindTimeout(20000);

    for (var item of wonItems) {
      this._util.clickPreventShield(item);

      const xListOption = By.xpath("//span[contains(text(), 'List on Transfer Market')]");
      const xStartBidInput = By.xpath("(//input)[1]");
      const xBuyNowInput = By.xpath("(//input)[2]");
      const xDurationSelect = By.xpath("//div[contains(@class, 'ut-drop-down-control')]");
      const xListOnMarketBtn = By.xpath("//button[contains(@class, 'call-to-action')]");

      const listOption = await this._driver.findElement(xListOption);
      const startBidInput = await this._driver.findElement(xStartBidInput);
      const buyNowInput = await this._driver.findElement(xBuyNowInput);
      const durationSelect = await this._driver.findElement(xDurationSelect);
      const listOnMarketBtn = await this._driver.findElement(xListOnMarketBtn);
      const eraseStartBidInput = await this._util.getBackspacesFrom(
        await startBidInput.getAttribute("value")
      );
      const eraseBuyNowInput = await this._util.getBackspacesFrom(
        await buyNowInput.getAttribute("value")
      );

      await this._util.clickPreventShield(listOption).catch((e) => this._logger.error(e));
      await startBidInput.sendKeys(eraseStartBidInput + options.startBid);
      await buyNowInput.sendKeys(eraseBuyNowInput + options.buyNow);
      await this._util
        .selectOption(options.duration, durationSelect)
        .catch((e) => this._logger.error(e));

      await this._util
        .clickPreventShield(listOnMarketBtn)
        .catch((e) => this._logger.error(e));

      await this._util.sleep(600);
    }
  }

  //This function should be implemented by library users
  public onListOnMarketHttpIntercept(data: any) {}

  public async back() {
    const xBackBtn = By.xpath("//button[@class='ut-navigation-button-control']");
    const backBtn = this._driver.findElement(xBackBtn);
    await this._util.clickPreventShield(backBtn);
  }
}
