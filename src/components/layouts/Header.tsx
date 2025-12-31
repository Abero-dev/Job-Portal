import { SignedIn, SignedOut, SignIn, SignUp, UserButton, useUser } from '@clerk/clerk-react'
import { Button } from '../ui/button'
import { Link, useSearchParams } from 'react-router-dom'
import { BriefcaseBusiness, Heart, PenBox, Repeat, Menu } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

function Header() {
  const [showSignIn, setShowSignIn] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)
  const [search, setSearch] = useSearchParams();
  const { user } = useUser();

  useEffect(() => {
    if (search.get("sign-in"))
      setShowSignIn(true);
  }, [search])

  const handleOverlayClick = (e: any) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false)
      setShowSignUp(false)
      setSearch({})
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <nav className='container mx-auto px-4 flex justify-between items-center'>

        <Link to="/" className="shrink-0">
          <img
            src='/jobby_logo.webp'
            alt='logo'
            className='h-30 w-auto -my-5'
          />
        </Link>

        <div className='flex items-center gap-x-4'>
          <SignedOut>
            <div className="hidden md:flex gap-x-3">
              <Button
                variant={"outline"}
                onClick={() => setShowSignIn(true)}
              >
                Sign In
              </Button>
              <Button
                variant={"outline"}
                onClick={() => setShowSignUp(true)}
              >
                Sign Up
              </Button>
            </div>

            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowSignIn(true)}>
                    Sign In
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowSignUp(true)}>
                    Sign Up
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="hidden md:flex items-center gap-x-3">
              {
                user?.unsafeMetadata?.role !== undefined &&
                <Link to="/onboarding">
                  <Button variant={"blue"} className='rounded-full gap-x-2'>
                    <Repeat size={20} />
                    Change role
                  </Button>
                </Link>
              }
              {
                user?.unsafeMetadata?.role === 'recruiter' &&
                <Link to="/post-job">
                  <Button variant={"magenta"} className='rounded-full gap-x-2'>
                    <PenBox size={20} />
                    Post a job
                  </Button>
                </Link>
              }
            </div>

            <div className="md:hidden flex items-center gap-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"outline"} className="h-12 w-12 rounded-lg">
                    <Menu className="min-h-full min-w-full" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {
                    user?.unsafeMetadata?.role !== undefined &&
                    <DropdownMenuItem asChild>
                      <Link to="/onboarding" className="flex items-center w-full cursor-pointer">
                        <Repeat className="mr-2 h-4 w-4" />
                        Change role
                      </Link>
                    </DropdownMenuItem>
                  }
                  {
                    user?.unsafeMetadata?.role === 'recruiter' &&
                    <DropdownMenuItem asChild>
                      <Link to="/post-job" className="flex items-center w-full cursor-pointer">
                        <PenBox className="mr-2 h-4 w-4" />
                        Post a job
                      </Link>
                    </DropdownMenuItem>
                  }
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

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

      {
        showSignIn &&
        <div
          className='fixed inset-0 min-h-screen flex items-center justify-center bg-black/50 z-1000'
          onClick={handleOverlayClick}>
          <SignIn />
        </div>
      }
      {
        showSignUp &&
        <div
          className='fixed inset-0 min-h-screen flex items-center justify-center bg-black/50 z-1000'
          onClick={handleOverlayClick}>
          <SignUp />
        </div>
      }
    </header>
  )
}

export default Header