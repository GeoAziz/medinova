interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

const maxWidthClasses = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  'full': 'max-w-full'
}

export function ResponsiveContainer({ 
  children, 
  className = "", 
  maxWidth = 'full' 
}: ResponsiveContainerProps) {
  return (
    <div className={`w-full px-4 md:px-6 mx-auto ${maxWidthClasses[maxWidth]} ${className}`}>
      {children}
    </div>
  )
}
