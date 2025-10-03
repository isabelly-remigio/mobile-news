import React, { useState, useEffect } from 'react';
import { FlatList, Alert } from 'react-native';
import { router } from 'expo-router';
import { 
  NativeBaseProvider, Box, HStack, Text, Button, Icon, Center, Pressable,
  extendTheme, Spinner, useToast, VStack 
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import Footer from '../components/footer';
import FavoriteCard, { FavoriteItem } from '../components/favoriteCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const theme = extendTheme({
  colors: {
    primary: {
      700: "#3A74C0",
    },
  },
});

const API_BASE_URL = 'http://localhost:3000/api';

const Favoritos = () => {
  const [favoritos, setFavoritos] = useState<FavoriteItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [removendo, setRemovendo] = useState<number | null>(null);
  
  const toast = useToast();

  useEffect(() => {
    carregarFavoritos();
  }, []);

  const mostrarToast = (titulo: string, descricao: string, status: "success" | "error" | "warning" | "info") => {
    toast.show({
      title: titulo,
      description: descricao,
      status: status,
      duration: 3000,
    });
  };

  const carregarFavoritos = async () => {
    try {
      setCarregando(true);
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        mostrarToast('Ação Necessária', 'Faça login para ver seus favoritos', 'warning');
        router.push('/pages/login');
        return;
      }

      const resposta = await fetch(`${API_BASE_URL}/usuarios/favoritos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    
      if (resposta.status === 401) {
        await AsyncStorage.removeItem('userToken');
        mostrarToast('Sessão Expirada', 'Faça login novamente', 'warning');
        router.push('/pages/login');
        return;
      }

      if (!resposta.ok) {
        throw new Error('Erro ao carregar favoritos');
      }

      const dadosFavoritos = await resposta.json();
      setFavoritos(dadosFavoritos);
      
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      mostrarToast('Erro', 'Não foi possível carregar os favoritos', 'error');
    } finally {
      setCarregando(false);
    }
  };

  const removeFavorite = async (id: number) => {
    try {
      setRemovendo(id);
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        mostrarToast('Erro', 'Sessão expirada', 'error');
        return;
      }

      const resposta = await fetch(`${API_BASE_URL}/usuarios/favoritos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (resposta.ok) {
        setFavoritos(favoritos.filter(item => item.id !== id));
        mostrarToast('Sucesso', 'Notícia removida dos favoritos', 'success');
      } else {
        throw new Error('Erro ao remover dos favoritos');
      }
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      mostrarToast('Erro', 'Erro ao remover dos favoritos', 'error');
    } finally {
      setRemovendo(null);
    }
  };

  const confirmarRemocao = (id: number, titulo: string) => {
    Alert.alert(
      "Remover Favorito",
      `Deseja remover "${titulo}" dos favoritos?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Remover", 
          style: "destructive",
          onPress: () => removeFavorite(id)
        }
      ]
    );
  };

  const abrirDetalhesNoticia = (noticia: FavoriteItem) => {
    router.push({
      pathname: '/pages/detalhesNoticias',
      params: { id: noticia.id.toString() }
    });
  };

  const renderFavoriteItem = ({ item }: { item: FavoriteItem }) => (
    <FavoriteCard
      item={item}
      removendo={removendo}
      onRemove={confirmarRemocao}
      onPress={abrirDetalhesNoticia}
    />
  );

  const EmptyState = () => (
    <Center flex={1} px={8} py={20}>
      <Icon
        as={Ionicons}
        name="heart-outline"
        size="6xl"
        color="gray.300"
        mb={4}
      />
      <Text
        fontSize="lg"
        color="gray.500"
        textAlign="center"
        mb={2}
        lineHeight="md"
        fontWeight="medium"
      >
        Nenhuma notícia favoritada
      </Text>
      <Text
        fontSize="sm"
        color="gray.400"
        textAlign="center"
        mb={6}
      >
        As notícias que você favoritar aparecerão aqui
      </Text>
      <Button
        bg="primary.700"
        rounded="lg"
        px={8}
        py={3}
        _pressed={{ bg: "primary.800" }}
        onPress={() => router.push("/pages/home")}
        shadow={2}
      >
        <Text fontSize="md" color="white" fontWeight="semibold">
          Explorar Notícias
        </Text>
      </Button>
    </Center>
  );

  const Loading = () => (
    <Center flex={1}>
      <VStack space={4} alignItems="center">
        <Spinner size="lg" color="primary.700" />
        <Text color="gray.600">Carregando favoritos...</Text>
      </VStack>
    </Center>
  );

  return (
    <NativeBaseProvider theme={theme}>
      <Box flex={1} bg="white" safeArea>
        <Box bg="primary.700" px={5} py={5}>
          <HStack alignItems="center" justifyContent="space-between">
            <Box flex={1}>
              <Pressable onPress={() => router.back()}>
                {({ isPressed }) => (
                  <Icon
                    as={Ionicons}
                    name="chevron-back-outline"
                    size="lg"
                    color="white"
                    opacity={isPressed ? 0.7 : 1}
                  />
                )}
              </Pressable>
            </Box>

            <Text fontSize="lg" fontWeight="bold" color="white">
              Meus Favoritos
            </Text>

            <Box flex={1} />
          </HStack>
        </Box>

        <Box flex={1} bg="white" roundedTop="3xl" shadow={4} mt={-2}>
          {carregando ? (
            <Loading />
          ) : favoritos.length === 0 ? (
            <EmptyState />
          ) : (
            <Box flex={1} px={2} py={4}>
              <Box px={4} mb={3}>
                <Text fontSize="sm" color="gray.500">
                  {favoritos.length} {favoritos.length === 1 ? 'notícia favoritada' : 'notícias favoritadas'}
                </Text>
              </Box>
              
              <FlatList
                data={favoritos}
                renderItem={renderFavoriteItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
                key="grid"
              />
            </Box>
          )}
        </Box>

        <Footer />
      </Box>
    </NativeBaseProvider>
  );
};

export default Favoritos;