"use client"

import { useCallback, useEffect, useRef } from "react"
import { Moon02 as Moon } from "@/components/animate-ui/icons/hugeicons/moon-02";
import { Sun03 as Sun } from "@/components/animate-ui/icons/hugeicons/sun-03";
import { useHydrated, useTheme } from "@wrksz/themes/client"
import { AnimateIcon } from "@animate-ui/react/icons"

import { Button } from "@/components/ui/button"
import {
  ThemeToggler,
  type ThemeSelection,
  type Resolved,
} from "@animate-ui/react/primitives/effects/theme-toggler"

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const mounted = useHydrated()
  const pendingTheme = useRef<Resolved | null>(null)
  const requestedTheme = useRef<ThemeSelection | null>(null)

  const commitTheme = useCallback((nextTheme: ThemeSelection) => {
    // An older wipe may finish after the user has already toggled again.
    if (requestedTheme.current !== nextTheme) return
    pendingTheme.current = null
    setTheme(nextTheme)
  }, [setTheme])

  useEffect(() => {
    const root = document.documentElement
    const observer = new MutationObserver(() => {
      const nextTheme = pendingTheme.current
      if (!nextTheme) return

      const domTheme = root.classList.contains("dark") ? "dark" : "light"
      if (domTheme === nextTheme) commitTheme(nextTheme)
    })

    // ThemeToggler changes the class before committing its theme. Commit at that
    // mutation so @wrksz/themes does not restore the old theme during the wipe.
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [commitTheme])

  if (!mounted) {
    return (
      <Button variant="default" size="icon" className="rounded-full shadow-sm opacity-0">
        <Moon aria-hidden className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    )
  }

  return (
    <ThemeToggler
      theme={theme as ThemeSelection}
      resolvedTheme={resolvedTheme as Resolved}
      setTheme={commitTheme}
      onImmediateChange={(nextTheme) => {
        requestedTheme.current = nextTheme
        pendingTheme.current = nextTheme === "system" ? null : nextTheme
      }}
      direction="ltr"
    >
      {({ resolved, toggleTheme }) => (
        <AnimateIcon animateOnHover animateOnTap completeOnStop asChild>
        <Button 
          variant="default" 
          size="icon" 
          className="relative rounded-full shadow-sm transition-colors duration-300"
          onClick={() => toggleTheme(resolved === "dark" ? "light" : "dark")}
        >
          <Moon aria-hidden className="size-[1.2rem] rotate-0 scale-100 transition-[rotate,scale,opacity] dark:-rotate-90 dark:scale-0 dark:opacity-0 motion-reduce:rotate-0 motion-reduce:scale-100 motion-reduce:dark:rotate-0 motion-reduce:dark:scale-100" />
          <Sun aria-hidden className="absolute size-[1.2rem] rotate-90 scale-0 opacity-0 transition-[rotate,scale,opacity] dark:rotate-0 dark:scale-100 dark:opacity-100 motion-reduce:rotate-0 motion-reduce:scale-100 motion-reduce:dark:rotate-0 motion-reduce:dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        </AnimateIcon>
      )}
    </ThemeToggler>
  )
}
