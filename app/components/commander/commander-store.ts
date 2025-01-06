import { atom } from 'jotai'
import type { LucideProps } from 'lucide-react'

export interface Command {
  name: string
  action: (event?: KeyboardEvent) => void
  hotkey?: string
  icon?: React.FC<LucideProps>
  scope?: string
}

export const commandsAtom = atom<Command[]>([])

export const addCommandsAtom = atom(
  null, // it's a convention to pass `null` for the first argument
  (_get, set, { commands, scope }: { commands: Command[]; scope?: string }) => {
    const _commands = commands.map((c) => ({ ...c, scope }))

    set(commandsAtom, (state) => [..._commands, ...state])
  }
)

export const removeCommandsAtom = atom(
  null,
  (_get, set, { commands, scope }: { commands: Command[]; scope: string }) => {
    set(commandsAtom, (state) => state.filter((c) => c.scope !== scope))
  }
)
