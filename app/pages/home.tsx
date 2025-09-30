import React, { useState, useEffect } from "react";
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
  Spinner,
  Button,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import Footer from "../components/footer";
import CardNews from "../components/cardNews";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tema customizado
const theme = extendTheme({
  colors: {
    primary: {
      700: "#3A74C0",
    },
  },
});

// Interface para Notícia
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

// Interface para Usuário
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

  const API_BASE_URL = 'http://localhost:3000/api';


  const categories = [
    { icon: "newspaper-outline", label: "Notícias", value: "Notícias" },
    { icon: "trending-up", label: "Negócios", value: "Negócios" },
    { icon: "laptop-outline", label: "Tecnologia", value: "Tecnologia" },
    { icon: "american-football-outline", label: "Esportes", value: "Esportes" },
  ];


  useEffect(() => {
    buscarDadosUsuario();
    buscarNoticias();
  }, []);


  useEffect(() => {
    filtrarNoticias();
  }, [categoriaSelecionada, noticias]);

  // Buscar dados do usuário
  const buscarDadosUsuario = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        setErro('Usuário não autenticado');
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
        setErro('Sessão expirada. Faça login novamente.');
        setCarregando(false);
        return;
      }

      if (!resposta.ok) {
        throw new Error('Erro ao buscar dados do usuário');
      }

      const dadosUsuario = await resposta.json();
      setUsuario(dadosUsuario);
      
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      setErro('Erro ao carregar dados do usuário');
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

  // Função para lidar com categoria selecionada
  const handleCategoriaPress = (categoria: string) => {

    if (categoriaSelecionada === categoria) {
      setCategoriaSelecionada(null);
    } else {
      setCategoriaSelecionada(categoria);
    }
  };

  // Função para recarregar
  const recarregar = () => {
    setErro(null);
    setCategoriaSelecionada(null);
    buscarNoticias();
    buscarDadosUsuario();
  };

  
  const gerarCorAvatar = (letra: string) => {
    const cores = [
      "red.500", "orange.500", "yellow.500", "green.500", 
      "teal.500", "blue.500", "cyan.500", "purple.500", "pink.500"
    ];
    const index = letra.charCodeAt(0) % cores.length;
    return cores[index];
  };

  // Tela de loading
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
          {/* Header */}
          <Box bg="primary.700" px={5} py={4}>
            <HStack alignItems="center" space={3}>

              <Avatar
                bg={usuario ? gerarCorAvatar(usuario.nome.charAt(0)) : "gray.500"}
                size="md"
              >
                <Text fontSize="lg" fontWeight="bold" color="white">
                  {usuario ? usuario.nome.charAt(0).toUpperCase() : 'U'}
                </Text>
              </Avatar>
              <VStack flex={1}>
                <Text fontSize="md" fontWeight="semibold" color="white">
                  {usuario ? `Olá, ${usuario.nome}!` : 'Olá, Usuário!'}
                </Text>
                <Text fontSize="sm" color="blue.100">
                  Bem-vindo de volta
                </Text>
              </VStack>
              
            </HStack>

            <Center mt={4}>
              <Text
                fontSize="lg"
                fontWeight="bold"
                color="white"
                textAlign="center"
              >
                Fique por dentro das principais notícias
              </Text>
            </Center>
          </Box>

          <Box bg="white" roundedTop="3xl" shadow={4} mt={-2} minH="full">
           
            {/* Categorias */}
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

            {/* Notícias */}
            <Box px={5} py={2}>

              <Text fontSize="xl" fontWeight="bold" color="gray.800" mb={5}>
                Últimas Notícias
              </Text>

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
      <Footer/>
    </NativeBaseProvider>
  );
};

export default Home;