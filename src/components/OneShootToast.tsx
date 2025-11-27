"use client";

import { useEffect } from "react";
import { toast } from "sonner";

type ToastVariant = "success" | "error" | "info";

export function OneShotToast({
  message,
  variant = "error",
}: {
  message?: string;
  variant?: ToastVariant;
}) {
  useEffect(() => {
    if (!message) return;

    if (variant === "success") toast.success(message);
    else if (variant === "info") toast(message);
    else toast.error(message);
  }, [message, variant]);

  return null;
}
