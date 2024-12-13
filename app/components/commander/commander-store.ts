import type { LucideProps } from 'lucide-react'
import { proxy } from 'valtio'

interface Command {
  name: string
  action: () => void
  shortcut?: string
  icon?: React.FC<LucideProps>
}

export const commanderStore = proxy<{
  commands: Command[]
}>({
  commands: [],
})

export const addCommands = (commands: Command[]) => {
  commanderStore.commands.push(...commands)
}

export const removeCommands = (commands: Command[]) => {
  for (const command of commands) {
    const index = commanderStore.commands.findIndex((c) => c.name === command.name)

    if (index !== -1) {
      commanderStore.commands.splice(index, 1)
    }
  }
}
