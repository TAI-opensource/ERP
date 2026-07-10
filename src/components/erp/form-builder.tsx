"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, PlusIcon, Trash2Icon, GripVerticalIcon, AlertCircleIcon } from "lucide-react"
import { format } from "date-fns"

type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "textarea"
  | "select"
  | "multi-select"
  | "checkbox"
  | "switch"
  | "date"
  | "time"
  | "datetime"
  | "currency"
  | "percentage"
  | "file"
  | "hidden"
  | "section"
  | "divider"
  | "custom"

interface Option {
  label: string
  value: string
  disabled?: boolean
}

interface ValidationRule {
  required?: boolean | string
  min?: number | string
  max?: number | string
  minLength?: number
  maxLength?: number
  pattern?: RegExp | string
  custom?: (value: unknown) => string | null
}

interface FieldConfig {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  defaultValue?: unknown
  options?: Option[]
  validation?: ValidationRule
  disabled?: boolean
  readOnly?: boolean
  hidden?: boolean
  className?: string
  labelClassName?: string
  inputClassName?: string
  description?: string
  prefix?: string
  suffix?: string
  rows?: number
  min?: number
  max?: number
  step?: number
  accept?: string
  render?: (props: {
    value: unknown
    onChange: (value: unknown) => void
    field: FieldConfig
    error?: string
  }) => React.ReactNode
  group?: string
  colSpan?: number
  dependsOn?: string
  dependsOnValue?: unknown
  showWhen?: (values: Record<string, unknown>) => boolean
}

interface FieldGroup {
  name: string
  label?: string
  description?: string
  collapsible?: boolean
  defaultCollapsed?: boolean
}

interface FormBuilderProps {
  fields: FieldConfig[]
  values?: Record<string, unknown>
  onChange?: (name: string, value: unknown) => void
  onValuesChange?: (values: Record<string, unknown>) => void
  onSubmit?: (values: Record<string, unknown>) => void
  onReset?: () => void
  validation?: Record<string, ValidationRule>
  errors?: Record<string, string>
  disabled?: boolean
  readOnly?: boolean
  loading?: boolean
  submitLabel?: string
  resetLabel?: string
  showReset?: boolean
  layout?: "single" | "two-column" | "three-column"
  groups?: FieldGroup[]
  className?: string
  formClassName?: string
 ActionsComponent?: React.ComponentType<{ children: React.ReactNode }>
}

