import { Browser, Page } from "puppeteer";
import * as puppeteer from "puppeteer";
import { LoginPage } from "./Pages/LoginPage";
import { MarketPage } from "./Pages/MarketPage";

export class Webapp {
  private _browserArgs = [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-automation",
    "--disable-blink-features=AutomationControlled",
    "--disable-infobars",
    "--window-position=0,0",
    "--ignore-certifcate-errors",
    "--ignore-certifcate-errors-spki-list",
    '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
  ];
  private _browser: Browser;
  private _browserPage: Page;
  private _loginPage: LoginPage;
  private _marketPage: MarketPage;
  constructor() {}

  async init(): Promise<void> {
    this._browser = await puppeteer.launch({
      args: this._browserArgs,
      headless: false,
      defaultViewport: { width: 1280, height: 720 },
    });
    this._browserPage = await this._browser.newPage();
    await this._browserPage.goto("https://www.ea.com/fifa/ultimate-team/web-app/");

    this._loginPage = new LoginPage(this._browserPage);
    this._marketPage = new MarketPage(this._browserPage);
  }

  getLoginPage(): LoginPage {
    return this._loginPage;
  }

  getMarketPage(): MarketPage {
    return this._marketPage;
  }

  async getCoins(): Promise<number> {
    this._browserPage.waitForXPath("//div[contains(@class, 'view-navbar-currency-coins')]");
    const [coinsElem] = await this._browserPage.$x("//div[contains(@class, 'view-navbar-currency-coins')]");
    const coinsText = (await (await coinsElem.getProperty("textContent")).jsonValue()) as string;
    return parseInt(coinsText.replace(",", ""));
  }
}
