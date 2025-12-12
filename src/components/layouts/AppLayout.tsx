import { Outlet } from 'react-router-dom'

function AppLayout() {
    return (
        <div>
            <div className='grid-background'></div>
            <Outlet />
        </div>
    )
}

export default AppLayout