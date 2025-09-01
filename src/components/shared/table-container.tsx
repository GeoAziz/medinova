import * as React from "react"

interface TableContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function TableContainer({ children, className = "", ...props }: TableContainerProps) {
  return (
    <div className="w-full overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0" {...props}>
      <div className="min-w-full inline-block align-middle">
        {children}
      </div>
    </div>
  )
}
