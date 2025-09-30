import React, { useState } from "react";
import { Platform, KeyboardAvoidingView, Alert } from "react-native";
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
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  
// Estados para mensagens de erro
  const [erroNome, setErroNome] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [erroConfirmarSenha, setErroConfirmarSenha] = useState("");

  const validarCampos = () => {
    let valido = true;

    setErroNome("");
    setErroEmail("");
    setErroSenha("");
    setErroConfirmarSenha("");


    if (!nome.trim()) {
      setErroNome("O nome é obrigatório");
      valido = false;
    }

    if (!email.trim()) {
      setErroEmail("O email é obrigatório");
      valido = false;
    } else if (!email.includes('@') || !email.includes('.')) {
      setErroEmail("Por favor, insira um email válido");
      valido = false;
    }


    if (!senha) {
      setErroSenha("A senha é obrigatória");
      valido = false;
    } else if (senha.length < 6) {
      setErroSenha("A senha deve ter pelo menos 6 caracteres");
      valido = false;
    }


    if (!confirmarSenha) {
      setErroConfirmarSenha("Confirme sua senha");
      valido = false;
    } else if (senha !== confirmarSenha) {
      setErroConfirmarSenha("As senhas não coincidem");
      valido = false;
    }

    return valido;
  };



  const verificarSenhas = (valor: string) => {
    setConfirmarSenha(valor);
    if (senha && valor && senha !== valor) {
      setErroConfirmarSenha("As senhas não coincidem");
    } else {
      setErroConfirmarSenha("");
    }
  };

  const fazerCadastro = async () => {
    if (!validarCampos()) {
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch('http://localhost:3000/api/auth/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim().toLowerCase(),
          senha: senha
        }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        Alert.alert(
          "Sucesso!", 
          "Cadastro realizado com sucesso!",
          [
            { 
              text: "OK", 
              onPress: () => {


                console.log('Redirecionando para login...');
                router.replace('/pages/login');
              }
            }
          ]
        );
        


        setTimeout(() => {
          router.replace('/pages/login');
        }, 2000);
        
      } else {
        Alert.alert("Erro no cadastro", dados.error || "Erro ao realizar cadastro");
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      Alert.alert("Erro de conexão", "Não foi possível conectar ao servidor. Verifique sua conexão.");
    } finally {
      setCarregando(false);
    }
  };

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


                <VStack space={1}>
                  <Input
                    placeholder="Nome completo"
                    value={nome}
                    onChangeText={(texto) => {
                      setNome(texto);
                      setErroNome("");
                    }}
                    isDisabled={carregando}
                    fontSize="md"
                    borderColor={erroNome ? "red.500" : "gray.300"}
                  />
                  {erroNome ? (
                    <Text color="red.500" fontSize="xs" ml={2}>
                      {erroNome}
                    </Text>
                  ) : null}
                </VStack>


                <VStack space={1}>
                  <Input
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={(texto) => {
                      setEmail(texto);
                      setErroEmail("");
                    }}
                    isDisabled={carregando}
                    fontSize="md"
                    borderColor={erroEmail ? "red.500" : "gray.300"}
                  />
                  {erroEmail ? (
                    <Text color="red.500" fontSize="xs" ml={2}>
                      {erroEmail}
                    </Text>
                  ) : null}
                </VStack>

                {/* Campo Senha */}
                <VStack space={1}>
                  <Input
                    placeholder="Senha (mínimo 6 caracteres)"
                    type={mostrarSenha ? "text" : "password"}
                    value={senha}
                    onChangeText={(texto) => {
                      setSenha(texto);
                      setErroSenha("");

// Verificar se a senha bate com confirmarSenha

                      if (confirmarSenha && texto !== confirmarSenha) {
                        setErroConfirmarSenha("As senhas não coincidem");
                      } else {
                        setErroConfirmarSenha("");
                      }
                    }}
                    isDisabled={carregando}
                    fontSize="md"
                    borderColor={erroSenha ? "red.500" : "gray.300"}
                    InputRightElement={
                      <Pressable onPress={() => setMostrarSenha(!mostrarSenha)} pr={3}>
                        <Icon
                          as={
                            <MaterialIcons
                              name={mostrarSenha ? "visibility" : "visibility-off"}
                            />
                          }
                          size={5}
                          color={erroSenha ? "red.500" : "gray.500"}
                        />
                      </Pressable>
                    }
                  />
                  {erroSenha ? (
                    <Text color="red.500" fontSize="xs" ml={2}>
                      {erroSenha}
                    </Text>
                  ) : null}
                </VStack>

                {/* Campo Confirmar Senha */}
                <VStack space={1}>
                  <Input
                    placeholder="Confirmar Senha"
                    type={mostrarConfirmarSenha ? "text" : "password"}
                    value={confirmarSenha}
                    onChangeText={verificarSenhas}
                    isDisabled={carregando}
                    fontSize="md"
                    borderColor={erroConfirmarSenha ? "red.500" : "gray.300"}
                    InputRightElement={
                      <Pressable
                        onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                        pr={3}
                      >
                        <Icon
                          as={
                            <MaterialIcons
                              name={mostrarConfirmarSenha ? "visibility" : "visibility-off"}
                            />
                          }
                          size={5}
                          color={erroConfirmarSenha ? "red.500" : "gray.500"}
                        />
                      </Pressable>
                    }
                  />
                  {erroConfirmarSenha ? (
                    <Text color="red.500" fontSize="xs" ml={2}>
                      {erroConfirmarSenha}
                    </Text>
                  ) : null}
                </VStack>

                <Button 
                  bg="info.700" 
                  mt={2} 
                  onPress={fazerCadastro}
                  isLoading={carregando}
                  isLoadingText="Cadastrando..."
                  isDisabled={carregando}
                  h={12}
                  _pressed={{ bg: "info.800" }}
                >
                  <Text color="white" fontSize="md" fontWeight="bold">
                    Cadastrar
                  </Text>
                </Button>

                <Center mt={3}>
                  <Text fontSize="sm" color="coolGray.700">
                    Já tem conta?{" "}
                    <Link
                      _text={{
                        color: "primary.700",
                        fontWeight: "bold",
                        textDecorationLine: "none",
                      }} 
                      onPress={() => !carregando && router.push('pages/login')}
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