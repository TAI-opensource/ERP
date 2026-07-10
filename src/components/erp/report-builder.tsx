"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  PlusIcon,
  Trash2Icon,
  DownloadIcon,
  FilterIcon,
  XIcon,
  GripVerticalIcon,
  ArrowUpDownIcon,
} from "lucide-react"

interface ReportColumn {
  id: string
  name: string
  label: string
  type: "string" | "number" | "date" | "currency" | "percentage"
  sortable?: boolean
  aggregable?: boolean
}

interface ReportFilter {
  id: string
  columnId: string
  operator: "equals" | "contains" | "startsWith" | "endsWith" | "gt" | "lt" | "between"
  value: string
  value2?: string
}

interface ReportSort {
  columnId: string
  direction: "asc" | "desc"
}

interface ReportBuilderProps {
  columns: ReportColumn[]
  data: Record<string, unknown>[]
  filters?: ReportFilter[]
  sorts?: ReportSort[]
  onFiltersChange?: (filters: ReportFilter[]) => void
  onSortsChange?: (sorts: ReportSort[]) => void
  onExport?: (data: Record<string, unknown>[], format: "csv" | "xlsx" | "pdf") => void
  title?: string
  className?: string
}

const operators = [
  { value: "equals", label: "Equals" },
  { value: "contains", label: "Contains" },
  { value: "startsWith", label: "Starts with" },
  { value: "endsWith", label: "Ends with" },
  { value: "gt", label: "Greater than" },
  { value: "lt", label: "Less than" },
  { value: "between", label: "Between" },
]

const aggregations = [
  { value: "none", label: "None" },
  { value: "sum", label: "Sum" },
  { value: "avg", label: "Average" },
  { value: "min", label: "Min" },
  { value: "max", label: "Max" },
  { value: "count", label: "Count" },
]

