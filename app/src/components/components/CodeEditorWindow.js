import React, { useState } from "react";

import Editor from "@monaco-editor/react";
import { useEffect } from "react";
const CodeEditorWindow = ({ onChange, language, code, theme,setTemplate }) => {
  const [value, setValue] = useState(code || "");
  useEffect(()=>{
    console.log("\n\nCODE:"+code)
    console.log(setTemplate)
  },[setTemplate])
  const handleEditorChange = (value) => {
    setValue(value);
    onChange("code", value);
  };

  return (
    <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
      <Editor
        height="85vh"
        width={`100%`}
        language={language || "javascript"}
        value={code}
        theme={theme}
        defaultValue="// some comment"
        onChange={handleEditorChange}
      />
    </div>
  );
};
export default CodeEditorWindow;
