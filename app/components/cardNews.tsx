import React from "react";
import { router } from "expo-router"; 
import { 
  Box, 
  VStack, 
  Text, 
  Image, 
  HStack, 
  Pressable, 
  Icon, 
  Button 
} from "native-base";
import { Ionicons } from "@expo/vector-icons";

interface NewsCardProps {
  id: number; 
  image: string;
  title: string;
  authors: string;
  description: string;
  categoria?: string;
}

function CardNews({
  id,
  image,
  title,
  authors,
  description,
  categoria,
}: NewsCardProps) {

  const handleLerMais = () => {
    router.push({
      pathname: '/pages/detalhesNoticias',
      params: { id: id.toString() }
    });
  };

  return (
    <Box bg="white" rounded="2xl" shadow={3} overflow="hidden">
      <Image
        source={{ uri: image }}
        alt={title}
        w="full"
        h={48}
        resizeMode="cover"
      />

      <VStack p={5} space={3}>
        {categoria && (
          <Box alignSelf="flex-start">
            <Text 
              fontSize="xs" 
              color="primary.700" 
              fontWeight="bold"
              bg="blue.50"
              px={2}
              py={1}
              rounded="md"
            >
              {categoria}
            </Text>
          </Box>
        )}

        <Text 
          fontSize="lg" 
          fontWeight="bold" 
          color="gray.800" 
          lineHeight="sm"
          numberOfLines={2}
        >
          {title}
        </Text>

        <Text 
          fontSize="sm" 
          color="blue.600" 
          fontWeight="semibold"
          numberOfLines={1}
        >
          {authors}
        </Text>

        <Text 
          fontSize="sm" 
          color="gray.600" 
          lineHeight="sm"
          numberOfLines={3}
        >
          {description}
        </Text>

        <HStack justifyContent="space-between" alignItems="center" mt={3}>
          <HStack space={5} alignItems="center">
            <Pressable>
              {({ isPressed }) => (
                <HStack alignItems="center" space={1} opacity={isPressed ? 0.7 : 1}>
                  {/* <Icon 
                    as={Ionicons} 
                    name="heart-outline" 
                    size="sm" 
                    color="gray.500" 
                  /> */}
                </HStack>
              )}
            </Pressable>
          </HStack>

          <Button
            size="sm"
            bg="blue.500"
            rounded="lg"
            shadow={2}
            onPress={handleLerMais}
            _pressed={{ bg: "blue.600" }}
          >
            <Text 
              fontSize="xs" 
              color="white" 
              fontWeight="semibold"
            >
              Ler mais
            </Text>
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}

export default CardNews;