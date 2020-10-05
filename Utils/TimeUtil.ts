export class TimesUtil {
  public static async delay(ms: number) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + ms);
  }
}
