import { AuthProvider } from "@/context/AuthContext"
import { BusinessAccessProvider } from "@/context/BusinessAccessContext"

export const Provider = ({ children }) => {
    return (
        <AuthProvider>
            <BusinessAccessProvider>
                {children}
            </BusinessAccessProvider>
        </AuthProvider>
    )
}