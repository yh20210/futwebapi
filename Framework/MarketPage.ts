import { By, Key, WebDriver } from "selenium-webdriver";
import IMarketPage from "../Interfaces/IMarketPage";
import { IListItemParams } from "../Interfaces/IListItemParams";
import { ISearchPlayerParams } from "../Interfaces/ISearchPlayerParams";
import Logger from "./Logger";
import Util from "./Util";

export default class MarketPage implements IMarketPage {
  private _driver: WebDriver;
  private _logger: Logger;
  private _util: Util;

  public constructor(driver: WebDriver, logger: Logger) {
    this._driver = driver;
    this._logger = logger;
    this._util = new Util(driver);
  }

  public async goto() {
    const xGotoMarket = By.xpath("//button[contains(@class, 'icon-transfer')]");
    const gotoMarketBtn = await this._driver.findElement(xGotoMarket);
    await this._util
      .clickPreventShield(gotoMarketBtn)
      .catch((e) => this._logger.error(e));
  }

  public async gotoSearch() {
    const xGotoSearch = By.xpath("//div[contains(@class, 'ut-tile-transfer-market')]");
    const gotoSearchBtn = await this._driver.findElement(xGotoSearch);
    await this._util
      .clickPreventShield(gotoSearchBtn)
      .catch((e) => this._logger.error(e));
  }

  public async gotoTransferList() {
    const xGotoTransferList = By.xpath("//button[contains(@class, 'icon-transfer')]");
    const gotoTransferList = await this._driver.findElement(xGotoTransferList);
    await gotoTransferList.click().catch((e) => this._logger.error(e));
  }

  public async setSearchOptions(params: ISearchPlayerParams) {
    const xNameInput = By.xpath("//input[contains(@placeholder, 'Player Name')]");
    const xQualitySelect = By.xpath("//span[contains(text(), 'Quality')]");
    const xRaritySelect = By.xpath("//span[contains(text(), 'Rarity')]");
    const xPositionSelect = By.xpath("//span[contains(text(), 'Position')]");
    const xChemistrySelect = By.xpath("//span[contains(text(), 'Chemistry Style')]");
    const xNationalitySelect = By.xpath("//span[contains(text(), 'Nationality')]");
    const xLeagueSelect = By.xpath("//span[contains(text(), 'League')]");
    const xClubSelect = By.xpath("//span[contains(text(), 'Club')]");
    const xMinBidInput = By.xpath("(//input)[2]");
    const xMaxBidInput = By.xpath("(//input)[3]");
    const xMinBuyNowInput = By.xpath("(//input)[4]");
    const xMaxBuyNowInput = By.xpath("(//input)[5]");

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

    if (params.name) {
      await this._util.sendKeysPreventShield(params.name, nameInput);
      const xPlayerOption = By.xpath("//span[contains(@class, 'btn-text')]");
      const playerOption = await this._driver.findElement(xPlayerOption);
      await playerOption.click().catch((e) => this._logger.error(e));
    }
    params.quality && (await this._util.selectOption(params.quality, qualitySelect));
    params.rarity && (await this._util.selectOption(params.rarity, raritySelect));
    params.position && (await this._util.selectOption(params.position, positionSelect));
    params.chem && (await this._util.selectOption(params.chem, chemSelect));
    params.nation && (await this._util.selectOption(params.nation, nationSelect));
    params.league && (await this._util.selectOption(params.league, leagueSelect));
    params.club && (await this._util.selectOption(params.club, clubSelect));
    params.minBid && (await this._util.sendKeysPreventShield(params.minBid, minBidInput));
    params.maxBid && (await this._util.sendKeysPreventShield(params.maxBid, maxBidInput));
    params.minBuyNow &&
      (await this._util.sendKeysPreventShield(params.minBuyNow, minBuyNowInput));
    params.maxBuyNow &&
      (await this._util.sendKeysPreventShield(params.maxBuyNow, maxBuyNowInput));
  }

  public async search() {
    const xSearchBtn = By.xpath("//button[contains(@class, 'call-to-action')]");
    const searchBtn = await this._driver.findElement(xSearchBtn);
    await searchBtn.click().catch((e) => this._logger.error(e));
  }

  public async buyNow(quantity: number = -1, maxBuyNowConfirm: number) {
    const xResultItems = By.xpath("//li[contains(@class, 'listFUTItem')]");
    await this._util.updateFindTimeout(2000);
    let resultItems = await this._driver.findElements(xResultItems);
    await this._util.updateFindTimeout(20000);

    if (resultItems.length === 0) {
      return;
    }

    if (quantity !== -1) {
      resultItems = resultItems.slice(0, quantity);
    }

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

      //Check if item is expired
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
    }
  }

  public async listOnMarket(params: IListItemParams) {
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
      await startBidInput.sendKeys(eraseStartBidInput + params.startBid);
      await buyNowInput.sendKeys(eraseBuyNowInput + params.buyNow);
      await this._util
        .selectOption(params.duration, durationSelect)
        .catch((e) => this._logger.error(e));
      await this._util
        .clickPreventShield(listOnMarketBtn)
        .catch((e) => this._logger.error(e));

      await this._util.sleep(600);
    }
  }

  public async back() {
    const xBackBtn = By.xpath("//button[@class='ut-navigation-button-control']");
    const backBtn = this._driver.findElement(xBackBtn);
    await this._util.clickPreventShield(backBtn);
  }
}
