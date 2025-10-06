import React, { useState, useEffect } from "react";
import {
  NativeBaseProvider,Box,VStack,HStack,Text,Avatar,ScrollView,Icon,
  Center,Pressable,extendTheme,Spinner,Button,Alert,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import Footer from "../components/footer";
import CardNews from "../components/cardNews";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";

const theme = extendTheme({
  colors: {
    primary: {
      700: "#3A74C0",
    },
  },
});

// Definição de interfaces para tipagem
interface Noticia {
  id: number;
  titulo: string;
  autor: string;
  descricao: string;
  categoria: string;
  link: string;
  imagemURL: string;
  dataPublicacao: string;
}

interface Usuario {
  id: number;
  nome: string;
  email: string;
  isAdmin: boolean;
}

const Home = () => {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [noticiasFiltradas, setNoticiasFiltradas] = useState<Noticia[]>([]);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [carregandoNoticias, setCarregandoNoticias] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
  const [usuarioLogado, setUsuarioLogado] = useState(false);

  const API_BASE_URL = 'http://localhost:3000/api';

//filtragem
  const categories = [
    { icon: "newspaper-outline", label: "Notícias", value: "Notícias" },
    { icon: "trending-up", label: "Negócios", value: "Negócios" },
    { icon: "laptop-outline", label: "Tecnologia", value: "Tecnologia" },
    { icon: "american-football-outline", label: "Esportes", value: "Esportes" },
  ];

  useEffect(() => {
    verificarTipoUsuario();
    buscarNoticias();
  }, []);

  useEffect(() => {
    filtrarNoticias();
  }, [categoriaSelecionada, noticias]);

  const verificarTipoUsuario = async () => {
    try {
      setCarregando(true);
      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        setUsuarioLogado(false);
        setCarregando(false);
        return;
      }

      const resposta = await fetch(`${API_BASE_URL}/usuarios/perfil`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (resposta.status === 401) {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('loginTime');
        setUsuarioLogado(false);
        setCarregando(false);
        return;
      }

      if (!resposta.ok) {
        throw new Error('Erro ao verificar usuário');
      }

      const dadosUsuario = await resposta.json();

      // Redirecionamento de administradores para área administrativa
      if (dadosUsuario.isAdmin) {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('loginTime');
        await AsyncStorage.removeItem('userData');

        Alert.alert(
          'Acesso Restrito',
          'Administradores devem acessar a área administrativa',
          [{ text: 'OK', onPress: () => router.replace('/pages/admin/admin') }]
        );
        return;
      }

      setUsuario(dadosUsuario);
      setUsuarioLogado(true);

    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      setUsuarioLogado(false);
    } finally {
      setCarregando(false);
    }
  };

  const buscarNoticias = async () => {
    try {
      setCarregandoNoticias(true);
      setErro(null);

      const resposta = await fetch(`${API_BASE_URL}/noticias`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!resposta.ok) {
        throw new Error('Erro ao carregar notícias');
      }

      const noticiasData = await resposta.json();
      setNoticias(noticiasData);

    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
      setErro('Não foi possível carregar as notícias. Verifique sua conexão.');
    } finally {
      setCarregandoNoticias(false);
    }
  };

  const filtrarNoticias = () => {
    if (!categoriaSelecionada) {
      setNoticiasFiltradas(noticias);
    } else {
      const filtradas = noticias.filter(noticia =>
        noticia.categoria === categoriaSelecionada
      );
      setNoticiasFiltradas(filtradas);
    }
  };

  const handleCategoriaPress = (categoria: string) => {
    if (categoriaSelecionada === categoria) {
      setCategoriaSelecionada(null);
    } else {
      setCategoriaSelecionada(categoria);
    }
  };

  const recarregar = () => {
    setErro(null);
    setCategoriaSelecionada(null);
    buscarNoticias();
    verificarTipoUsuario();
  };

  const fazerLogin = () => {
    router.push("/pages/login");
  };

//cor dos avatares
  const gerarCorAvatar = (letra: string) => {
    const cores = ["red.500", "orange.500", "green.500", "teal.500", "blue.500", "purple.500"];
    const index = letra.charCodeAt(0) % cores.length;
    return cores[index];
  };

  if (carregando) {
    return (
      <NativeBaseProvider theme={theme}>
        <Box flex={1} bg="primary.700" safeArea>
          <Center flex={1}>
            <VStack space={4} alignItems="center">
              <Spinner size="lg" color="white" />
              <Text color="white">Carregando...</Text>
            </VStack>
          </Center>
        </Box>
      </NativeBaseProvider>
    );
  }

  return (
    <NativeBaseProvider theme={theme}>
      <Box flex={1} bg="white" safeArea>
        <ScrollView flex={1} showsVerticalScrollIndicator={false} bg="primary.700">
          <Box bg="primary.700" px={5} py={4}>
            <HStack alignItems="center" space={3}>
              {usuarioLogado ? (
                <Avatar
                  bg={usuario ? gerarCorAvatar(usuario.nome.charAt(0)) : "gray.500"}
                  size="md"
                >
                  <Text fontSize="lg" fontWeight="bold" color="white">
                    {usuario ? usuario.nome.charAt(0).toUpperCase() : 'U'}
                  </Text>
                </Avatar>
              ) : (
                <Pressable onPress={fazerLogin}>
                  <Avatar bg="gray.400" size="md">
                    <Icon as={Ionicons} name="person-outline" size="sm" color="white" />
                  </Avatar>
                </Pressable>
              )}

              <VStack flex={1}>
                <Text fontSize="md" fontWeight="semibold" color="white">
                  {usuarioLogado
                    ? (usuario ? `Olá, ${usuario.nome}!` : 'Olá, Usuário!')
                    : 'Bem-vindo ao NewsApp!'
                  }
                </Text>
                <Text fontSize="sm" color="blue.100">
                  {usuarioLogado ? 'Bem-vindo de volta' : 'Faça login '}
                </Text>
              </VStack>

              {!usuarioLogado && (
                <Pressable onPress={fazerLogin}>
                  <Center bg="white" px={3} py={1} rounded="full">
                    <Text fontSize="sm" color="primary.700" fontWeight="bold">
                      Login
                    </Text>
                  </Center>
                </Pressable>
              )}
            </HStack>

            <Center mt={4}>
              <Text fontSize="lg" fontWeight="bold" color="white" textAlign="center">
                Fique por dentro das principais notícias
              </Text>
            </Center>
          </Box>

          <Box bg="white" roundedTop="3xl" shadow={4} mt={-2} minH="full">
            <Box px={5} py={6}>
              <HStack justifyContent="space-between" alignItems="center">
                {categories.map((category, index) => (
                  <Pressable
                    key={index}
                    alignItems="center"
                    onPress={() => handleCategoriaPress(category.value)}
                  >
                    {({ isPressed }) => (
                      <VStack alignItems="center" opacity={isPressed ? 0.7 : 1}>
                        <Center
                          w={16}
                          h={16}
                          bg={
                            categoriaSelecionada === category.value
                              ? "primary.700"
                              : "blue.100"
                          }
                          rounded="full"
                          mb={3}
                          shadow={2}
                          borderWidth={2}
                          borderColor={
                            categoriaSelecionada === category.value
                              ? "primary.700"
                              : "transparent"
                          }
                        >
                          <Icon
                            as={Ionicons}
                            name={category.icon}
                            size="lg"
                            color={
                              categoriaSelecionada === category.value
                                ? "white"
                                : "primary.700"
                            }
                          />
                        </Center>
                        <Text
                          fontSize="xs"
                          color={
                            categoriaSelecionada === category.value
                              ? "primary.700"
                              : "gray.600"
                          }
                          textAlign="center"
                          fontWeight={
                            categoriaSelecionada === category.value
                              ? "bold"
                              : "medium"
                          }
                        >
                          {category.label}
                        </Text>
                      </VStack>
                    )}
                  </Pressable>
                ))}
              </HStack>
            </Box>

{/* Seção de notícias */}
            <Box px={5} py={2}>
              <Text fontSize="xl" fontWeight="bold" color="gray.800" mb={5}>
                Últimas Notícias
              </Text>

{/* Banner de incentivo ao login */}
              {!usuarioLogado && (
                <Center bg="blue.50" p={4} rounded="lg" mb={4}>
                  <HStack space={3} alignItems="center">
                    <Icon as={Ionicons} name="information-circle" size="sm" color="blue.600" />
                    <VStack flex={1}>
                      <Text fontSize="sm" color="blue.800" fontWeight="medium">
                        Faça login para salvar suas notícias favoritas
                      </Text>
                    </VStack>
                    <Pressable onPress={fazerLogin}>
                      <Text fontSize="sm" color="blue.600" fontWeight="bold">
                        Login
                      </Text>
                    </Pressable>
                  </HStack>
                </Center>
              )}

              {erro && (
                <Center py={8}>
                  <VStack space={3} alignItems="center">
                    <Icon as={Ionicons} name="warning-outline" size="4xl" color="red.500" />
                    <Text color="red.500" textAlign="center" fontSize="md">
                      {erro}
                    </Text>
                    <Button
                      variant="outline"
                      onPress={recarregar}
                      leftIcon={<Icon as={Ionicons} name="refresh" />}
                    >
                      Tentar Novamente
                    </Button>
                  </VStack>
                </Center>
              )}

              {carregandoNoticias && !erro && (
                <Center py={8}>
                  <VStack space={3} alignItems="center">
                    <Spinner size="lg" color="primary.700" />
                    <Text color="gray.600">Carregando notícias...</Text>
                  </VStack>
                </Center>
              )}

              {!carregandoNoticias && !erro && (
                <VStack space={5}>
                  {noticiasFiltradas.length > 0 ? (
                    noticiasFiltradas.map((noticia) => (
                      <CardNews
                        key={noticia.id}
                        id={noticia.id}
                        image={noticia.imagemURL}
                        title={noticia.titulo}
                        authors={noticia.autor}
                        description={noticia.descricao}
                        categoria={noticia.categoria}
                      />
                    ))
                  ) : (
                    <Center py={10}>
                      <VStack space={3} alignItems="center">
                        <Icon as={Ionicons} name="newspaper-outline" size="4xl" color="gray.400" />
                        <Text color="gray.500" textAlign="center" fontSize="md">
                          Nenhuma notícia disponível no momento
                        </Text>
                        <Button
                          variant="outline"
                          onPress={recarregar}
                          leftIcon={<Icon as={Ionicons} name="refresh" />}
                        >
                          Recarregar
                        </Button>
                      </VStack>
                    </Center>
                  )}
                </VStack>
              )}

              <Box h={20} />
            </Box>
          </Box>
        </ScrollView>
      </Box>
      <Footer />
    </NativeBaseProvider>
  );
};

export default Home;