import { IListItemOptions } from "./IListItemOptions";
import { ISearchConsumableOptions } from "./ISearchConsumableOptions";
import { ISearchPlayerOptions } from "./ISearchPlayerOptions";

export default interface IMarketPage {
  goto(): Promise<void>;
  gotoSearch(): Promise<void>;
  gotoTransferList(): Promise<void>;
  setSearchPlayerOptions(params: ISearchPlayerOptions): Promise<void>;
  setSearchConsumableOptions(params: ISearchConsumableOptions): Promise<void>;
  search(): Promise<void>;
  nextSearchPage(): Promise<void>;
  buyNow(quantity: number, maxBuyNowConfirm: number): Promise<number>;
  listOnMarket(params: IListItemOptions): Promise<void>;
  getCoins(): Promise<string>;
  back(): Promise<void>;
}
