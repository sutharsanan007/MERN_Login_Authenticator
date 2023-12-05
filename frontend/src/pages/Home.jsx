import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Container } from 'react-bootstrap'
import API_URL from '../../config/global'
import '../styles/Home.css'

const Home = () => {

  const [response, setResponse] = useState({})

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"))
    if (user && user.token) {
      getData(user.token)
    }
  }, [])

  const getData = async (token) => {
    try {
      const config = {
        headers: {
          Authorization: token,
        },
      }

      const response = await axios.get(`${API_URL}/home`, config)
      setResponse(response.data)

    } catch (error) {
      console.log("Error during loading Home Page:", error)
    }
  }

  return (
    <Container>
      <h1>Welcome to our webpage!</h1>
      <p>We are here to serve you</p>
      <p>{response.name}</p>
      <Button variant="primary" type="submit">
        Get Started
      </Button>
    </Container>
  )
}

export default Home