"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { SearchIcon, XIcon, ClockIcon, ArrowRightIcon, Loader2Icon, AlertCircleIcon } from "lucide-react"

interface SearchSuggestion {
  id: string
  label: string
  description?: string
  category?: string
  icon?: React.ReactNode
  badge?: string
  metadata?: Record<string, unknown>
}

interface SearchInputProps {
  value?: string
  onChange?: (value: string) => void
  onSearch?: (query: string) => void
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void
  suggestions?: SearchSuggestion[]
  recentSearches?: string[]
  onClearRecent?: () => void
  placeholder?: string
  label?: string
  description?: string
  error?: string
  disabled?: boolean
  readOnly?: boolean
  loading?: boolean
  debounce?: number
  minChars?: number
  maxSuggestions?: number
  showRecentSearches?: boolean
  showCategories?: boolean
  autoFocus?: boolean
  size?: "sm" | "default" | "lg"
  className?: string
  inputClassName?: string
  renderSuggestion?: (suggestion: SearchSuggestion) => React.ReactNode
  renderEmpty?: () => React.ReactNode
  renderLoading?: () => React.ReactNode
  renderError?: (error: string) => React.ReactNode
}

function SearchInput({
  value: controlledValue,
  onChange,
  onSearch,
  onSuggestionSelect,
  suggestions = [],
  recentSearches = [],
  onClearRecent,
  placeholder = "Search...",
  label,
  description,
  error,
  disabled = false,
  readOnly = false,
  loading = false,
  debounce = 300,
  minChars = 0,
  maxSuggestions = 10,
  showRecentSearches = true,
  showCategories = true,
  autoFocus = false,
  size = "default",
  className,
  inputClassName,
  renderSuggestion,
  renderEmpty,
  renderLoading,
  renderError,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = React.useState(controlledValue ?? "")
  const [isOpen, setIsOpen] = React.useState(false)
  const [focusedIndex, setFocusedIndex] = React.useState(-1)
  const [highlightedCategory, setHighlightedCategory] = React.useState<string | null>(null)

  const inputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null)

  const value = controlledValue ?? internalValue

  const sizeClasses = {
    sm: "h-7 text-xs",
    default: "h-8 text-sm",
    lg: "h-10 text-base",
  }

  const filteredSuggestions = React.useMemo(() => {
    let result = suggestions

    if (highlightedCategory) {
      result = result.filter((s) => s.category === highlightedCategory)
    }

    return result.slice(0, maxSuggestions)
  }, [suggestions, highlightedCategory, maxSuggestions])

  const categories = React.useMemo(() => {
    const cats = new Set(suggestions.map((s) => s.category).filter(Boolean))
    return Array.from(cats) as string[]
  }, [suggestions])

  const allItems = React.useMemo(() => {
    const items: { type: "suggestion" | "recent"; data: SearchSuggestion | string }[] = []

    if (value.length >= minChars && filteredSuggestions.length > 0) {
      filteredSuggestions.forEach((s) => {
        items.push({ type: "suggestion", data: s })
      })
    } else if (showRecentSearches && recentSearches.length > 0 && value.length === 0) {
      recentSearches.slice(0, 5).forEach((r) => {
        items.push({ type: "recent", data: r })
      })
    }

    return items
  }, [filteredSuggestions, recentSearches, value, minChars, showRecentSearches])

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInternalValue(newValue)
      onChange?.(newValue)
      setFocusedIndex(-1)

      if (debounceRef.current) clearTimeout(debounceRef.current)

      if (newValue.length >= minChars) {
        debounceRef.current = setTimeout(() => {
          onSearch?.(newValue)
        }, debounce)
      }
    },
    [onChange, onSearch, debounce, minChars]
  )

  const handleSuggestionClick = React.useCallback(
    (item: { type: "suggestion" | "recent"; data: SearchSuggestion | string }) => {
      if (item.type === "recent") {
        const searchTerm = item.data as string
        setInternalValue(searchTerm)
        onChange?.(searchTerm)
        onSearch?.(searchTerm)
      } else {
        const suggestion = item.data as SearchSuggestion
        setInternalValue(suggestion.label)
        onChange?.(suggestion.label)
        onSuggestionSelect?.(suggestion)
      }
      setIsOpen(false)
      setFocusedIndex(-1)
    },
    [onChange, onSearch, onSuggestionSelect]
  )

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || allItems.length === 0) {
        if (e.key === "Enter" && value) {
          onSearch?.(value)
        }
        return
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setFocusedIndex((prev) => (prev + 1) % allItems.length)
          break
        case "ArrowUp":
          e.preventDefault()
          setFocusedIndex((prev) => (prev - 1 + allItems.length) % allItems.length)
          break
        case "Enter":
          e.preventDefault()
          if (focusedIndex >= 0 && focusedIndex < allItems.length) {
            handleSuggestionClick(allItems[focusedIndex])
          } else if (value) {
            onSearch?.(value)
            setIsOpen(false)
          }
          break
        case "Escape":
          setIsOpen(false)
          setFocusedIndex(-1)
          break
        case "Tab":
          setIsOpen(false)
          setFocusedIndex(-1)
          break
      }
    },
    [isOpen, allItems, focusedIndex, handleSuggestionClick, onSearch, value]
  )

  const handleClear = React.useCallback(() => {
    setInternalValue("")
    onChange?.("")
    onSearch?.("")
    inputRef.current?.focus()
  }, [onChange, onSearch])

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  React.useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const showDropdown = isOpen && (allItems.length > 0 || loading || error)

  return (
    <div ref={containerRef} className={cn("relative flex flex-col gap-1.5", className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}

      <div className="relative">
        <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          autoFocus={autoFocus}
          autoComplete="off"
          role="combobox"
          aria-expanded={showDropdown ? "true" : undefined}
          aria-haspopup="listbox"
          className={cn(
            "pl-8 pr-8",
            sizeClasses[size],
            error && "border-destructive",
            inputClassName
          )}
        />

        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {loading && (
            <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
          )}
          {value && !loading && !readOnly && (
            <button
              onClick={handleClear}
              className="rounded-sm text-muted-foreground hover:text-foreground"
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>
      </div>

      {showDropdown && (
        <div
          className="absolute top-full z-50 mt-1 w-full overflow-hidden rounded-lg border border-border bg-popover shadow-md"
          role="listbox"
        >
          {categories.length > 0 && showCategories && value.length >= minChars && (
            <div className="flex gap-1 border-b border-border p-1.5">
              <button
                onClick={() => setHighlightedCategory(null)}
                className={cn(
                  "rounded-md px-2 py-1 text-xs font-medium transition-colors",
                  !highlightedCategory
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setHighlightedCategory(cat)}
                  className={cn(
                    "rounded-md px-2 py-1 text-xs font-medium transition-colors",
                    highlightedCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          <ScrollArea className="max-h-[300px]">
            {loading ? (
              renderLoading ? (
                renderLoading()
              ) : (
                <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                  <Loader2Icon className="size-4 animate-spin" />
                  Searching...
                </div>
              )
            ) : error ? (
              renderError ? (
                renderError(error)
              ) : (
                <div className="flex items-center justify-center gap-2 py-6 text-sm text-destructive">
                  <AlertCircleIcon className="size-4" />
                  {error}
                </div>
              )
            ) : allItems.length === 0 ? (
              renderEmpty ? (
                renderEmpty()
              ) : (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No results found
                </div>
              )
            ) : (
              allItems.map((item, idx) => {
                const isFocused = idx === focusedIndex
                const isRecent = item.type === "recent"
                const suggestion = item.type === "suggestion" ? (item.data as SearchSuggestion) : null

                return (
                  <button
                    key={item.type === "recent" ? `recent-${item.data}` : suggestion?.id}
                    onClick={() => handleSuggestionClick(item)}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors",
                      isFocused && "bg-muted",
                      !isFocused && "hover:bg-muted"
                    )}
                    role="option"
                    aria-selected={isFocused}
                  >
                    {renderSuggestion && suggestion ? (
                      renderSuggestion(suggestion)
                    ) : (
                      <>
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                          {isRecent ? (
                            <ClockIcon className="size-4 text-muted-foreground" />
                          ) : suggestion?.icon ? (
                            suggestion.icon
                          ) : (
                            <SearchIcon className="size-4 text-muted-foreground" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="truncate font-medium text-foreground">
                              {isRecent ? (item.data as string) : suggestion?.label}
                            </span>
                            {suggestion?.badge && (
                              <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                                {suggestion.badge}
                              </span>
                            )}
                          </div>
                          {suggestion?.description && (
                            <p className="truncate text-xs text-muted-foreground">
                              {suggestion.description}
                            </p>
                          )}
                          {suggestion?.category && (
                            <span className="text-[10px] text-muted-foreground">
                              {suggestion.category}
                            </span>
                          )}
                        </div>

                        <ArrowRightIcon className="size-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </>
                    )}
                  </button>
                )
              })
            )}
          </ScrollArea>

          {value && onSearch && (
            <>
              <Separator />
              <button
                onClick={() => {
                  onSearch(value)
                  setIsOpen(false)
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
              >
                <SearchIcon className="size-4" />
                Search for &quot;{value}&quot;
              </button>
            </>
          )}
        </div>
      )}

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

export { SearchInput, type SearchInputProps, type SearchSuggestion }
