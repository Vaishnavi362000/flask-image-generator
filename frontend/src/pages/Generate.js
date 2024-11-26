import React, { useState, useEffect } from 'react';
import { Box, Button, Input, Image, SimpleGrid, VStack, HStack, useToast, Icon, Text, Heading, Select, Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react';
import { FiUpload, FiDownload, FiEye, FiTrash2, FiFeather, FiSun, FiMoon} from 'react-icons/fi';
import { useSpring, animated } from '@react-spring/web';
import { useLoading } from '../context/LoadingContext';
import { BackgroundGradient } from '../components/BackgroundGradient';
import api from "../utils/axios";

const Generate= () => {
  const [ setSelectedFile] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]);
  const { isLoading, setIsLoading } = useLoading();
  const toast = useToast();
  const [promptType, setPromptType] = useState('guided');
  const [customPrompt, setCustomPrompt] = useState('');
  const [style, setStyle] = useState('');
  const [subject, setSubject] = useState('');
  const [mood, setMood] = useState('');
  const [lighting, setLighting] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [deleteImageId, setDeleteImageId] = useState(null); // State to hold the ID of the image to delete
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure(); 

  const errorAnimation = useSpring({
    opacity: showError ? 1 : 0,
    transform: showError ? 'translateY(0)' : 'translateY(-20px)',
    config: { tension: 200, friction: 15 },
  });

  const fetchImages = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
          console.error('No token found');
          return;
      }

      const response = await api.get('/image/user-images', {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });

      if (Array.isArray(response.data.images)) {
          setGeneratedImages(response.data.images);
      } else {
          console.error('Expected an array of images, but got:', response.data.images);
          setGeneratedImages([]);
      }
    } catch (error) {
        console.error('Error fetching images:', error);
    }
};

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(URL.createObjectURL(file));
      // You'll need to implement the actual file upload logic here
      // and set the uploadedImagePath
    }
  };

  const handleGenerate = async (useCustomPrompt = false) => {
    setIsLoading(true);
    try {
        const promptData = useCustomPrompt
            ? { customPrompt: customPrompt } // Only send customPrompt if using custom prompt
            : { 
                style, 
                subject, 
                mood, 
                lighting 
            }; // Removed imagePath since it's null

            const response = await api.post('/image/generate', promptData, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
              }
            });

        if (response.data.success) {
          const generatedImageUrl = response.data.image.url; // Adjust based on your API response structure
          setGeneratedImages((prevImages) => [...prevImages, generatedImageUrl]); // Add to the list of generated images
          fetchImages();

            toast({
                title: "Image Generated",
                description: "Your image has been successfully generated.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        }
      } catch (error) {
        console.error("Error generating image:", error);
        setErrorMessage("Failed to generate image. Please try again.");
        setShowError(true);
        setTimeout(() => setShowError(false), 3000); // Hide error after 3 seconds
      } finally {
        setIsLoading(false);
      }
};
  
const handleDownload = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Network response was not ok');

    const blob = await response.blob(); // Convert the response to a Blob
    const url = window.URL.createObjectURL(blob); // Create a URL for the Blob

    const link = document.createElement('a');
    link.href = url;
    link.download = 'generated-image.png'; // Set the default file name
    document.body.appendChild(link);
    link.click(); // Trigger the download
    document.body.removeChild(link); // Clean up

    // Revoke the object URL after the download
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading image:", error);
    setErrorMessage("Failed to download image. Please try again.");
    setShowError(true);
    setTimeout(() => setShowError(false), 3000); // Hide error after 3 seconds
  }
};

  const handleViewFullImage = (image) => {
    setSelectedImage(image.url);
    onOpen();
  };

  const openDeleteModal = (imageId) => {
    console.log("Opening delete modal for image ID:", imageId); // Debugging line
    setDeleteImageId(imageId);
    onDeleteModalOpen();
};

