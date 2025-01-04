import axios from "axios";

const Login = async formData => {
    try {
        const response = await axios.post("http://localhost:8000/api/login/", formData , { withCredentials: true });

        return {
            success : true,
            response : response.data
        }
      } catch (err) {
        return {
            success : false,
            error : 'Login failed'
        }
      }
}

const ReviveToken = async () => {
    try {
        const response = await axios.post("http://localhost:8000/api/token/refresh/", {}, { withCredentials: true })
    } catch (err) {
        return false
    }
}

const Auth = async () => {
    console.log('Auth launched')

    try {
        const headers = {
            withCredentials: true
        }

        
        const response = await axios.get("http://localhost:8000/api/authinfo/", headers)

        return {
            success : true,
            response : response.data
        }

    } catch(err) {
        const returnval = await ReviveToken()
            
        if(!returnval) {
            return {
                success : false,
                error : 'Cannot auth'
            }
        }

        return await Auth()
    }
}

const Logout = async () => {
    try {
        axios.post("http://localhost:8000/api/logout/", {}, {withCredentials : true})

        window.location = '/login'
    } catch(err) {
        console.log('error loggin out: ', err)
    }
}

const createAuthInstance = () => {
    return {
        login : Login,
        auth  : Auth,
        logout : Logout
    }
}

export default createAuthInstance;