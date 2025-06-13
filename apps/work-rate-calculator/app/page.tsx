"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Workers from "@/components/workers";
import { useState } from "react";

export default function Page() {
  const [rate, setRate] = useState(10);
  console.log("Rendering Page");

  return (
    <div className="w-1/2 p-10 m-auto max-w-[700px] min-w-[600px]">
      <div>
        <div className="text-left m-auto py-10 space-y-4">
          <h1 className="text-4xl">Work Rate Calculator</h1>
          <p>
            The Work Rate Calculator is a user-friendly tool designed to help
            individuals and teams assess productivity and efficiency.
          </p>
        </div>
      </div>
      <div className="">
        <div className="flex justify-between">
          <Label className="" htmlFor="workers">
            Default rate
          </Label>
          <Input
            type="number"
            step={1}
            min={1}
            value={rate}
            onChange={(e) => setRate(parseInt(e.target.value))}
            className="max-w-sm w-16 shrink-0 text-right"
            id="workers"
          />
        </div>
        <p className="text-sm opacity-76">
          Default rate is the standard rate per unit (e.g., a trained worker can
          do so many units per hour)
        </p>
      </div>
      <hr className="mt-4"></hr>
      <Workers defaultRate={rate} />
    </div>
  );
}
