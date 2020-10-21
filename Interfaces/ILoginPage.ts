import { ILoginOptions } from "./ILoginOptions";

export default interface ILoginPage {
  goto(): Promise<void>;
  login(options: ILoginOptions): Promise<void>;
}
