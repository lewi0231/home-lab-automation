"use client";

import { type Worker as WorkerType } from "@/types/worker";
import { useState } from "react";
import DisplayWorker from "./display-worker";
import Worker from "./worker";

function Workers({ defaultRate }: { defaultRate: number }) {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  console.log("Rendering Workers");

  const onAddWorker = (id: number, { name, rate }: WorkerType) => {
    setWorkers((prev) => {
      return [...prev, { name, rate }];
    });
    setCurrentIndex((prev) => prev + 1);
    console.debug("currentIndex is now", currentIndex);
  };

  const onRemoveWorker = (id: number) => {
    if (id >= currentIndex) {
      console.error("There was a problem", id);
      return;
    }

    setWorkers((prev) => {
      return prev.filter((worker, index) => index !== id);
    });
    setCurrentIndex((prev) => prev - 1);
  };

  return (
    <div>
      {currentIndex > 0 ? (
        <div className="flex justify-around my-2 pt-6 m-auto font-semibold text-sm">
          <h2 className="">Name</h2>
          <h2 className="">Default rate (per unit)</h2>
          <h2 className="">Delete</h2>
        </div>
      ) : (
        ""
      )}
      {workers?.length > 0
        ? calculatePercentages(workers, defaultRate).map((worker, index) => {
            console.log(worker.name, index);
            return (
              <DisplayWorker
                key={index + worker.name}
                index={index}
                onRemoveWorker={onRemoveWorker}
                worker={worker}
              />
            );
          })
        : ""}

      <Worker id={currentIndex} onAddWorker={onAddWorker} />
    </div>
  );
}

const calculatePercentages = (workers: Worker[], defaultRate: number) => {
  let total = 0;
  const amendedWorkers = [...workers];
  workers.forEach((worker, index) => {
    const actualPerUnit = (worker.rate / 100) * defaultRate;
    amendedWorkers[index] = {
      ...worker,
      actualRate: actualPerUnit,
    };
    total += actualPerUnit;
  });
  console.debug("total, default", total, defaultRate);

  amendedWorkers.forEach((worker, index) => {
    amendedWorkers[index] = {
      ...worker,
      percentage: roundToDecimal((worker.actualRate / total) * 100, 2),
    };
  });
  return amendedWorkers;
};

function roundToDecimal(number: number, decimals: number) {
  const multiplier = Math.pow(10, decimals);
  return Math.round(number * multiplier) / multiplier;
}

export default Workers;
