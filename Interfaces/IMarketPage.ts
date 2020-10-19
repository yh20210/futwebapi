import { ListItemParams } from "./ListItemParams";
import { SearchPlayerParams } from "./SearchPlayerParams";

export default interface IMarketPage {
  goto(): Promise<void>;
  gotoSearch(): Promise<void>;
  gotoTransferList(): Promise<void>;
  setSearchOptions(params: SearchPlayerParams): Promise<void>;
  search(): Promise<void>;
  buyNow(quantity: number, maxBuyNowConfirm: number): Promise<void>;
  listOnMarket(params: ListItemParams): Promise<void>;
  back(): Promise<void>;
}
