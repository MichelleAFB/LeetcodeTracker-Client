import React from "react";

const OutputDetails = ({ outputDetails }) => {
  return (
    <div className="metrics-container mt-4 flex flex-col space-y-3">
    <p className="text-sm text-white">
    <p class="text-white"> Status:{" "}</p>
      <span className="font-semibold px-2 py-1 rounded-md bg-gray-500 m-2">
        {outputDetails?.status?.description}
      </span>
    </p>
    <p className="text-sm text-white">
     <p class="text-white">Memory:{" "}</p> 
      <span className="font-semibold px-2 py-1 rounded-md bg-gray-500 m-2">
        {outputDetails?.memory}
      </span>
    </p>
    <p className="text-sm text-white">
    <p class="text-white"> Time:{" "}</p>
      <span className="font-semibold px-2 py-1 rounded-md bg-gray-500 m-2">
        {outputDetails?.time}
      </span>
    </p>
  </div>
  );
};

export default OutputDetails;
