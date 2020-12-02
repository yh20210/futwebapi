import { By, Key, WebDriver, WebElement } from "selenium-webdriver";

export default class Util {
  private _driver: WebDriver;

  public constructor(driver: WebDriver) {
    this._driver = driver;
  }

  public httpHook() {
    this._driver.executeScript(`
      ((() => {
          const origOpen = XMLHttpRequest.prototype.open;
          XMLHttpRequest.prototype.open = function() {
              this.addEventListener('load', function() {
                  fetch("http://localhost:3000", {
                    method: 'POST',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      body: this.responseText,
                      url: this.responseURL
                    })
                  })
              });
              origOpen.apply(this, arguments);
          };
      }))();
    `);
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

  public async sendKeysPreventShield(value: string | number, element: WebElement) {
    let elementValue = await element.getAttribute("value");
    const backspaces = await this.getBackspacesFrom(elementValue);
    let chars = value.toString().split("");
    await element.sendKeys(backspaces);
    for (var i = 0; i < chars.length; i++) {
      if (i === 0) {
        await element.sendKeys(chars[i]);
        await this.sleep(120);
        await element.sendKeys(Key.ARROW_RIGHT);
      } else {
        await element.sendKeys(chars[i]);
        await this.sleep(120);
      }
      if (i === chars.length - 1) {
        await this.sleep(800);
      }
    }
  }
}
