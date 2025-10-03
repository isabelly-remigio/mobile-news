import React from 'react';
import { Box, HStack, VStack, Text, Image, Pressable, Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

interface Noticia {
    id: number;
    imagemURL: string;
    titulo: string;
    autores: string;
}

interface ItemNoticiaAdminProps {
    item: Noticia;
    onEdit: (noticia: Noticia) => void;
    onDelete: (noticia: Noticia) => void;
}

const ItemNoticiaAdmin: React.FC<ItemNoticiaAdminProps> = ({ item, onEdit, onDelete }) => {
    const handleImageError = () => {
        console.log(`Erro ao carregar imagem da notícia ${item.id}`);
    };

    return (
        <Box bg="white" rounded="xl" shadow={2} mb={3} overflow="hidden">
            <HStack space={3} p={3}>
                <Image
                    source={{ uri: item.imagemURL }}
                    alt={item.titulo}
                    w={20}
                    h={16}
                    rounded="lg"
                    resizeMode="cover"
                    fallbackSource={{ uri: 'https://via.placeholder.com/80x60?text=Imagem' }}
                    onError={handleImageError}
                />

                <VStack flex={1} space={1}>
                    <Text fontSize="md" fontWeight="semibold" color="gray.800" numberOfLines={2}>
                        {item.titulo}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                        {item.autores}
                    </Text>
                </VStack>

                <VStack space={2}>
                    <Pressable onPress={() => onEdit(item)}>
                        {({ isPressed }) => (
                            <Box
                                bg="blue.50"
                                p={2}
                                rounded="lg"
                                opacity={isPressed ? 0.7 : 1}
                            >
                                <Icon
                                    as={Ionicons}
                                    name="create-outline"
                                    size="sm"
                                    color="blue.500"
                                />
                            </Box>
                        )}
                    </Pressable>

                    <Pressable onPress={() => onDelete(item)}>
                        {({ isPressed }) => (
                            <Box
                                bg="red.50"
                                p={2}
                                rounded="lg"
                                opacity={isPressed ? 0.7 : 1}
                            >
                                <Icon
                                    as={Ionicons}
                                    name="trash-outline"
                                    size="sm"
                                    color="red.500"
                                />
                            </Box>
                        )}
                    </Pressable>
                </VStack>
            </HStack>
        </Box>
    );
};

export default ItemNoticiaAdmin;