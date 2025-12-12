import { Button } from '../ui/button'

function Header() {
  return (
    <header>
      <nav className='flex justify-between items-center'>
        <img src='' alt='logo' className='h-16' />
        <Button variant={"outline"}>Sign In</Button>
        <Button variant={"outline"}>Sign Up</Button>
      </nav>
    </header>
  )
}

export default Header