import React, { useState } from "react";
import { Platform, KeyboardAvoidingView } from "react-native";
import {
  NativeBaseProvider,
  Box,
  VStack,
  Text,
  ScrollView,
  Center,
  Input,
  Button,
  Pressable,
  Icon,
  Link,
  extendTheme,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const theme = extendTheme({
  colors: {
    primary: {
      700: "#3A74C0",
    },
  },
});

function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  return (
    <NativeBaseProvider theme={theme}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Box flex={1} safeArea>
          <Box bg="primary.700" px={5} py={10}>
            <Center>
              <Text fontSize="lg" fontWeight="bold" color="white">
                Cadastre-se para acessar o app
              </Text>
            </Center>
            <Center mt={2}>
              <Text fontSize="sm" color="blue.100" textAlign="center">
                Complete seus dados abaixo
              </Text>
            </Center>
          </Box>

          <Box flex={1} bg="white" roundedTop="3xl" mt={-4} px={5} py={6}>
            <ScrollView
              flex={1}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              <VStack space={4}>
                <Input
                  placeholder="Nome completo"
                  value={nome}
                  onChangeText={setNome}
                />
                <Input
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
                <Input
                  placeholder="Senha"
                  type={showSenha ? "text" : "password"}
                  value={senha}
                  onChangeText={setSenha}
                  InputRightElement={
                    <Pressable onPress={() => setShowSenha(!showSenha)} pr={3}>
                      <Icon
                        as={
                          <MaterialIcons
                            name={showSenha ? "visibility" : "visibility-off"}
                          />
                        }
                        size={5}
                      />
                    </Pressable>
                  }
                />

                <Input
                  placeholder="Confirmar Senha"
                  type={showConfirmarSenha ? "text" : "password"}
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                  InputRightElement={
                    <Pressable
                      onPress={() => setShowConfirmarSenha(!showConfirmarSenha)}
                      pr={3}
                    >
                      <Icon
                        as={
                          <MaterialIcons
                            name={
                              showConfirmarSenha
                                ? "visibility"
                                : "visibility-off"
                            }
                          />
                        }
                        size={5}
                      />
                    </Pressable>
                  }
                />

                <Button bg="info.700" mt={2} onPress={() => router.push('pages/login')}>
                  Cadastrar
                </Button>

                <Center mt={3}>
                  <Text fontSize="sm" color="coolGray.700">
                    Já tem conta?{" "}
                    <Link
                      _text={{
                        color: "primary.700",
                        fontWeight: "bold",
                        textDecorationLine: "none",
                      }} onPress={() => router.push('pages/login')}
                    >
                      Faça o login
                    </Link>
                  </Text>
                </Center>
              </VStack>
            </ScrollView>
          </Box>
        </Box>
      </KeyboardAvoidingView>
    </NativeBaseProvider>
  );
}
export default Cadastro;
