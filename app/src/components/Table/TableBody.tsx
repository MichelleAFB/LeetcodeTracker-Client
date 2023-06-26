import clsx from "clsx";
import * as React from "react";

 type TableBodyProps = {
  children?: React.ReactNode;
  className?: string;
};

export default function TableBody({ children, className }: TableBodyProps) {
  return (
    <tbody className={clsx("bg-white divide-y divide-gray-200", className)}>
      {children}
    </tbody>
  );
}