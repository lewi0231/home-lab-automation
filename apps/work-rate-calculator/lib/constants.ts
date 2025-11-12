import { DayOfWeek } from "./scheduler";

export const DAYS_OF_WEEK: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export const AVAILABILITY_HEADINGS = [
  ...DAYS_OF_WEEK.map((day) => day.substring(0, 3)),
  "not region",
  "under perform",
] as const;

export const CAR_YARD_HEADINGS = [
  "yard id",
  "per w'k",
  "days betw.",
  "region",
  "min w'k's",
  "max w'k's",
  "length h'rs",
  "linked yard",
  "gap days",
  "required",
];
