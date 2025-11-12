export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export type EmployeeReliabilityRating =
  | "excellent"
  | "acceptable"
  | "below_average";
export type CarYardPriority = "high" | "medium" | "low";
export type CarYardRegion = "north" | "central" | "south";

export interface Employee {
  id: number;
  name: string;
  ranking: EmployeeReliabilityRating;
  available_days: DayOfWeek[];
  not_region?: CarYardRegion;
}

export interface CarYard {
  id: number;
  name: string;
  priority: CarYardPriority;
  region: CarYardRegion;
  min_employees: number;
  max_employees: number;
  hours_required: number;
  required_days?: DayOfWeek[];
  per_week?: [visitsRequired: number, minGapDays: number];
  linked_yard?: [otherYardId: number, gapDays: number];
  startTime?: string; // "HH:MM"
}

export interface ScheduleRequestPayload {
  employees: Employee[];
  car_yards: CarYard[];
  days: DayOfWeek[];
  yard_groups?: Record<string, number[]>;
  max_hours_per_day?: number;
  earliest_start_time?: string; // "HH:MM"
  travel_buffer_minutes?: number;
}

export const payload: ScheduleRequestPayload = {
  employees: [
    {
      id: 1,
      name: "Chris",
      ranking: "excellent",
      available_days: ["monday", "wednesday", "thursday", "friday", "saturday"],
    },
    {
      id: 2,
      name: "Vashaal",
      ranking: "excellent",
      available_days: ["monday", "tuesday", "thursday", "friday"],
    },
    {
      id: 3,
      name: "Paul",
      ranking: "excellent",
      available_days: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ],
      not_region: "south",
    },
  ],
  car_yards: [
    {
      id: 1,
      name: "Adrien Brian",
      priority: "high",
      region: "central",
      min_employees: 2,
      max_employees: 4,
      hours_required: 8.0,
      per_week: [2, 2],
    },
    {
      id: 2,
      name: "Reynella Kia",
      priority: "medium",
      region: "south",
      min_employees: 2,
      max_employees: 4,
      hours_required: 6.0,
      linked_yard: [6, 1],
      per_week: [1, 0],
    },
    {
      id: 3,
      name: "Reynella All",
      priority: "low",
      region: "south",
      min_employees: 3,
      max_employees: 4,
      hours_required: 12.0,
      per_week: [1, 0],
    },
    {
      id: 4,
      name: "EasyAuto123 Tender",
      priority: "high",
      region: "central",
      min_employees: 2,
      max_employees: 4,
      hours_required: 8.0,
      required_days: ["monday"],
      startTime: "08:30",
      per_week: [1, 0],
    },
  ],
  days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
  yard_groups: {
    reynella_group: [5, 6],
  },
  max_hours_per_day: 7.0,
  earliest_start_time: "06:00",
  travel_buffer_minutes: 30,
};
