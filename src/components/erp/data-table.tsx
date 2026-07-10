"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronsUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  XIcon,
  DownloadIcon,
  FilterIcon,
} from "lucide-react"

type SortDirection = "asc" | "desc" | null

interface Column<T> {
  id: string
  header: string
  accessorKey?: keyof T
  accessorFn?: (row: T) => React.ReactNode
  sortable?: boolean
  filterable?: boolean
  className?: string
  headerClassName?: string
  cellClassName?: string
  align?: "left" | "center" | "right"
  width?: string | number
  minWidth?: string | number
}

interface FilterValue {
  value: string
  operator: "contains" | "equals" | "startsWith" | "endsWith" | "gt" | "lt" | "gte" | "lte"
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchPlaceholder?: string
  searchKey?: keyof T
  searchKeys?: (keyof T)[]
  searchFn?: (row: T, query: string) => boolean
  searchDebounce?: number
  pageSize?: number
  pageSizeOptions?: number[]
  totalItems?: number
  currentPage?: number
  onPageChange?: (page: number) => void
  onSearch?: (query: string) => void
  onSort?: (column: string, direction: SortDirection) => void
  onFilter?: (filters: Record<string, FilterValue>) => void
  onExport?: (data: T[]) => void
  onRowClick?: (row: T) => void
  selectedRows?: T[]
  onSelectionChange?: (rows: T[]) => void
  selectable?: boolean
  loading?: boolean
  emptyMessage?: string
  className?: string
  tableClassName?: string
  stickyHeader?: boolean
  striped?: boolean
  compact?: boolean
  pagination?: boolean
  serverSide?: boolean
  filters?: Record<string, FilterValue>
}

function defaultSearch<T>(row: T, query: string, keys: (keyof T)[]): boolean {
  return keys.some((key) => {
    const value = row[key]
    if (value == null) return false
    return String(value).toLowerCase().includes(query.toLowerCase())
  })
}

