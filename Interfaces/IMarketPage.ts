import { IListItemParams } from "./IListItemParams";
import { ISearchPlayerParams } from "./ISearchPlayerParams";

export default interface IMarketPage {
  goto(): Promise<void>;
  gotoSearch(): Promise<void>;
  gotoTransferList(): Promise<void>;
  setSearchOptions(params: ISearchPlayerParams): Promise<void>;
  search(): Promise<void>;
  buyNow(quantity: number, maxBuyNowConfirm: number): Promise<void>;
  listOnMarket(params: IListItemParams): Promise<void>;
  back(): Promise<void>;
}
