import React from 'react';
import { FlatList, Box, VStack, HStack, Text, Center, Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import ItemNoticiaAdmin from './itemNoticiaAdmin';

interface Noticia {
    id: number;
    imagemURL: string;
    titulo: string;
    autores: string;
}

interface ListaNoticiasProps {
    noticias: Noticia[];
    carregando: boolean;
    onRefresh: () => void;
    onEdit: (noticia: Noticia) => void;
    onDelete: (noticia: Noticia) => void;
}

const ListaNoticias: React.FC<ListaNoticiasProps> = ({
    noticias,
    carregando,
    onRefresh,
    onEdit,
    onDelete
}) => (
    <VStack flex={1} space={2}>
        <HStack justifyContent="space-between" alignItems="center">
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
                Notícias Cadastradas
            </Text>
            <Text fontSize="sm" color="gray.500">
                {noticias.length} itens
            </Text>
        </HStack>

        <Box flex={1}>
            <FlatList
                data={noticias}
                renderItem={({ item }) => (
                    <ItemNoticiaAdmin
                        item={item}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 20,
                    flexGrow: noticias.length === 0 ? 1 : 0
                }}
                ListEmptyComponent={() => (
                    <Center flex={1} py={10}>
                        <VStack space={3} alignItems="center">
                            <Icon as={Ionicons} name="newspaper-outline" size="4xl" color="gray.400" />
                            <Text color="gray.500" textAlign="center">
                                Nenhuma notícia cadastrada
                            </Text>
                        </VStack>
                    </Center>
                )}
                refreshing={carregando}
                onRefresh={onRefresh}
            />
        </Box>
    </VStack>
);

export default ListaNoticias;