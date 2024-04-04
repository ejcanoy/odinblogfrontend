import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
      });
    
      function handleChange(e) {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value
        });
      };
    
      async function handleSubmit(e) {
        e.preventDefault();

        const { username, password } = formData;
        const requestBody = {
          username: username,
          password: password
        };

        try {
            const response = await fetch(`http://localhost:3000/auth/login`,
                {
                    mode: 'cors',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                }
            )
            if (response.status === 401) {
                alert("user not found");
            } else if (!response.ok) {
                console.log("made it to the network response error?")
                throw new Error('Network response was not ok');
            }
            const data = await response.json()
            localStorage.setItem("token", data.token)
            navigate('/blogdashboard');
        } catch (error) {
            console.error('Error updating the post', error);
        }
      };
    
      return (
        <>
        <h1>login</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              name="username"
              placeholder="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              name="password"
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span id="password-error"></span>
          </div>
          <button type="submit">Log in</button>
        </form>
        </>
    )
}

export default Login