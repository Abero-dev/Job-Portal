import { useUser } from '@clerk/clerk-react'
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
    children: ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {

    const { isSignedIn, user, isLoaded } = useUser();
    const { pathname } = useLocation();

    if (isLoaded && !isSignedIn && isSignedIn !== undefined) {
        return <Navigate to="/?sign-in=true" />
    }

    if (user !== undefined && !user?.unsafeMetadata?.role && pathname !== "/onboarding")
        return <Navigate to="/onboarding" />

    if (user !== undefined && user?.unsafeMetadata?.role && user?.unsafeMetadata.role === "candidate" && pathname !== "/jobs" && pathname !== "/onboarding")
        return <Navigate to="/onboarding" />

    return children
}


export default ProtectedRoute