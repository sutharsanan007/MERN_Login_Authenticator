import axios from 'axios'
import React, { useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import API_URL from '../../config/global'
import '../styles/Login.css'

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const navigate = useNavigate();

    const handleOnChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${API_URL}/login`, formData)
            console.log(response)

            if (response.data === "Invalid User name or Password.") {
                alert('Invalid User name or Password.');

            } else if (response.data === "Server Busy. Please try again later.") {
                alert('Verify your email address to login.');
                
            } else if (response?.status) {
                localStorage.setItem("userInfo", JSON.stringify(response.data))
                navigate('/home')
            }

        } catch (error) {
            console.log("Error during login:", error)
        }
    }

    return (
        <Container>
            <h1>Login</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        name='email'
                        value={formData.email}
                        onChange={handleOnChange}
                        required
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        name='password'
                        value={formData.password}
                        onChange={handleOnChange}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
        </Container>
    )
}

export default Login