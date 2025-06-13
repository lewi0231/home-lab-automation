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
    <div className="flex justify-around m-auto text-sm">
      <p className="w-20 text-left">{worker.name}</p>

      <p className="w-20 text-center">{worker.rate}</p>
      <p className="w-20 text-center">{worker?.percentage ?? 0}</p>
      <Button
        className="cursor-pointer "
        size="sm"
        variant="secondary"
        onClick={() => onRemoveWorker(index)}
      >
        <Minus className="" />
      </Button>
    </div>
  );
}

export default DisplayWorker;
