"use client";

import React from "react";
import { cn } from "../utils/cn";
export default function AdminCard({
  icon,
  title,
  onClick,
  className = "",
  variant = "primary",
}) {
  const variants = {
    primary:
      "bg-gradient-white border border-border hover:border-primary/30 hover:shadow-card-hover",
    secondary:
      "bg-gradient-gray border border-border hover:border-primary/30 hover:shadow-card-hover",
    accent:
      "bg-gradient-dark text-white border border-primary hover:border-primary-light hover:shadow-card-hover",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        // Base styles
        "group relative overflow-hidden rounded-xl cursor-pointer",
        "p-6 min-h-[140px] flex flex-col items-center justify-center text-center",
        "transform transition-all duration-300 ease-smooth",
        "hover:scale-105 hover:-translate-y-2 active:scale-95",
        "shadow-card animate-scale-in",

        // Variant styles
        variants[variant],

        // Custom className
        className
      )}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-3">
        <div
          className={cn(
            "absolute top-0 right-0 w-20 h-20 rounded-full -translate-y-10 translate-x-10",
            variant === "accent" ? "bg-white/10" : "bg-primary/5"
          )}
        />
        <div
          className={cn(
            "absolute bottom-0 left-0 w-16 h-16 rounded-full translate-y-8 -translate-x-8",
            variant === "accent" ? "bg-white/10" : "bg-primary/5"
          )}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="text-4xl transition-transform duration-300 group-hover:scale-110 filter drop-shadow-sm">
          {icon}
        </div>
        <p
          className={cn(
            "font-semibold text-sm leading-tight transition-colors duration-300",
            variant === "accent" ? "text-white" : "text-foreground"
          )}
        >
          {title}
        </p>
      </div>

      {/* Hover effect overlay */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          variant === "accent" ? "bg-white/5" : "bg-primary/3"
        )}
      />
    </div>
  );
}
