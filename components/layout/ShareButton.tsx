"use client";

import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Check, Copy, MessageCircle, Share2 } from "lucide-react";
import { FacebookIcon } from "@/components/icons/SocialBrandIcons";
import { useEffect, useRef, useState } from "react";

type ShareButtonProps = {
  className?: string;
  iconClassName?: string;
  /** Menu opens to the right of the trigger (sidebar) or above (footer). */
  placement?: "right" | "top";
};

function getShareUrl() {
  if (typeof window === "undefined") return "";
  return window.location.origin;
}

function getShareText() {
  return `${SITE_NAME} — ${SITE_TAGLINE}`;
}

export default function ShareButton({
  className,
  iconClassName = "h-5 w-5",
  placement = "right",
}: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCanNativeShare(typeof navigator.share === "function");
  }, []);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function handleCopyLink() {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Fallback for older browsers / denied clipboard permission
      window.prompt("Copy this link:", url);
    }
  }

  function handleWhatsAppShare() {
    const url = getShareUrl();
    const text = `${getShareText()}\n${url}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
    setOpen(false);
  }

  async function handleNativeShare() {
    const url = getShareUrl();
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: SITE_NAME,
        text: getShareText(),
        url,
      });
      setOpen(false);
    } catch {
      // User cancelled share sheet — ignore
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="Share"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "text-muted-foreground transition-colors hover:text-foreground",
          className
        )}
      >
        <Share2 className={iconClassName} />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Share options"
          className={cn(
            "absolute z-[60] w-48 rounded-[12px] glass-floating py-1.5 shadow-lg",
            placement === "right" && "bottom-0 left-full ml-3",
            placement === "top" && "bottom-full left-1/2 mb-3 -translate-x-1/2"
          )}
        >
          <button
            type="button"
            role="menuitem"
            onClick={handleCopyLink}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-black/5"
          >
            {copied ? (
              <Check className="h-4 w-4 text-accent" />
            ) : (
              <Copy className="h-4 w-4 text-muted-foreground" />
            )}
            {copied ? "Link copied" : "Copy link"}
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={handleWhatsAppShare}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-black/5"
          >
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
            Share on WhatsApp
          </button>

          <a
            role="menuitem"
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-black/5"
          >
            <FacebookIcon className="h-4 w-4 text-muted-foreground" />
            Share on Facebook
          </a>

          {canNativeShare && (
            <button
              type="button"
              role="menuitem"
              onClick={handleNativeShare}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-black/5"
            >
              <Share2 className="h-4 w-4 text-muted-foreground" />
              More options…
            </button>
          )}
        </div>
      )}
    </div>
  );
}