function DataTableInner<T extends Record<string, unknown>>(
  {
    data,
    columns,
    searchPlaceholder = "Search...",
    searchKey,
    searchKeys,
    searchFn,
    searchDebounce = 300,
    pageSize: initialPageSize = 10,
    pageSizeOptions = [10, 20, 50, 100],
    totalItems,
    currentPage: controlledPage,
    onPageChange,
    onSearch,
    onSort,
    onFilter,
    onExport,
    onRowClick,
    selectedRows = [],
    onSelectionChange,
    selectable = false,
    loading = false,
    emptyMessage = "No results found.",
    className,
    tableClassName,
    stickyHeader = true,
    striped = false,
    compact = false,
    pagination = true,
    serverSide = false,
    filters: controlledFilters,
  }: DataTableProps<T>,
  ref: React.Ref<HTMLDivElement>
) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [sortColumn, setSortColumn] = React.useState<string | null>(null)
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null)
  const [internalPage, setInternalPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(initialPageSize)
  const [internalFilters, setInternalFilters] = React.useState<Record<string, FilterValue>>({})
  const [showFilters, setShowFilters] = React.useState(false)

  const debouncedSearchRef = React.useRef<NodeJS.Timeout | null>(null)

  const currentPage = controlledPage ?? internalPage
  const filters = controlledFilters ?? internalFilters

  const searchFields = React.useMemo(() => {
    if (searchKeys) return searchKeys
    if (searchKey) return [searchKey]
    return columns.filter((c) => c.accessorKey).map((c) => c.accessorKey!) as (keyof T)[]
  }, [searchKey, searchKeys, columns])

  const handleSearch = React.useCallback(
    (value: string) => {
      setSearchQuery(value)
      if (onSearch) {
        if (debouncedSearchRef.current) clearTimeout(debouncedSearchRef.current)
        debouncedSearchRef.current = setTimeout(() => {
          onSearch(value)
        }, searchDebounce)
      }
      if (!serverSide) {
        setInternalPage(1)
      }
    },
    [onSearch, searchDebounce, serverSide]
  )

  const handleSort = React.useCallback(
    (columnId: string) => {
      let newDirection: SortDirection = "asc"
      if (sortColumn === columnId) {
        if (sortDirection === "asc") newDirection = "desc"
        else if (sortDirection === "desc") newDirection = null
      }
      setSortColumn(newDirection ? columnId : null)
      setSortDirection(newDirection)
      if (onSort) onSort(columnId, newDirection)
    },
    [sortColumn, sortDirection, onSort]
  )

  const handleFilterChange = React.useCallback(
    (columnId: string, value: FilterValue) => {
      const newFilters = { ...filters, [columnId]: value }
      if (!value.value) delete newFilters[columnId]
      setInternalFilters(newFilters)
      if (onFilter) onFilter(newFilters)
      if (!serverSide) setInternalPage(1)
    },
    [filters, onFilter, serverSide]
  )

  const filteredData = React.useMemo(() => {
    if (serverSide) return data

    let result = [...data]

    if (searchQuery) {
      const searchFnToUse = searchFn || ((row: T, q: string) => defaultSearch(row, q, searchFields))
      result = result.filter((row) => searchFnToUse(row, searchQuery))
    }

    Object.entries(filters).forEach(([columnId, filter]) => {
      if (!filter.value) return
      const col = columns.find((c) => c.id === columnId)
      if (!col?.accessorKey) return

      result = result.filter((row) => {
        const cellValue = String(row[col.accessorKey!] ?? "").toLowerCase()
        const filterValue = filter.value.toLowerCase()

        switch (filter.operator) {
          case "contains":
            return cellValue.includes(filterValue)
          case "equals":
            return cellValue === filterValue
          case "startsWith":
            return cellValue.startsWith(filterValue)
          case "endsWith":
            return cellValue.endsWith(filterValue)
          case "gt":
            return Number(cellValue) > Number(filterValue)
          case "lt":
            return Number(cellValue) < Number(filterValue)
          case "gte":
            return Number(cellValue) >= Number(filterValue)
          case "lte":
            return Number(cellValue) <= Number(filterValue)
          default:
            return true
        }
      })
    })

    return result
  }, [data, searchQuery, searchFn, searchFields, filters, columns, serverSide])

  const sortedData = React.useMemo(() => {
    if (serverSide || !sortColumn || !sortDirection) return filteredData

    const col = columns.find((c) => c.id === sortColumn)
    if (!col) return filteredData

    return [...filteredData].sort((a, b) => {
      let aVal: unknown
      let bVal: unknown

      if (col.accessorFn) {
        return 0
      } else if (col.accessorKey) {
        aVal = a[col.accessorKey]
        bVal = b[col.accessorKey]
      } else {
        return 0
      }

      if (aVal == null && bVal == null) return 0
      if (aVal == null) return 1
      if (bVal == null) return -1

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal
      }

      const aStr = String(aVal)
      const bStr = String(bVal)
      const cmp = aStr.localeCompare(bStr)
      return sortDirection === "asc" ? cmp : -cmp
    })
  }, [filteredData, sortColumn, sortDirection, columns, serverSide])

  const processedData = sortedData

  const totalFiltered = serverSide ? (totalItems ?? data.length) : processedData.length
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize))
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages)

  const paginatedData = React.useMemo(() => {
    if (!pagination) return processedData
    const start = (safeCurrentPage - 1) * pageSize
    return processedData.slice(start, start + pageSize)
  }, [processedData, safeCurrentPage, pageSize, pagination])

  const handleSelectAll = React.useCallback(() => {
    if (!onSelectionChange || !selectable) return
    if (selectedRows.length === processedData.length) {
      onSelectionChange([])
    } else {
      onSelectionChange([...processedData])
    }
  }, [selectedRows, processedData, onSelectionChange, selectable])

  const handleSelectRow = React.useCallback(
    (row: T) => {
      if (!onSelectionChange) return
      const isSelected = selectedRows.some((r) => JSON.stringify(r) === JSON.stringify(row))
      if (isSelected) {
        onSelectionChange(selectedRows.filter((r) => JSON.stringify(r) !== JSON.stringify(row)))
      } else {
        onSelectionChange([...selectedRows, row])
      }
    },
    [selectedRows, onSelectionChange]
  )

  const allSelected = selectable && paginatedData.length > 0 && paginatedData.every((row) => selectedRows.some((r) => JSON.stringify(r) === JSON.stringify(row)))

  const visiblePageNumbers = React.useMemo(() => {
    const pages: (number | "...")[] = []
    const maxVisible = 7
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (safeCurrentPage > 3) pages.push("...")
      for (let i = Math.max(2, safeCurrentPage - 1); i <= Math.min(totalPages - 1, safeCurrentPage + 1); i++) {
        pages.push(i)
      }
      if (safeCurrentPage < totalPages - 2) pages.push("...")
      pages.push(totalPages)
    }
    return pages
  }, [totalPages, safeCurrentPage])

  React.useEffect(() => {
    return () => {
      if (debouncedSearchRef.current) clearTimeout(debouncedSearchRef.current)
    }
  }, [])

  return (
    <div ref={ref} className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-8 pr-8"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>

        {columns.some((c) => c.filterable) && (
          <Button
            variant={Object.keys(filters).length > 0 ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FilterIcon className="size-4" />
            Filters
            {Object.keys(filters).length > 0 && (
              <span className="ml-1 rounded-full bg-primary-foreground px-1.5 text-xs text-primary">
                {Object.keys(filters).length}
              </span>
            )}
          </Button>
        )}

        {onExport && (
          <Button variant="outline" size="sm" onClick={() => onExport(processedData)}>
            <DownloadIcon className="size-4" />
            Export
          </Button>
        )}
      </div>

      {showFilters && columns.some((c) => c.filterable) && (
        <div className="flex flex-wrap items-end gap-2 rounded-lg border bg-muted/30 p-3">
          {columns
            .filter((c) => c.filterable && c.accessorKey)
            .map((col) => (
              <div key={col.id} className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">{col.header}</label>
                <div className="flex items-center gap-1">
                  <select
                    value={filters[col.id]?.operator ?? "contains"}
                    onChange={(e) =>
                      handleFilterChange(col.id, {
                        value: filters[col.id]?.value ?? "",
                        operator: e.target.value as FilterValue["operator"],
                      })
                    }
                    className="h-8 rounded-md border border-input bg-transparent px-2 text-xs"
                  >
                    <option value="contains">Contains</option>
                    <option value="equals">Equals</option>
                    <option value="startsWith">Starts with</option>
                    <option value="endsWith">Ends with</option>
                    <option value="gt">Greater than</option>
                    <option value="lt">Less than</option>
                    <option value="gte">Greater or equal</option>
                    <option value="lte">Less or equal</option>
                  </select>
                  <Input
                    placeholder="Filter..."
                    value={filters[col.id]?.value ?? ""}
                    onChange={(e) =>
                      handleFilterChange(col.id, {
                        value: e.target.value,
                        operator: filters[col.id]?.operator ?? "contains",
                      })
                    }
                    className="h-8 w-32 text-xs"
                  />
                </div>
              </div>
            ))}
        </div>
      )}

      <div className="relative rounded-lg border overflow-hidden">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
            <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}

        <Table className={tableClassName}>
          <TableHeader className={stickyHeader ? "sticky top-0 z-[1] bg-background" : ""}>
            <TableRow>
              {selectable && (
                <TableHead className="w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    className="size-4 rounded border-input"
                  />
                </TableHead>
              )}
              {columns.map((col) => (
                <TableHead
                  key={col.id}
                  className={cn(
                    col.headerClassName,
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center",
                    col.sortable && "cursor-pointer select-none hover:text-foreground",
                    compact && "h-8 px-2 text-xs"
                  )}
                  style={{ width: col.width, minWidth: col.minWidth }}
                  onClick={col.sortable ? () => handleSort(col.id) : undefined}
                >
                  <div className={cn("flex items-center gap-1", col.align === "right" && "justify-end", col.align === "center" && "justify-center")}>
                    {col.header}
                    {col.sortable && (
                      <span className="inline-flex flex-col">
                        {sortColumn === col.id && sortDirection === "asc" ? (
                          <ChevronUpIcon className="size-3" />
                        ) : sortColumn === col.id && sortDirection === "desc" ? (
                          <ChevronDownIcon className="size-3" />
                        ) : (
                          <ChevronsUpDownIcon className="size-3 text-muted-foreground/50" />
                        )}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIdx) => {
                const isSelected = selectable && selectedRows.some((r) => JSON.stringify(r) === JSON.stringify(row))
                return (
                  <TableRow
                    key={rowIdx}
                    className={cn(
                      onRowClick && "cursor-pointer",
                      isSelected && "bg-muted",
                      striped && rowIdx % 2 === 1 && "bg-muted/30"
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {selectable && (
                      <TableCell className="w-10">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(row)}
                          onClick={(e) => e.stopPropagation()}
                          className="size-4 rounded border-input"
                        />
                      </TableCell>
                    )}
                    {columns.map((col) => (
                      <TableCell
                        key={col.id}
                        className={cn(
                          col.cellClassName,
                          col.align === "right" && "text-right",
                          col.align === "center" && "text-center",
                          compact && "h-8 px-2 text-xs"
                        )}
                      >
                        {col.accessorFn
                          ? col.accessorFn(row)
                          : col.accessorKey
                            ? String(row[col.accessorKey] ?? "")
                            : null}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Showing {Math.min((safeCurrentPage - 1) * pageSize + 1, totalFiltered)} to{" "}
              {Math.min(safeCurrentPage * pageSize, totalFiltered)} of {totalFiltered}
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setInternalPage(1)
              }}
              className="h-7 rounded-md border border-input bg-transparent px-1.5 text-xs"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size} / page
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-xs"
              disabled={safeCurrentPage === 1}
              onClick={() => {
                const newPage = safeCurrentPage - 1
                setInternalPage(newPage)
                onPageChange?.(newPage)
              }}
            >
              <ChevronLeftIcon className="size-4" />
            </Button>

            {visiblePageNumbers.map((page, idx) =>
              page === "..." ? (
                <span key={`dots-${idx}`} className="px-1 text-muted-foreground">
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  variant={page === safeCurrentPage ? "default" : "outline"}
                  size="icon-xs"
                  onClick={() => {
                    setInternalPage(page as number)
                    onPageChange?.(page as number)
                  }}
                >
                  {page}
                </Button>
              )
            )}

            <Button
              variant="outline"
              size="icon-xs"
              disabled={safeCurrentPage === totalPages}
              onClick={() => {
                const newPage = safeCurrentPage + 1
                setInternalPage(newPage)
                onPageChange?.(newPage)
              }}
            >
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

const DataTable = React.forwardRef(DataTableInner) as <T extends Record<string, unknown>>(
  props: DataTableProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => React.ReactNode

export { DataTable, type Column, type FilterValue, type DataTableProps }
