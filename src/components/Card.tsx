import React from 'react'
import { cn } from '@/utils/helpers'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border border-vault-200 bg-white p-6 shadow-sm',
        hoverable && 'cursor-pointer transition-all hover:shadow-md hover:border-gold-300',
        className
      )}
      {...props}
    />
  )
)

Card.displayName = 'Card'
