"use client"

import * as React from "react"

type Theme = "light" | "dark" | "system"

type ThemeContextValue = {
  theme: Theme
  resolvedTheme: Exclude<Theme, "system">
  setTheme: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined
)

function getSystemTheme() {
  if (typeof window === "undefined") {
    return "light" as const
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function applyDocumentTheme(theme: Exclude<Theme, "system">) {
  const root = document.documentElement

  root.classList.remove("light", "dark")
  root.classList.add(theme)
  root.style.colorScheme = theme
}

function ThemeProvider({
  children,
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = true,
  storageKey = "theme",
}: React.PropsWithChildren<{
  defaultTheme?: Theme
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
  storageKey?: string
}>) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = React.useState<
    Exclude<Theme, "system">
  >("light")

  React.useEffect(() => {
    const storedTheme = window.localStorage.getItem(storageKey)

    if (storedTheme === "light" || storedTheme === "dark" || storedTheme === "system") {
      setThemeState(storedTheme)
      return
    }

    setThemeState(defaultTheme)
  }, [defaultTheme, storageKey])

  React.useEffect(() => {
    const nextResolvedTheme =
      theme === "system" && enableSystem ? getSystemTheme() : theme

    setResolvedTheme(nextResolvedTheme === "dark" ? "dark" : "light")
  }, [enableSystem, theme])

  React.useEffect(() => {
    applyDocumentTheme(resolvedTheme)

    if (!disableTransitionOnChange) {
      return
    }

    const style = document.createElement("style")
    style.appendChild(
      document.createTextNode("*,*::before,*::after{transition:none !important}")
    )
    document.head.appendChild(style)

    const frame = window.requestAnimationFrame(() => {
      document.head.removeChild(style)
    })

    return () => {
      window.cancelAnimationFrame(frame)
      if (style.parentNode) {
        style.parentNode.removeChild(style)
      }
    }
  }, [disableTransitionOnChange, resolvedTheme])

  React.useEffect(() => {
    window.localStorage.setItem(storageKey, theme)
  }, [storageKey, theme])

  React.useEffect(() => {
    if (theme !== "system" || !enableSystem) {
      return
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      setResolvedTheme(mediaQuery.matches ? "dark" : "light")
    }

    mediaQuery.addEventListener("change", handleChange)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [enableSystem, theme])

  const setTheme = React.useCallback(
    (nextTheme: Theme) => {
      setThemeState(nextTheme)
    },
    []
  )

  const value = React.useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [resolvedTheme, setTheme, theme]
  )

  return (
    <ThemeContext.Provider value={value}>
      <ThemeHotkey />
      {children}
    </ThemeContext.Provider>
  )
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (event.key.toLowerCase() !== "d") {
        return
      }

      if (isTypingTarget(event.target)) {
        return
      }

      setTheme(resolvedTheme === "light" ? "dark" : "light")
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [resolvedTheme, setTheme])

  return null
}

function useTheme() {
  const context = React.useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}

export { ThemeProvider, useTheme }
