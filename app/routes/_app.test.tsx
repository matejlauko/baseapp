import { useMutation, useSub } from '@/lib/db/use-db'
import { Button } from '@/lib/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/lib/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/lib/ui/dropdown-menu'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/lib/ui/form'
import { Input } from '@/lib/ui/input'
import { Label } from '@/lib/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/lib/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/lib/ui/table'
import {
  DEFAULT_ITEM_TYPE,
  ItemTypeList,
  type CreateItemData,
  type Item,
} from '@/modules/items/items'
import { createItemMutation } from '@/modules/items/mutators'
import { listItems } from '@/modules/items/queries'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { format as formatDate } from 'date-fns'
import isHotkey from 'is-hotkey'
import { MoreHorizontal, Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useHotkeys } from 'react-hotkeys-hook'
import { z } from 'zod'

export const Route = createFileRoute('/_app/test')({
  component: TestPage,
})

function TestPage() {
  useHotkeys('mod+k', (event) => {
    console.log('k', event, { isPressed: isHotkey('mod+k', event) })
  })

  return (
    <div className="container py-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Items</h2>
        <CreateItemDialog />
      </div>
      <ItemsList />
    </div>
  )
}

function ItemsList() {
  const items = useSub(listItems)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Text</TableHead>
          <TableHead>Completed</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {items?.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.type}</TableCell>
            <TableCell>{item.text}</TableCell>
            <TableCell>{item.completed}</TableCell>
            <TableCell>{item.tags?.join(', ')}</TableCell>
            <TableCell>{formatDate(item.createdAt, 'P')}</TableCell>
            <TableCell>{item.updatedAt && formatDate(item.updatedAt, 'P')}</TableCell>

            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => {}}>Copy payment ID</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

      {/* <TableFooter>
        <TableRow>
        </TableRow>
      </TableFooter> */}
    </Table>
  )
}

export const itemFormSchema = z.object({
  text: z.string().min(1, { message: 'Fill text' }),
  type: z.enum(ItemTypeList, {
    required_error: 'Select type',
  }),
  // tags: z.string(),
})

export type ItemFormData = z.infer<typeof itemFormSchema>

function ItemForm({ onSubmit, item }: { onSubmit: (data: ItemFormData) => void; item?: Item }) {
  const form = useForm<ItemFormData>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      text: item?.text ?? '',
      // tags: item?.tags?.join(', ') ?? '',
      type: item?.type ?? DEFAULT_ITEM_TYPE,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col space-y-4">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Text</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>

                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="m@example.com">m@example.com</SelectItem>
                      <SelectItem value="m@google.com">m@google.com</SelectItem>
                      <SelectItem value="m@support.com">m@support.com</SelectItem>
                    </SelectContent>
                  </FormControl>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">
              Tags
            </Label>
            {/* <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="col-span-3"
              placeholder="tag1, tag2, tag3"
            /> */}
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Create item</Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

function CreateItemDialog() {
  const [open, setOpen] = useState(false)
  const addItem = useMutation(createItemMutation)

  const handleSubmit = (data: CreateItemData) => {
    addItem(data)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add item
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new item</DialogTitle>
          <DialogDescription>
            Add a new item to your list. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <ItemForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}
