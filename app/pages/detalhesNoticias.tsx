import React, { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import {
  NativeBaseProvider, Box, VStack, HStack, Text, ScrollView, Image,
  Button, Icon, Pressable, Badge, extendTheme, useToast, Spinner, Center,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { Linking, Alert } from 'react-native';
import Footer from '../components/footer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const theme = extendTheme({
  colors: {
    primary: {
      800: '#0369A1',
    },
  },
});

const API_BASE_URL = 'http://localhost:3000/api';

interface Noticia {
  id: number;
  titulo: string;
  descricao: string;
  conteudo: string;
  imagem: string;
  categoria: string;
  autor: string;
  dataPublicacao: string;
  link?: string; // Adicionei o campo link
}

const DetalhesNoticias = () => {
  const [favorito, setFavorito] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvandoFavorito, setSalvandoFavorito] = useState(false);
  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [verificandoFavorito, setVerificandoFavorito] = useState(true);
  const [erroImagem, setErroImagem] = useState(false);

  const toast = useToast();
  const params = useLocalSearchParams();

  const idNoticia = params.id ? String(params.id) : null;

  useEffect(() => {
    if (idNoticia) {
      carregarNoticia();
      verificarFavorito();
    } else {
      setCarregando(false);
    }
  }, [idNoticia]);

  const mostrarToast = (titulo: string, descricao: string, status: "success" | "error" | "warning" | "info") => {
    toast.show({
      title: titulo,
      description: descricao,
      status: status,
      duration: 3000,
    });
  };

  const carregarNoticia = async () => {
    if (!idNoticia) {
      mostrarToast('Erro', 'ID da notícia não encontrado', 'error');
      return;
    }

    try {
      setCarregando(true);
      setErroImagem(false);

      const resposta = await fetch(`${API_BASE_URL}/noticias/${idNoticia}`);

      if (!resposta.ok) {
        throw new Error(`Erro ${resposta.status}: ${resposta.statusText}`);
      }

      const dadosNoticia = await resposta.json();

      const noticiaComFallback = {
        ...dadosNoticia,
        titulo: dadosNoticia.titulo || 'Título não disponível',
        descricao: dadosNoticia.descricao || 'Descrição não disponível',
        conteudo: dadosNoticia.conteudo || '',
        imagem:  dadosNoticia.imagemURL || '',
        categoria: dadosNoticia.categoria || 'GERAL',
        autor: dadosNoticia.autor || 'Autor não informado',
        dataPublicacao: dadosNoticia.dataPublicacao || new Date().toISOString(),
        link: dadosNoticia.link || '', 
      };

      setNoticia(noticiaComFallback);
    } catch (error) {
      console.error('Erro ao carregar notícia:', error);
      mostrarToast('Erro', 'Não foi possível carregar a notícia', 'error');

      const noticiaFallback: Noticia = {
        id: idNoticia ? parseInt(idNoticia) : 0,
        titulo: 'Notícia não encontrada',
        descricao: 'A notícia solicitada não está disponível no momento.',
        conteudo: 'Tente novamente mais tarde ou verifique se o ID está correto.',
        imagem: '',
        categoria: 'ERRO',
        autor: 'Sistema',
        dataPublicacao: new Date().toISOString(),
        link: '',
      };

      setNoticia(noticiaFallback);
    } finally {
      setCarregando(false);
    }
  };

  const verificarFavorito = async () => {
    if (!idNoticia) return;

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setVerificandoFavorito(false);
        return;
      }

      const resposta = await fetch(`${API_BASE_URL}/usuarios/favoritos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (resposta.ok) {
        const favoritos = await resposta.json();
        const isFavorito = favoritos.some((fav: Noticia) => fav.id === parseInt(idNoticia));
        setFavorito(isFavorito);
      }
    } catch (error) {
      console.error('Erro ao verificar favorito:', error);
    } finally {
      setVerificandoFavorito(false);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!idNoticia) {
      mostrarToast('Erro', 'ID da notícia não encontrado', 'error');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        mostrarToast('Ação Necessária', 'Faça login para favoritar notícias', 'warning');
        router.push('/pages/login');
        return;
      }

      setSalvandoFavorito(true);

      if (favorito) {
        const resposta = await fetch(`${API_BASE_URL}/usuarios/favoritos/${idNoticia}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (resposta.ok) {
          setFavorito(false);
          mostrarToast('Sucesso', 'Notícia removida dos favoritos', 'success');
        } else {
          throw new Error('Erro ao remover dos favoritos');
        }
      } else {
        const resposta = await fetch(`${API_BASE_URL}/usuarios/favoritos/${idNoticia}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (resposta.ok) {
          setFavorito(true);
          mostrarToast('Sucesso', 'Notícia adicionada aos favoritos', 'success');
        } else {
          throw new Error('Erro ao favoritar - ' + resposta.status);
        }
      }
    } catch (error) {
      console.error('Erro ao favoritar:', error);
      mostrarToast('Erro', error instanceof Error ? error.message : 'Erro ao processar favorito', 'error');
    } finally {
      setSalvandoFavorito(false);
    }
  };

  const handleErroImagem = () => {
    setErroImagem(true);
  };

  const abrirNoticiaCompleta = async () => {
    if (!noticia?.link) {
      mostrarToast('Informação', 'Link da notícia não disponível', 'info');
      return;
    }

    try {
      const podeAbrir = await Linking.canOpenURL(noticia.link);

      if (podeAbrir) {
        await Linking.openURL(noticia.link);
      } else {
        Alert.alert(
          'Erro',
          'Não foi possível abrir o link da notícia',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Erro ao abrir link:', error);
      mostrarToast('Erro', 'Não foi possível abrir a notícia completa', 'error');
    }
  };

  if (carregando) {
    return (
      <NativeBaseProvider theme={theme}>
        <Box flex={1} bg="white" safeArea>
          <Center flex={1}>
            <VStack space={4} alignItems="center">
              <Spinner size="lg" color="primary.800" />
              <Text color="gray.600">Carregando notícia...</Text>
            </VStack>
          </Center>
        </Box>
      </NativeBaseProvider>
    );
  }

  if (!noticia) {
    return (
      <NativeBaseProvider theme={theme}>
        <Box flex={1} bg="white" safeArea>
          <Center flex={1}>
            <VStack space={4} alignItems="center">
              <Icon as={Ionicons} name="alert-circle-outline" size="2xl" color="red.500" />
              <Text color="gray.600">Notícia não encontrada</Text>
              <Button onPress={() => router.back()} bg="primary.800">
                <Text color="white">Voltar</Text>
              </Button>
            </VStack>
          </Center>
        </Box>
      </NativeBaseProvider>
    );
  }

  return (
    <NativeBaseProvider theme={theme}>
      <Box flex={1} bg="white" safeArea>
        <HStack justifyContent="flex-start" alignItems="center" px={4} py={3}>
          <Pressable onPress={() => router.back()}>
            {({ isPressed }) => (
              <Icon
                as={Ionicons}
                name="chevron-back-outline"
                size="lg"
                color="blue.500"
                opacity={isPressed ? 0.7 : 1}
              />
            )}
          </Pressable>
        </HStack>

        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <Box px={4} mb={4} position="relative">
            {erroImagem || !noticia.imagem ? (
              <Center w="full" h={64} bg="gray.200" rounded="md">
                <VStack space={2} alignItems="center">
                  <Icon as={Ionicons} name="image-outline" size="2xl" color="gray.400" />
                  <Text color="gray.500" fontSize="sm">Imagem não disponível</Text>
                </VStack>
              </Center>
            ) : (
              <Image
                source={{ uri: noticia.imagem }}
                alt={noticia.titulo}
                w="full"
                h={64}
                rounded="md"
                resizeMode="cover"
                onError={handleErroImagem}
              />
            )}

            <Box position="absolute" bottom={3} right={7}>
              <Pressable
                onPress={handleFavoriteToggle}
                disabled={salvandoFavorito || verificandoFavorito}
              >
                {({ isPressed }) => (
                  <Box
                    bg="white"
                    rounded="full"
                    p={2}
                    shadow={3}
                    opacity={isPressed ? 0.8 : 1}
                  >
                    {verificandoFavorito ? (
                      <Spinner size="sm" color="gray.400" />
                    ) : salvandoFavorito ? (
                      <Spinner size="sm" color="red.500" />
                    ) : (
                      <Icon
                        as={Ionicons}
                        name={favorito ? "heart" : "heart-outline"}
                        size="md"
                        color={favorito ? "red.500" : "gray.400"}
                      />
                    )}
                  </Box>
                )}
              </Pressable>
            </Box>
          </Box>

          <VStack px={4} space={4}>
            <Box alignSelf="flex-start">
              <Badge
                bg={noticia.categoria === 'ERRO' ? 'red.500' : 'primary.800'}
                px={3}
                py={1}
                _text={{ color: "white", fontWeight: "bold", fontSize: "xs" }}
              >
                {noticia.categoria}
              </Badge>
            </Box>

            <Text fontSize="xl" fontWeight="bold" color="gray.800" lineHeight="lg">
              {noticia.titulo}
            </Text>

            <Text fontSize="sm" color="gray.500" lineHeight="sm">
              {noticia.autor}
            </Text>

            <VStack space={3} mt={4}>
              <Text fontSize="md" fontWeight="bold" color="gray.800">
                DESCRIÇÃO
              </Text>
              <Text fontSize="sm" color="gray.600" lineHeight="md">
                {noticia.descricao}
              </Text>
            </VStack>

            {noticia.conteudo && (
              <VStack space={3} mt={4}>
                <Text fontSize="md" fontWeight="bold" color="gray.800">
                  CONTEÚDO COMPLETO
                </Text>
                <Text fontSize="sm" color="gray.600" lineHeight="md">
                  {noticia.conteudo}
                </Text>
              </VStack>
            )}

            {noticia.link && (
              <Box mt={8} mb={6}>
                <Button
                  variant="outline"
                  borderColor="info.700"
                  borderWidth={2}
                  h={12}
                  rounded="lg"
                  _pressed={{ bg: "blue.50" }}
                  onPress={abrirNoticiaCompleta}
                >
                  <Text fontSize="md" color="primary.500" fontWeight="semibold">
                    Notícia Completa
                  </Text>
                </Button>
              </Box>
            )}

            <Box h={4} />
          </VStack>
        </ScrollView>

        <Footer />
      </Box>
    </NativeBaseProvider>
  );
};

export default DetalhesNoticias;