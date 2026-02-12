"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, Truck } from "lucide-react";

interface Order {
  id: string;
  status: string;
  tracking_number: string | null;
  tracking_url: string | null;
  email: string;
}

export function OrderActions({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState(
    order.tracking_number || ""
  );
  const [trackingUrl, setTrackingUrl] = useState(order.tracking_url || "");
  const router = useRouter();

  async function handleShip() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          status: "shipped",
          trackingNumber,
          trackingUrl,
        }),
      });

      if (res.ok) {
        setOpen(false);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkDelivered() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          status: "delivered",
        }),
      });

      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  if (order.status === "delivered") {
    return (
      <span className="text-xs text-muted-foreground">Fulfilled</span>
    );
  }

  if (order.status === "shipped") {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleMarkDelivered}
        disabled={loading}
      >
        {loading && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
        Mark Delivered
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Truck className="mr-1 h-3 w-3" />
          Ship
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ship Kit Order</DialogTitle>
          <DialogDescription>
            Enter tracking information for {order.email}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="tracking">Tracking Number</Label>
            <Input
              id="tracking"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. 1Z999AA10123456784"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="trackingUrl">Tracking URL (optional)</Label>
            <Input
              id="trackingUrl"
              value={trackingUrl}
              onChange={(e) => setTrackingUrl(e.target.value)}
              placeholder="https://tools.usps.com/go/TrackConfirmAction?tRef=fullpage&tLc=2&text28777=..."
            />
          </div>
          <Button
            onClick={handleShip}
            disabled={loading || !trackingNumber}
            className="w-full"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Mark as Shipped & Send Email
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
