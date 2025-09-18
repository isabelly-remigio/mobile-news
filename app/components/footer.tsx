import React from "react";
import { Box, HStack, Pressable, Center, Icon, Text } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";


function Footer() {
  return (
    <Box bg="white" safeAreaBottom shadow={6}>
      <HStack bg="white" alignItems="center">
        <HStack flex={1} alignItems="center">
          {/* Home */}
          <Pressable flex={1} alignItems="center" py={3}>
            {({ isPressed }) => (
              <Center opacity={isPressed ? 0.7 : 1}>
                <Icon as={Ionicons} name="home" size="md" color="blue.500" />
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

          {/* pesquisa */}
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

          {/* favoritos */}
          <Pressable flex={1} alignItems="center" py={3}>
            {({ isPressed }) => (
              <Center opacity={isPressed ? 0.7 : 1}>
                <Icon
                  as={Ionicons}
                  name="heart-outline"
                  size="md"
                  color="gray.400"
                />
                <Text fontSize="xs" color="gray.400" mt={1} fontWeight="medium">
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
            onPress={() => router.push("/pages/login")}
          >
            {({ isPressed }) => (
              <Center opacity={isPressed ? 0.7 : 1}>
                <Icon
                  as={Ionicons}
                  name="person-outline"
                  size="md"
                  color="gray.400"
                />
                <Text fontSize="xs" color="gray.400" mt={1} fontWeight="medium">
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
