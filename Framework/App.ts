import { Builder, By, Capabilities } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome";
import { Level, Preferences, Type } from "selenium-webdriver/lib/logging";
import Logger from "./Logger";
import LoginPage from "./LoginPage";
import MarketPage from "./MarketPage";
import express, { Application, Request, Response } from "express";
import { IAppOptions } from "../Interfaces/IAppOptions";
import Util from "./Util";

export class App {
  private _driveName: string;
  private _loginPage: LoginPage;
  private _marketPage: MarketPage;
  private _server: Application;
  private interceptPort: number;

  public constructor(options: IAppOptions) {
    this._driveName = options.driverName;
    this._server = express();
    this.interceptPort = options.interceptPort;
  }

  private async _interceptHttp(req: Request, res: Response) {
    let body = {};
    try {
      body = JSON.parse(req.body.body);
    } catch (e) {
      body = {};
    }
    if (req.body.url.includes("ut/game/fifa21/transfermarket")) {
      this._marketPage.onSearchHttpIntercept(body);
    } else if (
      req.body.url.includes("ut/game/fifa21/trade/") &&
      req.body.url.includes("bid")
    ) {
      this._marketPage.onBuyNowHttpIntercept(body);
    } else if (req.body.url.includes("ut/game/fifa21/trade/status?tradeIds")) {
      this._marketPage.onListOnMarketHttpIntercept(body);
    }
    res.end();
  }

  public async init() {
    this._server.use(express.json());
    this._server.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    });
    this._server.post("/", this._interceptHttp.bind(this));
    this._server.listen(this.interceptPort, () => {
      console.log(`Http interceptor listen on port ${this.interceptPort}`);
    });
    const options = new Options();
    options.addArguments("--disable-setuid-sandbox");
    options.addArguments("--disable-automation");
    options.addArguments("--disable-blink-features=AutomationControlled");
    options.addArguments("--disable-infobars");
    options.addArguments(
      'user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36'
    );
    options.setUserPreferences({
      "dom.webdriver.enabled": false,
      "profile.password_manager_enabled": false,
      credentails_enable_serivce: false,
    });
    const logPrefs = new Preferences();
    logPrefs.setLevel(Type.PERFORMANCE, Level.ALL);
    const driver = await new Builder()
      .setChromeOptions(options)
      .withCapabilities(Capabilities.chrome)
      .setLoggingPrefs(logPrefs)
      .forBrowser(this._driveName)
      .build();

    driver.manage().setTimeouts({
      implicit: 20000,
    });
    const logger = new Logger({ type: "console" });
    const util = new Util(driver, this.interceptPort);
    this._loginPage = new LoginPage(driver, logger, util);
    this._marketPage = new MarketPage(driver, logger, util);
  }

  public get loginPage() {
    return this._loginPage;
  }

  public get marketPage() {
    return this._marketPage;
  }
}
