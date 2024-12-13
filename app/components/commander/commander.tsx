import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/lib/ui/command'
import { useEffect, useState } from 'react'
import { useSnapshot } from 'valtio'
import { commanderStore } from './commander-store'

export function Commander() {
  const { commands } = useSnapshot(commanderStore)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        event.stopPropagation()

        setOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Command bar">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {commands.map((command) => (
          <CommandItem key={command.name} onSelect={command.action}>
            {command.icon && <command.icon size={16} />}
            {command.name}
            {command.shortcut && <CommandShortcut>{command.shortcut}</CommandShortcut>}
          </CommandItem>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
