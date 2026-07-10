"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  AlertCircleIcon,
  ClockIcon,
  CalendarDaysIcon,
} from "lucide-react"
import {
  format,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isBefore,
  isAfter,
  isSameDay,
  isWeekend,
  isToday,
  parseISO,
  isValid,
} from "date-fns"

type DatePickerPreset = "today" | "yesterday" | "tomorrow" | "thisWeek" | "lastWeek" | "nextWeek" | "thisMonth" | "lastMonth" | "nextMonth" | "thisYear" | "lastYear" | "nextYear"

interface BusinessRule {
  disableWeekends?: boolean
  disablePast?: boolean
  disableFuture?: boolean
  disableToday?: boolean
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  disabledDaysOfWeek?: number[]
  customDisabled?: (date: Date) => boolean
}

interface DatePickerProps {
  value?: Date | null
  onChange?: (date: Date | null) => void
  placeholder?: string
  label?: string
  description?: string
  error?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  businessRules?: BusinessRule
  showPresets?: boolean
  presets?: { label: string; value: DatePickerPreset | Date }[]
  showTime?: boolean
  timeStep?: number
  format?: string
  className?: string
  inputClassName?: string
  calendarClassName?: string
  showTodayButton?: boolean
  clearable?: boolean
  size?: "sm" | "default" | "lg"
  align?: "start" | "center" | "end"
  side?: "top" | "bottom" | "left" | "right"
  range?: boolean
  rangeEnd?: Date | null
  onRangeEndChange?: (date: Date | null) => void
}

function evaluateBusinessRule(date: Date, rules: BusinessRule): string | null {
  if (rules.disableWeekends && isWeekend(date)) return "Weekends are not available"
  if (rules.disablePast && isBefore(date, new Date()) && !isToday(date)) return "Past dates are not available"
  if (rules.disableFuture && isAfter(date, new Date()) && !isToday(date)) return "Future dates are not available"
  if (rules.disableToday && isToday(date)) return "Today is not available"
  if (rules.minDate && isBefore(date, rules.minDate)) return `Date must be after ${format(rules.minDate, "MMM d, yyyy")}`
  if (rules.maxDate && isAfter(date, rules.maxDate)) return `Date must be before ${format(rules.maxDate, "MMM d, yyyy")}`
  if (rules.disabledDates?.some((d) => isSameDay(d, date))) return "This date is not available"
  if (rules.disabledDaysOfWeek?.includes(date.getDay())) return "This day of the week is not available"
  if (rules.customDisabled?.(date)) return "This date is not available"
  return null
}

function getPresetDate(preset: DatePickerPreset): Date {
  const now = new Date()
  switch (preset) {
    case "today": return now
    case "yesterday": return subDays(now, 1)
    case "tomorrow": return addDays(now, 1)
    case "thisWeek": return startOfWeek(now)
    case "lastWeek": return startOfWeek(subWeeks(now, 1))
    case "nextWeek": return startOfWeek(addWeeks(now, 1))
    case "thisMonth": return startOfMonth(now)
    case "lastMonth": return startOfMonth(subMonths(now, 1))
    case "nextMonth": return startOfMonth(addMonths(now, 1))
    case "thisYear": return startOfYear(now)
    case "lastYear": return startOfYear(subYears(now, 1))
    case "nextYear": return startOfYear(addYears(now, 1))
    default: return now
  }
}

const defaultPresets: { label: string; value: DatePickerPreset }[] = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Tomorrow", value: "tomorrow" },
  { label: "This Week", value: "thisWeek" },
  { label: "This Month", value: "thisMonth" },
  { label: "Last Month", value: "lastMonth" },
]