const handleDeleteImage = async () => {
  try {
      const access_token = localStorage.getItem('token'); // Changed from 'token' to 'access_token'
      console.log("token",access_token)
      

      if (!deleteImageId) {
          setErrorMessage("No image selected for deletion.");
          setShowError(true);
          return;
      }

      const response = await api.delete(`/image/api/images/${deleteImageId}`, {
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('access_token')}` // Use the actual access_token, not the string 'token'
          }
      });

      if (response.status === 200) { // Check status instead of response.data.success
          // Refresh the images list after successful deletion
          await fetchImages();
          
          toast({
              title: "Image Deleted",
              description: "The image has been successfully deleted.",
              status: "success",
              duration: 3000,
              isClosable: true,
          });
      }
  } catch (error) {
      console.error("Error deleting image:", error);
      setErrorMessage(error.response?.data?.error || "Failed to delete image. Please try again.");
      setShowError(true);
  } finally {
      onClose();
  }
};

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <Box padding={6} bg="F3F4F5E6" borderBottom="1px" borderBottomColor="gray">
        <HStack spacing={4}>
          <Select value={promptType} size="lg" bg="#FFFFFF" onChange={(e) => setPromptType(e.target.value)} width="150px">
            <option value="guided">Guided</option>
            <option value="custom">Custom</option>
          </Select>
          <Input
            flex={1}
            bg="#FFFFFF"
            size="lg"
            placeholder={promptType === 'guided' ? "Enter subject..." : "Enter your custom prompt..."}
              value={promptType === 'guided' ? subject : customPrompt}
              onChange={(e) => promptType === 'guided' ? setSubject(e.target.value) : setCustomPrompt(e.target.value)}
          />
          <BackgroundGradient>
          <Button
            color="black"
            borderRadius="full"
            onClick={() => handleGenerate(promptType === 'custom')}
            isLoading={isLoading}
          >
            Generate
          </Button>
          </BackgroundGradient>
          <Button leftIcon={<FiUpload />} variant="outline" onClick={() => document.getElementById('fileInput').click()}>
            Upload
          </Button>
          <input
            id="fileInput"
            type="file"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </HStack>
      

        {promptType === 'guided' && (
          <HStack spacing={8} align="stretch" mt={4}>
            <Select placeholder="Style" bg="#FFFFFF" value={style} onChange={(e) => setStyle(e.target.value)} icon={<Icon as={FiFeather} />}>
              <option value="realistic">Realistic</option>
              <option value="cartoon">Cartoon</option>
              <option value="abstract">Abstract</option>
              <option value="impressionist">Impressionist</option>
              <option value="surrealist">Surrealist</option>
              <option value="minimalist">Minimalist</option>
            </Select>
            <Select placeholder="Mood" bg="#FFFFFF" value={mood} onChange={(e) => setMood(e.target.value)} icon={<Icon as={FiSun} />}>
              <option value="happy">Happy</option>
              <option value="sad">Sad</option>
              <option value="energetic">Energetic</option>
              <option value="calm">Calm</option>
              <option value="mysterious">Mysterious</option>
              <option value="romantic">Romantic</option>
            </Select>
            <Select placeholder="Lighting" bg="#FFFFFF" value={lighting} onChange={(e) => setLighting(e.target.value)} icon={<Icon as={FiMoon} />}>
              <option value="bright">Bright</option>
              <option value="dim">Dim</option>
              <option value="dramatic">Dramatic</option>
              <option value="natural">Natural</option>
              <option value="soft">Soft</option>
              <option value="neon">Neon</option>
            </Select>
          </HStack>
        )}
        </Box>

        <animated.div style={errorAnimation}>
          {showError && (
            <Box bg="red.500" color="white" p={4} borderRadius="md" textAlign="center">
              <Text>{errorMessage}</Text>
            </Box>
          )}
        </animated.div>

        <Box>
          {generatedImages.length > 0 && (
            <>
              <Heading size="md" mb={4}>Generated Images</Heading>
              <SimpleGrid columns={3} spacing={6}>
    {generatedImages.map((image) => (
        <Box key={image.id} borderWidth={1} borderRadius="lg" overflow="hidden" position="relative">
            <Image
                src={image.url}
                alt={image.prompt}
                w="full"
                h="500px"
                objectFit="cover"
                fallbackSrc="https://via.placeholder.com/200"
                onError={(e) => {
                    console.error('Image failed to load:', image.url);
                    e.target.src = "https://via.placeholder.com/200";
                }}
            />
            <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bg="rgba(0,0,0,0.5)"
                display="flex"
                justifyContent="center"
                alignItems="center"
                opacity="0"
                transition="opacity 0.2s"
                _hover={{ opacity: 1 }}
            >
                <HStack spacing={4}>
                    <Icon as={FiDownload} color="white" boxSize={6} cursor="pointer" onClick={() => handleDownload(image.url)} />
                    <Icon as={FiEye} color="white" boxSize={6} cursor="pointer" onClick={() => handleViewFullImage(image)} />
                    <Icon as={FiTrash2} color="white" boxSize={6} cursor="pointer" onClick={() => openDeleteModal(image.id)} />
                </HStack>
            </Box>
        </Box>
    ))}
</SimpleGrid>
            </>
          )}
        </Box>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
          <ModalContent
              bg="transparent"
              boxShadow="none"
          >
              <ModalCloseButton color="white" /> 
              <ModalBody display="flex" justifyContent="center" alignItems="center" p={0}>
                  <Image 
                      src={selectedImage} 
                      alt="Full-size Generated Image" 
                      maxW="90%" 
                      maxH="90vh"
                      objectFit="contain" 
                  />
              </ModalBody>
          </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose} isCentered>
       <ModalOverlay />
       <ModalContent>
           <ModalCloseButton />
           <ModalBody>
               <Text fontSize="lg" mb={4}>Are you sure you want to delete this image?</Text>
               <HStack justify="flex-end">
                   <Button colorScheme="red" onClick={handleDeleteImage}>Delete</Button>
                   <Button onClick={onDeleteModalClose}>Cancel</Button>
               </HStack>
           </ModalBody>
       </ModalContent>
   </Modal>
    </Box>
  );
};

export default Generate;