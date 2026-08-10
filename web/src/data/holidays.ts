export interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
}

// ponytail: mock holiday data. Since this app runs purely on the client without
// a backend, we inject today/tomorrow's dates dynamically into the mock so the
// notification bell always has something to show during demos.
const now = new Date();
const tomorrow = new Date(now);
tomorrow.setDate(now.getDate() + 1);

const toYMD = (d: Date) => d.toISOString().split("T")[0] as string;

export const mockHolidays: Holiday[] = [
  {
    date: toYMD(tomorrow),
    name: "Hari Nasional (Demo)",
  },
  {
    date: "2026-08-17",
    name: "Hari Kemerdekaan RI",
  },
  {
    date: "2026-12-25",
    name: "Hari Raya Natal",
  },
];
