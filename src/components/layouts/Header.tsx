import { SignedIn, SignedOut, SignIn, SignUp, UserButton } from '@clerk/clerk-react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import { PenBox } from 'lucide-react'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'

function Header() {

  return (
    <header>
      <nav className='flex justify-between items-center'>
        <img src='/jobby_logo.webp' alt='logo' className='h-32' />
        <div className='flex justify-around items-center gap-x-5 mr-16'>

          <SignedOut>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant={"outline"}
                >
                  Sign In
                </Button>
              </DialogTrigger>
              <DialogContent className='h-fit w-fit bg-transparent'>
                <SignIn
                  signUpForceRedirectUrl="/onboarding"
                  fallbackRedirectUrl="/">

                </SignIn>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant={"outline"}
                >
                  Sign Up
                </Button>
              </DialogTrigger>
              <DialogContent className='h-fit w-fit bg-transparent'>
                <SignUp
                  signInForceRedirectUrl="/onboarding"
                  fallbackRedirectUrl="/">
                </SignUp>
              </DialogContent>
            </Dialog>
          </SignedOut>
          <SignedIn>
            <Button variant={"magenta"} className='rounded-full'>
              <PenBox size={20} />
              Post a job
            </Button>
            <Link to="/post-job">

            </Link>
            <UserButton />
          </SignedIn>
        </div>
      </nav>
    </header>
  )
}

export default Header