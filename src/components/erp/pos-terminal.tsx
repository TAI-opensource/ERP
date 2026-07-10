"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  SearchIcon,
  PlusIcon,
  MinusIcon,
  Trash2Icon,
  ShoppingCartIcon,
  CreditCardIcon,
  BanknoteIcon,
  QrCodeIcon,
} from "lucide-react"

interface POSProduct {
  id: string
  name: string
  sku: string
  price: number
  image?: string
  category: string
  stock: number
}

interface POSCartItem {
  product: POSProduct
  quantity: number
}

interface POSTerminalProps {
  products: POSProduct[]
  onCheckout?: (items: POSCartItem[], paymentMethod: string) => void
  className?: string
}

function POSTerminal({
  products,
  onCheckout,
  className,
}: POSTerminalProps) {
  const [cart, setCart] = React.useState<POSCartItem[]>([])
  const [search, setSearch] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)

  const categories = React.useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)))
    return ["All", ...cats]
  }, [products])

  const filteredProducts = React.useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = !selectedCategory || selectedCategory === "All" || p.category === selectedCategory
      return matchesSearch && matchesCategory && p.stock > 0
    })
  }, [products, search, selectedCategory])

  const handleAddToCart = (product: POSProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta
            if (newQty <= 0) return null
            return { ...item, quantity: Math.min(newQty, item.product.stock) }
          }
          return item
        })
        .filter(Boolean) as POSCartItem[]
    })
  }

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const subtotal = React.useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  }, [cart])

  const tax = subtotal * 0.1
  const total = subtotal + tax

  const handleCheckout = (method: string) => {
    onCheckout?.(cart, method)
    setCart([])
  }

  return (
    <div className={cn("flex h-[700px] gap-4", className)}>
      <div className="flex-1 flex flex-col">
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === "All" ? null : cat)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                (selectedCategory === null && cat === "All") || selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 overflow-auto flex-1">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => handleAddToCart(product)}
              className="flex flex-col items-center gap-2 rounded-lg border bg-card p-3 text-center transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="size-16 rounded-md object-cover"
                />
              ) : (
                <div className="flex size-16 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <ShoppingCartIcon className="size-6" />
                </div>
              )}
              <div className="w-full">
                <p className="text-xs font-medium line-clamp-2">{product.name}</p>
                <p className="text-sm font-bold mt-1">${product.price.toFixed(2)}</p>
                <p className="text-[10px] text-muted-foreground">
                  Stock: {product.stock}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Card className="w-[350px] flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShoppingCartIcon className="size-4" />
            Cart
            {cart.length > 0 && (
              <Badge variant="secondary" className="text-[10px]">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 p-0">
          <ScrollArea className="flex-1 px-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingCartIcon className="mb-2 size-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">Cart is empty</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ${item.product.price.toFixed(2)} each
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon-xs"
                        onClick={() => handleUpdateQuantity(item.product.id, -1)}
                      >
                        <MinusIcon className="size-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon-xs"
                        onClick={() => handleUpdateQuantity(item.product.id, 1)}
                      >
                        <PlusIcon className="size-3" />
                      </Button>
                    </div>
                    <div className="w-20 text-right">
                      <p className="text-sm font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleRemoveFromCart(item.product.id)}
                    >
                      <Trash2Icon className="size-3 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="border-t p-4 space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-base font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                className="flex flex-col gap-1 h-auto py-3"
                onClick={() => handleCheckout("cash")}
                disabled={cart.length === 0}
              >
                <BanknoteIcon className="size-4" />
                <span className="text-[10px]">Cash</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col gap-1 h-auto py-3"
                onClick={() => handleCheckout("card")}
                disabled={cart.length === 0}
              >
                <CreditCardIcon className="size-4" />
                <span className="text-[10px]">Card</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col gap-1 h-auto py-3"
                onClick={() => handleCheckout("pix")}
                disabled={cart.length === 0}
              >
                <QrCodeIcon className="size-4" />
                <span className="text-[10px]">PIX</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export { POSTerminal, type POSProduct, type POSCartItem, type POSTerminalProps }
