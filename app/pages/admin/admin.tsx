import React, { useState, useRef } from 'react';
import { FlatList, Alert } from 'react-native';
import { router } from 'expo-router';
import {
    NativeBaseProvider,
    Box,
    VStack,
    HStack,
    Text,
    Image,
    Button,
    Icon,
    Center,
    Pressable,
    extendTheme,
    AlertDialog
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';

// Interfaces TypeScript
interface Noticia {
    id: number;
    imagem: string;
    titulo: string;
    autores: string;
}

// Tema customizado
const theme = extendTheme({
    colors: {
        primary: {
            700: "#3A74C0",
        },
    },
});

const TelaAdmin = () => {
    const [mostrarAlertaExcluir, setMostrarAlertaExcluir] = useState(false);
    const [noticiaParaExcluir, setNoticiaParaExcluir] = useState<Noticia | null>(null);

    // Referência para botão "Cancelar" (obrigatório no AlertDialog)
    const cancelarRef = useRef(null);

    // Lista de notícias mockada
    const [listaNoticias, setListaNoticias] = useState<Noticia[]>([
        {
            id: 1,
            imagem: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&h=150&fit=crop',
            titulo: 'Tecnologia revoluciona o mercado brasileiro',
            autores: 'João Silva, Maria Santos',
        },
        {
            id: 2,
            imagem: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=150&fit=crop',
            titulo: 'Economia em crescimento surpreende analistas',
            autores: 'Carlos Oliveira',
        },
        {
            id: 3,
            imagem: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=200&h=150&fit=crop',
            titulo: 'Sustentabilidade ganha força no agronegócio',
            autores: 'Ana Costa, Pedro Lima',
        },
        {
            id: 4,
            imagem: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=200&h=150&fit=crop',
            titulo: 'Garmin watches exploding prices and popularity',
            autores: 'Michael L Hicks',
        }
    ]);

    const editarNoticia = (id: number) => {
        console.log(`Editar notícia ${id}`);
    };

    const confirmarExclusao = (item: Noticia) => {
        setNoticiaParaExcluir(item);
        setMostrarAlertaExcluir(true);
    };

    const excluirNoticia = () => {
        if (noticiaParaExcluir) {
            setListaNoticias(listaNoticias.filter(item => item.id !== noticiaParaExcluir.id));
            setMostrarAlertaExcluir(false);
            setNoticiaParaExcluir(null);
        }
    };

    const adicionarNoticia = () => {
        console.log('Adicionar nova notícia');
    };

    const sairSistema = () => {
        Alert.alert(
            "Sair",
            "Tem certeza que deseja sair da administração?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Sair", onPress: () => console.log("Logout") }
            ]
        );
    };

    const renderizarNoticia = ({ item }: { item: Noticia }) => (
        <Box bg="white" rounded="xl" shadow={2} mb={3} overflow="hidden">
            <HStack space={3} p={3}>
                {/* Imagem */}
                <Image
                    source={{ uri: item.imagem }}
                    alt={item.titulo}
                    w={20}
                    h={16}
                    rounded="lg"
                    resizeMode="cover"
                />

                {/* Conteúdo */}
                <VStack flex={1} space={1}>
                    <Text fontSize="md" fontWeight="semibold" color="gray.800" numberOfLines={2}>
                        {item.titulo}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                        {item.autores}
                    </Text>
                </VStack>

                {/* Botões de Ação */}
                <VStack space={2}>
                    {/* Botão Editar */}
                    <Pressable onPress={() => editarNoticia(item.id)}>
                        {({ isPressed }) => (
                            <Box
                                bg="blue.50"
                                p={2}
                                rounded="lg"
                                opacity={isPressed ? 0.7 : 1}
                            >
                                <Icon
                                    as={Ionicons}
                                    name="create-outline"
                                    size="sm"
                                    color="blue.500"
                                />
                            </Box>
                        )}
                    </Pressable>

                    {/* Botão Excluir */}
                    <Pressable onPress={() => confirmarExclusao(item)}>
                        {({ isPressed }) => (
                            <Box
                                bg="red.50"
                                p={2}
                                rounded="lg"
                                opacity={isPressed ? 0.7 : 1}
                            >
                                <Icon
                                    as={Ionicons}
                                    name="trash-outline"
                                    size="sm"
                                    color="red.500"
                                />
                            </Box>
                        )}
                    </Pressable>
                </VStack>
            </HStack>
        </Box>
    );

    return (
        <NativeBaseProvider theme={theme}>
            <Box flex={1} bg="primary.700" safeArea>
                {/* Header Azul */}
                <Box bg="primary.700" px={5} py={6}>
                    <HStack alignItems="center" justifyContent="center">
                        {/* Título no centro */}
                        <Text fontSize="xl" fontWeight="bold" color="white">
                            Administração
                        </Text>
                    </HStack>
                </Box>

                {/* Card Branco Sobreposto */}
                <Box
                    flex={1}
                    bg="gray.50"
                    roundedTop="3xl"
                    shadow={4}
                    mt={-2}
                >
                    <VStack flex={1} px={5} py={6} space={4}>
                        {/* Lista de Notícias */}
                        <VStack flex={1} space={2}>
                            <Text fontSize="lg" fontWeight="bold" color="gray.800">
                                Notícias Cadastradas
                            </Text>

                            <Box flex={1}>
                                <FlatList
                                    data={listaNoticias}
                                    renderItem={renderizarNoticia}
                                    keyExtractor={(item) => item.id.toString()}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{ paddingBottom: 20 }}
                                />
                            </Box>
                        </VStack>
                    </VStack>
                </Box>

                {/* Bottom Navigation */}
                <Box bg="white" safeAreaBottom shadow={6}>
                    <HStack bg="white" alignItems="center">
                        <HStack flex={1} alignItems="center" justifyContent="space-around">

                            {/* Admin */}
                            <Pressable flex={1} alignItems="center" py={3}>
                                {({ isPressed }) => (
                                    <Center opacity={isPressed ? 0.7 : 1}>
                                        <Icon as={Ionicons} name="settings" size="md" color="blue.500" />
                                        <Text fontSize="xs" color="blue.500" mt={1} fontWeight="semibold">
                                            Admin
                                        </Text>
                                    </Center>
                                )}
                            </Pressable>
                            {/* Botão Adicionar Notícia (Grande no centro) */}
                            <Pressable
                                onPress={adicionarNoticia}
                                alignItems="center"
                                py={2}
                                mx={2}
                            >
                                {({ isPressed }) => (
                                    <Center
                                        bg="orange.500"
                                        w={16}
                                        h={16}
                                        rounded="full"
                                        shadow={3}
                                        opacity={isPressed ? 0.8 : 1}
                                        mt={-8}
                                    >
                                        <Icon
                                            as={Ionicons}
                                            name="add"
                                            size="2xl"
                                            color="white"
                                            onPress={() => router.push("/pages/admin/cadastroNews")}

                                        />
                                    </Center>
                                )}
                            </Pressable>

                            {/* Perfil */}
                            <Pressable flex={1} alignItems="center" py={3}>
                                {({ isPressed }) => (
                                    <Center opacity={isPressed ? 0.7 : 1}>
                                        <Icon as={Ionicons} name="person-outline" size="md" color="gray.400" />
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

            {/* Modal de Confirmação de Exclusão */}
            <AlertDialog
                isOpen={mostrarAlertaExcluir}
                onClose={() => setMostrarAlertaExcluir(false)}
                leastDestructiveRef={cancelarRef}
            >
                <AlertDialog.Content>
                    <AlertDialog.CloseButton />
                    <AlertDialog.Header>Excluir Notícia</AlertDialog.Header>
                    <AlertDialog.Body>
                        Tem certeza que deseja excluir a notícia "{noticiaParaExcluir?.titulo}"?
                        Esta ação não pode ser desfeita.
                    </AlertDialog.Body>
                    <AlertDialog.Footer>
                        <Button.Group space={2}>
                            <Button
                                variant="unstyled"
                                colorScheme="coolGray"
                                onPress={() => setMostrarAlertaExcluir(false)}
                                ref={cancelarRef}
                            >
                                Cancelar
                            </Button>
                            <Button colorScheme="danger" onPress={excluirNoticia}>
                                Excluir
                            </Button>
                        </Button.Group>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog>
        </NativeBaseProvider>
    );
};

export default TelaAdmin;