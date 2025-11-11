"use client";

import AddNameField from "@/components/add-name-field";
import Counter from "@/components/counter";
import Header from "@/components/header";
import SelectCarYardRegion from "@/components/select-region";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  CarYardRegion,
  DayOfWeek,
  Employee,
  payload,
  ScheduleRequestPayload,
} from "@/lib/scheduler";
import { cn } from "@/lib/utils";
import { useState } from "react";

const daysOfTheWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as DayOfWeek[];

const availabilityHeadings = [
  ...daysOfTheWeek,
  "excluded region",
  "under performing",
] as const;

const carYardHeadings = [
  "yard id",
  "times per week",
  "days between",
  "region",
  "min workers",
  "max workers",
  "approx hours",
  "required day",
];

const CarYardCustomizationDisplay = ({
  carYards,
  onUpdateCarYard,
}: {
  carYards: ScheduleRequestPayload["car_yards"];
  onUpdateCarYard: (
    yardId: number,
    updater: (
      yard: ScheduleRequestPayload["car_yards"][number]
    ) => ScheduleRequestPayload["car_yards"][number]
  ) => void;
}) => {
  return (
    <section className="w-full mx-auto">
      <Header>Car Yard Details</Header>
      <div className="grid grid-cols-[minmax(12rem,1fr)_repeat(7,minmax(3rem,1fr))_10rem] space-y-4 py-4">
        <div aria-hidden />
        {carYardHeadings.map((heading) => (
          <div
            key={heading}
            className="flex h-24 w-full items-center justify-center"
          >
            <span className="-rotate-90 w-24 origin-center text-sm text-muted-foreground">
              {heading}
            </span>
          </div>
        ))}
      </div>
      {carYards.map((yard) => {
        const visitsRequired = yard.per_week?.[0] ?? 0;
        const daysBetweenVisits = yard.per_week?.[1] ?? 0;

        return (
          <div
            key={yard.id}
            className="grid grid-cols-[minmax(12rem,1fr)_repeat(7,minmax(3rem,1fr))_10rem] divide-y"
          >
            <div className="flex items-center justify-start py-4 font-medium">
              {yard.name}
            </div>
            <div className="flex items-center justify-center border-r py-2 text-center">
              <span>{yard.id}</span>
            </div>
            <div className="flex items-center justify-center border-r py-2 text-center">
              <Counter
                value={visitsRequired}
                min={0}
                max={7}
                onValueChange={(newValue) =>
                  onUpdateCarYard(yard.id, (current) => {
                    const [, currentGapDays = 0] = current.per_week ?? [0, 0];
                    return {
                      ...current,
                      per_week: [newValue, currentGapDays],
                    };
                  })
                }
                aria-label={`${yard.name} visits per week`}
              />
            </div>
            <div className="flex items-center justify-center py-2 text-center">
              <Counter
                value={daysBetweenVisits}
                min={0}
                max={14}
                className=""
                onValueChange={(newValue) =>
                  onUpdateCarYard(yard.id, (current) => {
                    const [currentVisits = 0] = current.per_week ?? [0, 0];
                    return {
                      ...current,
                      per_week: [currentVisits, newValue],
                    };
                  })
                }
                aria-label={`${yard.name} days between visits`}
              />
            </div>
            <div className="flex items-center justify-center border-r py-2 text-center">
              <SelectCarYardRegion
                value={yard.region}
                onSelect={(region) =>
                  onUpdateCarYard(yard.id, (current) => ({
                    ...current,
                    region,
                  }))
                }
                triggerClassName="h-10"
                placeholder="Select region"
              />
            </div>
            <div className="flex items-center justify-center border-r py-2 text-center">
              <Counter
                value={yard.min_employees}
                min={0}
                max={yard.max_employees}
                onValueChange={(newValue) =>
                  onUpdateCarYard(yard.id, (current) => {
                    const nextMax = Math.max(current.max_employees, newValue);
                    return {
                      ...current,
                      min_employees: newValue,
                      max_employees: nextMax,
                    };
                  })
                }
                aria-label={`${yard.name} minimum workers`}
              />
            </div>
            <div className="flex items-center justify-center border-r py-2 text-center">
              <Counter
                value={yard.max_employees}
                min={yard.min_employees}
                max={10}
                onValueChange={(newValue) =>
                  onUpdateCarYard(yard.id, (current) => ({
                    ...current,
                    max_employees: Math.max(newValue, current.min_employees),
                  }))
                }
                aria-label={`${yard.name} maximum workers`}
              />
            </div>
            <div className="flex items-center justify-center border-r py-2 text-center">
              <Input
                type="number"
                inputMode="decimal"
                step={0.5}
                min={0}
                value={yard.hours_required}
                onChange={(event) => {
                  const nextValue = Number(event.target.value);
                  if (Number.isNaN(nextValue)) {
                    return;
                  }
                  onUpdateCarYard(yard.id, (current) => ({
                    ...current,
                    hours_required: nextValue,
                  }));
                }}
                className="h-10 text-center border-none "
                aria-label={`${yard.name} hours required`}
              />
            </div>
            <div className="flex items-center justify-center gap-2 border-r py-2 text-center">
              {daysOfTheWeek.map((day) => {
                const isChecked = (yard.required_days ?? []).includes(day);
                return (
                  <label
                    key={`${yard.id}-${day}`}
                    className="flex flex-col items-center gap-1 text-xs"
                  >
                    <span className="font-medium uppercase">
                      {day.charAt(0)}
                    </span>
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        onUpdateCarYard(yard.id, (current) => {
                          const required = new Set(current.required_days ?? []);
                          if (checked) {
                            required.add(day);
                          } else {
                            required.delete(day);
                          }

                          const ordered = daysOfTheWeek.filter((weekday) =>
                            required.has(weekday)
                          );

                          return {
                            ...current,
                            required_days: ordered.length ? ordered : undefined,
                          };
                        })
                      }
                      aria-label={`${day} required for ${yard.name}`}
                    />
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
};

const SchedulerPage = () => {
  const [workers, setWorkers] = useState<ScheduleRequestPayload["employees"]>(
    payload.employees
  );
  const [carYards, setCarYards] = useState(payload.car_yards);

  const handleRemoveAvailability = (
    dayToRemove: DayOfWeek,
    workerId: number
  ) => {
    setWorkers((prev) => {
      return prev.map((worker) => {
        if (worker.id === workerId) {
          const newAvailability = worker.available_days.filter(
            (day) => day !== dayToRemove
          );
          return { ...worker, available_days: newAvailability };
        }
        return worker;
      });
    });
  };

  const handleAddAvailability = (workerId: number, selectedDay: DayOfWeek) => {
    setWorkers((prev) => {
      return prev.map((worker) => {
        if (worker.id === workerId) {
          const newAvailability = [
            ...new Set([...worker.available_days, selectedDay]),
          ];
          return { ...worker, available_days: newAvailability };
        }
        return worker;
      });
    });
  };

  const handleEmployeePerformanceFlag = (
    workerId: number,
    checked: boolean
  ) => {
    setWorkers((prev) => {
      return prev.map((worker) => {
        if (workerId === worker.id) {
          return {
            ...worker,
            ranking: checked ? "below_average" : "excellent",
          };
        }
        return worker;
      });
    });
  };

  const handleAddWorker = (name: string) => {
    const newWorker: Employee = {
      name,
      id: workers.length + 1,
      available_days: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ],
      ranking: "below_average",
    };

    setWorkers((prev) => {
      return [...prev, newWorker];
    });
  };

  const handleChangeExcludedRegion = (
    workerId: number,
    region: CarYardRegion
  ) => {
    setWorkers((prev) => {
      return prev.map((worker) => {
        if (worker.id === workerId) {
          return {
            ...worker,
            not_region: region,
          };
        }
        return worker;
      });
    });
  };

  const handleUpdateCarYard = (
    yardId: number,
    updater: (
      yard: ScheduleRequestPayload["car_yards"][number]
    ) => ScheduleRequestPayload["car_yards"][number]
  ) => {
    setCarYards((prev) =>
      prev.map((yard) => (yard.id === yardId ? updater(yard) : yard))
    );
  };

  return (
    <main className="w-full min-h-screen flex flex-col justify-start items-start px-10 max-w-[1200px] mx-auto">
      <div className="w-full space-y-4">
        <Header>Employee Availability</Header>
        {/* Availability rotated headings row */}
        <div className="grid grid-cols-[minmax(12rem,1fr)_repeat(6,minmax(3rem,1fr))_repeat(2,minmax(4rem,1.5fr))]">
          <div className="" />
          {availabilityHeadings.map((heading, index) => {
            return (
              <div
                className={cn(
                  " text-muted-foreground font-medium text-sm  w-full flex justify-center items-center h-24"
                )}
                key={heading}
              >
                <span className="-rotate-90 origin-center font-medium w-24  break-words">
                  {heading}
                </span>
              </div>
            );
          })}
        </div>
        <div className="w-full flex flex-col divide-y">
          {workers.map((worker) => (
            <div
              key={worker.id}
              className="grid grid-cols-[minmax(12rem,1fr)_repeat(6,minmax(3rem,1fr))_repeat(2,minmax(4rem,1.5fr))] w-full py-4"
            >
              <div className="font-medium border-r">{worker.name}</div>
              {daysOfTheWeek.map((day) => (
                <div
                  key={`${worker.id}-${day}`}
                  className="w-full flex justify-center items-center "
                >
                  <Checkbox
                    className=""
                    checked={worker.available_days.includes(day)}
                    onCheckedChange={(checked) =>
                      checked
                        ? handleAddAvailability(worker.id, day)
                        : handleRemoveAvailability(day, worker.id)
                    }
                  />
                </div>
              ))}
              <div className="flex items-center justify-center border-l overflow-hidden">
                <SelectCarYardRegion
                  worker={worker}
                  handleSelectRegion={handleChangeExcludedRegion}
                />
              </div>

              <div className="flex items-center justify-center border-l">
                <Checkbox
                  className=""
                  checked={worker.ranking === "below_average"}
                  onCheckedChange={(checked) =>
                    handleEmployeePerformanceFlag(
                      worker.id,
                      checked.valueOf() as boolean
                    )
                  }
                />
              </div>
            </div>
          ))}
          <AddNameField handleAddWorker={handleAddWorker} />
        </div>
      </div>
      {/* Car Yard Details */}
      <CarYardCustomizationDisplay
        carYards={carYards}
        onUpdateCarYard={handleUpdateCarYard}
      />

      <div className="w-full text-center py-14">
        <Button
          size="lg"
          className="h-xl py-8 mx-auto cursor-pointer  text-2xl w-xl"
        >
          Generate Roster
        </Button>
      </div>
    </main>
  );
};

export default SchedulerPage;