function ReportBuilder({
  columns,
  data,
  filters: controlledFilters,
  sorts: controlledSorts,
  onFiltersChange,
  onSortsChange,
  onExport,
  title = "Report Builder",
  className,
}: ReportBuilderProps) {
  const [internalFilters, setInternalFilters] = React.useState<ReportFilter[]>([])
  const [internalSorts, setInternalSorts] = React.useState<ReportSort[]>([])
  const [selectedColumns, setSelectedColumns] = React.useState<string[]>(
    columns.map((c) => c.id)
  )
  const [aggregationsState, setAggregationsState] = React.useState<Record<string, string>>({})

  const filters = controlledFilters ?? internalFilters
  const sorts = controlledSorts ?? internalSorts

  const handleAddFilter = () => {
    const newFilter: ReportFilter = {
      id: Date.now().toString(),
      columnId: columns[0]?.id ?? "",
      operator: "contains",
      value: "",
    }
    const newFilters = [...filters, newFilter]
    setInternalFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const handleRemoveFilter = (filterId: string) => {
    const newFilters = filters.filter((f) => f.id !== filterId)
    setInternalFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const handleFilterChange = (filterId: string, updates: Partial<ReportFilter>) => {
    const newFilters = filters.map((f) =>
      f.id === filterId ? { ...f, ...updates } : f
    )
    setInternalFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const handleAddSort = () => {
    const newSort: ReportSort = {
      columnId: columns[0]?.id ?? "",
      direction: "asc",
    }
    const newSorts = [...sorts, newSort]
    setInternalSorts(newSorts)
    onSortsChange?.(newSorts)
  }

  const handleRemoveSort = (columnId: string) => {
    const newSorts = sorts.filter((s) => s.columnId !== columnId)
    setInternalSorts(newSorts)
    onSortsChange?.(newSorts)
  }

  const handleSortDirectionToggle = (columnId: string) => {
    const newSorts = sorts.map((s) =>
      s.columnId === columnId
        ? { ...s, direction: (s.direction === "asc" ? "desc" : "asc") as "asc" | "desc" }
        : s
    )
    setInternalSorts(newSorts as ReportSort[])
    onSortsChange?.(newSorts as ReportSort[])
  }

  const handleToggleColumn = (columnId: string) => {
    setSelectedColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    )
  }

  const filteredData = React.useMemo(() => {
    let result = [...data]

    filters.forEach((filter) => {
      if (!filter.value) return
      const col = columns.find((c) => c.id === filter.columnId)
      if (!col) return

      result = result.filter((row) => {
        const cellValue = String(row[filter.columnId] ?? "").toLowerCase()
        const filterValue = filter.value.toLowerCase()

        switch (filter.operator) {
          case "equals":
            return cellValue === filterValue
          case "contains":
            return cellValue.includes(filterValue)
          case "startsWith":
            return cellValue.startsWith(filterValue)
          case "endsWith":
            return cellValue.endsWith(filterValue)
          case "gt":
            return Number(row[filter.columnId]) > Number(filter.value)
          case "lt":
            return Number(row[filter.columnId]) < Number(filter.value)
          case "between":
            const num = Number(row[filter.columnId])
            return num >= Number(filter.value) && num <= Number(filter.value2 ?? filter.value)
          default:
            return true
        }
      })
    })

    sorts.forEach((sort) => {
      const col = columns.find((c) => c.id === sort.columnId)
      if (!col) return

      result.sort((a, b) => {
        const aVal = a[sort.columnId]
        const bVal = b[sort.columnId]

        if (aVal == null && bVal == null) return 0
        if (aVal == null) return 1
        if (bVal == null) return -1

        const cmp = String(aVal).localeCompare(String(bVal))
        return sort.direction === "asc" ? cmp : -cmp
      })
    })

    return result
  }, [data, filters, sorts, columns])

  const visibleColumns = columns.filter((c) => selectedColumns.includes(c.id))

  const handleExport = (format: "csv" | "xlsx" | "pdf") => {
    onExport?.(filteredData, format)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport("csv")}>
              <DownloadIcon className="mr-1 size-3" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("xlsx")}>
              <DownloadIcon className="mr-1 size-3" />
              Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("pdf")}>
              <DownloadIcon className="mr-1 size-3" />
              PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Label className="text-sm font-medium">Columns:</Label>
          {columns.map((col) => (
            <div key={col.id} className="flex items-center gap-1">
              <Checkbox
                id={`col-${col.id}`}
                checked={selectedColumns.includes(col.id)}
                onCheckedChange={() => handleToggleColumn(col.id)}
              />
              <Label htmlFor={`col-${col.id}`} className="text-xs cursor-pointer">
                {col.label}
              </Label>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FilterIcon className="size-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Filters</Label>
              <Badge variant="secondary" className="text-[10px]">
                {filters.length}
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={handleAddFilter}>
              <PlusIcon className="mr-1 size-3" />
              Add Filter
            </Button>
          </div>

          {filters.map((filter) => (
            <div key={filter.id} className="flex items-center gap-2">
              <Select
                value={filter.columnId}
                onValueChange={(val) => handleFilterChange(filter.id, { columnId: val })}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((col) => (
                    <SelectItem key={col.id} value={col.id}>
                      {col.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filter.operator}
                onValueChange={(val) =>
                  handleFilterChange(filter.id, { operator: val as ReportFilter["operator"] })
                }
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {operators.map((op) => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Value"
                value={filter.value}
                onChange={(e) => handleFilterChange(filter.id, { value: e.target.value })}
                className="w-[150px]"
              />

              {filter.operator === "between" && (
                <Input
                  placeholder="To"
                  value={filter.value2 ?? ""}
                  onChange={(e) => handleFilterChange(filter.id, { value2: e.target.value })}
                  className="w-[150px]"
                />
              )}

              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => handleRemoveFilter(filter.id)}
              >
                <XIcon className="size-3" />
              </Button>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowUpDownIcon className="size-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Sort By</Label>
              <Badge variant="secondary" className="text-[10px]">
                {sorts.length}
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={handleAddSort}>
              <PlusIcon className="mr-1 size-3" />
              Add Sort
            </Button>
          </div>

          {sorts.map((sort) => (
            <div key={sort.columnId} className="flex items-center gap-2">
              <Select
                value={sort.columnId}
                onValueChange={(val) => {
                  const newSorts = sorts.map((s) =>
                    s.columnId === sort.columnId ? { ...s, columnId: val } : s
                  )
                  setInternalSorts(newSorts)
                  onSortsChange?.(newSorts)
                }}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((col) => (
                    <SelectItem key={col.id} value={col.id}>
                      {col.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSortDirectionToggle(sort.columnId)}
              >
                {sort.direction === "asc" ? "↑ Ascending" : "↓ Descending"}
              </Button>

              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => handleRemoveSort(sort.columnId)}
              >
                <XIcon className="size-3" />
              </Button>
            </div>
          ))}
        </div>

        <Separator />

        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {visibleColumns.map((col) => (
                  <TableHead key={col.id} className="text-xs">
                    {col.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={visibleColumns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row, idx) => (
                  <TableRow key={idx}>
                    {visibleColumns.map((col) => (
                      <TableCell key={col.id} className="text-xs">
                        {String(row[col.id] ?? "")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="text-xs text-muted-foreground">
          {filteredData.length} rows
        </div>
      </CardContent>
    </Card>
  )
}

export { ReportBuilder, type ReportColumn, type ReportFilter, type ReportSort, type ReportBuilderProps }
