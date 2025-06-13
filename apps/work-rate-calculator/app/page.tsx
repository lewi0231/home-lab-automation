"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Workers from "@/components/workers";
import { useState } from "react";

export default function Page() {
  const [rate, setRate] = useState(10);
  console.log("Rendering Page");

  return (
    <div className="w-3/4 sm:w-2/3 lg:w-1/2 py-2 sm:py-10 m-auto sm:max-w-[700px] min-w-[300px]">
      <div>
        <div className="text-left m-auto py-10 space-y-4">
          <h1 className="text-4xl">Work Rate Calculator</h1>
          <p className="text-sm">
            The Work Rate Calculator balances relative percentages (between
            workers) based on their rate of work, taken as a percentage of the
            expected rate.
          </p>
        </div>
      </div>
      <div className="">
        <div className="flex justify-between mb-2 w-1/2">
          <Label className="text-lg" htmlFor="workers">
            Default rate:
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
        <p className="text-sm opacity-76 w-1/2">
          Default rate is the expected rate (that a worker &apos;should&apos;
          work at (per hr/day/week) - all things being equal)
        </p>
      </div>
      <hr className="mt-10"></hr>
      <Workers defaultRate={rate} />
    </div>
  );
}
