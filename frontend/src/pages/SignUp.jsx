import axios from 'axios'
import React, { useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import API_URL from '../../config/global'
import '../styles/SignUp.css'

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
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
      const response = await axios.post(`${API_URL}/signin/verify`, formData)
      console.log(response)

      if (response.data === true) {
        alert('Registration Successful! A verification email has been sent to your email address. Please verify your email address to login.')
      } else {
        alert('Registration Failed! User already exists.')
      }
      
    } catch (error) {
      console.log("Error during registration:", error)
    }
  }

  return (
    <Container>
      <h1>Registration Form</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>User Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter User Name"
            name='name'
            value={formData.username}
            onChange={handleOnChange}
            required
          />
        </Form.Group>
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
          Register
        </Button>
        <p>Already have an account? <Link to='/login'>Login</Link> </p>
      </Form>
    </Container>
  )
}

export default SignUp