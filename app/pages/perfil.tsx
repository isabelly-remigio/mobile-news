import React, { useState } from 'react';
import {
    NativeBaseProvider,
    Box,
    VStack,
    HStack,
    Text,
    Avatar,
    ScrollView,
    Input,
    Button,
    Icon,
    Pressable,
    extendTheme,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAvoidingView, Platform } from 'react-native';
import Footer from '../components/footer';

// Tema customizado
const theme = extendTheme({
    colors: {
        primary: {
            700: '#3A74C0',
        },
    },
});

const PerfilUsuario = () => {
    const [nome, setNome] = useState('Rubens Barbosa');
    const [email, setEmail] = useState('rubens@email.com');
    const [senha, setSenha] = useState('12345678');
    const [showSenha, setShowSenha] = useState(false);

    return (
        <NativeBaseProvider theme={theme}>
            <Box flex={1} bg="primary.700" safeArea>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <ScrollView flex={1} showsVerticalScrollIndicator={false}>

                        <Box bg="primary.700" px={5} py={5}>
                            <HStack alignItems="center" justifyContent="flex-end" space={3} mb={4}>
                                <Pressable>
                                    {({ isPressed }) => (
                                        <Icon
                                            as={Ionicons}
                                            name="log-out-outline"
                                            size="lg"
                                            color="white"
                                            opacity={isPressed ? 0.7 : 1}
                                        />
                                    )}
                                </Pressable>
                            </HStack>
                        </Box>

                        <Box
                            bg="white"
                            roundedTop="3xl"
                            shadow={4}
                            mt={-2}
                            minH="100%"
                        >
                            <Box px={5} py={8} alignItems="center">
                                <Avatar
                                    bg="cyan.400"
                                    size="2xl"
                                    source={{
                                        uri: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80"
                                    }}
                                    mb={4}
                                >
                                    RB
                                </Avatar>

                                <Text fontSize="xl" fontWeight="bold" color="gray.800" mb={1}>
                                    Rubens Barbosa
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                    {email}
                                </Text>
                            </Box>

                            <Box px={5}>

                                <VStack space={4}>
                                    <VStack space={1}>
                                        <Text fontSize="sm" color="gray.600" fontWeight="medium">
                                            Nome
                                        </Text>
                                        <Input
                                            value={nome}
                                            onChangeText={setNome}
                                            bg="gray.50"
                                            borderColor="gray.300"
                                            fontSize="md"
                                            h={12}
                                            _focus={{
                                                borderColor: "blue.500",
                                                bg: "white"
                                            }}
                                        />
                                    </VStack>

                                    <VStack space={1}>
                                        <Text fontSize="sm" color="gray.600" fontWeight="medium">
                                            Email
                                        </Text>
                                        <Input
                                            value={email}
                                            onChangeText={setEmail}
                                            bg="gray.50"
                                            borderColor="gray.300"
                                            fontSize="md"
                                            h={12}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            _focus={{
                                                borderColor: "blue.500",
                                                bg: "white"
                                            }}
                                        />
                                    </VStack>

                                    <VStack space={1}>
                                        <Text fontSize="sm" color="gray.600" fontWeight="medium">
                                            Senha
                                        </Text>
                                        <Input
                                            value={senha}
                                            onChangeText={setSenha}
                                            bg="gray.50"
                                            borderColor="gray.300"
                                            fontSize="md"
                                            h={12}
                                            type={showSenha ? "text" : "password"}
                                            _focus={{
                                                borderColor: "blue.500",
                                                bg: "white"
                                            }}
                                            InputRightElement={
                                                <Pressable onPress={() => setShowSenha(!showSenha)} mr={3}>
                                                    <Icon
                                                        as={Ionicons}
                                                        name={showSenha ? "eye-off-outline" : "eye-outline"}
                                                        size="md"
                                                        color="gray.400"
                                                    />
                                                </Pressable>
                                            }
                                        />
                                    </VStack>

                                    <Button
                                        variant="ghost"
                                        borderColor="primary.700"
                                        borderWidth={2}
                                        mt={6}
                                        h={12}
                                        rounded="lg"
                                        _text={{ fontSize: "md", color: "info.400", fontWeight: "semibold" }}
                                    >
                                        EDITAR
                                    </Button>

                                    {/* Espaço extra */}
                                    <Box h={80} />
                                </VStack>
                            </Box>
                        </Box>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Box>

            <Footer />
        </NativeBaseProvider>
    );
};

export default PerfilUsuario;
