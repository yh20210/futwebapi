import { By, WebDriver } from "selenium-webdriver";

export class Page {
  protected _driver: WebDriver;

  protected constructor(driver: WebDriver) {
    this._driver = driver;
  }

  public async getCoins() {
    const xCoins = By.xpath("//div[contains(@class, 'view-navbar-currency-coins')]");
    const coinsElem = await this._driver.findElement(xCoins);
    return coinsElem.getText();
  }
}
