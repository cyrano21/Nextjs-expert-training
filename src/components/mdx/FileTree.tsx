"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Folder, File, ChevronRight } from "lucide-react";

interface FileTreeItem {
  name: string;
  children?: FileTreeItem[];
  isOpen?: boolean;
}

interface FileTreeProps {
  items: FileTreeItem[];
  className?: string;
}

export function FileTree({ items, className }: FileTreeProps) {
  return (
    <div className={cn("my-4 rounded-lg border bg-card p-4", className)}>
      <FileTreeList items={items} level={0} />
    </div>
  );
}

interface FileTreeListProps {
  items: FileTreeItem[];
  level: number;
}

function FileTreeList({ items, level }: FileTreeListProps) {
  return (
    <ul className={cn("list-none pl-0", level > 0 && "pl-5")}>
      {items.map((item, index) => (
        <FileTreeNode
          key={`${level}-${index}-${item.name}`}
          item={item}
          level={level}
        />
      ))}
    </ul>
  );
}

interface FileTreeNodeProps {
  item: FileTreeItem;
  level: number;
}

function FileTreeNode({ item, level }: FileTreeNodeProps) {
  const isFolder = !!item.children?.length;

  return (
    <li className="py-1">
      <div className="flex items-center gap-1 text-sm">
        {isFolder ? (
          <>
            <ChevronRight
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground transition-transform",
                item.isOpen && "rotate-90"
              )}
            />
            <Folder size={16} className="text-blue-500 mr-1.5" />
            <span className="font-medium">{item.name}</span>
          </>
        ) : (
          <>
            <span className="w-3.5" />
            <File size={16} className="text-gray-400 mr-1.5" />
            <span>{item.name}</span>
          </>
        )}
      </div>
      {isFolder && item.isOpen && (
        <FileTreeList items={item.children!} level={level + 1} />
      )}
    </li>
  );
}
