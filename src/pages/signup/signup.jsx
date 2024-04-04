import { useState } from "react";

function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
      });
    
      function handleChange(e) {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value
        });
      };
    
      function checkPasswords() {
        const { password, confirmPassword } = formData;
        if (password !== confirmPassword) {
          document.getElementById('password-error').innerText = 'Passwords do not match';
        } else {
          document.getElementById('password-error').innerText = '';
          document.getElementById('confirm-password-error').innerText = '';
        }
      };
    
      async function handleSubmit(e) {
        e.preventDefault();

        const { username, password } = formData;
        const requestBody = {
          username: username,
          password: password
        };

        try {
            const response = await fetch(`http://localhost:3000/auth/signup`,
                {
                    mode: 'cors',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                }
            )
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log(response);
        } catch (error) {
            console.error('Error updating the post', error);
        }
      };
    
      return (
        <>
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
              onBlur={checkPasswords}
              required
            />
            <span id="password-error"></span>
          </div>
          <div>
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              name="confirmPassword"
              id="confirm-password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={checkPasswords}
              required
            />
            <span id="confirm-password-error"></span>
          </div>
          <button type="submit">Sign Up</button>
        </form>
        </>
    )
}

export default Signup