import React, { useEffect, useState, useRef } from "react";
import createAuthInstance from "../Helpers/Auth"
import {useUser} from "../Helpers/ProtectedRoute"

const Login = () => {
    const [formData, setFormData] = useState({ name: "", password: "" })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const authMgr = createAuthInstance()
    const { userData } = useUser()

    useEffect(() => {
      if (userData?.name) {
        window.location = "/"; 
      }
    }, [userData])

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); 
        setError(null); 

        const result = await authMgr.login(formData)
        if(result.success) {
            setLoading(false);
            window.location = '/'
        } else {
            setError(result.error)
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((prevFormData) => ({
            ...prevFormData, 
            [name]: value,
        }));
    };

  return (
    <>
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Loading..." : "Submit"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
    </>
  );
}

export default Login;