import * as dotenv from "dotenv";
import * as fs from "fs/promises";
import * as path from "path";
import { App } from "../Framework/App";

(async () => {
  dotenv.config();
  var playersFile = await fs.readFile(path.join(__dirname, "./players.txt"), "utf-8");
  var players = playersFile.split("\n");

  const app = new App();
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
      const name = player.split("||")[0];
      const maxBuyNow = parseInt(player.split("||")[1]);
      const sellBuyNow = parseInt(player.split("||")[2]);

      await app.marketPage.setSearchOptions({
        name,
        maxBuyNow,
      });
      await app.marketPage.search();
      //await app.marketPage.buyNow(1);
      await app.marketPage.listOnMarket({
        startBid: 150,
        buyNow: sellBuyNow,
        duration: "1 Hour",
      });
      await app.marketPage.back();
    }
  }
})();
