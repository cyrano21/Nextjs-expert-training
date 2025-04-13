import React from "react";
import { Info, AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react";

export function InfoTip({
  children,
  type = "info",
  title = "",
}: {
  children: React.ReactNode;
  type?: "info" | "warning" | "success" | "idea";
  title?: string;
}) {
  const types = {
    info: {
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      borderColor: "border-blue-200 dark:border-blue-800/50",
      textColor: "text-blue-800 dark:text-blue-300",
      icon: <Info className="h-5 w-5" />,
    },
    warning: {
      bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
      borderColor: "border-yellow-200 dark:border-yellow-800/50",
      textColor: "text-yellow-800 dark:text-yellow-300",
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    success: {
      bgColor: "bg-green-50 dark:bg-green-950/30",
      borderColor: "border-green-200 dark:border-green-800/50",
      textColor: "text-green-800 dark:text-green-300",
      icon: <CheckCircle2 className="h-5 w-5" />,
    },
    idea: {
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      borderColor: "border-purple-200 dark:border-purple-800/50",
      textColor: "text-purple-800 dark:text-purple-300",
      icon: <Lightbulb className="h-5 w-5" />,
    },
  };

  const style = types[type] || types.info;

  return (
    <div
      className={`p-4 my-4 rounded-md border ${style.borderColor} ${style.bgColor}`}
    >
      {title && (
        <div
          className={`font-bold mb-1 ${style.textColor} flex items-center gap-1.5`}
        >
          {style.icon} {title}
        </div>
      )}
      <div className={style.textColor}>{children}</div>
    </div>
  );
}
