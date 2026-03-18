/* eslint-disable @typescript-eslint/no-explicit-any */

// GA4 event helper
export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", eventName, params);
  }
}

// Meta Pixel event helper
export function trackPixelEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof (window as any).fbq === "function") {
    (window as any).fbq("track", eventName, params);
  }
}

// Combined tracker for key FOA conversion events
export const analytics = {
  // Course page / pricing section viewed
  viewCourse: () => {
    trackEvent("view_item", { item_name: "FOA Course", item_category: "online_course" });
    trackPixelEvent("ViewContent", { content_name: "FOA Course", content_type: "product" });
  },
  // Checkout initiated (buy button clicked)
  initiateCheckout: (value: number) => {
    trackEvent("begin_checkout", { value, currency: "USD" });
    trackPixelEvent("InitiateCheckout", { value, currency: "USD" });
  },
  // Purchase complete
  purchase: (value: number, orderId?: string) => {
    trackEvent("purchase", { value, currency: "USD", transaction_id: orderId });
    trackPixelEvent("Purchase", { value, currency: "USD" });
  },
  // Blog post read (50%+ scroll depth)
  readBlog: (title: string) => {
    trackEvent("blog_read", { post_title: title });
    trackPixelEvent("ViewContent", { content_name: title, content_type: "article" });
  },
};
