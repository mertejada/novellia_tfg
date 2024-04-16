"use client";

import { Badge } from "flowbite-react";
import { useState } from "react";
import { HiCheck } from "react-icons/hi";

function StepsInterest() {
  const [selected, setSelected] = useState(false);

  const handleClick = () => {
    setSelected(!selected);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={handleClick} className={`badge-input ${selected ? 'bg-crayola' : 'bg-gray-200'}`}>
        <Badge icon={HiCheck} />
      </button>
      <button onClick={handleClick} className={`badge-input ${selected ? 'bg-crayola' : 'bg-gray-200'}`}>
        <Badge color="gray" icon={HiCheck} />
      </button>
      <button onClick={handleClick} className={`badge-input ${selected ? 'bg-crayola' : 'bg-gray-200'}`}>
        <Badge size="sm" icon={HiCheck} />
      </button>
      <button onClick={handleClick} className={`badge-input ${selected ? 'bg-crayola' : 'bg-gray-200'}`}>
        <Badge color="gray" size="sm" icon={HiCheck} />
      </button>
    </div>
  );
}

export default StepsInterest;
