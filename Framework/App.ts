import { Builder } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome";
import Logger from "./Logger";
import LoginPage from "./LoginPage";
import MarketPage from "./MarketPage";

export class App {
  private _loginPage: LoginPage;
  private _marketPage: MarketPage;

  public async init() {
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
    const driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    driver.manage().setTimeouts({
      implicit: 20000,
    });

    const logger = new Logger({ type: "console" });

    this._loginPage = new LoginPage(driver, logger);
    this._marketPage = new MarketPage(driver, logger);
  }

  public get loginPage() {
    return this._loginPage;
  }

  public get marketPage() {
    return this._marketPage;
  }
}
