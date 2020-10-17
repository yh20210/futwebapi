export default interface ILoginPage {
  goto(): Promise<void>;
  login(): Promise<void>;
}
