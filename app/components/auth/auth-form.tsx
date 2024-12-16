import { Button } from '@/lib/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/lib/ui/form'
import { Input } from '@/lib/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const authFormSchema = z.object({
  email: z.string().email(),
})

export type AuthFormData = z.infer<typeof authFormSchema>

interface Props {
  onSubmit: (data: AuthFormData) => Promise<void>
}

export function AuthForm({ onSubmit }: Props) {
  const form = useForm<AuthFormData>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: '',
    },
  })

  // Create a wrapper function to handle form submission and reset
  const handleSubmit = async (data: AuthFormData) => {
    await onSubmit(data)
    form.reset() // Reset form after successful submission
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex flex-col space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    autoFocus
                    autoComplete="work email"
                    placeholder="name@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            Send me a magic link
          </Button>
        </div>
      </form>
    </Form>
  )
}
