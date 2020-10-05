import { Webapp } from "./Webapp";
import * as dotenv from "dotenv";

(async () => {
  dotenv.config();
  const _webapp = new Webapp();
  await _webapp.init();
  await _webapp.login(process.env.EA_EMAIL, process.env.EA_PASSWORD, process.env.EA_TOKEN);
  const market = await _webapp.openMarket();
  await market.setPlayerSearchParams({
    name: "cristiano ronaldo",
    rating: 92,
    //league: "Premier League (ENG 1)",
    //nationality: "Portugal",
    //position: "LW",
    //quality: "Bronze",
    //maxBuyNow: 200,
  });
  await market.search();
  await market.buyNow(1);
  await market.listOnMarket(150, 200, "1 Hour");
})();
