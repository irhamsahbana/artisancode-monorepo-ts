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
  { date: "2026-01-03", name: "Hari Departemen Agama" },
  { date: "2026-01-05", name: "Hari Korps Wanita Angkatan Laut (KOWAL)" },
  { date: "2026-01-10", name: "Hari Lingkungan Hidup Indonesia" },
  { date: "2026-01-16", name: "Ascension of the Prophet Muhammad" },
  { date: "2026-01-25", name: "Hari Gizi dan Makanan Nasional" },
  { date: "2026-02-09", name: "Hari Pers Nasional" },
  { date: "2026-02-14", name: "Hari Peringatan Pekerja" },
  { date: "2026-02-16", name: "Chinese New Year Joint Holiday" },
  { date: "2026-02-17", name: "Chinese New Year's Day" },
  { date: "2026-02-20", name: "Ramadan Start" },
  { date: "2026-03-01", name: "Hari Kehakiman" },
  { date: "2026-03-06", name: "Hari Kostrad" },
  { date: "2026-03-18", name: "Nyepi Joint Holiday" },
  { date: "2026-03-19", name: "Nyepi" },
  { date: "2026-03-20", name: "Idul Fitri Joint Holiday" },
  { date: "2026-03-21", name: "Hari Down Syndrome Sedunia" },
  { date: "2026-03-21", name: "Idul Fitri" },
  { date: "2026-03-22", name: "Idul Fitri Holiday" },
  { date: "2026-03-23", name: "Idul Fitri Joint Holiday" },
  { date: "2026-03-24", name: "Idul Fitri Joint Holiday" },
  { date: "2026-04-03", name: "Good Friday" },
  { date: "2026-04-05", name: "Easter Sunday" },
  { date: "2026-04-06", name: "Hari Nelayan Nasional" },
  { date: "2026-04-21", name: "Hari Kartini" },
  { date: "2026-04-22", name: "Hari Bumi" },
  { date: "2026-05-01", name: "Hari Buruh Internasional" },
  { date: "2026-05-01", name: "International Labor Day" },
  { date: "2026-05-14", name: "Ascension Day of Jesus Christ" },
  { date: "2026-05-15", name: "Ascension Day Joint Holiday" },
  { date: "2026-05-20", name: "Hari Kebangkitan Nasional" },
  { date: "2026-05-21", name: "Hari Reformasi" },
  { date: "2026-05-27", name: "Idul Adha" },
  { date: "2026-05-28", name: "Idul Adha Joint Holiday" },
  { date: "2026-05-31", name: "Waisak Day" },
  { date: "2026-06-01", name: "Pancasila Day" },
  { date: "2026-06-05", name: "Hari Lingkungan Hidup Sedunia" },
  { date: "2026-06-16", name: "Islamic New Year" },
  { date: "2026-06-29", name: "Hari Keluarga Nasional" },
  { date: "2026-07-23", name: "Hari Anak Nasional" },
  { date: "2026-08-10", name: "Hari Veteran Nasional" },
  { date: "2026-08-14", name: "Hari Pramuka" },
  { date: "2026-08-17", name: "Indonesian Independence Day" },
  { date: "2026-08-25", name: "Maulid Nabi Muhammad" },
  { date: "2026-09-08", name: "Hari Aksara Internasional" },
  { date: "2026-09-28", name: "Hari Kereta Api" },
  { date: "2026-10-01", name: "Hari Kesaktian Pancasila" },
  { date: "2026-10-02", name: "Hari Batik Nasional" },
  { date: "2026-10-28", name: "Hari Sumpah Pemuda" },
  { date: "2026-11-10", name: "Hari Pahlawan" },
  { date: "2026-11-12", name: "Hari Kesehatan Nasional" },
  { date: "2026-12-09", name: "Hari Antikorupsi Sedunia" },
  { date: "2026-12-22", name: "Hari Ibu" },
  { date: "2026-12-24", name: "Christmas Eve Joint Holiday" },
  { date: "2026-12-25", name: "Christmas Day" },
  { date: "2026-12-31", name: "New Year's Eve" },
];
