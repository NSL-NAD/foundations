"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Mail, CheckCircle } from "lucide-react";

export function ContactFOADialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setSubject("");
    setMessage("");
    setError(null);
    setSent(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/account/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });

      if (res.ok) {
        setSent(true);
      } else {
        setError("Failed to send message. Please try again.");
      }
    } catch {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (!isOpen) {
      setTimeout(resetForm, 200);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="min-w-[120px]">
          <Mail className="mr-2 h-4 w-4" />
          Contact
        </Button>
      </DialogTrigger>
      <DialogContent>
        {sent ? (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-heading text-lg font-semibold">
              Message sent!
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Thanks for reaching out. We&apos;ll get back to you as soon as
              possible.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              You can also reach us directly at{" "}
              <a
                href="mailto:nic@goodatscale.co"
                className="text-primary hover:underline"
              >
                nic@goodatscale.co
              </a>
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Contact Foundations of Architecture</DialogTitle>
              <DialogDescription>
                Send us a message and we&apos;ll get back to you as soon as we
                can.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              {error && (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="contact-subject">Subject (optional)</Label>
                <Input
                  id="contact-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What's this about?"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-message">Message</Label>
                <Textarea
                  id="contact-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your message..."
                  className="min-h-[120px] resize-y"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !message.trim()}
                className="w-full"
              >
                {loading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Send Message
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
