import { Outlet } from 'react-router-dom'

import ToastProvider from '@/providers/ToastProvider'

const RootLayout = () => {
    return (
        <>
            <ToastProvider />
            <Outlet />
        </>
    )
}

export default RootLayout