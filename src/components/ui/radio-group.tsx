import * as React from "react"
import { cn } from "@/lib/utils"

export interface RadioGroupProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  options: { value: string; label: string }[]
  value?: string
  onValueChange?: (value: string) => void
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, options, value, onValueChange, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-3", className)} {...props}>
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="radio"
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onValueChange?.(e.target.value)}
              className="h-4 w-4 text-primary focus:ring-primary border-input bg-background"
            />
            <span className="text-sm font-medium">{option.label}</span>
          </label>
        ))}
      </div>
    )
  }
)
RadioGroup.displayName = "RadioGroup"

export { RadioGroup }
