import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Text, Icon, Image, SimpleGrid, Button} from '@chakra-ui/react';
import { FaImages, FaClock, FaMagic } from 'react-icons/fa';
import { useNavigate} from 'react-router-dom';
import api from '../utils/axios';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
          const token = localStorage.getItem('token');
          console.log('Token:', token);
  
          const response = await api.get('/image/user-images', {
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          });
  
          if (response.headers['content-type'] !== 'application/json') {
              throw new Error('Expected JSON response');
          }
  
          setImages(response.data.images);
      } catch (error) {
          console.error('Error fetching images:', error);
      }
  };

  fetchImages();
  },[]);
  


  return (
      <Box flex={1} p={8}>
        <VStack align="stretch" spacing={8}>
          <Box>
            <Text mt={2} color="gray.600">Ready to create something amazing today?</Text>
          </Box>

          {/* Stats Grid */}
          <SimpleGrid columns={3} spacing={6}>
            <Box p={6} bg="#FFFFFF" borderRadius="lg" boxShadow="md">
              <Icon as={FaImages} boxSize={8} color="blue.500" mb={4} />
              <Heading size="md">Your Images</Heading>
              <Text fontSize="2xl" mt={2}>{images.length}</Text>
            </Box>

            <Box p={6} bg="#FFFFFF" borderRadius="lg" boxShadow="md">
              <Icon as={FaClock} boxSize={8} color="green.500" mb={4} />
              <Heading size="md">Last Generated</Heading>
              <Text mt={2}>
                {images.length > 0 ? new Date(images[0].generated_at).toLocaleString() : 'No images yet'}
              </Text>
            </Box>

            <Box p={6} bg="#FFFFFF" borderRadius="lg" boxShadow="md">
              <VStack spacing={4} align="stretch">
                <Heading size="md">Quick Actions</Heading>
                <Button
                  leftIcon={<FaMagic />}
                  colorScheme="blue"
                  onClick={() => navigate('/generate')}
                >
                  New Image
                </Button>
              </VStack>
            </Box>
          </SimpleGrid>

          {/* Recent Images */}
          <Box>
          <Heading size="md" mb={4}>Recent Creations</Heading>
          
          {images.length > 0 ? (
            <SimpleGrid columns={4} spacing={6}>
              {images.map((image) => (
                <Box
                  key={image.id}
                  position="relative"
                  borderRadius="lg"
                  overflow="hidden"
                  boxShadow="md"
                  transition="transform 0.2s, box-shadow 0.2s"
                _hover={{ transform: 'scale(1.05)', boxShadow: 'lg' }}
                >
                  <Image
            src={image.url}
            alt={image.prompt}
            objectFit="cover"
            w="100%"
            h="200px"
            fallbackSrc="https://via.placeholder.com/200"
            onError={(e) => {
              console.error('Image failed to load:', image.url);
              e.target.src = "https://via.placeholder.com/200";
            }}
          />
                  <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    bg="blackAlpha.700"
                    p={4}
                    color="white"
                  >
                    <Text fontSize="sm" noOfLines={2}>
                      {image.prompt}
                    </Text>
                    <Text fontSize="xs" mt={1}>
                      {new Date(image.generated_at).toLocaleDateString()}
                    </Text>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
            ) : (
              <Box textAlign="center" py={10}>
                <Icon as={FaImages} boxSize={12} color="gray.400" mb={4} />
                <Text color="gray.500" mb={4}>No images yet. Start creating!</Text>
                <Button
                  colorScheme="blue"
                  onClick={() => navigate('/generate')}
                >
                  Generate Images
                </Button>
              </Box>
            )}
          </Box>
        </VStack>
      </Box>
  );
};

export default DashboardPage;
