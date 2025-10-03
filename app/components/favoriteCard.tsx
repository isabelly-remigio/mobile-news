import React from 'react';
import { Box, Text, Image, Pressable, Icon, Center, Spinner } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

export interface FavoriteItem {
  id: number;
  titulo: string;
  descricao: string;
  imagemURL: string;
  categoria: string;
  autor: string;
  dataPublicacao: string;
}

interface FavoriteCardProps {
  item: FavoriteItem;
  removendo: number | null;
  onRemove: (id: number, titulo: string) => void;
  onPress: (noticia: FavoriteItem) => void;
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({ 
  item, 
  removendo, 
  onRemove, 
  onPress 
}) => {
  return (
    <Box flex={1} maxW="50%" p={2}>
      <Pressable onPress={() => onPress(item)}>
        {({ isPressed }) => (
          <Box
            bg="white"
            rounded="xl"
            shadow={2}
            overflow="hidden"
            opacity={isPressed ? 0.8 : 1}
            position="relative"
            borderWidth={1}
            borderColor="gray.100"
          >
            {item.imagemURL ? (
              <Image
                source={{ uri: item.imagemURL }}
                alt={item.titulo}
                w="full"
                h={32}
                resizeMode="cover"
                fallbackElement={
                  <Center w="full" h={32} bg="gray.200">
                    <Icon as={Ionicons} name="image-outline" size="lg" color="gray.400" />
                  </Center>
                }
              />
            ) : (
              <Center w="full" h={32} bg="gray.200">
                <Icon as={Ionicons} name="image-outline" size="lg" color="gray.400" />
              </Center>
            )}

            <Box position="absolute" top={2} left={2}>
              <Box 
                bg="primary.700" 
                px={2} 
                py={1} 
                rounded="md"
              >
                <Text fontSize="xs" color="white" fontWeight="bold">
                  {item.categoria || 'GERAL'}
                </Text>
              </Box>
            </Box>

            <Box p={3} pb={10}>
              <Text
                fontSize="sm"
                fontWeight="medium"
                color="gray.800"
                numberOfLines={2}
                lineHeight="sm"
                mb={1}
              >
                {item.titulo}
              </Text>
              <Text
                fontSize="xs"
                color="gray.500"
                numberOfLines={1}
              >
                {item.autor}
              </Text>
            </Box>

            <Box position="absolute" bottom={2} right={2}>
              <Pressable 
                onPress={() => onRemove(item.id, item.titulo)}
                disabled={removendo === item.id}
              >
                {({ isPressed: heartPressed }) => (
                  <Box
                    bg="white"
                    rounded="full"
                    p={1}
                    shadow={2}
                    opacity={heartPressed ? 0.7 : 1}
                  >
                    {removendo === item.id ? (
                      <Spinner size="sm" color="red.500" />
                    ) : (
                      <Icon
                        as={Ionicons}
                        name="heart"
                        size="sm"
                        color="red.500"
                      />
                    )}
                  </Box>
                )}
              </Pressable>
            </Box>
          </Box>
        )}
      </Pressable>
    </Box>
  );
};

export default FavoriteCard;