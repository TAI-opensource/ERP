"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertCircleIcon } from "lucide-react"

interface Currency {
  code: string
  name: string
  symbol: string
  decimalPlaces: number
  thousandSeparator?: string
  decimalSeparator?: string
}

const defaultCurrencies: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", decimalPlaces: 2 },
  { code: "EUR", name: "Euro", symbol: "\u20AC", decimalPlaces: 2 },
  { code: "GBP", name: "British Pound", symbol: "\u00A3", decimalPlaces: 2 },
  { code: "JPY", name: "Japanese Yen", symbol: "\u00A5", decimalPlaces: 0 },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", decimalPlaces: 2 },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", decimalPlaces: 2 },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", decimalPlaces: 2 },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", decimalPlaces: 2 },
  { code: "CNY", name: "Chinese Yuan", symbol: "\u00A5", decimalPlaces: 2 },
  { code: "INR", name: "Indian Rupee", symbol: "\u20B9", decimalPlaces: 2 },
]

interface CurrencyInputProps {
  value: string | number
  onChange: (value: string, currency: string) => void
  currency?: string
  onCurrencyChange?: (currency: string) => void
  currencies?: Currency[]
  showCurrencySelect?: boolean
  prefix?: string
  suffix?: string
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  min?: number
  max?: number
  allowNegative?: boolean
  error?: string
  className?: string
  inputClassName?: string
  size?: "sm" | "default" | "lg"
  compact?: boolean
}

function formatCurrencyValue(
  value: string,
  currency: Currency,
  allowNegative: boolean
): string {
  const raw = value.replace(/[^0-9.-]/g, "")

  if (raw === "" || raw === "-" || raw === ".") return raw

  const isNegative = raw.startsWith("-") && !allowNegative
  const cleanValue = isNegative ? raw.slice(1) : raw

  const num = parseFloat(cleanValue)
  if (isNaN(num)) return ""

  const parts = cleanValue.split(".")
  const intPart = parts[0]
  const decPart = parts.length > 1 ? parts[1].slice(0, currency.decimalPlaces) : ""

  const thousandSep = currency.thousandSeparator ?? ","
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSep)

  if (currency.decimalPlaces > 0 && (cleanValue.includes(".") || decPart)) {
    const decSep = currency.decimalSeparator ?? "."
    return (isNegative ? "-" : "") + formatted + decSep + decPart
  }

  return (isNegative ? "-" : "") + formatted
}

function parseCurrencyValue(formatted: string): string {
  return formatted.replace(/[^0-9.-]/g, "")
}

function CurrencyInput({
  value,
  onChange,
  currency: currencyCode = "USD",
  onCurrencyChange,
  currencies = defaultCurrencies,
  showCurrencySelect = false,
  prefix,
  suffix,
  placeholder = "0.00",
  disabled = false,
  readOnly = false,
  min,
  max,
  allowNegative = true,
  error,
  className,
  inputClassName,
  size = "default",
  compact = false,
}: CurrencyInputProps) {
  const currency = React.useMemo(
    () => currencies.find((c) => c.code === currencyCode) ?? currencies[0],
    [currencyCode, currencies]
  )

  const [displayValue, setDisplayValue] = React.useState("")
  const [isFocused, setIsFocused] = React.useState(false)

  React.useEffect(() => {
    if (!isFocused) {
      const num = typeof value === "string" ? parseFloat(value) : value
      if (!isNaN(num) && num !== 0) {
        setDisplayValue(
          formatCurrencyValue(String(num), currency, allowNegative)
        )
      } else if (num === 0) {
        setDisplayValue("")
      } else {
        setDisplayValue("")
      }
    }
  }, [value, currency, allowNegative, isFocused])

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      const parsed = parseCurrencyValue(raw)

      if (parsed === "" || parsed === "-" || parsed === ".") {
        setDisplayValue(raw)
        onChange(parsed, currencyCode)
        return
      }

      const num = parseFloat(parsed)
      if (!isNaN(num)) {
        let clamped = num
        if (min !== undefined && num < min) clamped = min
        if (max !== undefined && num > max) clamped = max

        setDisplayValue(formatCurrencyValue(String(clamped), currency, allowNegative))
        onChange(String(clamped), currencyCode)
      }
    },
    [currency, currencyCode, onChange, min, max, allowNegative]
  )

  const handleBlur = React.useCallback(() => {
    setIsFocused(false)
    const num = parseFloat(parseCurrencyValue(displayValue))
    if (!isNaN(num)) {
      setDisplayValue(formatCurrencyValue(String(num), currency, allowNegative))
    }
  }, [displayValue, currency, allowNegative])

  const handleFocus = React.useCallback(() => {
    setIsFocused(true)
  }, [])

  const effectivePrefix = prefix ?? currency.symbol
  const effectiveSuffix = suffix

  const sizeClasses = {
    sm: "h-7 text-xs",
    default: "h-8 text-sm",
    lg: "h-10 text-base",
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center">
        {showCurrencySelect && (
          <Select
            value={currencyCode}
            onValueChange={(val) => onCurrencyChange?.(val ?? "USD")}
            disabled={disabled}
          >
            <SelectTrigger
              className={cn(
                "w-[90px] shrink-0 rounded-r-none border-r-0",
                sizeClasses[size]
              )}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {effectivePrefix && !showCurrencySelect && (
          <span className={cn(
            "flex items-center justify-center border border-input bg-muted/50 text-muted-foreground",
            sizeClasses[size],
            "rounded-l-lg px-2 text-sm font-medium",
            compact && "px-1.5"
          )}>
            {effectivePrefix}
          </span>
        )}

        <Input
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className={cn(
            "text-right tabular-nums",
            effectivePrefix && !showCurrencySelect && "rounded-l-none",
            effectiveSuffix && "rounded-r-none",
            error && "border-destructive",
            sizeClasses[size],
            inputClassName
          )}
        />

        {effectiveSuffix && (
          <span className={cn(
            "flex items-center justify-center border border-input bg-muted/50 text-muted-foreground",
            sizeClasses[size],
            "rounded-r-lg px-2 text-sm font-medium",
            compact && "px-1.5"
          )}>
            {effectiveSuffix}
          </span>
        )}
      </div>

      {error && (
        <p className="flex items-center gap-1 text-xs text-destructive">
          <AlertCircleIcon className="size-3" />
          {error}
        </p>
      )}
    </div>
  )
}

export { CurrencyInput, defaultCurrencies, type Currency, type CurrencyInputProps }
