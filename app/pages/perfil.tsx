import React, { useState, useEffect } from 'react';
import {
    NativeBaseProvider,
    Box,
    VStack,
    HStack,
    Text,
    Avatar,
    ScrollView,
    Input,
    Button,
    Icon,
    Pressable,
    extendTheme,
    Spinner,
    Center,
    useToast,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAvoidingView, Platform, Alert } from 'react-native';
import Footer from '../components/footer';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const theme = extendTheme({
    colors: {
        primary: { 700: '#3A74C0' },
    },
});

interface Usuario {
    id: number;
    nome: string;
    email: string;
    isAdmin: boolean;
}

const PerfilUsuario = () => {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [showSenha, setShowSenha] = useState(false);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [modoEdicao, setModoEdicao] = useState(false);

    const toast = useToast();
    const API_BASE_URL = 'http://localhost:3000/api';

    useEffect(() => {
        buscarDadosUsuario();
    }, []);

    const mostrarToast = (titulo: string, descricao: string, status: "success" | "error" | "warning" | "info") => {
        toast.show({
            title: titulo,
            description: descricao,
            status: status,
            duration: 3000,
        });
    };

    const buscarDadosUsuario = async () => {
        try {
            setCarregando(true);
            const token = await AsyncStorage.getItem('userToken');
            
            if (!token) {
                mostrarToast('Acesso Negado', 'Faça login para acessar o perfil', 'warning');
                router.replace('/pages/login');
                return;
            }

            const resposta = await fetch(`${API_BASE_URL}/usuarios/perfil`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (resposta.status === 401) {
                await limparSessao();
                mostrarToast('Sessão Expirada', 'Faça login novamente', 'warning');
                router.replace('/pages/login');
                return;
            }

            if (!resposta.ok) throw new Error('Erro ao carregar perfil');

            const dadosUsuario = await resposta.json();
            setUsuario(dadosUsuario);
            setNome(dadosUsuario.nome);
            setEmail(dadosUsuario.email);
            
        } catch (error) {
            console.error('Erro:', error);
            mostrarToast('Erro', 'Não foi possível carregar o perfil', 'error');
            router.back();
        } finally {
            setCarregando(false);
        }
    };

    const salvarAlteracoes = async () => {
        // Validações
        if (!nome.trim()) {
            mostrarToast('Erro', 'O nome é obrigatório', 'error');
            return;
        }

        if (!email.trim()) {
            mostrarToast('Erro', 'O email é obrigatório', 'error');
            return;
        }

        if (senha && senha.length < 6) {
            mostrarToast('Erro', 'A senha deve ter pelo menos 6 caracteres', 'error');
            return;
        }

        try {
            setSalvando(true);
            const token = await AsyncStorage.getItem('userToken');
            
            if (!token) {
                mostrarToast('Erro', 'Sessão expirada', 'error');
                router.replace('/pages/login');
                return;
            }

            const dadosAtualizacao: any = {
                nome: nome.trim(),
                email: email.trim().toLowerCase(),
            };

            // Incluir senha apenas se foi preenchida
            if (senha.trim()) {
                dadosAtualizacao.senha = senha;
            }

            const resposta = await fetch(`${API_BASE_URL}/usuarios/perfil`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosAtualizacao),
            });

            if (resposta.status === 401) {
                await limparSessao();
                mostrarToast('Sessão Expirada', 'Faça login novamente', 'warning');
                router.replace('/pages/login');
                return;
            }

            if (!resposta.ok) {
                const erro = await resposta.json();
                throw new Error(erro.error || 'Erro ao salvar alterações');
            }

            // Sucesso
            await resposta.json();
            mostrarToast('Sucesso', 'Perfil atualizado com sucesso!', 'success');
            setModoEdicao(false);
            setSenha('');
            await buscarDadosUsuario();
            
        } catch (error) {
            console.error('Erro ao salvar:', error);
            mostrarToast('Erro', error instanceof Error ? error.message : 'Erro ao salvar alterações', 'error');
        } finally {
            setSalvando(false);
        }
    };

    const limparSessao = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('loginTime');
            await AsyncStorage.removeItem('userData');
        } catch (error) {
            console.error('Erro ao limpar sessão:', error);
        }
    };

    const fazerLogout = async () => {
        Alert.alert(
            "Sair da Conta",
            "Tem certeza que deseja sair?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Sair", 
                    onPress: async () => {
                        try {
                            await limparSessao();
                            console.log('Logout realizado com sucesso');
                            // CORREÇÃO: Usar navigate em vez de replace para garantir a navegação
                            router.navigate('/pages/home');
                        } catch (error) {
                            console.error('Erro no logout:', error);
                            router.navigate('/pages/home');
                        }
                    }
                }
            ]
        );
    };

    const voltarParaHome = () => {
        // CORREÇÃO: Navegação mais direta para home
        router.navigate('/pages/home');
    };

    const cancelarEdicao = () => {
        // Restaurar valores originais
        if (usuario) {
            setNome(usuario.nome);
            setEmail(usuario.email);
        }
        setSenha('');
        setModoEdicao(false);
    };

    const gerarCorAvatar = (letra: string) => {
        const cores = ["red.500", "orange.500", "green.500", "teal.500", "blue.500", "purple.500"];
        return cores[letra.charCodeAt(0) % cores.length];
    };

    if (carregando) {
        return (
            <NativeBaseProvider theme={theme}>
                <Box flex={1} bg="primary.700" safeArea>
                    <Center flex={1}>
                        <VStack space={4} alignItems="center">
                            <Spinner size="lg" color="white" />
                            <Text color="white">Carregando perfil...</Text>
                        </VStack>
                    </Center>
                </Box>
                {/* REMOVIDO: Footer durante loading para evitar conflitos */}
            </NativeBaseProvider>
        );
    }

    return (
        <NativeBaseProvider theme={theme}>
            <Box flex={1} bg="primary.700" safeArea>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === "ios" ? "padding" : "height"} 
                    style={{ flex: 1 }}
                >
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Header - CORREÇÃO: Botão voltar navega para home */}
                        <Box bg="primary.700" px={5} py={5}>
                            <HStack alignItems="center" justifyContent="space-between">
                                <Pressable onPress={voltarParaHome}>
                                    <Icon as={Ionicons} name="arrow-back-outline" size="lg" color="white" />
                                </Pressable>
                                <Text fontSize="lg" fontWeight="bold" color="white">
                                    Meu Perfil
                                </Text>
                                <Pressable onPress={fazerLogout}>
                                    <Icon as={Ionicons} name="log-out-outline" size="lg" color="white" />
                                </Pressable>
                            </HStack>
                        </Box>

                        {/* Conteúdo */}
                        <Box bg="white" roundedTop="3xl" shadow={4} mt={-2}>
                            <Box px={5} py={8} alignItems="center">
                                <Avatar 
                                    bg={usuario ? gerarCorAvatar(usuario.nome.charAt(0)) : "gray.500"} 
                                    size="2xl" 
                                    mb={4}
                                >
                                    <Text fontSize="3xl" fontWeight="bold" color="white">
                                        {usuario ? usuario.nome.charAt(0).toUpperCase() : 'U'}
                                    </Text>
                                </Avatar>
                                <Text fontSize="xl" fontWeight="bold" color="gray.800" mb={1}>
                                    {usuario?.nome}
                                </Text>
                                <Text fontSize="sm" color="gray.500" mb={2}>
                                    {usuario?.email}
                                </Text>
                                <Center bg="blue.50" px={3} py={1} rounded="full">
                                    <Text fontSize="xs" color="blue.700" fontWeight="medium">
                                        {usuario?.isAdmin ? 'Administrador' : 'Usuário'}
                                    </Text>
                                </Center>
                            </Box>

                            <Box px={5} pb={8}>
                                <VStack space={4}>
                                    {/* Nome */}
                                    <VStack space={1}>
                                        <Text fontSize="sm" color="gray.600" fontWeight="medium">
                                            Nome
                                        </Text>
                                        <Input
                                            value={nome}
                                            onChangeText={setNome}
                                            bg="gray.50"
                                            borderColor="gray.300"
                                            h={12}
                                            isDisabled={!modoEdicao || salvando}
                                            _focus={{ borderColor: "primary.700", bg: "white" }}
                                        />
                                    </VStack>

                                    {/* Email */}
                                    <VStack space={1}>
                                        <Text fontSize="sm" color="gray.600" fontWeight="medium">
                                            Email
                                        </Text>
                                        <Input
                                            value={email}
                                            onChangeText={setEmail}
                                            bg="gray.50"
                                            borderColor="gray.300"
                                            h={12}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            isDisabled={!modoEdicao || salvando}
                                            _focus={{ borderColor: "primary.700", bg: "white" }}
                                        />
                                    </VStack>

                                    {/* Senha */}
                                    <VStack space={1}>
                                        <Text fontSize="sm" color="gray.600" fontWeight="medium">
                                            Senha {modoEdicao && '(opcional)'}
                                        </Text>
                                        <Input
                                            value={senha}
                                            onChangeText={setSenha}
                                            bg="gray.50"
                                            borderColor="gray.300"
                                            h={12}
                                            type={showSenha ? "text" : "password"}
                                            placeholder={modoEdicao ? "Nova senha (mín. 6 caracteres)" : "••••••••"}
                                            isDisabled={!modoEdicao || salvando}
                                            _focus={{ borderColor: "primary.700", bg: "white" }}
                                            InputRightElement={
                                                modoEdicao && (
                                                    <Pressable onPress={() => setShowSenha(!showSenha)} mr={3}>
                                                        <Icon
                                                            as={Ionicons}
                                                            name={showSenha ? "eye-off-outline" : "eye-outline"}
                                                            size="md"
                                                            color="gray.500"
                                                        />
                                                    </Pressable>
                                                )
                                            }
                                        />
                                        {modoEdicao && (
                                            <Text fontSize="xs" color="gray.500" ml={1}>
                                                Deixe em branco para manter a senha atual
                                            </Text>
                                        )}
                                    </VStack>

                                    {/* Botões */}
                                    {!modoEdicao ? (
                                        <Button 
                                            bg="primary.700" 
                                            h={12} 
                                            mt={6} 
                                            onPress={() => setModoEdicao(true)}
                                            _pressed={{ bg: "primary.800" }}
                                            shadow={2}
                                        >
                                            <Text color="white" fontWeight="bold" fontSize="md">
                                                EDITAR PERFIL
                                            </Text>
                                        </Button>
                                    ) : (
                                        <VStack space={3} mt={6}>
                                            <Button 
                                                bg="green.600" 
                                                h={12} 
                                                onPress={salvarAlteracoes} 
                                                isLoading={salvando}
                                                isLoadingText="SALVANDO..."
                                                _pressed={{ bg: "green.700" }}
                                                shadow={2}
                                            >
                                                <Text color="white" fontWeight="bold" fontSize="md">
                                                    SALVAR ALTERAÇÕES
                                                </Text>
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                borderColor="red.400" 
                                                h={12} 
                                                onPress={cancelarEdicao}
                                                isDisabled={salvando}
                                                _pressed={{ bg: "red.50" }}
                                            >
                                                <Text color="red.500" fontWeight="semibold" fontSize="md">
                                                    CANCELAR
                                                </Text>
                                            </Button>
                                        </VStack>
                                    )}

                                    <Box h={20} />
                                </VStack>
                            </Box>
                        </Box>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Box>
            {/* CORREÇÃO: Footer com navegação controlada */}
            <Footer onHomePress={voltarParaHome} />
        </NativeBaseProvider>
    );
};

export default PerfilUsuario;