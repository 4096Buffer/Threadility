import React, { useState, useEffect, createContext, useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import createAuthInstance from "../Helpers/Auth";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true); // Dodano loading
    const authMgr = createAuthInstance();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await authMgr.auth();
                if (data.success) {
                    setUserData(data.response.data);
                } else {
                    setUserData(null);
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
                setUserData(null);
            } finally {
                setLoading(false); // Ustaw zakończenie ładowania
            }
        };

        fetchUserData();
    }, []);

    return (
        <UserContext.Provider value={{ userData, setUserData, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

function ProtectedRoute() {
    const { userData, loading } = useUser();

    if (loading) {
        return <h1>Loading...</h1>;
    }
    
    if (!userData) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;