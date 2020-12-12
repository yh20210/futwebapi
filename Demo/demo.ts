import * as dotenv from "dotenv";
import * as fs from "fs/promises";
import * as path from "path";
import { App } from "../Framework/App";

async function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

(async () => {
  dotenv.config();
  var playersFile = await fs.readFile(path.join(__dirname, "./players.txt"), "utf-8");
  var players = playersFile.split("\n");

  const app = new App("chrome");
  await app.init();

  await app.loginPage.goto();
  await app.loginPage.login({
    email: process.env.EA_EMAIL,
    password: process.env.EA_PASSWORD,
    token: process.env.EA_TOKEN,
  });

  await app.marketPage.goto();
  await app.marketPage.gotoSearch();

  while (true) {
    for (var player of players) {
      await app.marketPage.search();
      await app.marketPage.nextSearchPage();
      await app.marketPage.nextSearchPage();
      //await app.marketPage.back();
      await sleep(10000);
    }
  }
})();
