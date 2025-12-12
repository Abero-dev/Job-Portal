import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react'

function Header() {
  return (
    <header>
      <nav className='flex justify-between items-center'>
        <img src='' alt='logo' className='h-16' />
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </nav>
    </header>
  )
}

export default Header