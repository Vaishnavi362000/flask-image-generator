import React from 'react';
import { Box, Flex, Progress } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useLoading } from '../context/LoadingContext';

const Layout = ({ children }) => {
  const { isLoading } = useLoading();

  return (
    <Box 
      alignItems="center" 
      justifyContent="center" 
      height="100vh"
      
    >
      {isLoading && <Progress size="xs" isIndeterminate colorScheme="black" />}
      <Flex height="100vh">
        {/* <Box 
        width="250px" 
        bg="rgba(236, 232, 234, 0.79)" 
        backdropFilter="blur(10px)"
        bgImage="url('https://images.pexels.com/photos/370799/pexels-photo-370799.jpeg?auto=compress&cs=tinysrgb&w=400')"
      bgSize="cover" 
      bgPosition="center"
      >
        <Sidebar />
      </Box> */}
        <Sidebar />
        <Box
          flex="1"
          p={4}
          bg="rgba(236, 232, 234, 0.79)" 
          backdropFilter="blur(10px)"
        >
          <TopBar />
          {children}
        </Box>
      </Flex>
    </Box>
  ); 
};

export default Layout;