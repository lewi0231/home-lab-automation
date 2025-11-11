import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

function AddNameField({
  handleAddWorker,
}: {
  handleAddWorker: (name: string) => void;
}) {
  const [name, setName] = useState("");

  return (
    <div className=" flex divide-y gap-6 w-full justify-center py-6 ">
      <Input
        placeholder="Name"
        className="flex-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button
        size="lg"
        variant="default"
        className="flex-1 cursor-pointer"
        onClick={(e) => {
          handleAddWorker(name);
          setName("");
        }}
      >
        <Plus />
        <span>Worker</span>
      </Button>
    </div>
  );
}

export default AddNameField;
