import React, { useState, useRef, useEffect } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import {
    NativeBaseProvider, Box, VStack, HStack, Text, Button,
    Icon, Center, Pressable, AlertDialog,Spinner, extendTheme
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalEditarNoticia from './editarNews';
import ListaNoticias from '@/app/components/listaNoticiasAdmin';

const theme = extendTheme({
    colors: {
        primary: {
            700: "#3A74C0",
        },
    },
});

interface Noticia {
    id: number;
    imagemURL: string;
    titulo: string;
    autores: string;
    descricao?: string;
    categoria?: string;
    link?: string;
}

const API_BASE_URL = 'http://localhost:3000/api';

const TelaAdmin = () => {
    const [mostrarAlertaExcluir, setMostrarAlertaExcluir] = useState(false);
    const [noticiaParaExcluir, setNoticiaParaExcluir] = useState<Noticia | null>(null);
    const [listaNoticias, setListaNoticias] = useState<Noticia[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [excluindo, setExcluindo] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [verificandoAuth, setVerificandoAuth] = useState(true);
    const [modalVisivel, setModalVisivel] = useState(false);
    const [noticiaSelecionada, setNoticiaSelecionada] = useState<Noticia | null>(null);
    const cancelarRef = useRef(null);

    useEffect(() => {
        verificarAutenticacao();
    }, []);

    const verificarAutenticacao = async () => {
        try {
            setVerificandoAuth(true);
            const userToken = await AsyncStorage.getItem('userToken');

            if (!userToken) {
                Alert.alert('Acesso Negado', 'Você precisa fazer login como administrador.');
                router.replace('/pages/login');
                return;
            }

            const resposta = await fetch(`${API_BASE_URL}/usuarios/perfil`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (resposta.status === 401) {
                await AsyncStorage.removeItem('userToken');
                await AsyncStorage.removeItem('loginTime');
                Alert.alert('Sessão Expirada', 'Faça login novamente.');
                router.replace('/pages/login');
                return;
            }

            if (!resposta.ok) throw new Error('Erro ao verificar autenticação');

            const dadosUsuario = await resposta.json();

            if (!dadosUsuario.isAdmin) {
                await AsyncStorage.removeItem('userToken');
                await AsyncStorage.removeItem('loginTime');
                Alert.alert('Acesso Negado', 'Apenas administradores podem acessar esta área');
                router.replace('/pages/home');
                return;
            }

            setToken(userToken);
            await buscarNoticias(userToken);

        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            router.replace('/pages/login');
        } finally {
            setVerificandoAuth(false);
        }
    };

    const getAuthHeaders = (authToken?: string) => {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        const currentToken = authToken || token;
        if (currentToken) {
            headers['Authorization'] = `Bearer ${currentToken}`;
        }

        return headers;
    };

    const buscarNoticias = async (authToken?: string) => {
        try {
            setCarregando(true);
            const response = await fetch(`${API_BASE_URL}/noticias`, {
                headers: getAuthHeaders(authToken)
            });

            if (response.status === 401) {
                await AsyncStorage.removeItem('userToken');
                await AsyncStorage.removeItem('loginTime');
                setToken(null);
                Alert.alert('Sessão Expirada', 'Por favor, faça login novamente.');
                router.replace('/pages/login');
                return;
            }

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }

            const noticias = await response.json();
            setListaNoticias(noticias);
        } catch (error) {
            console.error('Erro ao buscar notícias:', error);
            if (!error.message.includes('401')) {
                Alert.alert('Erro', 'Não foi possível carregar as notícias. Verifique a conexão com o servidor.');
            }
        } finally {
            setCarregando(false);
        }
    };

    const editarNoticia = (noticia: Noticia) => {
        setNoticiaSelecionada(noticia);
        setModalVisivel(true);
    };

    const handleSalvarNoticia = (noticiaAtualizada: any) => {
        setListaNoticias(prev => 
            prev.map(item => 
                item.id === noticiaAtualizada.id 
                    ? { ...item, ...noticiaAtualizada }
                    : item
            )
        );
        buscarNoticias();
    };

    const confirmarExclusao = (item: Noticia) => {
        if (!token) {
            Alert.alert('Erro', 'Você precisa estar autenticado para excluir notícias.');
            return;
        }
        setNoticiaParaExcluir(item);
        setMostrarAlertaExcluir(true);
    };

    const excluirNoticia = async () => {
        if (!noticiaParaExcluir || !token) return;

        try {
            setExcluindo(true);
            const response = await fetch(`${API_BASE_URL}/noticias/${noticiaParaExcluir.id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });

            if (response.status === 401) {
                await AsyncStorage.removeItem('userToken');
                await AsyncStorage.removeItem('loginTime');
                setToken(null);
                setMostrarAlertaExcluir(false);
                Alert.alert('Sessão Expirada', 'Por favor, faça login novamente.');
                router.replace('/pages/login');
                return;
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Erro ${response.status}: ${response.statusText}`);
            }

            setListaNoticias(listaNoticias.filter(item => item.id !== noticiaParaExcluir.id));
            Alert.alert('Sucesso', 'Notícia excluída com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir notícia:', error);
            Alert.alert('Erro', error instanceof Error ? error.message : 'Não foi possível excluir a notícia. Tente novamente.');
        } finally {
            setExcluindo(false);
            setMostrarAlertaExcluir(false);
            setNoticiaParaExcluir(null);
        }
    };

    const adicionarNoticia = () => {
        if (!token) {
            Alert.alert('Erro', 'Você precisa estar autenticado para adicionar notícias.');
            return;
        }
        router.push("/pages/admin/cadastroNews");
    };

    const sairSistema = async () => {
        try {
            await AsyncStorage.multiRemove(['userToken', 'loginTime', 'userData']);
            setToken(null);
            router.replace('/pages/login');
        } catch (error) {
            console.error('Erro no logout:', error);
            router.replace('/pages/login');
        }
    };

    if (verificandoAuth) {
        return (
            <NativeBaseProvider theme={theme}>
                <Box flex={1} bg="primary.700" safeArea>
                    <Center flex={1}>
                        <VStack space={4} alignItems="center">
                            <Spinner size="lg" color="white" />
                            <Text color="white">Verificando autenticação...</Text>
                        </VStack>
                    </Center>
                </Box>
            </NativeBaseProvider>
        );
    }

    if (!token) {
        return (
            <NativeBaseProvider theme={theme}>
                <Box flex={1} bg="primary.700" safeArea>
                    <Center flex={1} px={5}>
                        <VStack space={4} alignItems="center">
                            <Icon as={Ionicons} name="log-out-outline" size="4xl" color="white" />
                            <Text color="white" fontSize="lg" textAlign="center">
                                Acesso não autorizado
                            </Text>
                            <Button onPress={() => router.replace('/pages/login')} mt={4}>
                                Ir para Login
                            </Button>
                        </VStack>
                    </Center>
                </Box>
            </NativeBaseProvider>
        );
    }

    return (
            <NativeBaseProvider theme={theme}>
            <Box flex={1} bg="primary.700" safeArea>
                <Box bg="primary.700" px={5} py={6}>
                    <HStack alignItems="center" justifyContent="space-between">
                        <Pressable onPress={() => buscarNoticias()} hitSlop={10}>
                            <Icon as={Ionicons} name="refresh-outline" size="lg" color="white" />
                        </Pressable>

                        <Text fontSize="xl" fontWeight="bold" color="white">
                            Administração
                        </Text>

                        <Pressable onPress={sairSistema} hitSlop={10}>
                            <Icon as={Ionicons} name="log-out-outline" size="lg" color="white" />
                        </Pressable>
                    </HStack>
                </Box>

                <Box flex={1} bg="gray.50" roundedTop="3xl" shadow={4} mt={-2}>
                    <VStack flex={1} px={5} py={6} space={4}>
                        <ListaNoticias
                            noticias={listaNoticias}
                            carregando={carregando}
                            onRefresh={() => buscarNoticias()}
                            onEdit={editarNoticia}
                            onDelete={confirmarExclusao}
                        />
                    </VStack>
                </Box>

                <Box bg="white" safeAreaBottom shadow={6}>
                    <HStack bg="white" alignItems="center">
                        <HStack flex={1} alignItems="center" justifyContent="space-around">
                            <Pressable flex={1} alignItems="center" py={3}>
                                <Center>
                                    {/* <Icon as={Ionicons} name="settings" size="md" color="blue.500" />
                                    <Text fontSize="xs" color="blue.500" mt={1} fontWeight="semibold">
                                        Admin
                                    </Text> */}
                                </Center>
                            </Pressable>

                            <Pressable onPress={adicionarNoticia} alignItems="center" py={2} mx={2}>
                                <Center bg="orange.500" w={16} h={16} rounded="full" shadow={3} mt={-8}>
                                    <Icon as={Ionicons} name="add" size="2xl" color="white" />
                                </Center>
                            </Pressable>

                            <Pressable flex={1} alignItems="center" py={3}>
                                <Center>
                                    {/* <Icon as={Ionicons} name="person-outline" size="md" color="gray.400" />
                                    <Text fontSize="xs" color="gray.400" mt={1} fontWeight="medium">
                                        Perfil
                                    </Text> */}
                                </Center>
                            </Pressable>
                        </HStack>
                    </HStack>
                </Box>
            </Box>

            <ModalEditarNoticia 
                visivel={modalVisivel}
                fechar={() => setModalVisivel(false)}
                noticia={noticiaSelecionada}
                aoSalvar={handleSalvarNoticia}
            />

            <AlertDialog
                isOpen={mostrarAlertaExcluir}
                onClose={() => setMostrarAlertaExcluir(false)}
                leastDestructiveRef={cancelarRef}
            >
                <AlertDialog.Content>
                    <AlertDialog.CloseButton />
                    <AlertDialog.Header>Excluir Notícia</AlertDialog.Header>
                    <AlertDialog.Body>
                        Tem certeza que deseja excluir a notícia "{noticiaParaExcluir?.titulo}"? Esta ação não pode ser desfeita.
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