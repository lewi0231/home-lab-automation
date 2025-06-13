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
      <div className="flex justify-around my-4 gap-4 m-auto items-center">
        <Input
          className="shrink-0 w-32"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., John"
        />
        <Input
          placeholder="65"
          className="w-20 text-right"
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
    </div>
  );
}

export default Worker;
