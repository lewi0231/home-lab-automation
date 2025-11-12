"use client";

import EmployeeAvailabilityDisplay from "@/components/employee-availability-display";
import Header from "@/components/header";
import InputCounter from "@/components/input-counter";
import SelectCarYardRegion from "@/components/select-region";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CAR_YARD_HEADINGS, DAYS_OF_WEEK } from "@/lib/constants";
import { Employee, payload, ScheduleRequestPayload } from "@/lib/scheduler";
import { useState } from "react";

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
      <Header
        subText="Please add or alter the default values as you like. Note that setting
        changes will be lost on page refresh."
      >
        Car Yard Details
      </Header>
      <div className="grid grid-cols-[minmax(12rem,1fr)_repeat(7,minmax(3rem,1fr))_minmax(10rem,1fr)] border-b pb-4 text-wrap pt-10">
        <div aria-hidden />
        {CAR_YARD_HEADINGS.map((heading) => (
          <div
            key={heading}
            className="flex w-full items-center justify-center border-r"
          >
            <span className="text-center text-sm text-muted-foreground h-full">
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
              <InputCounter
                min={1}
                step={1}
                value={visitsRequired}
                onValueChange={(newValue) =>
                  onUpdateCarYard(yard.id, (current) => {
                    const [, currentGapDays = 0] = current.per_week ?? [1, 0];
                    return {
                      ...current,
                      per_week: [newValue, currentGapDays],
                    };
                  })
                }
                max={3}
                ariaLabel={`${yard.name} visits per week`}
              />
            </div>
            <div className="flex items-center justify-center py-2 text-center">
              <InputCounter
                min={0}
                step={1}
                value={daysBetweenVisits}
                disabled={visitsRequired <= 1}
                onValueChange={(newValue) => {
                  if (yard.per_week?.[0] <= 1) return;
                  onUpdateCarYard(yard.id, (current) => {
                    const [currentVisits = 1] = current.per_week ?? [1, 0];
                    return {
                      ...current,
                      per_week: [currentVisits, newValue],
                    };
                  });
                }}
                max={6}
                ariaLabel={`${yard.name} days between visits`}
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
              <InputCounter
                min={1}
                step={1}
                value={yard.min_employees}
                onValueChange={(newValue) =>
                  onUpdateCarYard(yard.id, (current) => {
                    return {
                      ...current,
                      min_employees: newValue,
                    };
                  })
                }
                max={yard.max_employees}
                ariaLabel={`${yard.name} minimum employees`}
              />
            </div>
            <div className="flex items-center justify-center border-r py-2 text-center">
              <InputCounter
                min={yard.min_employees}
                step={1}
                value={yard.max_employees}
                onValueChange={(newValue) =>
                  onUpdateCarYard(yard.id, (current) => {
                    return {
                      ...current,
                      max_employees: newValue,
                    };
                  })
                }
                max={4}
                ariaLabel={`${yard.name} maximum employees`}
              />
            </div>
            <div className="flex items-center justify-center border-r py-2 text-center">
              <InputCounter
                min={0}
                step={0.5}
                value={yard.hours_required}
                onValueChange={(newValue) =>
                  onUpdateCarYard(yard.id, (current) => {
                    return {
                      ...current,
                      hours_required: newValue,
                    };
                  })
                }
                max={24}
                ariaLabel={`${yard.name} hours required`}
              />
            </div>
            <div className="flex items-center justify-center gap-2 border-r py-2 text-center">
              {DAYS_OF_WEEK.map((day) => {
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

                          // Preserve the display order to prevent layout jitter.
                          const ordered = DAYS_OF_WEEK.filter((weekday) =>
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

  const handleUpdateWorker = (
    workerId: number,
    updater: (
      worker: ScheduleRequestPayload["employees"][number]
    ) => ScheduleRequestPayload["employees"][number]
  ) => {
    setWorkers((prev) => {
      return prev.map((worker) => {
        return worker.id === workerId ? updater(worker) : worker;
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
      <EmployeeAvailabilityDisplay
        workers={workers}
        onUpdateWorker={handleUpdateWorker}
        onAddWorker={handleAddWorker}
      />
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
