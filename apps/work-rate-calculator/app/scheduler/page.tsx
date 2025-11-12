"use client";

import CarYardCustomizationDisplay from "@/components/car-yard-customization-display";
import EmployeeAvailabilityDisplay from "@/components/employee-availability-display";
import GeneralSettingsDisplay from "@/components/general-settings-display";
import { Button } from "@/components/ui/button";
import { DAYS_OF_WEEK } from "@/lib/constants";
import {
  CarYard,
  Employee,
  payload,
  ScheduleRequestPayload,
} from "@/lib/scheduler";
import { useState } from "react";

const SchedulerPage = () => {
  const [workers, setWorkers] = useState<ScheduleRequestPayload["employees"]>(
    payload.employees
  );
  const [carYards, setCarYards] = useState(payload.car_yards);
  const [maxHoursPerDay, setMaxHoursPerDay] = useState(
    payload.max_hours_per_day ?? 7.0
  );
  const [earliestStartTime, setEarliestStartTime] = useState(
    payload.earliest_start_time ?? "06:00"
  );

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
      available_days: DAYS_OF_WEEK,
      ranking: "below_average",
    };

    setWorkers((prev) => {
      return [...prev, newWorker];
    });
  };

  const handleAddCarYard = (name: string) => {
    const newCarYard: CarYard = {
      name,
      id: carYards.length + 1,
      min_employees: 1,
      max_employees: 4,
      region: "central",
      hours_required: 2,
      priority: "high",
    };
    setCarYards((prev) => {
      return [...prev, newCarYard];
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
      <GeneralSettingsDisplay
        maxHoursPerDay={maxHoursPerDay}
        earliestStartTime={earliestStartTime}
        onMaxHoursPerDayChange={setMaxHoursPerDay}
        onEarliestStartTimeChange={setEarliestStartTime}
      />

      <EmployeeAvailabilityDisplay
        workers={workers}
        onUpdateWorker={handleUpdateWorker}
        onAddWorker={handleAddWorker}
      />
      <CarYardCustomizationDisplay
        carYards={carYards}
        onUpdateCarYard={handleUpdateCarYard}
        onAddCarYard={handleAddCarYard}
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
