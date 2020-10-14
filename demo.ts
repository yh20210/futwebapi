import { Webapp } from "./Webapp";
import * as dotenv from "dotenv";
import { TimesUtil } from "./Utils/TimeUtil";

(async () => {
  dotenv.config();
  const webapp = new Webapp();
  const minBuys = [150, 200, 250, 300];
  await webapp.init();
  const loginPage = webapp.getLoginPage();
  const marketPage = webapp.getMarketPage();

  await loginPage.login(process.env.EA_EMAIL, process.env.EA_PASSWORD, process.env.EA_TOKEN);

  console.log("You have --> " + (await webapp.getCoins()) + " coins");
  await marketPage.openSearchMarket();
  await marketPage.setPlayerSearchParams({
    //name: "Carlos Vela",
    //rating: 83,
    quality: "Bronze",
  });
  var i = 0;
  while (true) {
    if (i >= 3) {
      i = 0;
    }
    await marketPage.setPlayerSearchParams({
      minBuyNow: minBuys[i],
      maxBuyNow: 200,
    });
    await marketPage.search();
    const boughtItems = await marketPage.buyNow(2);
    await marketPage.listOnMarket(boughtItems, {
      startBid: 150,
      buyNow: 250,
      duration: "1 Hour",
    });
    await marketPage.back();
    TimesUtil.delay(3500);
    i++;
  }
})();
