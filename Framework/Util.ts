import { By, Key, WebDriver, WebElement } from "selenium-webdriver";

export default class Util {
  private _driver: WebDriver;

  public constructor(driver: WebDriver) {
    this._driver = driver;
  }

  public async selectOption(value: string, element: WebElement) {
    const xTargetOption = By.xpath(`//li[text()='${value}']`);
    await element.click();
    const targetOption = await this._driver.findElement(xTargetOption);
    await targetOption.click();
  }

  public async clickPreventShield(element: WebElement) {
    await element.click().catch(async (e: Error) => {
      if (e.name === "ElementClickInterceptedError") {
        await this.clickPreventShield(element);
      }
    });
  }

  public async sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  public async getBackspacesFrom(defaultValue: string) {
    var eraseCharSeq = "";
    for (var c of defaultValue.split("")) {
      eraseCharSeq += Key.BACK_SPACE;
    }
    return eraseCharSeq;
  }

  public async updateFindTimeout(ms: number) {
    await this._driver.manage().setTimeouts({
      implicit: ms,
    });
  }
}
