import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DataTableContainerProps {
  children: React.ReactNode
  className?: string
  fullHeight?: boolean
}

export function DataTableContainer({ 
  children, 
  className = "", 
  fullHeight = false 
}: DataTableContainerProps) {
  return (
    <div className={`w-full ${className}`}>
      <ScrollArea className={fullHeight ? "h-[calc(100vh-13rem)]" : "max-h-[600px]"}>
        <div className="w-full overflow-x-auto">
          {children}
        </div>
      </ScrollArea>
    </div>
  )
}
