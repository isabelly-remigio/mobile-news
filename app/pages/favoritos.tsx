import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { router } from 'expo-router';
import {
  NativeBaseProvider,
  Box,
  HStack,
  Text,
  Image,
  Button,
  Icon,
  Center,
  Pressable,
  extendTheme,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import Footer from '../components/footer';

interface FavoriteItem {
  id: number;
  image: string;
  title: string;
}

// Tema customizado
const theme = extendTheme({
  colors: {
    primary: {
      700: "#3A74C0",
    },
  },
});

const Favoritos = () => {
  // Estado dos favoritos com tipo definido
  const [favorito, setFavorito] = useState<FavoriteItem[]>([

    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=200&fit=crop',
      title: 'Garmin watches exploding prices and popularity',
    }
  ]);

  // Remover item dos favoritos com tipo definido
  const removeFavorite = (id: number) => {
    setFavorito(favorito.filter(item => item.id !== id));
  };


  // Renderizar cada item do grid com tipo definido
  const renderFavoriteItem = ({ item }: { item: FavoriteItem }) => (
    <Box flex={1} maxW="50%" p={2}>
      <Pressable onPress={() => console.log(`Abrir notícia ${item.id}`)}>
        {({ isPressed }) => (
          <Box
            bg="white"
            rounded="xl"
            shadow={2}
            overflow="hidden"
            opacity={isPressed ? 0.8 : 1}
            position="relative"
          >
            {/* Imagem */}
            <Image
              source={{ uri: item.image }}
              alt={item.title}
              w="full"
              h={32}
              resizeMode="cover"
            />

            {/* Título */}
            <Box p={3} pb={10}>
              <Text
                fontSize="sm"
                fontWeight="medium"
                color="gray.800"
                numberOfLines={2}
                lineHeight="sm"
              >
                {item.title}
              </Text>
            </Box>

            <Box position="absolute" bottom={2} right={2}>
              <Pressable onPress={() => removeFavorite(item.id)}>
                {({ isPressed: heartPressed }) => (
                  <Box
                    bg="white"
                    rounded="full"
                    p={1}
                    shadow={2}
                    opacity={heartPressed ? 0.7 : 1}
                  >
                    <Icon
                      as={Ionicons}
                      name="heart"
                      size="sm"
                      color="red.500"
                    />
                  </Box>
                )}
              </Pressable>
            </Box>
          </Box>
        )}
      </Pressable>
    </Box>
  );

  // Estado vazio
  const EmptyState = () => (
    <Center flex={1} px={8}>
      <Icon
        as={Ionicons}
        name="heart-outline"
        size="6xl"
        color="gray.300"
        mb={4}
      />
      <Text
        fontSize="lg"
        color="gray.500"
        textAlign="center"
        mb={6}
        lineHeight="md"
      >
        Você ainda não salvou nenhuma notícia.
      </Text>
      <Button
        bg="blue.500"
        rounded="lg"
        px={8}
        _pressed={{ bg: "blue.600" }}
        onPress={() => router.push("/pages/home")}

      >
        <Text fontSize="md" color="white" fontWeight="semibold">
          Explorar notícias
        </Text>
      </Button>
    </Center>
  );

  return (
    <NativeBaseProvider theme={theme}>

      <Box flex={1} bg="white" safeArea>
        <Box bg="primary.700" px={5} py={5}>
          <HStack alignItems="center" justifyContent="space-between">
            <Box flex={1}>
              <Pressable >
                {({ isPressed }) => (
                  <Icon
                    as={Ionicons}
                    name="chevron-back-outline"
                    size="lg"
                    color="white"
                    opacity={isPressed ? 0.7 : 1}
                  />
                )}
              </Pressable>
            </Box>

            {/* Título centralizado */}
            <Text fontSize="lg" fontWeight="bold" color="white">
              Favoritos
            </Text>

            {/* Espaço vazio no lado direito para manter o balanceamento */}
            <Box flex={1} />
          </HStack>
        </Box>

        {/* Card Branco Sobreposto */}
        <Box
          flex={1}
          bg="white"
          roundedTop="3xl"
          shadow={4}
          mt={-2}
        >
          {favorito.length === 0 ? (
            <EmptyState />
          ) : (
            <Box flex={1} px={2} py={4}>
              <FlatList
                data={favorito}
                renderItem={renderFavoriteItem}
                keyExtractor={(item: FavoriteItem) => item.id.toString()}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
                key="grid"
              />
            </Box>
          )}
        </Box>

        <Footer />
      </Box>
    </NativeBaseProvider>
  );
};

export default Favoritos;