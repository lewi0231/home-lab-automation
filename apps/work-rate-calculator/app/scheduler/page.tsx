"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DayOfWeek, payload, ScheduleRequestPayload } from "@/lib/scheduler";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

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
  "excluded",
  "under performing",
] as const;

const caryYardRegions = ["CENTRAL", "NORTH", "SOUTH"];

const SchedulerPage = () => {
  const [workers, setWorkers] = useState<ScheduleRequestPayload["employees"]>(
    payload.employees
  );

  useEffect(() => {}, []);

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

  return (
    <div className="w-full mx-auto h-screen  flex flex-col justify-start items-start">
      <div className="w-full px-10 space-y-4 ">
        <header>
          <h2 className="text-3xl text-center py-12">Availability</h2>
        </header>
        {/* <div className="flex w-full gap-2 mt-10">
          {workers.map((worker) => (
            <div className="border-2 rounded-2xl flex-1 p-2" key={worker.id}>
              <div className="text-xl font-semibold">{worker.name}</div>
              <ul className="flex flex-col gap-1 py-4">
                {worker.available_days.map((day, index) => (
                  <li
                    className="flex justify-between"
                    key={worker.id + day + index}
                  >
                    <span>{day}</span>
                    <Button
                      size="icon"
                      variant="destructive"
                      className=""
                      onClick={() => handleRemoveAvailability(day, worker.id)}
                    >
                      <X size="icon" />
                    </Button>
                  </li>
                ))}
                <SelectDayOfWeek
                  worker={worker}
                  handleAddAvailability={handleAddAvailability}
                />
                <hr className="my-6" />
                <div>{worker.not_region}</div>
                <div>{worker.ranking}</div>
              </ul>
            </div>
          ))}
        </div> */}
        <div className="grid grid-cols-[minmax(12rem,1fr)_repeat(6,minmax(3rem,1fr))_repeat(2,minmax(4rem,1fr))] w-full ">
          <div className="col-span-1"></div>
          {availabilityHeadings.map((heading, index) => {
            return (
              <>
                {/* {index === 6 || index === 7 ? (
                  <div className="col-span-1" />
                ) : (
                  ""
                )} */}
                <div
                  className={cn(
                    "-rotate-90 col-span-1 text-muted-foreground font-medium origin-bottom text-sm"
                  )}
                  key={heading}
                >
                  {heading}
                </div>
              </>
            );
          })}
        </div>
        <div className="w-full flex flex-col divide-y my-16">
          {workers.map((worker) => (
            // <div className="w-full grid grid-cols-12 items-center gap-3 py-2 divide-x">
            <div className="grid grid-cols-[minmax(12rem,1fr)_repeat(6,minmax(3rem,1fr))_repeat(2,minmax(4rem,1fr))] w-full py-4">
              <div className="col-span-1 font-medium">{worker.name}</div>
              {daysOfTheWeek.map((day) => (
                <Checkbox
                  key={`${worker.id}-${day}`}
                  className="col-span-1 "
                  checked={worker.available_days.includes(day)}
                  onCheckedChange={(checked) =>
                    checked
                      ? handleAddAvailability(worker.id, day)
                      : handleRemoveAvailability(day, worker.id)
                  }
                />
              ))}
              <div className="col-span-1 flex items-center justify-center">
                <Checkbox className="" />
              </div>

              <div className="col-span-1 flex items-center justify-center">
                <Checkbox className="" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full text-center py-10">
        <Button size="lg" className="h-xl w-sm py-8 mx-auto">
          Generate
        </Button>
      </div>
    </div>
  );
};

export default SchedulerPage;
