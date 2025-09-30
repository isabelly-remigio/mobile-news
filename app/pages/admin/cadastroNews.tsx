import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import {
    NativeBaseProvider,
    Box,
    VStack,
    HStack,
    Text,
    ScrollView,
    Image,
    Input,
    TextArea,
    Button,
    Icon,
    Pressable,
    Select,
    CheckIcon,
    extendTheme,
    Spinner,
    Center
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ADICIONAR IMPORT
import Cadastro from '../cadastro';

// Tema customizado
const theme = extendTheme({
    colors: {
        primary: {
            700: "#3A74C0",
        },
    },
});

// Interface para o formulário
interface DadosFormulario {
    titulo: string;
    imagemURL: string;
    descricao: string;
    autor: string;
    categoria: string;
    link: string;
}

const CadastroNews = () => {
    const [dadosFormulario, setDadosFormulario] = useState<DadosFormulario>({
        titulo: '',
        imagemURL: '',
        descricao: '',
        autor: '',
        categoria: '',
        link: ''
    });

    const [imagemSelecionada, setImagemSelecionada] = useState<string | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [carregandoImagem, setCarregandoImagem] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [verificandoAuth, setVerificandoAuth] = useState(true); // NOVO ESTADO

    // Categorias disponíveis
    const categorias = [
        'Notícias',
        'Negócios',
        'Tecnologia',
        'Esportes',
    ];

    // NOVO: Verificar autenticação ao carregar a tela
    useEffect(() => {
        verificarAutenticacao();
    }, []);

    // NOVO: Função para verificar autenticação
    const verificarAutenticacao = async () => {
        try {
            setVerificandoAuth(true);
            
            // Verificar tempo da sessão (igual na tela admin)
            const loginTime = await AsyncStorage.getItem('loginTime');
            if (!loginTime) {
                await AsyncStorage.removeItem('userToken');
                router.replace('/pages/login');
                return;
            }

            const tempoLogin = parseInt(loginTime);
            const tempoAtual = Date.now();
            const diferenca = tempoAtual - tempoLogin;
            const umaHora = 3600000;

            if (diferenca > umaHora) {
                await AsyncStorage.removeItem('userToken');
                await AsyncStorage.removeItem('loginTime');
                Alert.alert("Sessão Expirada", "Sua sessão expirou. Faça login novamente.");
                router.replace('/pages/login');
                return;
            }

            // Buscar token
            const userToken = await AsyncStorage.getItem('userToken');
            if (!userToken) {
                Alert.alert('Acesso Negado', 'Você precisa fazer login para acessar esta página.');
                router.replace('/pages/login');
                return;
            }

            setToken(userToken);
            
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            Alert.alert('Erro', 'Não foi possível verificar a autenticação.');
            router.replace('/pages/login');
        } finally {
            setVerificandoAuth(false);
        }
    };

    const validarFormulario = () => {
        if (!dadosFormulario.titulo.trim()) {
            Alert.alert('Erro', 'O título da notícia é obrigatório');
            return false;
        }
        if (!dadosFormulario.descricao.trim()) {
            Alert.alert('Erro', 'A descrição da notícia é obrigatória');
            return false;
        }
        if (!dadosFormulario.autor.trim()) {
            Alert.alert('Erro', 'O autor da notícia é obrigatório');
            return false;
        }
        if (!dadosFormulario.categoria) {
            Alert.alert('Erro', 'A categoria da notícia é obrigatória');
            return false;
        }
        if (!dadosFormulario.imagemURL.trim()) {
            Alert.alert('Erro', 'A URL da imagem é obrigatória');
            return false;
        }
        if (!dadosFormulario.link.trim()) {
            Alert.alert('Erro', 'O link da notícia é obrigatório');
            return false;
        }
        return true;
    };

    const salvarNoticia = async () => {
        if (!validarFormulario()) return;

        // NOVO: Verificar se tem token
        if (!token) {
            Alert.alert('Erro', 'Token de autenticação não encontrado. Faça login novamente.');
            router.replace('/pages/login');
            return;
        }

        setCarregando(true);

        try {
            const resposta = await fetch('http://localhost:3000/api/noticias', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    titulo: dadosFormulario.titulo,
                    autor: dadosFormulario.autor,
                    descricao: dadosFormulario.descricao,
                    categoria: dadosFormulario.categoria,
                    link: dadosFormulario.link,
                    imagemURL: dadosFormulario.imagemURL,
                })
            });

            // NOVO: Verificar se token expirou
            if (resposta.status === 401) {
                await AsyncStorage.removeItem('userToken');
                await AsyncStorage.removeItem('loginTime');
                setToken(null);
                Alert.alert('Sessão Expirada', 'Sua sessão expirou. Faça login novamente.');
                router.replace('/pages/login');
                return;
            }

            const dados = await resposta.json();

            if (resposta.ok) {
                Alert.alert('Sucesso', 'Notícia salva com sucesso!', [
                    { 
                        text: 'OK', 
                        onPress: () => router.back() 
                    }
                ]);
            } else {
                Alert.alert('Erro', dados.error || 'Erro ao salvar notícia');
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            Alert.alert('Erro', 'Não foi possível conectar ao servidor. Verifique sua conexão.');
        } finally {
            setCarregando(false);
        }
    };

    const cancelarEdicao = () => {
        Alert.alert('Cancelar', 'Tem certeza que deseja cancelar? Os dados não salvos serão perdidos.', [
            { text: 'Continuar editando', style: 'cancel' },
            { text: 'Cancelar', onPress: () => router.back() }
        ]);
    };

