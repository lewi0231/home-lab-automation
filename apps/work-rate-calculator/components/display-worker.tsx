import { Worker } from "@/types/worker";
import { Minus } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
  onRemoveWorker: (id: number) => void;
  worker: Worker;
  index: number;
};

function DisplayWorker({ index, worker, onRemoveWorker }: Props) {
  console.log(worker);
  return (
    <div className="grid grid-cols-4 text-sm my-2">
      <p className="text-left">{worker.name}</p>

      <p className="text-right">{worker.rate}</p>
      <p className=" text-right">{worker?.percentage ?? 0}</p>
      <div className="text-right">
        <Button
          className="cursor-pointer "
          size="sm"
          variant="secondary"
          onClick={() => onRemoveWorker(index)}
        >
          <Minus className="" />
        </Button>
      </div>
    </div>
  );
}

export default DisplayWorker;
