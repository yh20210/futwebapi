import { O_TRUNC } from "constants";
import { authenticator } from "otplib";
import { By, WebDriver } from "selenium-webdriver";
import { ILoginOptions } from "../Interfaces/ILoginOptions";
import Logger from "./Logger";
import Util from "./Util";

export default class LoginPage implements LoginPage {
  private _driver: WebDriver;
  private _logger: Logger;
  private _util: Util;

  public constructor(driver: WebDriver, logger: Logger) {
    this._driver = driver;
    this._logger = logger;
    this._util = new Util(driver);
  }

  public async goto() {
    const xGotoLoginBtn = By.xpath("//button[@class='btn-standard call-to-action']");
    await this._driver.get("https://www.ea.com/fifa/ultimate-team/web-app/");
    const gotoLoginBtn = await this._driver.findElement(xGotoLoginBtn);
    await gotoLoginBtn.click().catch((e) => this._logger.error(e));
  }

  public async login(options: ILoginOptions) {
    const { email, password, token } = options;
    const xEmailInput = By.xpath("//input[@name='email']");
    const xPasswordInput = By.xpath("//input[@name='password']");
    const xLoginBtn = By.xpath("//a[@id='btnLogin']");
    const xAppAuthRadioBtn = By.xpath("//strong[contains(text(), 'App Authenticator')]");
    const xSendCodeBtn = By.xpath("//a[@id='btnSendCode']");
    const xCodeInput = By.xpath("//input[@name='oneTimeCode']");
    const xSubmitCodeBtn = By.xpath("//a[@id='btnSubmit']");
    const xWrongCreds = By.xpath("//div[contains(text(), 'credentials are incorrect')]");
    const xWrongCode = By.xpath("//span[contains(text(), 'Incorrect code entered')]");

    //Fill and submit login form
    const emailInput = await this._driver.findElement(xEmailInput);
    const passwordInput = await this._driver.findElement(xPasswordInput);
    const loginBtn = await this._driver.findElement(xLoginBtn);
    await emailInput.sendKeys(email);
    await passwordInput.sendKeys(password);
    await loginBtn.click().catch((e) => this._logger.error(e));

    //Check for wrong credentials
    let areCredsWrong = false;
    try {
      await this._util.updateFindTimeout(1000);
      await this._driver.findElement(xWrongCreds);
      areCredsWrong = true;
    } catch (e) {
      await this._util.updateFindTimeout(20000);
    }
    if (areCredsWrong) throw new Error("Wrong credentials provided.");

    //Fill and submit 2fa form
    let code;
    if (options.code) code = options.code.toString();
    if (options.token) code = authenticator.generate(token);
    const appAuthRadioBtn = await this._driver.findElement(xAppAuthRadioBtn);
    const sendCodeBtn = await this._driver.findElement(xSendCodeBtn);
    await appAuthRadioBtn.click().catch();
    await sendCodeBtn.click().catch();
    const codeInput = await this._driver.findElement(xCodeInput);
    const submitCodeBtn = await this._driver.findElement(xSubmitCodeBtn);
    await codeInput.sendKeys(code);
    await submitCodeBtn.click().catch((e) => this._logger.error(e));

    //Check for wrong code
    let isCodeWrong = false;
    try {
      await this._util.updateFindTimeout(1000);
      await this._driver.findElement(xWrongCode);
      isCodeWrong = true;
    } catch (e) {
      await this._util.updateFindTimeout(20000);
    }
    if (isCodeWrong) throw new Error("Wrong 2fa code or token provided.");
  }
}
