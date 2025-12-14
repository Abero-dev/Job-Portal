import { SignedIn, SignedOut, SignIn, SignUp, UserButton } from '@clerk/clerk-react'
import { Button } from '../ui/button'
import { Link, useSearchParams } from 'react-router-dom'
import { BriefcaseBusiness, Heart, PenBox } from 'lucide-react'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import { useEffect } from 'react'

function Header() {
  const [searchParams, setSearchParams] = useSearchParams()

  const showSignIn = searchParams.get("sign-in") === "true"

  const handleOpenSignInChange = (open: boolean) => {
    if (open) {
      setSearchParams({ "sign-in": "true" })
    } else {
      searchParams.delete("sign-in")
      setSearchParams(searchParams)
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const dialog = document.querySelector('[role="dialog"]')

      if (dialog && !dialog.contains(target) && showSignIn) {
        handleOpenSignInChange(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showSignIn])

  return (
    <header>
      <nav className='flex justify-between items-center'>
        <Link to="/">
          <img src='/jobby_logo.webp' alt='logo' className='h-32' />
        </Link>
        <div className='flex justify-around items-center gap-x-5 mr-16'>
          <SignedOut>
            <Dialog open={showSignIn} onOpenChange={handleOpenSignInChange}>
              <DialogTrigger asChild>
                <Button
                  variant={"outline"}
                  onClick={() => handleOpenSignInChange(true)}
                >
                  Sign In
                </Button>
              </DialogTrigger>
              <DialogContent className='h-fit w-fit bg-transparent'>
                <SignIn
                  signUpForceRedirectUrl="/onboarding"
                  fallbackRedirectUrl="/"
                  afterSignInUrl="/"
                />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant={"outline"}>
                  Sign Up
                </Button>
              </DialogTrigger>
              <DialogContent className='h-fit w-fit bg-transparent'>
                <SignUp
                  signInForceRedirectUrl="/onboarding"
                  fallbackRedirectUrl="/"
                />
              </DialogContent>
            </Dialog>
          </SignedOut>

          <SignedIn>
            <Link to="/post-job">
              <Button variant={"magenta"} className='rounded-full'>
                <PenBox size={20} />
                Post a job
              </Button>
            </Link>

            <UserButton
              appearance={{
                elements: {
                  avatarBox: {
                    height: 40,
                    width: 40
                  },
                }
              }}>
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My jobs"
                  labelIcon={<BriefcaseBusiness size={15} />}
                  href="/my-jobs"
                />
                <UserButton.Link
                  label="Saved jobs"
                  labelIcon={<Heart size={15} />}
                  href="/saved-jobs"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>
    </header>
  )
}

export default Header