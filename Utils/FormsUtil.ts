import { Page } from "puppeteer";
import { TimesUtil } from "./TimeUtil";

export class FormsUtil {
  public static async fillTextInput(page: Page, xpath: string, value: string, preventFirstCharErase: boolean) {
    await page.waitForXPath(xpath);
    const [input] = await page.$x(xpath);
    await input.type((preventFirstCharErase ? value.charAt(0) : "") + value, { delay: 100 });
  }

  public static async chooseSelectInput(page: Page, selector: string, value: string) {
    await page.waitForSelector(selector);
    await page.click(selector);
    await page.waitForXPath(`//li[text()='${value}']`);
    const [option] = await page.$x(`//li[text()='${value}']`);
    option.click();
  }
}
