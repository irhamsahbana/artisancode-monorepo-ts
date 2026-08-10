export interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
}

// ponytail: real 2026 holidays merged with a dynamic "tomorrow" holiday so the
// notification bell always has something to show during demos.
const now = new Date();
const tomorrow = new Date(now);
tomorrow.setDate(now.getDate() + 1);

const toYMD = (d: Date) => d.toISOString().split("T")[0] as string;

export const mockHolidays: Holiday[] = [
  {
    date: toYMD(tomorrow),
    name: "Hari Teknologi Nasional (Demo)",
  },
  { date: "2026-01-01", name: "New Year's Day" },
  { date: "2026-01-16", name: "Ascension of the Prophet Muhammad" },
  { date: "2026-02-16", name: "Chinese New Year Joint Holiday" },
  { date: "2026-02-17", name: "Chinese New Year's Day" },
  { date: "2026-03-18", name: "Nyepi Joint Holiday" },
  { date: "2026-03-19", name: "Nyepi" },
  { date: "2026-03-20", name: "Idul Fitri Joint Holiday" },
  { date: "2026-03-21", name: "Idul Fitri" },
  { date: "2026-03-22", name: "Idul Fitri Holiday" },
  { date: "2026-03-23", name: "Idul Fitri Joint Holiday" },
  { date: "2026-03-24", name: "Idul Fitri Joint Holiday" },
  { date: "2026-04-03", name: "Good Friday" },
  { date: "2026-04-05", name: "Easter Sunday" },
  { date: "2026-05-01", name: "International Labor Day" },
  { date: "2026-05-14", name: "Ascension Day of Jesus Christ" },
  { date: "2026-05-15", name: "Ascension Day Joint Holiday" },
  { date: "2026-05-27", name: "Idul Adha" },
  { date: "2026-05-28", name: "Idul Adha Joint Holiday" },
  { date: "2026-05-31", name: "Waisak Day" },
  { date: "2026-06-01", name: "Pancasila Day" },
  { date: "2026-06-16", name: "Islamic New Year" },
  { date: "2026-08-17", name: "Indonesian Independence Day" },
  { date: "2026-08-25", name: "Maulid Nabi Muhammad" },
  { date: "2026-12-24", name: "Christmas Eve Joint Holiday" },
  { date: "2026-12-25", name: "Christmas Day" },
];
