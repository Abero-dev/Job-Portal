import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react'
import { Button } from '../ui/button'

function Header() {
  return (
    <header>
      <nav className='flex justify-between items-center'>
        <img src='/jobby_logo.webp' alt='logo' className='h-32' />
        <div className='flex justify-around items-center gap-x-5 mr-16'>
          <Button variant={"outline"}>Sign In</Button>
          {/* <SignedOut>
            <SignInButton />
            <SignUpButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn> */}
        </div>
      </nav>
    </header>
  )
}

export default Header