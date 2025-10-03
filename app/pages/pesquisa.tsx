import React, { useState, useEffect } from 'react';
import {
    NativeBaseProvider, Box, VStack, HStack, Text, Input, Icon, Pressable,
    ScrollView, Image, Spinner, Center, extendTheme
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform } from 'react-native';
import Footer from '../components/footer';

const theme = extendTheme({
    colors: {
        primary: {
            700: "#3A74C0",
        },
    },
});

interface Noticia {
    id: number;
    titulo: string;
    descricao: string;
    imagemURL: string;
    categoria: string;
    autor: string;
    dataPublicacao: string;
}

const Pesquisa = () => {
    const [termoPesquisa, setTermoPesquisa] = useState('');
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [noticiasFiltradas, setNoticiasFiltradas] = useState<Noticia[]>([]);
    const [carregando, setCarregando] = useState(true);
    const router = useRouter();

    const API_BASE_URL = 'http://localhost:3000/api';

    useEffect(() => {
        buscarNoticias();
    }, []);

    useEffect(() => {
        filtrarNoticias();
    }, [termoPesquisa, noticias]);

    const buscarNoticias = async () => {
        try {
            setCarregando(true);
            const resposta = await fetch(`${API_BASE_URL}/noticias`);

            if (!resposta.ok) {
                throw new Error('Erro ao carregar notícias');
            }

            const noticiasData = await resposta.json();
            setNoticias(noticiasData);
        } catch (error) {
            console.error('Erro ao buscar notícias:', error);
        } finally {
            setCarregando(false);
        }
    };

    const filtrarNoticias = () => {
        if (!termoPesquisa.trim()) {
            setNoticiasFiltradas(noticias);
            return;
        }

        const termo = termoPesquisa.toLowerCase().trim();
        const filtradas = noticias.filter(noticia =>
            noticia.titulo.toLowerCase().includes(termo) ||
            noticia.descricao.toLowerCase().includes(termo) ||
            noticia.autor.toLowerCase().includes(termo) ||
            noticia.categoria.toLowerCase().includes(termo)
        );

        setNoticiasFiltradas(filtradas);
    };

    const limparPesquisa = () => {
        setTermoPesquisa('');
    };

    const voltar = () => {
        router.back();
    };

    const abrirDetalhes = (id: number) => {
        router.push({
            pathname: '/pages/detalhesNoticias',
            params: { id: id.toString() }
        });
    };

    return (
        <NativeBaseProvider theme={theme}>
            <Box flex={1} bg="primary.700" safeArea>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <Box bg="primary.700" px={5} py={5}>
                        <HStack alignItems="center" space={3}>
                            <Pressable onPress={voltar}>
                                <Icon as={Ionicons} name="arrow-back-outline" size="lg" color="white" />
                            </Pressable>
                            <Text fontSize="lg" fontWeight="bold" color="white" flex={1}>
                                Pesquisar Notícias
                            </Text>
                        </HStack>

                        <Box mt={4}>
                            <Input
                                placeholder="Digite para pesquisar..."
                                value={termoPesquisa}
                                onChangeText={setTermoPesquisa}
                                bg="white"
                                borderRadius="lg"
                                fontSize="md"
                                _focus={{
                                    bg: "white",
                                    borderColor: "primary.700"
                                }}
                                InputLeftElement={
                                    <Icon
                                        as={Ionicons}
                                        name="search"
                                        size="sm"
                                        color="gray.500"
                                        ml={3}
                                    />
                                }
                                InputRightElement={
                                    termoPesquisa ? (
                                        <Pressable onPress={limparPesquisa} mr={3}>
                                            <Icon
                                                as={Ionicons}
                                                name="close-circle"
                                                size="sm"
                                                color="gray.500"
                                            />
                                        </Pressable>
                                    ) : undefined
                                }
                            />
                        </Box>
                    </Box>

                    <Box flex={1} bg="white" roundedTop="3xl" mt={-2}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Box px={5} py={6}>
                                {carregando ? (
                                    <Center py={8}>
                                        <VStack space={3} alignItems="center">
                                            <Spinner size="lg" color="primary.700" />
                                            <Text color="gray.600">Carregando notícias...</Text>
                                        </VStack>
                                    </Center>
                                ) : (
                                    <VStack space={4}>
                                        <HStack justifyContent="space-between" alignItems="center">
                                            <Text fontSize="lg" fontWeight="bold" color="gray.800">
                                                Resultados
                                            </Text>
                                            <Text fontSize="sm" color="gray.500">
                                                {noticiasFiltradas.length} {noticiasFiltradas.length === 1 ? 'item' : 'itens'}
                                            </Text>
                                        </HStack>

                                        {noticiasFiltradas.length === 0 ? (
                                            <Center py={10}>
                                                <VStack space={3} alignItems="center">
                                                    <Icon
                                                        as={Ionicons}
                                                        name="search-outline"
                                                        size="4xl"
                                                        color="gray.400"
                                                    />
                                                    <Text color="gray.500" textAlign="center" fontSize="md">
                                                        {termoPesquisa
                                                            ? 'Nenhuma notícia encontrada para sua pesquisa'
                                                            : 'Digite algo para pesquisar'
                                                        }
                                                    </Text>
                                                    {termoPesquisa && (
                                                        <Text color="gray.400" textAlign="center" fontSize="sm">
                                                            Tente outros termos de pesquisa
                                                        </Text>
                                                    )}
                                                </VStack>
                                            </Center>
                                        ) : (
                                            <VStack space={4}>
                                                {noticiasFiltradas.map((noticia) => (
                                                    <Pressable
                                                        key={noticia.id}
                                                        onPress={() => abrirDetalhes(noticia.id)}
                                                    >
                                                        {({ isPressed }) => (
                                                            <Box
                                                                bg="white"
                                                                rounded="xl"
                                                                shadow={2}
                                                                p={4}
                                                                opacity={isPressed ? 0.8 : 1}
                                                                borderWidth={1}
                                                                borderColor="gray.100"
                                                            >
                                                                <HStack space={3}>
                                                                    <Image
                                                                        source={{ uri: noticia.imagemURL }}
                                                                        alt={noticia.titulo}
                                                                        w={16}
                                                                        h={16}
                                                                        rounded="lg"
                                                                        resizeMode="cover"
                                                                        fallbackSource={{ uri: 'https://via.placeholder.com/80x80?text=Imagem' }}
                                                                    />
                                                                    <VStack flex={1} space={1}>
                                                                        <Text
                                                                            fontSize="md"
                                                                            fontWeight="semibold"
                                                                            color="gray.800"
                                                                            numberOfLines={2}
                                                                        >
                                                                            {noticia.titulo}
                                                                        </Text>
                                                                        <Text
                                                                            fontSize="sm"
                                                                            color="gray.500"
                                                                            numberOfLines={1}
                                                                        >
                                                                            {noticia.autor}
                                                                        </Text>
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
                                                                                {noticia.categoria}
                                                                            </Text>
                                                                        </Box>
                                                                    </VStack>
                                                                </HStack>
                                                            </Box>
                                                        )}
                                                    </Pressable>
                                                ))}
                                            </VStack>
                                        )}
                                    </VStack>
                                )}
                            </Box>
                        </ScrollView>
                    </Box>
                </KeyboardAvoidingView>
            </Box>

            <Footer />
        </NativeBaseProvider>
    );
};

export default Pesquisa;