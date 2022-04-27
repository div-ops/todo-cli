export function dateFromYYYYMMDD(yyyy_mm_dd: string) {
  const [yyyy, mm, dd] = yyyy_mm_dd.split("-");
  return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
}

export function todayYYYYMMDD() {
  return getYYYYMMDD(0);
}

export function getYYYYMMDD(offset: number) {
  const date = new Date(new Date().getTime() + Number(offset) * 24 * 3600_000);

  return [
    date.getFullYear(),
    date.getMonth() + 1 > 10 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`,
    date.getDate(),
  ].join("-");
}

export function getOffsetFromYYYYMMDD(yyyy_mm_dd: string) {
  const date = new Date(yyyy_mm_dd);
  const today = new Date();

  return Math.ceil(Number(date.getTime() - today.getTime()) / 1000 / 3600 / 24);
}

export function Dday(yyyy_mm_dd: string) {
  if (getOffsetFromYYYYMMDD(yyyy_mm_dd) < 0) {
    return `D+${Math.abs(getOffsetFromYYYYMMDD(yyyy_mm_dd))}`;
  } else {
    return `D-${getOffsetFromYYYYMMDD(yyyy_mm_dd)}`;
  }
}
