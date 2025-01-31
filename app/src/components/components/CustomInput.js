import React from "react";
import { classnames } from "../utils/general";

const CustomInput = ({ customInput, setCustomInput }) => {
 // console.log("CUSTOM INPUT:"+customInput)
  return (
    <>
      {" "}
      <textarea
        rows="5"
        value={customInput}
        onChange={(e) => {
          setCustomInput(e.target.value)
          function myFunction(item, index){
            // Write your code here

            // console.log(output)
}

    process.stdin.on('data', data => {
            // Convert string array to integer array
            var input_array = data.toString().split(',').map(i => Number(i));
            console.log("input:",input_array)
            myFunction(input_array)
      })

        }}
        placeholder={`Custom input`}
        className={classnames(
          "focus:outline-none w-full border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white mt-2"
        )}
      ></textarea>
    </>
  );
};

export default CustomInput;
