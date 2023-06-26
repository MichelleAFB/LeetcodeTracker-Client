import clsx from "clsx";
import * as React from "react";

type TableProps = {
  children?: React.ReactNode;
  className?: string;
};

export default function Table({ children, className }: TableProps) {
  return <table className={clsx("min-w-full", className)}>{children}</table>;
}
