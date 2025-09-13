// components/NewsCard.tsx
import React from "react";
import { Box, VStack, Text, Image, HStack, Pressable, Icon, Button } from "native-base";
import { Ionicons } from "@expo/vector-icons";

interface NewsCardProps {
  image: string;
  title: string;
  authors: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
}

function CardNews({
  image,
  title,
  authors,
  description,
  likes,
  comments,
  shares,
}: NewsCardProps) {
  return (
    <Box bg="white" rounded="2xl" shadow={3} overflow="hidden">
     
      <Image
        source={{ uri: image }}
        alt={title}
        w="full"
        h={48}
        resizeMode="cover"
      />

      {/* card */}
      <VStack p={5} space={3}>
        <Text fontSize="lg" fontWeight="bold" color="gray.800" lineHeight="sm">
          {title}
        </Text>

        <Text fontSize="sm" color="blue.600" fontWeight="semibold">
          {authors}
        </Text>

        <Text fontSize="sm" color="gray.600" lineHeight="sm">
          {description}
        </Text>

        <HStack justifyContent="space-between" alignItems="center" mt={3}>
          <HStack space={5} alignItems="center">
            <Pressable>
              {({ isPressed }) => (
                <HStack alignItems="center" space={1} opacity={isPressed ? 0.7 : 1}>
                  <Icon as={Ionicons} name="heart-outline" size="sm" color="gray.500" />
                  <Text fontSize="xs" color="gray.500" fontWeight="medium">{likes}</Text>
                </HStack>
              )}
            </Pressable>

            <Pressable>
              {({ isPressed }) => (
                <HStack alignItems="center" space={1} opacity={isPressed ? 0.7 : 1}>
                  <Icon as={Ionicons} name="chatbubble-outline" size="sm" color="gray.500" />
                  <Text fontSize="xs" color="gray.500" fontWeight="medium">{comments}</Text>
                </HStack>
              )}
            </Pressable>

            <Pressable>
              {({ isPressed }) => (
                <HStack alignItems="center" space={1} opacity={isPressed ? 0.7 : 1}>
                  <Icon as={Ionicons} name="share-outline" size="sm" color="gray.500" />
                  <Text fontSize="xs" color="gray.500" fontWeight="medium">{shares}</Text>
                </HStack>
              )}
            </Pressable>
          </HStack>

          <Button size="sm" bg="blue.500" rounded="lg" shadow={2}>
            <Text fontSize="xs" color="white" fontWeight="semibold">
              Ler mais
            </Text>
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}

export default CardNews