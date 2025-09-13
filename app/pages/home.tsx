import React from 'react';
import {
    NativeBaseProvider,
    Box,
    VStack,
    HStack,
    Text,
    Avatar,
    ScrollView,
    Icon,
    Center,
    Pressable,
    extendTheme,

} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import Footer from "../components/footer"
import CardNews from '../components/cardNews';

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
        { icon: 'laptop-outline', label: 'Tecnologia' },
        { icon: 'american-football-outline', label: 'Esportes' }
    ];

    return (
        <NativeBaseProvider theme={theme}>

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
                    {/* o card branco*/}
                    <Box
                        bg="white"
                        roundedTop="3xl"
                        shadow={4}
                        mt={-2}
                        minH="full"
                    >
                        {/* categoruias */}
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

                        {/* noticias */}
                        <Box px={5} py={2}>
                            <Text fontSize="xl" fontWeight="bold" color="gray.800" mb={5}>
                                Últimas Notícias
                            </Text>
                                {/* card das noticias */}
                            <VStack space={5}>
                                {newsData.map((news) => (
                                    <CardNews
                                        key={news.id}
                                        image={news.image}
                                        title={news.title}
                                        authors={news.authors}
                                        description={news.description}
                                        likes={news.likes}
                                        comments={news.comments}
                                        shares={news.shares}
                                    />
                                ))}
                            </VStack>


                            <Box h={20} />
                        </Box>
                    </Box>
                </ScrollView>
                
                <Footer/>
            </Box>
        </NativeBaseProvider>
    );
};

export default Home;