import { Browser } from "puppeteer";
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
  private _activePage = "login";
  private _browser: Browser;
  private _loginPage: LoginPage;
  private _marketPage: MarketPage;

  constructor() {}

  async init(): Promise<void> {
    this._browser = await puppeteer.launch({
      args: this._browserArgs,
      headless: false,
      defaultViewport: { width: 1280, height: 720 },
    });
    const _browserPage = await this._browser.newPage();
    await _browserPage.goto("https://www.ea.com/fifa/ultimate-team/web-app/");

    this._loginPage = new LoginPage(_browserPage);
    this._marketPage = new MarketPage(_browserPage);
  }

  async login(email: string, password: string, token: string): Promise<void> {
    const didLogin = await this._loginPage.handle(email, password, token);
    if (didLogin) {
      this._activePage = "home";
    }
  }

  async openMarket(): Promise<MarketPage | null> {
    const didOpen = await this._marketPage.open();
    if (didOpen) {
      this._activePage = "market";
      return this._marketPage;
    }
    return null;
  }

  public getActivePage(): string {
    return this._activePage;
  }
}
