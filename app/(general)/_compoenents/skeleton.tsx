import React from "react";
import clsx from "clsx";

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={clsx(
        "animate-pulse bg-zinc-200 dark:bg-zinc-700 rounded-md",
        className
      )}
    />
  );
};

export default Skeleton;
