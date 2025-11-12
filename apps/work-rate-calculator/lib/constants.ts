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
  "times per week",
  "days between",
  "region",
  "min workers",
  "max workers",
  "approx hours",
  "required day",
];
