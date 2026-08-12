"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/graphics/Logo";
import { useScrolled } from "@/components/motion/hooks";
import { nav } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const scrolled = useScrolled();

  // The menu is open only while we are still on the route it was opened from,
  // so navigating closes it as a derived consequence rather than via an effect.
  const [openedFrom, setOpenedFrom] = useState<string | null>(null);
  const open = openedFrom === pathname;
  const setOpen = (next: boolean) => setOpenedFrom(next ? pathname : null);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled || open
          ? "border-b border-hairline bg-canvas/80 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
      style={{ transitionTimingFunction: "var(--ease-signature)" }}
    >
      <div className="shell flex h-[var(--header-h)] items-center justify-between">
        <Link
          href="/"
          aria-label="Recharga Chargine — home"
          className="rounded-sm transition-opacity duration-300 hover:opacity-80"
        >
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`relative rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
                isActive(item.href)
                  ? "text-ink"
                  : "text-ink-2 hover:text-ink"
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-4 -bottom-px h-px bg-brand"
                />
              )}
            </Link>
          ))}
          <Link href="/contact" className="btn-primary ml-3 !px-5 !py-2.5">
            Start a conversation
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full border border-hairline md:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span aria-hidden="true" className="flex w-4 flex-col gap-[5px]">
            <span
              className="block h-px w-full bg-ink transition-transform duration-300"
              style={{
                transform: open ? "translateY(3px) rotate(45deg)" : undefined,
                transitionTimingFunction: "var(--ease-signature)",
              }}
            />
            <span
              className="block h-px w-full bg-ink transition-transform duration-300"
              style={{
                transform: open ? "translateY(-3px) rotate(-45deg)" : undefined,
                transitionTimingFunction: "var(--ease-signature)",
              }}
            />
          </span>
        </button>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-hairline bg-canvas md:hidden"
      >
        <nav aria-label="Primary mobile" className="shell flex flex-col py-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className="border-b border-hairline py-4 font-display text-2xl tracking-[-0.02em] text-ink last:border-0"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/contact" className="btn-primary mt-6 w-full">
            Start a conversation
          </Link>
        </nav>
      </div>
    </header>
  );
}
