import { authenticator } from "otplib";
import { Page } from "puppeteer";
import { DomUtils } from "../Utils/DomUtils";
import { WebappPage } from "./WebappPage";

export class LoginPage extends WebappPage {
  constructor(page: Page) {
    super(page);
  }

  async login(email: string, password: string, token: string) {
    await DomUtils.click(this._page, "//button[@class='btn-standard call-to-action']");
    await DomUtils.fillTextInput(this._page, "//input[@name='email']", email, false);
    await DomUtils.fillTextInput(this._page, "//input[@name='password']", password, false);
    await DomUtils.click(this._page, "//a[@id='btnLogin']");

    if (await DomUtils.doExists(this._page, "/div[contains(text(), 'Your credentials are incorrect')]")) {
      throw new Error("Incorrect login credentials.");
    }

    await DomUtils.click(this._page, "//strong[contains(text(), 'App Authenticator')]", 500);
    await DomUtils.click(this._page, "//a[@id='btnSendCode']");
    await DomUtils.fillTextInput(this._page, "//input[@name='oneTimeCode']", authenticator.generate(token), false);
    await DomUtils.click(this._page, "//a[@id='btnSubmit']");

    if (
      await DomUtils.doExists(
        this._page,
        "//span[contains(text(), 'Incorrect code entered') and contains(@class, 'origin-ux-textbox-status-message')]"
      )
    ) {
      throw new Error("Incorrect verification code.");
    }

    await this._page.waitForSelector(".icon-home");
  }
}
