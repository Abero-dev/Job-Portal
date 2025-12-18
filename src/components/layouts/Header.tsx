import { SignedIn, SignedOut, SignIn, SignUp, UserButton, useUser } from '@clerk/clerk-react'
import { Button } from '../ui/button'
import { Link, useSearchParams } from 'react-router-dom'
import { BriefcaseBusiness, Heart, PenBox, Repeat } from 'lucide-react'
import { useEffect, useState } from 'react'

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
    <header>
      <nav className='flex justify-between items-center'>
        <Link to="/">
          <img src='/jobby_logo.webp' alt='logo' className='h-32' />
        </Link>
        <div className='flex justify-around items-center gap-x-5 mr-16'>

          <SignedOut>
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
          </SignedOut>
          <SignedIn>
            {
              user?.unsafeMetadata?.role !== undefined &&
              <Link to="/onboarding">
                <Button variant={"blue"} className='rounded-full'>
                  <Repeat size={20} />
                  Change role
                </Button>
              </Link>
            }
            {
              user?.unsafeMetadata?.role === 'recruiter' &&
              <Link to="/post-job">
                <Button variant={"magenta"} className='rounded-full'>
                  <PenBox size={20} />
                  Post a job
                </Button>
              </Link>
            }

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
          className='fixed inset-0 flex items-center justify-center bg-black/50 z-1000'
          onClick={handleOverlayClick}>
          <SignIn />
        </div>
      }
      {
        showSignUp &&
        <div
          className='fixed inset-0 flex items-center justify-center bg-black/50 z-1000'
          onClick={handleOverlayClick}>
          <SignUp />
        </div>
      }
    </header>
  )
}

export default Header