import { Webapp } from "./Webapp";
import * as dotenv from "dotenv";

(async () => {
  dotenv.config();
  const webapp = new Webapp();
  await webapp.init();
  await webapp.login(process.env.EA_EMAIL, process.env.EA_PASSWORD, process.env.EA_TOKEN);
  const market = await webapp.openMarket();
  await market.setPlayerSearchParams({
    //name: "cristiano ronaldo",
    //rating: 92,
    //league: "Premier League (ENG 1)",
    //nationality: "Portugal",
    position: "LW",
    quality: "Bronze",
    maxBuyNow: 200,
  });
  await market.search();
  const boughtItems = await market.buyNow(1);
  await market.listOnMarket(boughtItems, {
    startBid: 150,
    buyNow: 200,
    duration: "1 Hour",
  });
  await market.back();
})();
