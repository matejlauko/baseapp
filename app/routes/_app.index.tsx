import { BottomBar } from '@/components/bottom-bar'
import { useAuth } from '@/lib/auth/use-auth'
import { Button } from '@/lib/ui/button'
import ItemsList from '@/modules/items/components/items-list'
import { createFileRoute, useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/')({
  component: AppPage,
})

function AppPage() {
  const router = useRouter()
  const auth = useAuth()

  const handleLogout = () => {
    auth.signOut().then(() => {
      router.invalidate().finally(() => {
        router.navigate({ to: '/auth' })
      })
    })
  }

  return (
    <>
      <div className="mb-(--bottom-bar-height) flex h-dvh flex-col">
        <div className="container">
          <ItemsList />
        </div>
      </div>

      <BottomBar>
        <div>
          {auth.session?.user.email} :{' '}
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </BottomBar>
    </>
  )
}
