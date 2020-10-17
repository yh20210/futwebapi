import LoggerParams from "../Models/LoggerParams";

export default class Logger {
  private _log: (arg: any, type: string) => void;

  public constructor(params: LoggerParams) {
    if (params.type === "console") {
      this._log = this._viaConsole;
    }
  }

  public info(arg: any) {
    this._log(arg, "info");
  }

  public error(arg: any) {
    this._log(arg, "error");
  }

  public log(arg: any) {
    this._log(arg, "log");
  }

  private _viaConsole(arg: any, type: string) {
    if (type === "info") {
      console.info(`[INFO] ${arg} -- ${new Date().toLocaleTimeString()}`);
    } else if (type === "error") {
      console.error(`[ERROR] ${arg} -- ${new Date().toLocaleTimeString()}`);
    } else {
      console.error(`${arg} -- ${new Date().toLocaleTimeString()}`);
    }
  }
}
