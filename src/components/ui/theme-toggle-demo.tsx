import { ThemeToggle } from "@/components/ui/theme-toggle"

function DefaultToggle() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-950 p-8">
      <div className="space-y-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Theme Toggle Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          Click the toggle to switch between light and dark modes.
          This component uses local state.
        </p>
        <div className="flex justify-center">
          <ThemeToggle />
        </div>
        <div className="pt-8 border-t border-gray-200 dark:border-zinc-800">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            For persistent theme across sessions, use the ThemeToggle 
            from <code className="text-xs bg-gray-200 dark:bg-zinc-800 px-2 py-1 rounded">@/components/shared/theme-toggle</code> 
            which uses next-themes.
          </p>
        </div>
      </div>
    </div>
  )
}

export { DefaultToggle }
