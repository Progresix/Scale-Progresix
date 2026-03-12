"use client";

import { useState } from "react";
import { 
  Share2, 
  MessageCircle, 
  Twitter, 
  Link2, 
  Check,
  Facebook
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
  variant?: "dropdown" | "inline";
}

/**
 * ShareButtons Component
 * Provides sharing options for WhatsApp, Twitter, Facebook, and copy link
 */
export function ShareButtons({
  url,
  title,
  description,
  className,
  variant = "dropdown",
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `${title}${description ? ` - ${description}` : ""}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(shareText);

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: shareLinks.whatsapp,
      color: "text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: shareLinks.twitter,
      color: "text-sky-500 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: shareLinks.facebook,
      color: "text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950",
    },
    {
      name: copied ? "Link Disalin!" : "Salin Link",
      icon: copied ? Check : Link2,
      action: handleCopyLink,
      color: copied 
        ? "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950" 
        : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
    },
  ];

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {shareOptions.map((option) => {
          const Icon = option.icon;
          
          if (option.action) {
            return (
              <Button
                key={option.name}
                variant="outline"
                size="sm"
                onClick={option.action}
                className={cn("gap-2", option.color)}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{option.name}</span>
              </Button>
            );
          }
          
          return (
            <Button
              key={option.name}
              variant="outline"
              size="sm"
              asChild
              className={cn("gap-2", option.color)}
            >
              <a
                href={option.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Share on ${option.name}`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{option.name}</span>
              </a>
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={cn("gap-2", className)}>
          <Share2 className="h-4 w-4" />
          Bagikan
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Opsi Berbagi</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {shareOptions.map((option) => {
          const Icon = option.icon;
          
          if (option.action) {
            return (
              <DropdownMenuItem
                key={option.name}
                onClick={option.action}
                className={cn("cursor-pointer", option.color)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {option.name}
              </DropdownMenuItem>
            );
          }
          
          return (
            <DropdownMenuItem key={option.name} asChild>
              <a
                href={option.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn("cursor-pointer", option.color)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {option.name}
              </a>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * NativeShareButton Component
 * Uses Web Share API when available, falls back to ShareButtons
 */
export function NativeShareButton({
  url,
  title,
  description,
  className,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title,
      text: description,
      url,
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error sharing:", err);
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      className={cn("gap-2", className)}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Link Disalin!
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          Bagikan
        </>
      )}
    </Button>
  );
}
