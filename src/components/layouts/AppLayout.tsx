import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { useUser } from '@clerk/clerk-react'
import { BarLoader } from 'react-spinners';

function AppLayout() {

    const { isLoaded } = useUser();

    if (!isLoaded)
        return <BarLoader className='mb-4' width={"100%"} color="#36d7b7" />

    return (
        <div>
            <div className='grid-background'></div>
            <main className='min-h-screen container min-w-full'>
                <Header />
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default AppLayout