import { Page } from "puppeteer";
import { TimesUtil } from "./TimeUtil";

export class DomUtils {
  public static async fillTextInput(page: Page, xpath: string, value: string, preventFirstCharErase: boolean) {
    await page.waitForXPath(xpath, { visible: true });
    const [input] = await page.$x(xpath);
    await input.type((preventFirstCharErase ? value.charAt(0) : "") + value, { delay: 100 });
  }

  public static async chooseSelectInput(page: Page, xpath: string, value: string, delay: number = 300) {
    await page.waitForXPath(xpath, { visible: true });
    const [dropdown] = await page.$x(xpath);
    TimesUtil.delay(delay);
    await dropdown.click();
    await page.waitForXPath(`//li[text()='${value}']`);
    TimesUtil.delay(delay);
    const [option] = await page.$x(`//li[text()='${value}']`);
    option.click();
  }

  public static async click(page: Page, xpath: string, delay: number = 300) {
    await page.waitForXPath(xpath, { visible: true });
    const [button] = await page.$x(xpath);
    TimesUtil.delay(delay);
    button.click();
  }

  public static async isDisabled(page: Page, xpath: string, delay: number = 300) {
    await page.waitForXPath(xpath, { visible: true });
    const [button] = await page.$x(xpath);
    TimesUtil.delay(delay);
    const classNames = (await (await button.getProperty("className")).jsonValue()) as string;
    const disabledProp = await (await button.getProperty("disabled")).jsonValue();
    return classNames.includes("disabled") || disabledProp !== false;
  }

  public static async doExists(page: Page, xpath: string) {
    try {
      await page.waitForXPath(xpath, { timeout: 2000 });
    } catch (e) {
      return false;
    }
    return true;
  }
}
