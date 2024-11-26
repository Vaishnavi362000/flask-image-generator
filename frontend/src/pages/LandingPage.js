import React from 'react';
import { Link } from 'react-router-dom';

import {Box, Button,
  Heading,
  Text,
  Icon,
  Container,
  VStack,
  HStack,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  Sparkles,
  Wand2,
  Zap,
  Image as ImageIcon,
  Palette,
  Clock,
  Lock,
  Share2,
  Check,
  Twitter,
  Github,
  Linkedin
} from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Generate high-quality images in seconds with our optimized AI engine'
  },
  {
    icon: ImageIcon,
    title: 'Multiple Styles',
    description: 'Choose from various artistic styles and customize to your preference'
  },
  {
    icon: Palette,
    title: 'Smart Editing',
    description: 'Fine-tune your creations with our intuitive editing tools'
  },
  {
    icon: Clock,
    title: 'Batch Processing',
    description: 'Generate multiple variations of your concept simultaneously'
  },
  {
    icon: Lock,
    title: 'Secure Storage',
    description: 'Your creations are safely stored and easily accessible'
  },
  {
    icon: Share2,
    title: 'Easy Sharing',
    description: 'Share your masterpieces directly to social media or download in HD'
  }
];

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    features: [
      '50 generations per month',
      'Basic art styles',
      'Standard resolution',
      'Community support'
    ]
  },
  {
    name: 'Pro',
    price: '$19/month',
    features: [
      'Unlimited generations',
      'All art styles',
      'HD resolution',
      'Priority support',
      'Advanced editing tools',
      'Batch processing'
    ]
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    features: [
      'Custom API access',
      'Dedicated support',
      'Custom model training',
      'Advanced analytics',
      'Team collaboration',
      'SLA guarantee'
    ]
  }
];

const galleryImages = [
  {
    url: "https://picsum.photos/seed/picsum/200/300",
    title: "Abstract Dream"
  },
  {
    url: "https://images.unsplash.com/photo-1705947320126-8c4490f9c1e8",
    title: "Digital Landscape"
  },
  {
    url: "https://images.unsplash.com/photo-1683009427666-340595e57e43",
    title: "Cosmic Journey"
  },
  {
    url: "https://images.unsplash.com/photo-1686591062448-d5d2c86f5db3",
    title: "Future Vision"
  }
];

