import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Heading, Input, Text, Alert, AlertIcon, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useGoogleLogin } from '@react-oauth/google';
import api from '../utils/axios'; // Adjust the path as necessary

function SignInPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [user, setUser] = useState("")
  const [showPassword, setShowPassword] = useState(false);


  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const email = event.target.email.value;
    const password = event.target.password.value;
  
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user_id', response.data.user.id);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user); // Add this line
        navigate('/dashboard'); // Use navigate instead of window.location
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed. Please try again.');
    }
  };

const handleGoogleSignIn = useGoogleLogin({
  onSuccess: async (response) => {
    console.log("Google sign-in successful...");
    console.log("Access Token:", response.access_token);
    try {
      // Send the access token to your backend for verification and user creation
      const res = await api.post('/auth/google-login', {
        token: response.access_token
      });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user_id', response.data.user.id);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError(error.response?.data?.error || 'Sign-in failed. Please try again.');
    }
  },
  onError: (error) => {
    console.error("Google sign-in error:", error);
    setError(error.message || 'Google sign-in failed. Please try again.');
  }
});


  return (
    <Box 
      className="signin-page" 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      height="100vh" 
      bg="rgba(212, 212, 212, 0.79)" 
      backdropFilter="blur(10px)" 
      p={5}
    >
      <Box 
        height="auto"
        width={{ base: "90%", sm: "450px" }}
        boxShadow="lg"
        borderRadius="md" 
        bg="white" 
        p={8}
        mb={10}
      >
        <Heading textAlign="center" mb={4} mt={4}>Welcome Back</Heading>
        <Text textAlign="center" mb={8}>Please sign in to continue.</Text>
        <Box textAlign="center" mb={8}>
          <Button
            leftIcon={<FcGoogle />}
            colorScheme='black'
            size="sm"
            bg="rgba(212, 212, 212, 0.79)"
            boxShadow="sm"
            width="100%"
            height="40px"
            mb={4}
            onClick={handleGoogleSignIn}
          >
            Sign In with Google
          </Button>
          <Box display="flex" alignItems="center" my={2}>
            <Box flex="1" height="1px" bg="gray.300" />
            <Text mx={2}>OR</Text> 
            <Box flex="1" height="1px" bg="gray.300" />
          </Box> 
        </Box>
        {error && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <FormControl mb={4}>
            <FormLabel>Email</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaEnvelope color="gray.500" />
              </InputLeftElement>
              <Input type="email" name="email" outlineColor="gray" placeholder="Enter your email" required />
            </InputGroup>
          </FormControl>
          <FormControl mb={6}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaLock color="gray.500" />
              </InputLeftElement>
              <Input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                outlineColor="gray"
                placeholder="Enter your password" 
                required 
              />
              <InputRightElement onClick={() => setShowPassword(!showPassword)} cursor="pointer">
                {showPassword ? <FaEye color="gray.500" /> : <FaEyeSlash color="gray.500" />}
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Text mb={4} textAlign="center">
            Don't have an account? <Link to="/signup" style={{color: 'blue'}}>Sign Up</Link>
          </Text>
          <Button 
            className="signin-button" 
            bg="linear-gradient(90deg, rgba(49,115,157,1) 19%, rgba(154,217,255,1) 100%)" 
            _hover={{ bg: "linear-gradient(90deg, rgba(49,115,157,1) 19%, rgba(154,217,255,1) 100%)", opacity: 0.9 }}
            size="lg" 
            width="100%" 
            mt={4} 
            boxShadow="lg" 
            type="submit"
          >
            Sign In
          </Button>
        </form>
      </Box> 
    </Box>
  );
}

export default SignInPage;