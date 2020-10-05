import { authenticator } from "otplib";
import { Page } from "puppeteer";
import { DomUtils } from "../Utils/DomUtils";
import { WebappPage } from "./WebappPage";

export class LoginPage extends WebappPage {
  constructor(page: Page) {
    super(page);
  }

  async handle(email: string, password: string, token: string): Promise<boolean> {
    try {
      await DomUtils.click(this._page, "//button[@class='btn-standard call-to-action']");
      await DomUtils.fillTextInput(this._page, "//input[@name='email']", email, false);
      await DomUtils.fillTextInput(this._page, "//input[@name='password']", password, false);
      await DomUtils.click(this._page, "//a[@id='btnLogin']");
      await this._page.waitForSelector(".origin-ux-radio-button-control");
      await this._page.evaluate(this.setAuthenticatorRadioOption);
      await DomUtils.fillTextInput(this._page, "//input[@name='oneTimeCode']", authenticator.generate(token), false);
      await DomUtils.click(this._page, "//a[@id='btnSubmit']");
      await this._page.waitForSelector(".icon-home");
    } catch (e) {
      return false;
    }
    return true;
  }

  private setAuthenticatorRadioOption() {
    const authenticatorRadioBtn = document.querySelectorAll(".origin-ux-radio-button-control")[1] as HTMLButtonElement;
    const sendCodeBtn = document.querySelector("#btnSendCode") as HTMLButtonElement;
    authenticatorRadioBtn.click();
    sendCodeBtn.click();
  }
}
