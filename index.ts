import { Webapp } from "./Webapp";
import * as dotenv from "dotenv";

(async () => {
  dotenv.config();

  const _webapp = new Webapp();
  await _webapp.init();
  await _webapp.login(process.env.EA_EMAIL, process.env.EA_PASSWORD, process.env.EA_TOKEN);
  const market = await _webapp.openMarket();
  await market.setPlayerSearchParams({
    //name: "cristiano ronaldo",
    league: "Premier League (ENG 1)",
    nationality: "Portugal",
    position: "LW",
    quality: "Gold",
    maxBuyNow: 1200,
  });
  await market.search();
})();
