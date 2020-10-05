import { authenticator } from "otplib";
import { Browser, Page } from "puppeteer";
import { WebappPage } from "./WebappPage";

export class LoginPage extends WebappPage {
  constructor(page: Page) {
    super(page);
  }

  async handle(email: string, password: string, token: string): Promise<boolean> {
    try {
      await this._page.waitForSelector("button[class='btn-standard call-to-action']");
      await this._page.click("button[class='btn-standard call-to-action']");
      await this._page.waitForSelector("input[name=email]");
      await this._page.waitForSelector("input[name=password]");
      await this._page.waitForSelector("#btnLogin");
      await this._page.evaluate(this.fillLoginForm, email, password);
      await this._page.waitForSelector(".origin-ux-radio-button-control");
      await this._page.evaluate(this.setAuthenticatorRadioOption);
      await this._page.waitForSelector("input[name=oneTimeCode");
      await this._page.evaluate(this.fillSecurityCodeForm, authenticator.generate(token));
      await this._page.waitForSelector(".icon-home");
    } catch (e) {
      return false;
    }
    return true;
  }

  private fillLoginForm(email: string, password: string) {
    const emailInput = document.querySelector("input[name=email]") as HTMLInputElement;
    const passwordInput = document.querySelector("input[name=password]") as HTMLInputElement;
    var submitBtn = document.querySelector("#btnLogin") as HTMLButtonElement;
    emailInput.value = email;
    passwordInput.value = password;
    submitBtn.click();
  }

  private setAuthenticatorRadioOption() {
    const authenticatorRadioBtn = document.querySelectorAll(".origin-ux-radio-button-control")[1] as HTMLButtonElement;
    const sendCodeBtn = document.querySelector("#btnSendCode") as HTMLButtonElement;
    authenticatorRadioBtn.click();
    sendCodeBtn.click();
  }

  private fillSecurityCodeForm(code: string) {
    const codeInput = document.querySelector("input[name=oneTimeCode]") as HTMLInputElement;
    codeInput.value = code;
    const submitBtn = document.querySelector("#btnSubmit") as HTMLButtonElement;
    submitBtn.click();
  }
}
