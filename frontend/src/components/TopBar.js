import React,{useState} from 'react';
import { Input,Text, Box, Button, Icon, InputGroup, InputLeftElement, HStack, Avatar, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { FaBell, FaSearch } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const TopBar = () => {
  const { user, logout} = useAuth();

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" p={3}>
      <Text fontSize="x-large" fontWeight="bold" alignItems="center">Hello,  {user?.username}! 👋</Text> 
      <InputGroup width="100%" maxWidth="400px">
        <InputLeftElement pointerEvents="none">
          <FaSearch color="gray.500" />
        </InputLeftElement>
      <Input
        placeholder="Search..." 
        bg="white" 
        borderRadius="md"
        height="40px"
        width="100%" 
        maxWidth="600px" 
        boxShadow="md"
        _placeholder={{ color: 'gray.500' }}
      />
      </InputGroup>
      <HStack>
      
      <Menu>
        <MenuButton as={Button} variant="ghost">
          <Icon as={FaBell} boxSize={6} borderRadius="full" p={1}color="black" />
        </MenuButton>
        <MenuList>
          <MenuItem>Notification 1</MenuItem>
          <MenuItem>Notification 2</MenuItem>
        </MenuList>
      </Menu>
     
      <Menu>
        <MenuButton as={Button} variant="ghost">
          <Avatar size="sm" name="User Name" src="user-image-url.jpg" />
        </MenuButton>
        <MenuList>
          <MenuItem>Profile</MenuItem>
          <MenuItem>Settings</MenuItem>
          <MenuItem>Logout</MenuItem> {/* Logout option */}
        </MenuList>
      </Menu>
      </HStack>
    </Box>
  );
};

export default TopBar;