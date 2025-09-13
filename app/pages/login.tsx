import React, { useState } from "react";
import { Platform, KeyboardAvoidingView } from "react-native";
import {
    NativeBaseProvider,
    Box,
    VStack,
    Heading,
    Input,
    Button,
    Center,
    Link,
    Text,
    Icon,
    Pressable,
    Checkbox, Image
} from "native-base";
import logo from "../../assets/images/logo.png";

import { MaterialIcons } from "@expo/vector-icons";

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
                        <Center>
                             <Image
                        source={logo}
                        alt="Logo"
                        resizeMode="contain"
                        size="80"           // ou w={24} h={24} 
                        mb={4}              // margem inferior para separar do card
                    />
                        </Center>
                        <VStack space={3} mt={5}>
                            <Input
                                placeholder="email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />

                            <Input
                                placeholder="senha shh"
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
                            <Button bg="info.700" mt={2} onPress={() => { }}>
                                entrar
                            </Button>
                            <VStack space={2} mt={3} alignItems="flex-end">
                                <Link _text={{
                                    color: "primary.700",
                                    fontWeight: "bold",
                                    textDecorationLine: "none"
                                }}>Esqueceu a senha?</Link>


                            </VStack>
                            <VStack>
                                <Checkbox value="test" accessibilityLabel="Lembrar de mim" >Lembrar de mim</Checkbox>

                            </VStack>
                            <VStack space={2} mt={3} alignItems="Center">
                                <Text fontSize="sm" color="coolGray.700">
                                    Ainda não tem conta?{" "}
                                    <Link _text={{
                                        color: "primary.700",
                                        fontWeight: "bold",
                                    }}>Cadastre-se</Link>
                                </Text>
                            </VStack>
                        </VStack>
                    </Box>
                </Center>
            </KeyboardAvoidingView>
        </NativeBaseProvider>
    )

}

