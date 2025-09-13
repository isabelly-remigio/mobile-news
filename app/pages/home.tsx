import React from 'react';
import {
    NativeBaseProvider,
    Box,
    VStack,
    HStack,
    Text,
    Avatar,
    ScrollView,
    Image,
    Button,
    Icon,
    Center,
    Pressable,
    extendTheme,
    StatusBar
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';

// Tema customizado
const theme = extendTheme({
    colors: {
        primary: {
            50: '#eff6ff',
            500: '#3b82f6',
            700: '#3A74C0',
        },
    },
});

const Home = () => {
    //dados fakes
    const newsData = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop',
            title: 'Tecnologia revoluciona o mercado brasileiro',
            authors: 'João Silva, Maria Santos',
            description: 'Novas startups brasileiras estão mudando o cenário tecnológico nacional com inovações disruptivas.',
            likes: 42,
            comments: 18,
            shares: 7
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
            title: 'Economia em crescimento surpreende analistas',
            authors: 'Carlos Oliveira',
            description: 'Dados do último trimestre mostram recuperação acima do esperado em diversos setores.',
            likes: 89,
            comments: 34,
            shares: 23
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=400&h=200&fit=crop',
            title: 'Sustentabilidade ganha força no agronegócio',
            authors: 'Ana Costa, Pedro Lima',
            description: 'Práticas sustentáveis se tornam prioridade para produtores rurais em todo o país.',
            likes: 156,
            comments: 67,
            shares: 45
        }
    ];

    const categories = [
        { icon: 'newspaper-outline', label: 'Notícias' },
        { icon: 'trending-up', label: 'Negócios' },
        { icon: 'flask-outline', label: 'Ciência' },
        { icon: 'american-football-outline', label: 'Esportes' }
    ];

    return (
        <NativeBaseProvider theme={theme}>
            <StatusBar backgroundColor="blue.500" barStyle="light-content" />

            <Box flex={1} bg="blue.500" safeArea>

                <ScrollView flex={1} showsVerticalScrollIndicator={false} bg="blue.500">

                    <Box bg="primary.700" px={5} py={4}>
                        <HStack alignItems="center" space={3}>
                            <Avatar bg="cyan.500" source={{
                                uri: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                            }}>
                                TE
                            </Avatar>
                            <VStack flex={1}>
                                <Text fontSize="md" fontWeight="semibold" color="white">
                                    Olá, Rubens!
                                </Text>
                                <Text fontSize="sm" color="blue.100">
                                    Bem-vindo de volta
                                </Text>
                            </VStack>
                        </HStack>

                        <Center mt={4}>
                            <Text fontSize="lg" fontWeight="bold" color="white" textAlign="center">
                                Fique por dentro das principais notícias
                            </Text>
                        </Center>
                    </Box>
                    {/* Card Branco Sobreposto */}
                    <Box
                        bg="white"
                        roundedTop="3xl"
                        shadow={4}
                        mt={-2}
                        minH="full"
                    >
                        {/* Menu de Categorias */}
                        <Box px={5} py={6}>
                            <HStack justifyContent="space-between" alignItems="center">
                                {categories.map((category, index) => (
                                    <Pressable key={index} alignItems="center">
                                        {({ isPressed }) => (
                                            <VStack alignItems="center" opacity={isPressed ? 0.7 : 1}>
                                                <Center
                                                    w={16}
                                                    h={16}
                                                    bg="blue.300"
                                                    rounded="full"
                                                    mb={3}
                                                    shadow={2}
                                                >
                                                    <Icon
                                                        as={Ionicons}
                                                        name={category.icon}
                                                        size="lg"
                                                        color="white"
                                                    />
                                                </Center>
                                                <Text fontSize="xs" color="gray.700" textAlign="center" fontWeight="medium">
                                                    {category.label}
                                                </Text>
                                            </VStack>
                                        )}
                                    </Pressable>
                                ))}
                            </HStack>
                        </Box>

                        {/* Seção de Notícias */}
                        <Box px={5} py={2}>
                            <Text fontSize="xl" fontWeight="bold" color="gray.800" mb={5}>
                                Últimas Notícias
                            </Text>

                            <VStack space={5}>
                                {newsData.map((news) => (
                                    <Box key={news.id} bg="white" rounded="2xl" shadow={3} overflow="hidden">
                                        {/* Imagem */}
                                        <Image
                                            source={{ uri: news.image }}
                                            alt={news.title}
                                            w="full"
                                            h={48}
                                            resizeMode="cover"
                                        />

                                        {/* Conteúdo do Card */}
                                        <VStack p={5} space={3}>
                                            {/* Título */}
                                            <Text fontSize="lg" fontWeight="bold" color="gray.800" lineHeight="sm">
                                                {news.title}
                                            </Text>

                                            {/* Autores */}
                                            <Text fontSize="sm" color="blue.600" fontWeight="semibold">
                                                {news.authors}
                                            </Text>

                                            {/* Descrição */}
                                            <Text fontSize="sm" color="gray.600" lineHeight="sm">
                                                {news.description}
                                            </Text>

                                            {/* Botão e Interações */}
                                            <HStack justifyContent="space-between" alignItems="center" mt={3}>
                                                <HStack space={5} alignItems="center">
                                                    <Pressable>
                                                        {({ isPressed }) => (
                                                            <HStack alignItems="center" space={1} opacity={isPressed ? 0.7 : 1}>
                                                                <Icon as={Ionicons} name="heart-outline" size="sm" color="gray.500" />
                                                                <Text fontSize="xs" color="gray.500" fontWeight="medium">{news.likes}</Text>
                                                            </HStack>
                                                        )}
                                                    </Pressable>

                                                    <Pressable>
                                                        {({ isPressed }) => (
                                                            <HStack alignItems="center" space={1} opacity={isPressed ? 0.7 : 1}>
                                                                <Icon as={Ionicons} name="chatbubble-outline" size="sm" color="gray.500" />
                                                                <Text fontSize="xs" color="gray.500" fontWeight="medium">{news.comments}</Text>
                                                            </HStack>
                                                        )}
                                                    </Pressable>

                                                    <Pressable>
                                                        {({ isPressed }) => (
                                                            <HStack alignItems="center" space={1} opacity={isPressed ? 0.7 : 1}>
                                                                <Icon as={Ionicons} name="share-outline" size="sm" color="gray.500" />
                                                                <Text fontSize="xs" color="gray.500" fontWeight="medium">{news.shares}</Text>
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
                                ))}
                            </VStack>

                            {/* Espaço extra no final */}
                            <Box h={20} />
                        </Box>
                    </Box>
                </ScrollView>

                {/* Bottom Navigation */}
                <Box bg="white" safeAreaBottom shadow={6}>
                    <HStack bg="white" alignItems="center">
                        <HStack flex={1} alignItems="center">
                            {/* Home - Destacado */}
                            <Pressable flex={1} alignItems="center" py={3}>
                                {({ isPressed }) => (
                                    <Center opacity={isPressed ? 0.7 : 1}>
                                        <Icon
                                            as={Ionicons}
                                            name="home"
                                            size="md"
                                            color="blue.500"
                                        />
                                        <Text fontSize="xs" color="blue.500" fontWeight="semibold" mt={1}>
                                            Home
                                        </Text>
                                    </Center>
                                )}
                            </Pressable>

                            {/* Pesquisa */}
                            <Pressable flex={1} alignItems="center" py={3}>
                                {({ isPressed }) => (
                                    <Center opacity={isPressed ? 0.7 : 1}>
                                        <Icon
                                            as={Ionicons}
                                            name="search-outline"
                                            size="md"
                                            color="gray.400"
                                        />
                                        <Text fontSize="xs" color="gray.400" mt={1} fontWeight="medium">
                                            Pesquisa
                                        </Text>
                                    </Center>
                                )}
                            </Pressable>

                            {/* Favoritos */}
                            <Pressable flex={1} alignItems="center" py={3}>
                                {({ isPressed }) => (
                                    <Center opacity={isPressed ? 0.7 : 1}>
                                        <Icon
                                            as={Ionicons}
                                            name="heart-outline"
                                            size="md"
                                            color="gray.400"
                                        />
                                        <Text fontSize="xs" color="gray.400" mt={1} fontWeight="medium">
                                            Favoritos
                                        </Text>
                                    </Center>
                                )}
                            </Pressable>

                            <Pressable flex={1} alignItems="center" py={3}>
                                {({ isPressed }) => (
                                    <Center opacity={isPressed ? 0.7 : 1}>
                                        <Icon
                                            as={Ionicons}
                                            name="person-outline"
                                            size="md"
                                            color="gray.400"
                                        />
                                        <Text fontSize="xs" color="gray.400" mt={1} fontWeight="medium">
                                            Perfil
                                        </Text>
                                    </Center>
                                )}
                            </Pressable>
                        </HStack>
                    </HStack>
                </Box>
            </Box>
        </NativeBaseProvider>
    );
};

export default Home;