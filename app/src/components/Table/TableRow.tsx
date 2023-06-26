import clsx from "clsx";
import * as React from "react";

type TableRowProps = {
  children?: React.ReactNode;
  className?: string;
};

export default function TableRow({ children, className }: TableRowProps) {
  return <tr className={clsx("text-sm", className)}>{children}</tr>;
}
