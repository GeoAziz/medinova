interface GridContainerProps {
  children: React.ReactNode
  className?: string
  cols?: {
    default: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
}

export function GridContainer({ 
  children, 
  className = "",
  cols = { default: 1, md: 2, lg: 3 }
}: GridContainerProps) {
  const gridCols = `grid-cols-${cols.default} ${cols.sm ? `sm:grid-cols-${cols.sm}` : ''} ${cols.md ? `md:grid-cols-${cols.md}` : ''} ${cols.lg ? `lg:grid-cols-${cols.lg}` : ''} ${cols.xl ? `xl:grid-cols-${cols.xl}` : ''}`;
  
  return (
    <div className={`grid gap-6 w-full ${gridCols} ${className}`}>
      {children}
    </div>
  );
}
