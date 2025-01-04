import React, {useEffect, useState} from "react"
import createAuthInstance from "../Helpers/Auth"
import Header from "../Components/Header"
import {useUser} from "../Helpers/ProtectedRoute"

const logoutUser = authMgr => {
    authMgr.logout()
}

const Home = () => {
    const { userData } = useUser()
    const authMgr = createAuthInstance()

    useEffect(() => {
        if(userData) {
            if(!userData.name) {
                window.location = '/login'
            }
        }
    }, [userData])

    
    
    return (
        <>
            <Header></Header>
            <h1>Welcome, {userData ? userData.name : ''}</h1>
            <button onClick={logoutUser.bind(null, authMgr)}>Logout</button>
        </>
    )
}

export default Home;