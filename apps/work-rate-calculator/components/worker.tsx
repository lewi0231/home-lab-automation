import { type Worker } from "@/types/worker";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type Props = {
  onAddWorker: (id: number, { name, rate }: Worker) => void;
  id: number;
};

function Worker({ onAddWorker, id }: Props) {
  const [name, setName] = useState<string>("");
  const [rate, setRate] = useState(100);

  return (
    <div>
      <div className="grid grid-cols-4 my-4 gap-4 m-auto items-center">
        <Input
          className="shrink-0 col-span-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., John"
        />
        <Input
          placeholder="65"
          className=" text-right"
          type="number"
          value={rate}
          min={1}
          max={100}
          step={5}
          onChange={(e) => setRate(parseInt(e.target.value))}
        />
        <Button
          className="my-10 cursor-pointer"
          onClick={() => {
            onAddWorker(id, { name, rate });
            setName("");
            setRate(100);
          }}
        >
          Add Worker
        </Button>
      </div>

      <ul className="ml-4">
        <li className="text-xs opacity-76 w-3/4 list-decimal">
          Add a worker, where '% of default' is the % of the desired rate
          achieved and 'actual %' is the relative %.
        </li>
        <li className="text-xs opacity-76 w-3/4 list-decimal">
          The sum of each worker's actual ~ 100 (if decimials are off, it may
          not perfectly balance to 100% - but it'll be very close)
        </li>
      </ul>
    </div>
  );
}

export default Worker;
