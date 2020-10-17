import { ListItemParams } from "../Models/ListItemParams";
import { SearchPlayerParams } from "../Models/SearchPlayerParams";

export default interface IMarketPage {
  goto(): Promise<void>;
  gotoSearch(): Promise<void>;
  gotoTransferList(): Promise<void>;
  setSearchOptions(params: SearchPlayerParams): Promise<void>;
  search(): Promise<void>;
  buyNow(quantity: number): Promise<void>;
  listOnMarket(params: ListItemParams): Promise<void>;
  back(): Promise<void>;
}