function CurrencyInput({
  value,
  onChange,
  prefix = "$",
  suffix,
  disabled,
  readOnly,
  className,
}: {
  value: string | number
  onChange: (value: string) => void
  prefix?: string
  suffix?: string
  disabled?: boolean
  readOnly?: boolean
  className?: string
}) {
  const [displayValue, setDisplayValue] = React.useState("")

  React.useEffect(() => {
    const num = typeof value === "string" ? parseFloat(value) : value
    if (!isNaN(num)) {
      setDisplayValue(num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    } else {
      setDisplayValue("")
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.-]/g, "")
    setDisplayValue(raw)
    if (raw === "" || raw === "-") {
      onChange(raw)
      return
    }
    const num = parseFloat(raw)
    if (!isNaN(num)) {
      onChange(String(num))
    }
  }

  const handleBlur = () => {
    const num = parseFloat(displayValue)
    if (!isNaN(num)) {
      setDisplayValue(num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    }
  }

  return (
    <div className="flex items-center">
      {prefix && <span className="mr-1 text-sm text-muted-foreground">{prefix}</span>}
      <Input
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        readOnly={readOnly}
        className={cn("text-right", className)}
      />
      {suffix && <span className="ml-1 text-sm text-muted-foreground">{suffix}</span>}
    </div>
  )
}

function DatePickerField({
  value,
  onChange,
  disabled,
  placeholder = "Pick a date",
}: {
  value?: Date
  onChange: (date: Date | undefined) => void
  disabled?: boolean
  placeholder?: string
}) {
  const [open, setOpen] = React.useState(false)

  return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 size-4" />
            {value ? format(value, "PPP") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange(date)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
  )
}

function FieldRenderer({
  field,
  value,
  onChange,
  error,
  disabled,
  readOnly,
  allValues,
}: {
  field: FieldConfig
  value: unknown
  onChange: (value: unknown) => void
  error?: string
  disabled?: boolean
  readOnly?: boolean
  allValues: Record<string, unknown>
}) {
  const isDisabled = disabled || field.disabled
  const isReadOnly = readOnly || field.readOnly

  if (field.showWhen && !field.showWhen(allValues)) {
    return null
  }

  if (field.type === "section") {
    return (
      <div className="col-span-full">
        <h3 className="text-lg font-semibold text-foreground">{field.label}</h3>
        {field.description && (
          <p className="text-sm text-muted-foreground">{field.description}</p>
        )}
      </div>
    )
  }

  if (field.type === "divider") {
    return <hr className="col-span-full my-2 border-border" />
  }

  if (field.type === "custom" && field.render) {
    return (
      <div className={cn("flex flex-col gap-1.5", field.colSpan === 2 && "col-span-2", field.colSpan === 3 && "col-span-3", field.className)}>
        <Label className={cn(field.labelClassName)}>{field.label}</Label>
        {field.render({ value, onChange, field, error })}
        {field.description && !error && (
          <p className="text-xs text-muted-foreground">{field.description}</p>
        )}
      </div>
    )
  }

  const renderInput = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "password":
      case "tel":
      case "url":
        return (
          <Input
            type={field.type}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={isDisabled}
            readOnly={isReadOnly}
            className={cn(error && "border-destructive", field.inputClassName)}
          />
        )

      case "number":
        return (
          <Input
            type="number"
            value={(value as number) ?? ""}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : "")}
            placeholder={field.placeholder}
            disabled={isDisabled}
            readOnly={isReadOnly}
            min={field.min}
            max={field.max}
            step={field.step}
            className={cn(error && "border-destructive", field.inputClassName)}
          />
        )

      case "textarea":
        return (
          <Textarea
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={isDisabled}
            readOnly={isReadOnly}
            rows={field.rows ?? 3}
            className={cn(error && "border-destructive", field.inputClassName)}
          />
        )

      case "select":
        return (
          <Select
            value={(value as string) ?? ""}
            onValueChange={(val) => onChange(val)}
            disabled={isDisabled}
          >
            <SelectTrigger className={cn(error && "border-destructive", field.inputClassName)}>
              <SelectValue placeholder={field.placeholder ?? "Select..."} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "multi-select": {
        const selected = (Array.isArray(value) ? value : []) as string[]
        return (
          <div className="flex flex-wrap gap-1">
            {field.options?.map((opt) => (
              <button
                key={opt.value}
                type="button"
                disabled={isDisabled}
                onClick={() => {
                  const newVal = selected.includes(opt.value)
                    ? selected.filter((v) => v !== opt.value)
                    : [...selected, opt.value]
                  onChange(newVal)
                }}
                className={cn(
                  "inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium transition-colors",
                  selected.includes(opt.value)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-muted"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )
      }

      case "checkbox":
        return (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={!!value}
              onCheckedChange={(checked) => onChange(checked)}
              disabled={isDisabled}
            />
            {field.placeholder && (
              <Label className="text-sm font-normal text-muted-foreground">{field.placeholder}</Label>
            )}
          </div>
        )

      case "switch":
        return (
          <Switch
            checked={!!value}
            onCheckedChange={(checked) => onChange(checked)}
            disabled={isDisabled}
          />
        )

      case "date":
        return (
          <DatePickerField
            value={value ? new Date(value as string) : undefined}
            onChange={(date) => onChange(date?.toISOString())}
            disabled={isDisabled}
            placeholder={field.placeholder}
          />
        )

      case "currency":
        return (
          <CurrencyInput
            value={(value as string | number) ?? ""}
            onChange={(val) => onChange(val)}
            prefix={field.prefix}
            suffix={field.suffix}
            disabled={isDisabled}
            readOnly={isReadOnly}
            className={cn(error && "border-destructive", field.inputClassName)}
          />
        )

      case "percentage":
        return (
          <div className="flex items-center gap-1">
            <Input
              type="number"
              value={(value as number) ?? ""}
              onChange={(e) => onChange(e.target.value ? Number(e.target.value) : "")}
              placeholder={field.placeholder}
              disabled={isDisabled}
              readOnly={isReadOnly}
              min={0}
              max={100}
              step={0.01}
              className={cn("text-right", error && "border-destructive", field.inputClassName)}
            />
            <span className="text-sm text-muted-foreground">%</span>
          </div>
        )

      case "file":
        return (
          <Input
            type="file"
            onChange={(e) => onChange(e.target.files)}
            disabled={isDisabled}
            accept={field.accept}
            className={cn(error && "border-destructive", field.inputClassName)}
          />
        )

      case "hidden":
        return null

      default:
        return null
    }
  }

  if (field.type === "hidden") {
    return <input type="hidden" value={String(value ?? "")} />
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5",
        field.colSpan === 2 && "col-span-2",
        field.colSpan === 3 && "col-span-3",
        field.className
      )}
    >
      <Label className={cn(field.type !== "checkbox" && field.type !== "switch" && "text-sm font-medium", field.labelClassName)}>
        {field.label}
      </Label>
      {renderInput()}
      {field.description && !error && (
        <p className="text-xs text-muted-foreground">{field.description}</p>
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

function FormBuilder({
  fields,
  values: controlledValues,
  onChange,
  onValuesChange,
  onSubmit,
  onReset,
  errors: externalErrors,
  disabled = false,
  readOnly = false,
  loading = false,
  submitLabel = "Save",
  resetLabel = "Reset",
  showReset = false,
  layout = "single",
  groups,
  className,
  formClassName,
  ActionsComponent,
}: FormBuilderProps) {
  const [internalValues, setInternalValues] = React.useState<Record<string, unknown>>(() => {
    const initial: Record<string, unknown> = {}
    fields.forEach((f) => {
      if (f.defaultValue !== undefined) initial[f.name] = f.defaultValue
    })
    return initial
  })

  const [internalErrors, setInternalErrors] = React.useState<Record<string, string>>({})
  const [touchedFields, setTouchedFields] = React.useState<Set<string>>(new Set())

  const values = controlledValues ?? internalValues
  const errors = externalErrors ?? internalErrors

  const setValue = React.useCallback(
    (name: string, value: unknown) => {
      if (onChange) {
        onChange(name, value)
      }
      setInternalValues((prev) => {
        const newValues = { ...prev, [name]: value }
        onValuesChange?.(newValues)
        return newValues
      })
    },
    [onChange, onValuesChange]
  )

  const validate = React.useCallback((): boolean => {
    const newErrors: Record<string, string> = {}
    let valid = true

    fields.forEach((field) => {
      if (field.type === "section" || field.type === "divider" || field.type === "hidden" || field.type === "custom") return
      if (field.showWhen && !field.showWhen(values)) return

      const val = values[field.name]
      const rules = field.validation

      if (rules?.required) {
        const isRequired = typeof rules.required === "string" ? true : rules.required
        if (isRequired && (val === undefined || val === null || val === "" || (Array.isArray(val) && val.length === 0))) {
          newErrors[field.name] = typeof rules.required === "string" ? rules.required : `${field.label} is required`
          valid = false
          return
        }
      }

      if (val !== undefined && val !== null && val !== "") {
        if (rules?.min !== undefined) {
          const numVal = Number(val)
          if (numVal < Number(rules.min)) {
            newErrors[field.name] = `Must be at least ${rules.min}`
            valid = false
          }
        }
        if (rules?.max !== undefined) {
          const numVal = Number(val)
          if (numVal > Number(rules.max)) {
            newErrors[field.name] = `Must be at most ${rules.max}`
            valid = false
          }
        }
        if (rules?.minLength !== undefined && typeof val === "string" && val.length < rules.minLength) {
          newErrors[field.name] = `Must be at least ${rules.minLength} characters`
          valid = false
        }
        if (rules?.maxLength !== undefined && typeof val === "string" && val.length > rules.maxLength) {
          newErrors[field.name] = `Must be at most ${rules.maxLength} characters`
          valid = false
        }
        if (rules?.pattern) {
          const regex = typeof rules.pattern === "string" ? new RegExp(rules.pattern) : rules.pattern
          if (typeof val === "string" && !regex.test(val)) {
            newErrors[field.name] = "Invalid format"
            valid = false
          }
        }
        if (rules?.custom) {
          const customError = rules.custom(val)
          if (customError) {
            newErrors[field.name] = customError
            valid = false
          }
        }
      }
    })

    setInternalErrors(newErrors)
    return valid
  }, [fields, values])

  const handleSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      setTouchedFields(new Set(fields.map((f) => f.name)))
      if (validate()) {
        onSubmit?.(values)
      }
    },
    [validate, onSubmit, values, fields]
  )

  const handleReset = React.useCallback(() => {
    const initial: Record<string, unknown> = {}
    fields.forEach((f) => {
      initial[f.name] = f.defaultValue ?? ""
    })
    setInternalValues(initial)
    setInternalErrors({})
    setTouchedFields(new Set())
    onReset?.()
  }, [fields, onReset])

  const visibleFields = React.useMemo(() => {
    return fields.filter((f) => {
      if (f.hidden) return false
      if (f.showWhen && !f.showWhen(values)) return false
      return true
    })
  }, [fields, values])

  const gridCols = layout === "three-column" ? "grid-cols-1 md:grid-cols-3" : layout === "two-column" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"

  const ActionsWrapper = ActionsComponent ?? "div"

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} noValidate>
      {groups && groups.length > 0 ? (
        groups.map((group) => {
          const groupFields = visibleFields.filter((f) => f.group === group.name)
          if (groupFields.length === 0) return null

          return (
            <FieldGroupSection key={group.name} group={group}>
              <div className={cn("grid gap-4", gridCols, formClassName)}>
                {groupFields.map((field) => (
                  <FieldRenderer
                    key={field.name}
                    field={field}
                    value={values[field.name]}
                    onChange={(val) => setValue(field.name, val)}
                    error={touchedFields.has(field.name) ? errors[field.name] : undefined}
                    disabled={disabled || loading}
                    readOnly={readOnly}
                    allValues={values}
                  />
                ))}
              </div>
            </FieldGroupSection>
          )
        })
      ) : (
        <div className={cn("grid gap-4", gridCols, formClassName)}>
          {visibleFields.map((field) => (
            <FieldRenderer
              key={field.name}
              field={field}
              value={values[field.name]}
              onChange={(val) => setValue(field.name, val)}
              error={touchedFields.has(field.name) ? errors[field.name] : undefined}
              disabled={disabled || loading}
              readOnly={readOnly}
              allValues={values}
            />
          ))}
        </div>
      )}

      <ActionsWrapper>
        <div className="flex items-center gap-2 pt-2">
          <Button type="submit" disabled={disabled || loading}>
            {loading && <div className="mr-1 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
            {submitLabel}
          </Button>
          {showReset && (
            <Button type="button" variant="outline" onClick={handleReset} disabled={disabled || loading}>
              {resetLabel}
            </Button>
          )}
        </div>
      </ActionsWrapper>
    </form>
  )
}

function FieldGroupSection({
  group,
  children,
}: {
  group: FieldGroup
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = React.useState(group.defaultCollapsed ?? false)

  return (
    <div className="rounded-lg border border-border">
      {group.label && (
        <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">{group.label}</h3>
            {group.description && (
              <p className="text-xs text-muted-foreground">{group.description}</p>
            )}
          </div>
          {group.collapsible && (
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="text-muted-foreground hover:text-foreground"
            >
              <GripVerticalIcon className={cn("size-4 transition-transform", collapsed && "-rotate-90")} />
            </button>
          )}
        </div>
      )}
      <div className={cn("p-4", collapsed && "hidden")}>{children}</div>
    </div>
  )
}

export {
  FormBuilder,
  FieldRenderer,
  CurrencyInput,
  DatePickerField,
  FieldGroupSection,
  type FieldType,
  type FieldConfig,
  type FieldGroup,
  type FormBuilderProps,
  type Option,
  type ValidationRule,
}
