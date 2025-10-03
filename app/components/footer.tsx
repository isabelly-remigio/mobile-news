import React from "react";
import { Box, HStack, Pressable, Center, Icon, Text } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

function Footer() {
  const [usuarioLogado, setUsuarioLogado] = React.useState(false);
  const pathname = usePathname();

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

  //
  const getRotaAtiva = () => {
    if (pathname.includes('/home')) return 'home';
    if (pathname.includes('/pesquisa')) return 'pesquisa';
    if (pathname.includes('/favoritos')) return 'favoritos';
    if (pathname.includes('/perfil')) return 'perfil';
    return 'home'; 
  };

  const rotaAtiva = getRotaAtiva();

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

  const handleHomePress = () => {
    router.push("/pages/home");
  };

  const handlePesquisaPress = () => {
    router.push("/pages/pesquisa");
  };

  return (
    <Box bg="white" safeAreaBottom shadow={6} borderTopWidth={1} borderTopColor="gray.100">
      <HStack bg="white" alignItems="center">
        <HStack flex={1} alignItems="center">

          <Pressable 
            flex={1} 
            alignItems="center" 
            py={3}
            onPress={handleHomePress}
          >
            {({ isPressed }) => (
              <Center opacity={isPressed ? 0.7 : 1}>
                <Icon 
                  as={Ionicons}
                  name={rotaAtiva === "home" ? "home" : "home-outline"}
                  size="md"
                  color={rotaAtiva === "home" ? "primary.700" : "gray.500"}
                />
                <Text
                  fontSize="xs"
                  color={rotaAtiva === "home" ? "primary.700" : "gray.500"}
                  fontWeight={rotaAtiva === "home" ? "semibold" : "medium"}
                  mt={1}
                >
                  Home
                </Text>
              </Center>
            )}
          </Pressable>

          <Pressable 
            flex={1} 
            alignItems="center" 
            py={3}
            onPress={handlePesquisaPress}
          >
            {({ isPressed }) => (
              <Center opacity={isPressed ? 0.7 : 1}>
                <Icon
                  as={Ionicons}
                  name={rotaAtiva === "pesquisa" ? "search" : "search-outline"}
                  size="md"
                  color={rotaAtiva === "pesquisa" ? "primary.700" : "gray.500"}
                />
                <Text 
                  fontSize="xs" 
                  color={rotaAtiva === "pesquisa" ? "primary.700" : "gray.500"} 
                  fontWeight={rotaAtiva === "pesquisa" ? "semibold" : "medium"}
                  mt={1}
                >
                  Pesquisa
                </Text>
              </Center>
            )}
          </Pressable>

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
                  name={rotaAtiva === "favoritos" ? "heart" : "heart-outline"}
                  size="md"
                  color={rotaAtiva === "favoritos" ? "primary.700" : "gray.500"}
                />
                <Text 
                  fontSize="xs" 
                  color={rotaAtiva === "favoritos" ? "primary.700" : "gray.500"} 
                  fontWeight={rotaAtiva === "favoritos" ? "semibold" : "medium"}
                  mt={1}
                >
                  Favoritos
                </Text>
              </Center>
            )}
          </Pressable>

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
                  name={rotaAtiva === "perfil" ? "person" : "person-outline"}
                  size="md"
                  color={rotaAtiva === "perfil" ? "primary.700" : "gray.500"}
                />
                <Text 
                  fontSize="xs" 
                  color={rotaAtiva === "perfil" ? "primary.700" : "gray.500"} 
                  fontWeight={rotaAtiva === "perfil" ? "semibold" : "medium"}
                  mt={1}
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