//: Enquanto verifica autenticação
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
                            <Icon as={Ionicons} name="lock-closed" size="4xl" color="white" />
                            <Text color="white" fontSize="lg" textAlign="center">
                                Acesso não autorizado
                            </Text>
                            <Text color="white" textAlign="center">
                                Você precisa fazer login para acessar esta página
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


                <Box bg="primary.700" px={5} py={5}>
                    <HStack alignItems="center" justifyContent="space-between">
                        <Pressable onPress={cancelarEdicao} hitSlop={10}>
                            <Icon as={Ionicons} name="chevron-back-outline" size="lg" color="white" />
                        </Pressable>
                        <Text fontSize="lg" fontWeight="bold" color="white">
                            Cadastrar Notícia
                        </Text>
                        <Pressable onPress={salvarNoticia} hitSlop={10}>
                            <Icon as={Ionicons} name="checkmark-outline" size="lg" color="white" />
                        </Pressable>
                    </HStack>
                </Box>


                <Box flex={1} bg="gray.50" roundedTop="3xl" shadow={4} mt={-2}>
                    <ScrollView flex={1} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                        <Box bg="white" mx={5} my={6} rounded="xl" shadow={2} p={5}>
                            <VStack space={5}>


                                <VStack space={2}>
                                    <Text fontSize="md" fontWeight="semibold" color="gray.700">Título da notícia *</Text>
                                    <Input
                                        placeholder="Digite o título da notícia"
                                        value={dadosFormulario.titulo}
                                        onChangeText={(texto) => setDadosFormulario({ ...dadosFormulario, titulo: texto })}
                                        bg="gray.50"
                                        borderColor="gray.300"
                                        _focus={{ borderColor: "blue.500", bg: "white" }}
                                        fontSize="md"
                                        isDisabled={carregando}
                                    />
                                </VStack>

                                {/* Campo Imagem URL */}
                                <VStack space={2}>
                                    <Text fontSize="md" fontWeight="semibold" color="gray.700">URL da Imagem *</Text>
                                    <Input
                                        placeholder="Cole a URL da imagem"
                                        value={dadosFormulario.imagemURL}
                                        onChangeText={(texto) => setDadosFormulario({ ...dadosFormulario, imagemURL: texto })}
                                        bg="gray.50"
                                        borderColor="gray.300"
                                        _focus={{ borderColor: "blue.500", bg: "white" }}
                                        fontSize="md"
                                        isDisabled={carregando}
                                    />

                                    {dadosFormulario.imagemURL ? (
                                        <Image
                                            source={{ uri: dadosFormulario.imagemURL }}
                                            alt="Pré-visualização da imagem"
                                            w="full"
                                            h={40}
                                            rounded="lg"
                                            resizeMode="cover"
                                            fallbackSource={{ uri: 'https://via.placeholder.com/400x200?text=Imagem+Carregando...' }}
                                        />
                                    ) : null}
                                </VStack>

                                {/* Campo Descrição */}
                                <VStack space={2}>
                                    <Text fontSize="md" fontWeight="semibold" color="gray.700">Descrição *</Text>
                                    <TextArea
                                        placeholder="Digite a descrição completa da notícia"
                                        value={dadosFormulario.descricao}
                                        onChangeText={(texto) => setDadosFormulario({ ...dadosFormulario, descricao: texto })}
                                        h={32}
                                        autoCompleteType={undefined}
                                        bg="gray.50"
                                        borderColor="gray.300"
                                        _focus={{ borderColor: "blue.500", bg: "white" }}
                                        fontSize="md"
                                        isDisabled={carregando}
                                    />
                                </VStack>

                                {/* Campo Autor */}
                                <VStack space={2}>
                                    <Text fontSize="md" fontWeight="semibold" color="gray.700">Autor *</Text>
                                    <Input
                                        placeholder="Digite o nome do autor"
                                        value={dadosFormulario.autor}
                                        onChangeText={(texto) => setDadosFormulario({ ...dadosFormulario, autor: texto })}
                                        bg="gray.50"
                                        borderColor="gray.300"
                                        _focus={{ borderColor: "blue.500", bg: "white" }}
                                        fontSize="md"
                                        isDisabled={carregando}
                                    />
                                </VStack>

                                {/* Campo Link */}
                                <VStack space={2}>
                                    <Text fontSize="md" fontWeight="semibold" color="gray.700">Link da Notícia *</Text>
                                    <Input
                                        placeholder="Cole o link da notícia"
                                        value={dadosFormulario.link}
                                        onChangeText={(texto) => setDadosFormulario({ ...dadosFormulario, link: texto })}
                                        bg="gray.50"
                                        borderColor="gray.300"
                                        _focus={{ borderColor: "blue.500", bg: "white" }}
                                        fontSize="md"
                                        isDisabled={carregando}
                                    />
                                </VStack>

                                {/* Campo Categoria */}
                                <VStack space={2}>
                                    <Text fontSize="md" fontWeight="semibold" color="gray.700">Categoria *</Text>
                                    <Select
                                        selectedValue={dadosFormulario.categoria}
                                        placeholder="Selecione a categoria"
                                        onValueChange={(valor) => setDadosFormulario({ ...dadosFormulario, categoria: valor })}
                                        bg="gray.50"
                                        borderColor="gray.300"
                                        _selectedItem={{
                                            bg: "blue.100",
                                            endIcon: <CheckIcon size="5" />
                                        }}
                                        isDisabled={carregando}
                                    >
                                        {categorias.map((categoria, indice) => (
                                            <Select.Item key={indice} label={categoria} value={categoria} />
                                        ))}
                                    </Select>
                                </VStack>
                            </VStack>
                        </Box>

                        {/* Botões de Ação */}
                        <VStack space={3} mx={5} mb={6}>
                            <Button
                                bg="orange.500"
                                h={12}
                                rounded="lg"
                                shadow={2}
                                onPress={salvarNoticia}
                                _pressed={{ bg: "orange.600" }}
                                isLoading={carregando}
                                isLoadingText="Salvando..."
                            >
                                <Text fontSize="md" color="white" fontWeight="bold">Salvar Notícia</Text>
                            </Button>

                            <Button
                                variant="outline"
                                borderColor="blue.500"
                                h={12}
                                rounded="lg"
                                onPress={cancelarEdicao}
                                _pressed={{ bg: "blue.50" }}
                                isDisabled={carregando}
                            >
                                <Text fontSize="md" color="blue.500" fontWeight="semibold">Cancelar</Text>
                            </Button>
                        </VStack>
                    </ScrollView>
                </Box>
            </Box>
        </NativeBaseProvider>
    );
};

export default CadastroNews;