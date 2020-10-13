import { Webapp } from "./Webapp";
import * as dotenv from "dotenv";
import { TimesUtil } from "./Utils/TimeUtil";

(async () => {
  dotenv.config();
  const webapp = new Webapp();
  const minBuys = [150, 200, 250, 300];
  await webapp.init();
  await webapp.login(process.env.EA_EMAIL, process.env.EA_PASSWORD, process.env.EA_TOKEN);
  const market = await webapp.openMarket();
  await market.setPlayerSearchParams({
    //name: "Carlos Vela",
    //rating: 83,
    quality: "Bronze",
  });
  var i = 0;
  while (true) {
    if (i >= 3) {
      i = 0;
    }
    await market.setPlayerSearchParams({
      minBuyNow: minBuys[i],
      maxBuyNow: 200,
    });
    await market.search();
    const boughtItems = await market.buyNow(2);
    await market.listOnMarket(boughtItems, {
      startBid: 150,
      buyNow: 250,
      duration: "1 Hour",
    });
    await market.back();
    TimesUtil.delay(3500);
    i++;
  }
})();
