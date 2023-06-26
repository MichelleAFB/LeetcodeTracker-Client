import clsx from "clsx";
import * as React from "react";

type CardProps = {
  children?: React.ReactNode;
  className?: string;
};

export default function CardBody({ children, className }: CardProps) {
  return (
    <div className={clsx("rounded-xl shadow-sm bg-white", className)}>
      {children}
    </div>
  );
}
