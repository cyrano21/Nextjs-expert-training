import React from "react";

interface InfoTipProps {
  type?: "info" | "warning" | "success" | "danger";
  title?: string;
  children: React.ReactNode;
}

export function InfoTip({ type = "info", title, children }: InfoTipProps) {
  const colorMap = {
    info: "blue",
    warning: "amber",
    success: "green",
    danger: "red",
  };

  const color = colorMap[type];

  return (
    <div
      className={`p-4 mb-6 border-l-4 border-${color}-500 bg-${color}-50 dark:bg-${color}-900/20 rounded-r-md`}
    >
      {title && <p className="font-semibold text-sm mb-2">{title}</p>}
      <div className="text-sm">{children}</div>
    </div>
  );
}
