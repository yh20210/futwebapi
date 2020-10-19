import { authenticator } from "otplib";
import { By, until, WebDriver } from "selenium-webdriver";
import { LoginParams } from "../Interfaces/LoginParams";
import Logger from "./Logger";

export default class LoginPage implements LoginPage {
  private _driver: WebDriver;
  private _logger: Logger;

  public constructor(driver: WebDriver, logger: Logger) {
    this._driver = driver;
    this._logger = logger;
  }

  public async goto() {
    const xGotoLoginBtn = By.xpath("//button[@class='btn-standard call-to-action']");
    await this._driver.get("https://www.ea.com/fifa/ultimate-team/web-app/");
    const gotoLoginBtn = await this._driver.findElement(xGotoLoginBtn);
    await gotoLoginBtn.click().catch((e) => this._logger.error(e));
  }

  public async login(params: LoginParams) {
    const { email, password, token } = params;
    const xEmailInput = By.xpath("//input[@name='email']");
    const xPasswordInput = By.xpath("//input[@name='password']");
    const xLoginBtn = By.xpath("//a[@id='btnLogin']");
    const xAppAuthRadioBtn = By.xpath("//strong[contains(text(), 'App Authenticator')]");
    const xSendCodeBtn = By.xpath("//a[@id='btnSendCode']");
    const xCodeInput = By.xpath("//input[@name='oneTimeCode']");
    const xSubmitCodeBtn = By.xpath("//a[@id='btnSubmit']");

    //Fill and submit login form
    const emailInput = await this._driver.findElement(xEmailInput);
    const passwordInput = await this._driver.findElement(xPasswordInput);
    const loginBtn = await this._driver.findElement(xLoginBtn);
    await emailInput.sendKeys(email);
    await passwordInput.sendKeys(password);
    await loginBtn.click().catch((e) => this._logger.error(e));

    //Fill and submit 2fa form
    const code = authenticator.generate(token);
    const appAuthRadioBtn = await this._driver.findElement(xAppAuthRadioBtn);
    const sendCodeBtn = await this._driver.findElement(xSendCodeBtn);
    await appAuthRadioBtn.click().catch();
    await sendCodeBtn.click().catch();
    const codeInput = await this._driver.findElement(xCodeInput);
    const submitCodeBtn = await this._driver.findElement(xSubmitCodeBtn);
    await codeInput.sendKeys(code);
    await submitCodeBtn.click().catch((e) => this._logger.error(e));
  }
}
