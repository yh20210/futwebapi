import { Page } from "puppeteer";
import { TimesUtil } from "./TimeUtil";

export class DomUtils {
  public static async fillTextInput(page: Page, xpath: string, value: string, preventFirstCharErase: boolean) {
    await page.waitForXPath(xpath);
    const [input] = await page.$x(xpath);
    await input.type((preventFirstCharErase ? value.charAt(0) : "") + value, { delay: 100 });
  }

  public static async chooseSelectInput(page: Page, xpath: string, value: string) {
    await page.waitForXPath(xpath);
    const [dropdown] = await page.$x(xpath);
    await dropdown.click();
    await page.waitForXPath(`//li[text()='${value}']`);
    const [option] = await page.$x(`//li[text()='${value}']`);
    option.click();
  }

  public static async click(page: Page, xpath: string) {
    await page.waitForXPath(xpath);
    const [button] = await page.$x(xpath);
    button.click();
  }
}