const Landing = () => {
  return (
    <Box
      style={{ minHeight: '100vh' }} // Ensure it takes at least the full viewport height
    >
    
      {/* Header */}
      <Box as="nav" py={4} px={8} display="flex" justifyContent="space-between" alignItems="center" bg="#FFFFFFCC" zIndex={1} borderBottom="1px" borderColor="#E2E8F0" position="fixed" width="100%" backdropFilter="blur(10px)">
        <HStack spacing={2} color="#4B5563">
          <Sparkles className="h-6 w-6" color="#9333EA" />
          <Heading size="md" bgGradient="linear(to-r, #38bdf8, #818cf8, #c084fc)"
            bgClip="text">ImageAI</Heading>
        </HStack>
        <HStack spacing={8} display={{ base: 'none', md: 'flex' }} color="#4B5563">
          <Link to="#features">Features</Link>
          <Link to="#gallery">Gallery</Link>
          <Link to="#pricing">Pricing</Link>
        </HStack>
        <HStack spacing={4}>
          <Link to="/signin">
            <Button variant="outline" color="#9333EA" border="1px">Login</Button>
          </Link>
          <Link to="/signup">
            <Button bg="#9333EA" color="#FFFFFF">Sign Up Free</Button>
          </Link>
        </HStack>
      </Box>

      {/* Hero Section */}
      <Container maxW="100%" py={60} px={20} bg="#FFFFFF">
        <Box textAlign="center" color="white">
          <Heading
            as="h1"
            size="2xl"
            mb={6}
            bgGradient="linear-gradient(to-r, #38bdf8, #818cf8, #c084fc)"
            bgClip="text"
          >
            Transform Your Ideas Into Art
          </Heading>
          <Text fontSize="xl" mb={8} color="#4B5563">
            Create stunning, unique images in seconds using our advanced AI.
            From concept to masterpiece – no artistic skills required.
          </Text>
          <HStack spacing={4} justify="center">
          <Link to="/signin">
            <Button
              leftIcon={<Wand2 />}
              bg="#9333EA" 
              color="#FFFFFF"
              size="lg"
            >
              Start Creating
            </Button>
            </Link>
            <Button
              variant="outline"
              border="1px"
              color="#9333EA" 
              size="lg"
            >
              View Gallery
            </Button>
          </HStack>
        </Box>
      </Container>
   

      {/* Features Section */}
      <Box as="section" id="features" py={20} bg="#F9FAFB">
        <Container maxW="7xl">
          <VStack spacing={12}>
            <Box textAlign="center" color="white">
              <Heading mb={4} color="#111827">Powerful Features for Creative Minds</Heading>
              <Text fontSize="xl" color="#4B5563">Everything you need to bring your imagination to life</Text>
            </Box>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
              {features.map((feature, index) => (
                <Box
                  key={index}
                  bg="#FFFFFF"
                  p={6}
                  borderRadius="xl"
                  backdropFilter="blur(10px)"
                  boxShadow="sm"
                  _hover={{ boxShadow: "lg", transition: "box-shadow 0.3s ease" }}
                  
                >
                  <Icon as={feature.icon} boxSize={6} mb={4} color="#9333EA"/>
                  <Heading size="md" mb={2} color="#111827">{feature.title}</Heading>
                  <Text color="#4B5563">{feature.description}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Gallery Section */}
      <Box as="section" id="gallery" py={20} bg="#FFFFFF">
        <Container maxW="7xl">
          <VStack spacing={12}>
            <Box textAlign="center" color="white">
              <Heading mb={4} color="#111827">Gallery of Possibilities</Heading>
              <Text fontSize="xl" color="#4B5563">Explore what others have created with ImageAI</Text>
            </Box>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
              {galleryImages.map((image, index) => (
                <Box
                  key={index}
                  position="relative"
                  overflow="hidden"
                  borderRadius="xl"
                  transition="transform 0.3s"
                  _hover={{ transform: 'scale(1.02)' }}
                >
                  <Box
                    as="img"
                    src={image.url}
                    alt={image.title}
                    w="full"
                    h="400px"
                    objectFit="cover"
                  />
                  <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    p={6}
                    bg="linear-gradient(to top, rgba(0,0,0,0.7), transparent)"
                  >
                    <Text color="#4B5563" fontSize="xl" fontWeight="bold">
                      {image.title}
                    </Text>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box as="section" id="pricing" py={20} bg="#F9FBFB">
        <Container maxW="7xl">
          <VStack spacing={12}>
            <Box textAlign="center" color="white">
              <Heading mb={4} color="#111827">Simple, Transparent Pricing</Heading>
              <Text fontSize="xl" color="#4B5563" >Choose the perfect plan for your creative needs</Text>
            </Box>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
              {plans.map((plan, index) => (
                <Box
                  key={index}
                  p={8}
                  borderRadius="xl"
                  color="#111827"
                  backdropFilter="blur(10px)"
                  bg="#FFFFFF"
                  boxShadow="sm"
                  _hover={{ boxShadow: "lg", transition: "box-shadow 0.3s ease" }}
                >
                  <VStack align="stretch" spacing={6}>
                    <Box>
                      <Heading size="lg" mb={2} color="#111827">{plan.name}</Heading>
                      <Text fontSize="3xl" fontWeight="bold" color="#9333EA">
                        {plan.price}
                      </Text>
                    </Box>
                    <VStack align="stretch" spacing={4}>
                      {plan.features.map((feature, i) => (
                        <HStack key={i}>
                          <Check className="h-5 w-5 text-green-500" />
                          <Text color="#111827">{feature}</Text>
                        </HStack>
                      ))}
                    </VStack>
                    <Button
                      color={index === 1 ? "#9333EA"  : "#FFFFF"}
                      variant={index === 1 ? "solid" : "outline"}
                    >
                      {index === 2 ? 'Contact Sales' : 'Get Started'}
                    </Button>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Footer */}
      <Box as="footer" py={20} color="white" bg="gray.900" borderTop="1px" borderColor="whiteAlpha.200">
        <Container maxW="7xl">
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8}>
            <VStack align="start" spacing={4}>
              <HStack>
                <Sparkles className="h-6 w-6" color="#9333EA" />
                <Heading size="md" bgGradient="linear(to-r, #38bdf8, #818cf8, #c084fc)"
            bgClip="text">ImageAI</Heading>
              </HStack>
              <Text color="#D1D5DB" >Transforming imagination into reality with the power of AI</Text>
            </VStack>
            
            <VStack align="start" spacing={4}>
              <Heading size="sm">Product</Heading>
              <VStack align="start" spacing={2}>
                <Link to="#features">Features</Link>
                <Link to="#gallery">Gallery</Link>
                <Link to="#pricing">Pricing</Link>
              </VStack>
            </VStack>

            <VStack align="start" spacing={4}>
              <Heading size="sm">Company</Heading>
              <VStack align="start" spacing={2}>
                <Link to="#">About</Link>
                <Link to="#">Blog</Link>
                <Link to="#">Careers</Link>
              </VStack>
            </VStack>

            <VStack align="start" spacing={4}>
              <Heading size="sm">Legal</Heading>
              <VStack align="start" spacing={2}>
                <Link to="#">Privacy</Link>
                <Link to="#">Terms</Link>
              </VStack>
            </VStack>
          </SimpleGrid>

          <Box borderTop="1px" borderColor="whiteAlpha.200" mt={12} pt={8}>
            <HStack justify="space-between" flexDir={{ base: 'column', md: 'row' }} spacing={4}>
              <Text color="#D1D5DB" >© 2024 ImageAI. All rights reserved.</Text>
              <HStack spacing={6}>
                <Link to="#"><Twitter className="h-5 w-5" /></Link>
                <Link to="#"><Github className="h-5 w-5" /></Link>
                <Link to="#"><Linkedin className="h-5 w-5" /></Link>
              </HStack>
            </HStack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;