function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  label,
  description,
  error,
  disabled = false,
  readOnly = false,
  required = false,
  businessRules,
  showPresets = false,
  presets = defaultPresets,
  showTime = false,
  timeStep = 30,
  format: dateFormat = "PPP",
  className,
  inputClassName,
  calendarClassName,
  showTodayButton = true,
  clearable = true,
  size = "default",
  align = "start",
  side = "bottom",
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")
  const [selectedTime, setSelectedTime] = React.useState({ hours: 0, minutes: 0 })
  const [month, setMonth] = React.useState<Date | undefined>(value ?? undefined)

  const sizeClasses = {
    sm: "h-7 text-xs",
    default: "h-8 text-sm",
    lg: "h-10 text-base",
  }

  React.useEffect(() => {
    if (value) {
      setInputValue(format(value, "MM/dd/yyyy"))
      setSelectedTime({ hours: value.getHours(), minutes: value.getMinutes() })
    } else {
      setInputValue("")
    }
  }, [value])

  const handleDateSelect = React.useCallback(
    (date: Date | undefined) => {
      if (!date) {
        onChange?.(null)
        return
      }

      if (businessRules) {
        const error = evaluateBusinessRule(date, businessRules)
        if (error) return
      }

      if (showTime) {
        const newDate = new Date(date)
        newDate.setHours(selectedTime.hours, selectedTime.minutes)
        onChange?.(newDate)
      } else {
        onChange?.(date)
      }

      if (!showTime) setOpen(false)
    },
    [onChange, businessRules, showTime, selectedTime]
  )

  const handleTimeChange = React.useCallback(
    (hours: number, minutes: number) => {
      setSelectedTime({ hours, minutes })
      if (value) {
        const newDate = new Date(value)
        newDate.setHours(hours, minutes)
        onChange?.(newDate)
      }
    },
    [value, onChange]
  )

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      setInputValue(raw)

      const parsed = parseISO(raw)
      if (isValid(parsed)) {
        if (businessRules) {
          const error = evaluateBusinessRule(parsed, businessRules)
          if (!error) onChange?.(parsed)
        } else {
          onChange?.(parsed)
        }
      }
    },
    [onChange, businessRules]
  )

  const handlePresetClick = React.useCallback(
    (presetValue: DatePickerPreset | Date) => {
      const date = typeof presetValue === "string" ? getPresetDate(presetValue) : presetValue
      handleDateSelect(date)
      setOpen(false)
    },
    [handleDateSelect]
  )

  const handleToday = React.useCallback(() => {
    handleDateSelect(new Date())
    setOpen(false)
  }, [handleDateSelect])

  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onChange?.(null)
      setInputValue("")
    },
    [onChange]
  )

  const timeOptions = React.useMemo(() => {
    const options: { label: string; value: number }[] = []
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += timeStep) {
        const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
        const ampm = h < 12 ? "AM" : "PM"
        options.push({
          label: `${hour12}:${String(m).padStart(2, "0")} ${ampm}`,
          value: h * 60 + m,
        })
      }
    }
    return options
  }, [timeStep])

  const displayValue = value ? format(value, dateFormat) : ""

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <Label className={cn(sizeClasses[size])}>
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <div className="relative">
            <button
              type="button"
              disabled={disabled || readOnly}
              className={cn(
                "flex w-full items-center justify-between rounded-lg border border-input bg-transparent px-2.5 text-left transition-colors outline-none",
                sizeClasses[size],
                "hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                disabled && "cursor-not-allowed opacity-50",
                readOnly && "cursor-default",
                error && "border-destructive",
                !value && "text-muted-foreground",
                inputClassName
              )}
            >
              <div className="flex items-center gap-2">
                <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{displayValue || placeholder}</span>
              </div>

              {clearable && value && !readOnly && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="ml-1 rounded-sm text-muted-foreground hover:text-foreground"
                >
                  <span className="sr-only">Clear</span>
                  &times;
                </button>
              )}
            </button>
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto p-0"
          align={align}
          side={side}
        >
          <div className="flex">
            <div className={cn("flex flex-col", showPresets && "border-r border-border")}>
              {showPresets && (
                <div className="flex flex-col gap-0.5 p-2 border-b border-border">
                  {presets.map((preset) => (
                    <button
                      key={typeof preset.value === "string" ? preset.value : preset.label}
                      onClick={() => handlePresetClick(preset.value)}
                      className="rounded-md px-2 py-1.5 text-left text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              )}

              <Calendar
                mode="single"
                selected={value ?? undefined}
                onSelect={handleDateSelect}
                month={month}
                onMonthChange={setMonth}
                disabled={(date) => {
                  if (!businessRules) return false
                  return evaluateBusinessRule(date, businessRules) !== null
                }}
                className={calendarClassName}
              />

              {showTime && value && (
                <div className="border-t border-border p-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ClockIcon className="size-3" />
                    Time
                  </div>
                  <select
                    value={selectedTime.hours * 60 + selectedTime.minutes}
                    onChange={(e) => {
                      const totalMinutes = Number(e.target.value)
                      const h = Math.floor(totalMinutes / 60)
                      const m = totalMinutes % 60
                      handleTimeChange(h, m)
                    }}
                    className="mt-1 w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs"
                  >
                    {timeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {showTodayButton && (
                <div className="border-t border-border p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={handleToday}
                  >
                    <CalendarDaysIcon className="mr-1.5 size-3.5" />
                    Today
                  </Button>
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {description && !error && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {error && (
        <p className="flex items-center gap-1 text-xs text-destructive">
          <AlertCircleIcon className="size-3" />
          {error}
        </p>
      )}
    </div>
  )
}

export { DatePicker, evaluateBusinessRule, getPresetDate, type DatePickerProps, type BusinessRule, type DatePickerPreset }
