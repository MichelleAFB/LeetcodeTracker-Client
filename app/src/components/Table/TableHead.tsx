import clsx from "clsx";
import * as React from "react";

type TableHeadProps = {
  children?: React.ReactNode;
  className?: string;
};

export default function TableHead({ children, className }: TableHeadProps) {
  return (
    <thead className={clsx("text-sm bg-gray-50 text-gray-500", className)}>
      {children}
    </thead>
  );
}
