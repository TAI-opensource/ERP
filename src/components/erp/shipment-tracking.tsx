"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  SearchIcon,
  MapPinIcon,
  TruckIcon,
  PackageIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  ExternalLinkIcon,
  RefreshCwIcon,
} from "lucide-react"

type ShipmentStatus =
  | "created"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "exception"
  | "returned"

interface ShipmentEvent {
  id: string
  status: ShipmentStatus
  location: string
  timestamp: string
  description: string
  details?: string
}

interface Shipment {
  id: string
  trackingNumber: string
  carrier: string
  status: ShipmentStatus
  origin: string
  destination: string
  estimatedDelivery: string
  actualDelivery?: string
  events: ShipmentEvent[]
  weight?: string
  dimensions?: string
  service?: string
}

interface ShipmentTrackingProps {
  shipments?: Shipment[]
  onSearch?: (trackingNumber: string) => void
  onRefresh?: (shipmentId: string) => void
  onTrackExternal?: (trackingNumber: string, carrier: string) => void
  className?: string
}

const statusConfig: Record<ShipmentStatus, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  created: {
    label: "Created",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
    icon: <PackageIcon className="size-3" />,
  },
  picked_up: {
    label: "Picked Up",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    icon: <TruckIcon className="size-3" />,
  },
  in_transit: {
    label: "In Transit",
    color: "text-indigo-700",
    bgColor: "bg-indigo-100",
    icon: <TruckIcon className="size-3" />,
  },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "text-purple-700",
    bgColor: "bg-purple-100",
    icon: <TruckIcon className="size-3" />,
  },
  delivered: {
    label: "Delivered",
    color: "text-green-700",
    bgColor: "bg-green-100",
    icon: <CheckCircleIcon className="size-3" />,
  },
  exception: {
    label: "Exception",
    color: "text-red-700",
    bgColor: "bg-red-100",
    icon: <AlertCircleIcon className="size-3" />,
  },
  returned: {
    label: "Returned",
    color: "text-orange-700",
    bgColor: "bg-orange-100",
    icon: <PackageIcon className="size-3" />,
  },
}

function ShipmentTimeline({ events }: { events: ShipmentEvent[] }) {
  return (
    <div className="relative space-y-4">
      {events.map((event, idx) => {
        const config = statusConfig[event.status]
        return (
          <div key={event.id} className="relative flex gap-4">
            {idx < events.length - 1 && (
              <div className="absolute left-4 top-8 h-full w-0.5 bg-border" />
            )}
            <div
              className={cn(
                "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full",
                config.bgColor,
                config.color
              )}
            >
              {config.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{event.description}</p>
                <Badge className={cn("text-[10px]", config.color, config.bgColor)}>
                  {config.label}
                </Badge>
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <MapPinIcon className="size-3" />
                <span>{event.location}</span>
                <span>•</span>
                <ClockIcon className="size-3" />
                <span>{event.timestamp}</span>
              </div>
              {event.details && (
                <p className="mt-1 text-xs text-muted-foreground">{event.details}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ShipmentCard({ shipment }: { shipment: Shipment }) {
  const config = statusConfig[shipment.status]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{shipment.trackingNumber}</CardTitle>
            <p className="text-sm text-muted-foreground">{shipment.carrier}</p>
          </div>
          <Badge className={cn("text-xs", config.color, config.bgColor)}>
            {config.icon}
            <span className="ml-1">{config.label}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Origin</p>
            <p className="font-medium">{shipment.origin}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Destination</p>
            <p className="font-medium">{shipment.destination}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Est. Delivery</p>
            <p className="font-medium">{shipment.estimatedDelivery}</p>
          </div>
          {shipment.actualDelivery && (
            <div>
              <p className="text-muted-foreground">Actual Delivery</p>
              <p className="font-medium text-green-600">{shipment.actualDelivery}</p>
            </div>
          )}
          {shipment.service && (
            <div>
              <p className="text-muted-foreground">Service</p>
              <p className="font-medium">{shipment.service}</p>
            </div>
          )}
          {shipment.weight && (
            <div>
              <p className="text-muted-foreground">Weight</p>
              <p className="font-medium">{shipment.weight}</p>
            </div>
          )}
        </div>

        <Separator />

        <div>
          <h4 className="mb-3 text-sm font-medium">Tracking History</h4>
          <ScrollArea className="max-h-[300px]">
            <ShipmentTimeline events={shipment.events} />
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}

function ShipmentTracking({
  shipments = [],
  onSearch,
  onRefresh,
  onTrackExternal,
  className,
}: ShipmentTrackingProps) {
  const [searchQuery, setSearchQuery] = React.useState("")

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch?.(searchQuery.trim())
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Shipment Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Enter tracking number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-8"
              />
            </div>
            <Button onClick={handleSearch}>Track</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {shipments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <PackageIcon className="mb-2 size-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No shipments to display</p>
            </CardContent>
          </Card>
        ) : (
          shipments.map((shipment) => (
            <div key={shipment.id} className="relative">
              <ShipmentCard shipment={shipment} />
              <div className="absolute top-4 right-4 flex items-center gap-1">
                {onRefresh && (
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => onRefresh(shipment.id)}
                  >
                    <RefreshCwIcon className="size-3" />
                  </Button>
                )}
                {onTrackExternal && (
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => onTrackExternal(shipment.trackingNumber, shipment.carrier)}
                  >
                    <ExternalLinkIcon className="size-3" />
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export {
  ShipmentTracking,
  ShipmentTimeline,
  ShipmentCard,
  statusConfig,
  type Shipment,
  type ShipmentEvent,
  type ShipmentStatus,
  type ShipmentTrackingProps,
}
