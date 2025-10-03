import React, { useState } from "react";
import { Platform, KeyboardAvoidingView, Alert } from "react-native";
import {
  NativeBaseProvider, Box, VStack, Input, Button, Center, Link, Text,
  Icon, Pressable, Checkbox, Image,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

import logo from "../../assets/images/logo.png";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const API_BASE_URL = 'http://localhost:3000/api';

  const fazerLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          senha: senha
        }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        if (dados.token) {
          await AsyncStorage.setItem('userToken', dados.token);
          await AsyncStorage.setItem('loginTime', Date.now().toString());
        }

        if (dados.usuario) {
          await AsyncStorage.setItem('userData', JSON.stringify(dados.usuario));
        }

        Alert.alert("Sucesso", "Login realizado com sucesso!");

        if (dados.usuario.isAdmin) {
          router.replace('/pages/admin/admin'); 
        } else {
          router.replace('/pages/home'); 
        }
      } else {
        Alert.alert("Erro", dados.error || "Erro ao fazer login");
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor. Verifique sua conexão.");
    } finally {
      setCarregando(false);
    }
  };

  const testarConexao = async () => {
    try {
      const resposta = await fetch('http://localhost:3000/');
      const texto = await resposta.text();
      console.log('Conexão com servidor:', texto);
    } catch (error) {
      console.error('Erro na conexão:', error);
    }
  };

  React.useEffect(() => {
    testarConexao();
  }, []);

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
                isDisabled={carregando}
              />

              <Input
                placeholder="Senha"
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChangeText={setSenha}
                isDisabled={carregando}
                InputRightElement={
                  <Pressable onPress={() => setMostrarSenha(!mostrarSenha)} pr={3}>
                    <Icon
                      as={
                        <MaterialIcons
                          name={mostrarSenha ? "visibility" : "visibility-off"}
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
                onPress={() => !carregando && console.log('Esqueci a senha')}
              >
                Esqueceu a senha?
              </Link>

              <Checkbox
                value="lembrar"
                accessibilityLabel="Lembrar de mim"
                mt={2}
                _text={{ fontWeight: "bold", color: "primary.700" }}
                isDisabled={carregando}
              >
                Lembrar de mim
              </Checkbox>

              <Button
                bg="info.700"
                mt={4}
                w="100%"
                onPress={fazerLogin}
                isLoading={carregando}
                isLoadingText="Entrando..."
              >
                Entrar
              </Button>

              <Center mt={4}>
                <Text fontSize="sm" color="coolGray.700">
                  Ainda não tem conta?{" "}
                  <Link
                    _text={{
                      color: "primary.700",
                      fontWeight: "bold",
                    }}
                    onPress={() => !carregando && router.push('pages/cadastro')}
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