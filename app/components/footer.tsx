import React from "react";
import { Box, HStack, Pressable, Center, Icon, Text } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import AsyncStorage from '@react-native-async-storage/async-storage';

function Footer() {
  const [usuarioLogado, setUsuarioLogado] = React.useState(false);

  // Verificar se usuário está logado
  React.useEffect(() => {
    verificarLogin();
  }, []);

  const verificarLogin = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      setUsuarioLogado(!!token);
    } catch (error) {
      console.error('Erro ao verificar login:', error);
    }
  };

  const handlePerfilPress = () => {
    if (usuarioLogado) {
      router.push("/pages/perfil");
    } else {
      router.push("/pages/login");
    }
  };

  const handleFavoritosPress = () => {
    if (usuarioLogado) {
      router.push("/pages/favoritos");
    } else {
      router.push("/pages/login");
    }
  };

  return (
    <Box bg="white" safeAreaBottom shadow={6}>
      <HStack bg="white" alignItems="center">
        <HStack flex={1} alignItems="center">
          {/* Home */}
          <Pressable 
            flex={1} 
            alignItems="center" 
            py={3}
            onPress={() => router.push("/pages/home")}
          >
            {({ isPressed }) => (
              <Center opacity={isPressed ? 0.7 : 1}>
                <Icon as={Ionicons}
                  name="home"
                  size="md"
                  color="blue.500"
                />
                <Text
                  fontSize="xs"
                  color="blue.500"
                  fontWeight="semibold"
                  mt={1}
                >
                  Home
                </Text>
              </Center>
            )}
          </Pressable>

          {/* Pesquisa */}
          <Pressable flex={1} alignItems="center" py={3}>
            {({ isPressed }) => (
              <Center opacity={isPressed ? 0.7 : 1}>
                <Icon
                  as={Ionicons}
                  name="search-outline"
                  size="md"
                  color="gray.400"
                />
                <Text fontSize="xs" color="gray.400" mt={1} fontWeight="medium">
                  Pesquisa
                </Text>
              </Center>
            )}
          </Pressable>

          {/* Favoritos */}
          <Pressable 
            flex={1} 
            alignItems="center" 
            py={3}
            onPress={handleFavoritosPress}
          >
            {({ isPressed }) => (
              <Center opacity={isPressed ? 0.7 : 1}>
                <Icon
                  as={Ionicons}
                  name="heart-outline"
                  size="md"
                  color={usuarioLogado ? "red.500" : "gray.400"}
                />
                <Text 
                  fontSize="xs" 
                  color={usuarioLogado ? "red.500" : "gray.400"} 
                  mt={1} 
                  fontWeight="medium"
                >
                  Favoritos
                </Text>
              </Center>
            )}
          </Pressable>

          {/* Perfil */}
          <Pressable
            flex={1}
            alignItems="center"
            py={3}
            onPress={handlePerfilPress}
          >
            {({ isPressed }) => (
              <Center opacity={isPressed ? 0.7 : 1}>
                <Icon
                  as={Ionicons}
                  name={usuarioLogado ? "person" : "person-outline"}
                  size="md"
                  color={usuarioLogado ? "green.500" : "gray.400"}
                />
                <Text 
                  fontSize="xs" 
                  color={usuarioLogado ? "green.500" : "gray.400"} 
                  mt={1} 
                  fontWeight="medium"
                >
                  Perfil
                </Text>
              </Center>
            )}
          </Pressable>
        </HStack>
      </HStack>
    </Box>
  );
}

export default Footer;