"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type Props = {};

const ADD_SUBTRACT_VALUE = 0.25;

export default function TimeInput() {
  const [value, setValue] = useState("1.00");

  // Helper function to format number to 2 decimal places
  const formatToTwoDecimals = (num: number): string => {
    return num.toFixed(2);
  };

  const onIncrement = () => {
    const numberValue = parseFloat(value);
    const newValue = numberValue + ADD_SUBTRACT_VALUE;
    setValue(formatToTwoDecimals(newValue));
  };

  const onDecrement = () => {
    const numberValue = parseFloat(value);
    const newValue = numberValue - ADD_SUBTRACT_VALUE;

    if (newValue <= 0) return;
    setValue(formatToTwoDecimals(newValue));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Only allow valid numbers
    if (/^\d*\.?\d{0,2}$/.test(inputValue) || inputValue === "") {
      setValue(inputValue);
    }
  };

  return (
    <div className="flex items-center">
      <Input
        type="text"
        value={value}
        onChange={handleInputChange}
        className="max-w-sm w-20 shrink-0 text-right"
        id="shift"
        disabled
      />
      <div className="flex flex-col">
        <Button size="sm" variant="ghost" className="" onClick={onIncrement}>
          <Plus className="" />
        </Button>
        <Button size="sm" variant="ghost" className="" onClick={onDecrement}>
          <Minus className="" />
        </Button>
      </div>
    </div>
  );
}
