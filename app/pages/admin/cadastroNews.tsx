import React, { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';   
import {
    NativeBaseProvider,
    Box,
    VStack,
    HStack,
    Text,
    ScrollView,
    Image,
    Input,
    TextArea,
    Button,
    Icon,
    Pressable,
    Select,
    CheckIcon,
    extendTheme,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';

// Tema customizado
const theme = extendTheme({
    colors: {
        primary: {
            700: "#3A74C0",
        },
    },
});
// Interface para o formulário
interface FormData {
    title: string;
    image: string | null;
    description: string;
    author: string;
    category: string;
}

const AddNewsScreen = () => {
    const [formData, setFormData] = useState<FormData>({
        title: '',
        image: null,
        description: '',
        author: '',
        category: ''
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Categorias disponíveis
    const categories = [
        'Notícias ',
        'Negócios',
        'Tecnologia',
        'Esportes',

    ];

    const handleSelectImage = () => {
        // Simulando seleção de imagem
        const mockImage = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=300&h=200&fit=crop';
        setImagePreview(mockImage);
        setFormData({ ...formData, image: mockImage });
        console.log('Abrir galeria/câmera');
    };

    const handleSave = () => {
        // Validação simples
        if (!formData.title.trim()) {
            Alert.alert('Erro', 'O título da notícia é obrigatório');
            return;
        }
        if (!formData.description.trim()) {
            Alert.alert('Erro', 'A descrição da notícia é obrigatória');
            return;
        }
        if (!formData.author.trim()) {
            Alert.alert('Erro', 'O autor da notícia é obrigatório');
            return;
        }
        if (!formData.category) {
            Alert.alert('Erro', 'A categoria da notícia é obrigatória');
            return;
        }

        console.log('Salvar notícia:', formData);
        Alert.alert('Sucesso', 'Notícia salva com sucesso!', [
            { text: 'OK', onPress: () => console.log('Voltar para Admin') }
        ]);
    };

    const handleCancel = () => {
        Alert.alert(
            'Cancelar',
            'Tem certeza que deseja cancelar? Os dados não salvos serão perdidos.',
            [
                { text: 'Continuar editando', style: 'cancel' },
                { text: 'Cancelar', onPress: () => console.log('Voltar para Admin') }
            ]
        );
    };

    const handleQuickSave = () => {
        console.log('Salvamento rápido');
        handleSave();
    };

    return (
        <NativeBaseProvider theme={theme}>
            <Box flex={1} bg="primary.700" safeArea>
                {/* Header Azul */}
                <Box bg="primary.700" px={5} py={5}>
                    <HStack alignItems="center">
                        {/* Botão Voltar */}
                        <Pressable onPress={handleCancel}>
                            {({ isPressed }) => (
                                <Icon
                                    as={Ionicons}
                                    name="chevron-back-outline"
                                    size="lg"
                                    color="white"
                                    opacity={isPressed ? 0.7 : 1}
                                    onPress={() => router.push("/pages/admin/admin")}

                                />
                            )}
                        </Pressable>

                        {/* Título centralizado com flex */}
                        <Text
                            fontSize="lg"
                            fontWeight="bold"
                            color="white"
                            flex={1}
                            textAlign="center"
                            ml={-6} /* Compensa o espaço do ícone */
                        >
                            Cadastrar Notícia
                        </Text>
                    </HStack>
                </Box>


                {/* Card Branco Sobreposto */}
                <Box
                    flex={1}
                    bg="gray.50"
                    roundedTop="3xl"
                    shadow={4}
                    mt={-2}
                >
                    <ScrollView
                        flex={1}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                    >
                        <Box bg="white" mx={5} my={6} rounded="xl" shadow={2} p={5}>
                            <VStack space={5}>
                                {/* Campo Título */}
                                <VStack space={2}>
                                    <Text fontSize="md" fontWeight="semibold" color="gray.700">
                                        Título da notícia *
                                    </Text>
                                    <Input
                                        placeholder="Digite o título da notícia"
                                        
                                        value={formData.title}
                                        onChangeText={(text) => setFormData({ ...formData, title: text })}
                                        bg="gray.50"
                                        borderColor="gray.300"
                                        _focus={{ borderColor: "blue.500", bg: "white" }}
                                        fontSize="md"
                                    />
                                </VStack>

                                {/* Campo Imagem */}
                                <VStack space={2}>
                                    <Text fontSize="md" fontWeight="semibold" color="gray.700">
                                        Imagem
                                    </Text>

                                    {imagePreview ? (
                                        <VStack space={3}>
                                            <Image
                                                source={{ uri: imagePreview }}
                                                alt="Preview"
                                                w="full"
                                                h={40}
                                                rounded="lg"
                                                resizeMode="cover"
                                            />
                                            <Button
                                                variant="outline"
                                                borderColor="blue.500"
                                                onPress={handleSelectImage}
                                            >
                                                <Text color="blue.500" fontSize="sm">Alterar Imagem</Text>
                                            </Button>
                                        </VStack>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            borderColor="gray.400"
                                            leftIcon={<Icon as={Ionicons} name="image-outline" size="sm" />}
                                            onPress={handleSelectImage}
                                        >
                                            <Text color="gray.600" fontSize="sm">Selecionar Imagem</Text>
                                        </Button>
                                    )}
                                </VStack>

                                {/* Campo Descrição */}
                                <VStack space={2}>
                                    <Text fontSize="md" fontWeight="semibold" color="gray.700">
                                        Descrição *
                                    </Text>
                                    <TextArea
                                        value={formData.description}
                                        onChangeText={(text) => setFormData({ ...formData, description: text })}
                                        placeholder="Digite a descrição da notícia"
                                        h={24}
                                        fontSize="md"
                                        bg="gray.50"
                                        borderColor="gray.300"
                                        _focus={{
                                            borderColor: "blue.500",
                                            bg: "white"
                                        }}
                                    />



                                </VStack>

                                {/* Campo Autor */}
                                <VStack space={2}>
                                    <Text fontSize="md" fontWeight="semibold" color="gray.700">
                                        Autor *
                                    </Text>
                                    <Input
                                        placeholder="Digite o nome do autor"
                                        value={formData.author}
                                        onChangeText={(text) => setFormData({ ...formData, author: text })}
                                        bg="gray.50"
                                        borderColor="gray.300"
                                        _focus={{
                                            borderColor: "blue.500",
                                            bg: "white"
                                        }}
                                        fontSize="md"
                                    />
                                </VStack>

                                {/* Campo Categoria */}
                                <VStack space={2}>
                                    <Text fontSize="md" fontWeight="semibold" color="gray.700">
                                        Categoria *
                                    </Text>
                                    <Select
                                        selectedValue={formData.category}
                                        placeholder="Selecione a categoria"
                                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                                        bg="gray.50"
                                        borderColor="gray.300"
                                        _selectedItem={{
                                            bg: "blue.100",
                                            endIcon: <CheckIcon size="5" />
                                        }}
                                    >
                                        {categories.map((category, index) => (
                                            <Select.Item
                                                key={index}
                                                label={category}
                                                value={category}
                                            />
                                        ))}
                                    </Select>
                                </VStack>
                            </VStack>
                        </Box>

                        {/* Botões de Ação */}
                        <VStack space={3} mx={5} mb={6}>
                            {/* Botão Salvar */}
                            <Button
                                bg="orange.500"
                                h={12}
                                rounded="lg"
                                shadow={2}
                                onPress={handleSave}
                                _pressed={{ bg: "orange.600" }}
                            >
                                <Text fontSize="md" color="white" fontWeight="bold">
                                    Salvar Notícia
                                </Text>
                            </Button>

                            {/* Botão Cancelar */}
                            <Button
                                variant="outline"
                                borderColor="blue.500"
                                h={12}
                                rounded="lg"
                                onPress={handleCancel}
                                _pressed={{ bg: "blue.50" }}
                            >
                                <Text fontSize="md" color="blue.500" fontWeight="semibold">
                                    Cancelar
                                </Text>
                            </Button>
                        </VStack>
                    </ScrollView>
                </Box>
            </Box>
        </NativeBaseProvider >
    );
};

export default AddNewsScreen;