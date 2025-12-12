import { Outlet } from 'react-router-dom'
import { ModeToggle } from '../dark-mode/mode-toggle'
import Header from './Header'
import Footer from './Footer'

function AppLayout() {
    return (
        <div>
            <div className='grid-background'></div>
            <ModeToggle />
            <main className='min-h-screen container'>
                <Header />
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default AppLayout