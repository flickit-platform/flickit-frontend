import i18next, { t } from "i18next";

export const MiladiCalendar = (date: Date): string => {
  let month = String(date.getMonth() + 1);
  let day = String(date.getDate());
  const year = date.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  const MiladiDate: string = [year, month, day].join("/");
  return MiladiDate;
};

export const ShamsiCalendar = (MiladiDate: any) => {
  let [gy, gm, gd] = MiladiDate.split("/").map(Number);

  let jy, jm, jd;
  let g_a = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

  if (gy > 1600) {
    jy = 979;
    gy -= 1600;
  } else {
    jy = 0;
    gy -= 621;
  }

  let gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) -
    80 +
    gd +
    g_a[gm - 1];

  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;

  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }

  if (days < 186) {
    jm = 1 + Math.floor(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + Math.floor((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }
  return `${jy}/${String(jm)}/${String(jd)}`;
};

type DateDisplayMode = "relative" | "relativeWithDate" | "absolute";


export const getReadableDate = (
  time: Date | string | number,
  mode: DateDisplayMode = "absolute",
  withTime: boolean = false
): string => {
  const lang = i18next.language;
  const now = new Date();
  const date = new Date(time);

  const calendar: string = MiladiCalendar(date);
  const localizedDate: string =
    lang === "fa" ? ShamsiCalendar(calendar) : calendar;

  const nowMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const dateMidnight = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const diffDays = Math.floor(
    (dateMidnight.getTime() - nowMidnight.getTime()) / (1000 * 60 * 60 * 24)
  );

  const diffMonths =
    (date.getFullYear() - now.getFullYear()) * 12 +
    (date.getMonth() - now.getMonth());

  let relativeStr = "";

  if (diffDays < 0) {
    const absDays = Math.abs(diffDays);
    const absMonths = Math.abs(diffMonths);

    if (diffDays === -1) {
      relativeStr = t("common.yesterday");
    } else if (diffDays === -2) {
      relativeStr = t("2daysAgo");
    } else if (absDays <= 6) {
      relativeStr = t("common.thisWeek");
    } else if (absMonths === 1) {
      relativeStr = t("common.lastMonth");
    } else if (absMonths > 1 && absMonths < 12) {
      relativeStr = t("common.monthsAgo", { count: absMonths });
    } else {
      relativeStr = t("common.lastYear");
    }
  } else if (diffDays > 0) {
    if (diffDays === 1) {
      relativeStr = t("common.tomorrow");
    } else if (diffDays === 2) {
      relativeStr = t("common.afterTomorrow");
    } else if (diffDays <= 6) {
      relativeStr = t("common.thisWeek");
    } else if (diffMonths === 1) {
      relativeStr = t("common.nextMonth");
    } else if (diffMonths > 1 && diffMonths < 12) {
      relativeStr = t("common.inMonths", { count: diffMonths });
    } else {
      relativeStr = t("common.nextYear");
    }
  } else {
    relativeStr = t("common.today");
  }

  const timeStr = withTime
    ? ` - ${date.getHours().toString().padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`
    : "";

  if (mode === "relative") return relativeStr + timeStr;
  if (mode === "relativeWithDate") return `${relativeStr} (${localizedDate}${withTime ? timeStr : ""})`;
  return `${localizedDate}${timeStr}`;
};
