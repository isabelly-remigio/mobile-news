import React, { useState } from "react";
import { Platform, KeyboardAvoidingView } from "react-native";
import {
  NativeBaseProvider,
  Box,
  VStack,
  Input,
  Button,
  Center,
  Link,
  Text,
  Icon,
  Pressable,
  Checkbox,
  Image,
  extendTheme,
} from "native-base";
import logo from "../../assets/images/logo.png";

import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";


export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);


  return (
    <NativeBaseProvider>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Center flex={1} px={4} bg="coolGray.100">
          <Box
            safeArea
            p={6}
            py={8}
            w="100%"
            maxW="400"
            bg="white"
            rounded="xl"
            shadow={2}
          >
            <Center mb={3}>
              <Image
                source={logo}
                alt="Logo"
                resizeMode="contain"
                w={120}
                h={120} 
                mb={2} 
              />
            </Center>
            <VStack space={3}>
              <Input
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <Input
                placeholder="Senha"
                type={showPass ? "text" : "password"}
                value={password}
                onChangeText={setPassword}
                InputRightElement={
                  <Pressable onPress={() => setShowPass(!showPass)} pr={3}>
                    <Icon
                      as={
                        <MaterialIcons
                          name={showPass ? "visibility" : "visibility-off"}
                        />
                      }
                      size={5}
                    />
                  </Pressable>
                }
              />
              <Link
                alignSelf="flex-end"
                mt={1}
                _text={{
                  color: "primary.700",
                  fontWeight: "bold",
                  textDecorationLine: "none",
                }}
              >
                Esqueceu a senha?
              </Link>

              <Checkbox
                value="lembrar"
                accessibilityLabel="Lembrar de mim"
                mt={2}
                _text={{ fontWeight: "bold", color: "primary.700" }}
              >
                Lembrar de mim
              </Checkbox>

              <Button
                bg="info.700"
                mt={4}
                w="100%"
                onPress={() => router.push('pages/home')}
              >
                Entrar
              </Button>

              <Center mt={4}>
                <Text fontSize="sm" color="coolGray.700" onPress={() => router.push('pages/cadastro')}>
                  Ainda não tem conta?{" "}
                  <Link
                    _text={{
                      color: "primary.700",
                      fontWeight: "bold",
                    }}
                  >
                    Cadastre-se
                  </Link>
                </Text>
              </Center>
            </VStack>
          </Box>
        </Center>
      </KeyboardAvoidingView>
    </NativeBaseProvider>
  );
}
