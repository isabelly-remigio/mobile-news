import React, { useState } from 'react';
import {
  NativeBaseProvider,
  Box,
  VStack,
  HStack,
  Text,
  ScrollView,
  Image,
  Button,
  Icon,
  Pressable,
  Badge,
  extendTheme,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import Footer from '../components/footer';

const theme = extendTheme({
  colors: {
    primary: {
      600: '#0369A1',
    },
  },
});

const NewsDetailScreen = () => {
  const [isFavorited, setIsFavorited] = useState(false);

  // Dados mockados da notícia
  const newsData = {
    id: 1,
    image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=300&fit=crop',
    category: 'TECNOLOGIA',
    title: 'Garmin watches\' exploding prices and popularity go hand-in-hand, for better or worse',
    authors: 'por michael.hicks@futurenet.com (Michael L Hicks), Michael L Hicks',
    description: 'I break down why Garmin raising prices has somehow led to greater sales, and whether people are overpaying for their Garmin watches.'
  };

  const handleFavoriteToggle = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <NativeBaseProvider theme={theme}>
      
      <Box flex={1} bg="white" safeArea>
        <HStack justifyContent="flex-start" alignItems="center" px={4} py={3}>
          <Pressable>
            {({ isPressed }) => (
              <Icon 
                as={Ionicons} 
                name="chevron-back-outline" 
                size="lg" 
                color="blue.500"
                opacity={isPressed ? 0.7 : 1}
              />
            )}
          </Pressable>
        </HStack>

        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <Box px={4} mb={4} position="relative">
            <Image 
              source={{ uri: newsData.image }} 
              alt={newsData.title}
              w="full" 
              h={64}
              rounded="md"
              resizeMode="cover"
            />
            
            <Box position="absolute" bottom={3} right={7}>
              <Pressable onPress={handleFavoriteToggle}>
                {({ isPressed }) => (
                  <Box 
                    bg="white" 
                    rounded="full" 
                    p={2} 
                    shadow={3}
                    opacity={isPressed ? 0.8 : 1}
                  >
                    <Icon 
                      as={Ionicons} 
                      name={isFavorited ? "heart" : "heart-outline"}
                      size="md" 
                      color={isFavorited ? "red.500" : "gray.400"}
                    />
                  </Box>
                )}
              </Pressable>
            </Box>
          </Box>

          <VStack px={4} space={4}>
            <Box alignSelf="flex-start">
              <Badge 
                bg="primary.600" 
                px={3} 
                py={1} 
                _text={{ color: "white", fontWeight: "bold", fontSize: "xs" }}
              >
                {newsData.category}
              </Badge>
            </Box>

            <Text fontSize="xl" fontWeight="bold" color="gray.800" lineHeight="lg">
              {newsData.title}
            </Text>

            <Text fontSize="sm" color="gray.500" lineHeight="sm">
              {newsData.authors}
            </Text>

            <VStack space={3} mt={4}>
              <Text fontSize="md" fontWeight="bold" color="gray.800">
                DESCRIÇÃO
              </Text>
              
              <Text fontSize="sm" color="gray.600" lineHeight="md">
                {newsData.description}
              </Text>
            </VStack>

            <Box mt={8} mb={6}>
              <Button 
                variant="outline"
                borderColor="info.700"
                borderWidth={2}
                h={12}
                rounded="lg"
                _pressed={{ bg: "blue.50" }}
              >
                <Text fontSize="md" color="primary.500" fontWeight="semibold">
                  Notícia Completa
                </Text>
              </Button>
            </Box>

            <Box h={4} />
          </VStack>
        </ScrollView>

     <Footer/>
      </Box>
    </NativeBaseProvider>
  );
};

export default NewsDetailScreen;