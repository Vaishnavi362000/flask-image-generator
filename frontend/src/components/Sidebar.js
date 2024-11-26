import React from 'react';
import { Box, VStack, Button, Text, Icon, Divider, Flex, HStack } from '@chakra-ui/react';
import { FaHome, FaPlus, FaUserCircle, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const SidebarButton = ({ icon, text, to }) => (
    <Link to={to} style={{ width: '100%' }}>
      <Button
        width="100%"
        variant="ghost"
        justifyContent="flex-start"
        px={6}
        py={6}
        mb={2}
        color="gray.700"
        fontWeight="medium"
        position="relative"
        _hover={{
          bg: 'gray.100',
          color: 'purple.600',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '4px',
            bg: 'purple.600',
          },
        }}
        fontSize="md"
      >
        <Icon as={icon} boxSize={6} mr={4} />
        <Text>{text}</Text>
      </Button>
    </Link>
  );

  return (
    <Flex
      width="280px"
      height="100vh"
      bg="#f4f4f5"
      flexDirection="column"
      borderRight="1px"
      borderColor="gray.200"
    >
      <Box p={6}>
        <Text fontSize="2xl" fontWeight="bold" color="gray.800" mb={10}>
           Image Generator
        </Text>
        <VStack spacing={6} align="stretch" flex="1">
          <SidebarButton icon={FaHome} text="Home" to="/dashboard" />
          <SidebarButton icon={FaPlus} text="Generate" to="/generate" />
        </VStack>
      </Box>
      <Box mt="auto" p={6}>
        <Divider mb={4} />
        <HStack spacing={4} align="center">
          <Icon as={FaUserCircle} boxSize={8} />
          <VStack align="start" spacing={0}>
            <Text fontSize="lg"  fontWeight="bold"  color="gray.800">{user?.username}</Text>
       
          </VStack>
          <Button
            variant="link"
            onClick={logout}
            color="gray.600"
            paddingLeft={14}
            leftIcon={<Icon as={FaChevronRight} boxSize={4} />}
          >      
          </Button>
        </HStack>
      </Box>
    </Flex>
  );
};

export default Sidebar;