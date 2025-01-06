import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/lib/ui/command'
import { skipMaybe } from '@/lib/utils'
import isHotkey from 'is-hotkey'
import { useAtomValue } from 'jotai'
import { useMemo, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { commandsAtom, type Command } from './commander-store'

export function Commander() {
  const commands = useAtomValue(commandsAtom)
  const [open, setOpen] = useState(false)

  /* Open commander when pressing mod+k */
  useHotkeys('mod+k', () => setOpen(true), {
    enableOnContentEditable: true,
    enableOnFormTags: true,
    preventDefault: true,
  })

  const hotkeys = useMemo(
    () => commands.map((command) => command.hotkey).filter(skipMaybe),
    [commands]
  )

  /* Handle command hotkeys */
  useHotkeys(
    hotkeys,
    (event) => {
      event.stopPropagation()

      for (const command of commands) {
        if (command.hotkey && isHotkey(command.hotkey, event)) {
          command.action(event)
        }
      }

      setOpen(false)
    },
    {
      enableOnContentEditable: open,
      enableOnFormTags: open,
      preventDefault: true,
      scopes: ['commander'],
    },
    [open, commands]
  )

  const handleSelectCommand = (command: Command) => {
    command.action()
    setOpen(false)
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Command bar">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {commands.map((command) => (
          <CommandItem key={command.name} onSelect={() => handleSelectCommand(command)}>
            {command.icon && <command.icon />}
            {command.name}
            {command.hotkey && (
              <CommandShortcut>{command.hotkey.replace('meta', '⌘')}</CommandShortcut>
            )}
          </CommandItem>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
