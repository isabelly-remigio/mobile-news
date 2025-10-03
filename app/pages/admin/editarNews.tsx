import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native'; 
import { 
    Modal, Box, VStack, HStack, Text, ScrollView, Input, TextArea, Button, Icon,
    Pressable, Select, CheckIcon, Image, useToast, Spinner 
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:3000/api';

const categorias = ['Notícias', 'Negócios', 'Tecnologia', 'Esportes'];

const ModalEditarNoticia = ({ visivel, fechar, noticia, aoSalvar }) => {
    const [titulo, setTitulo] = useState('');
    const [imagemUrl, setImagemUrl] = useState('');
    const [descricao, setDescricao] = useState('');
    const [autor, setAutor] = useState('');
    const [link, setLink] = useState('');
    const [categoria, setCategoria] = useState('');
    const [carregando, setCarregando] = useState(false);

    const toast = useToast();

    useEffect(() => {
        if (noticia) {
            setTitulo(noticia.titulo || '');
            setImagemUrl(noticia.imagemURL || ''); 
            setDescricao(noticia.descricao || '');
            setAutor(noticia.autor || '');
            setLink(noticia.link || '');
            setCategoria(noticia.categoria || '');
        }
    }, [noticia]);

    const validarCampos = () => {
        if (!titulo.trim()) {
            toast.show({ description: "O título é obrigatório", status: "warning" });
            return false;
        }
        if (!descricao.trim()) {
            toast.show({ description: "A descrição é obrigatória", status: "warning" });
            return false;
        }
        if (!autor.trim()) {
            toast.show({ description: "O autor é obrigatório", status: "warning" });
            return false;
        }
        if (!categoria) {
            toast.show({ description: "A categoria é obrigatória", status: "warning" });
            return false;
        }
        return true;
    };

    const salvarAlteracoes = async () => {
        if (!validarCampos()) return;
        if (!noticia?.id) {
            toast.show({ description: "Erro: ID da notícia não encontrado", status: "error" });
            return;
        }

        setCarregando(true);

        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                toast.show({ description: "Sessão expirada. Faça login novamente.", status: "error" });
                fechar();
                return;
            }

            const dadosAtualizacao = {
                titulo: titulo.trim(),
                autor: autor.trim(),
                descricao: descricao.trim(),
                categoria: categoria,
                link: link.trim(),
                imagemURL: imagemUrl.trim()
            };

            const resposta = await fetch(`${API_BASE_URL}/noticias/${noticia.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosAtualizacao)
            });

            if (resposta.status === 401) {
                await AsyncStorage.removeItem('userToken');
                toast.show({ description: "Sessão expirada. Faça login novamente.", status: "error" });
                fechar();
                return;
            }

            if (!resposta.ok) {
                const erro = await resposta.json();
                throw new Error(erro.error || `Erro ${resposta.status}: ${resposta.statusText}`);
            }

            await resposta.json();
            toast.show({ description: "Notícia atualizada com sucesso!", status: "success" });

            if (aoSalvar) {
                aoSalvar({
                    ...noticia,
                    titulo: dadosAtualizacao.titulo,
                    autores: dadosAtualizacao.autor,
                    descricao: dadosAtualizacao.descricao,
                    categoria: dadosAtualizacao.categoria,
                    link: dadosAtualizacao.link,
                    imagemURL: dadosAtualizacao.imagemURL 
                });
            }

            fechar();

        } catch (error) {
            console.error('Erro ao salvar:', error);
            toast.show({
                description: error instanceof Error ? error.message : "Erro ao atualizar notícia",
                status: "error"
            });
        } finally {
            setCarregando(false);
        }
    };

    const handleCancelar = () => {
        const temAlteracoes = 
            titulo !== (noticia?.titulo || '') ||
            descricao !== (noticia?.descricao || '') ||
            autor !== (noticia?.autor || '') ||
            imagemUrl !== (noticia?.imagemURL || '') ||
            link !== (noticia?.link || '') ||
            categoria !== (noticia?.categoria || '');

        if (temAlteracoes) {
            Alert.alert(
                'Cancelar Edição',
                'Tem certeza? As alterações não salvas serão perdidas.',
                [
                    { text: 'Continuar editando', style: 'cancel' },
                    { text: 'Cancelar', onPress: fechar }
                ]
            );
        } else {
            fechar();
        }
    };

    return (
        <Modal isOpen={visivel} onClose={fechar} size="xl" avoidKeyboard>
            <Modal.Content maxWidth="400px" borderRadius="xl">
                <Box bg="blue.600" px={4} py={3} borderTopRadius="xl">
                    <HStack alignItems="center" justifyContent="space-between">
                        <Text fontSize="lg" fontWeight="bold" color="white">
                            Editar Notícia
                        </Text>
                        <Pressable onPress={fechar} hitSlop={8}>
                            <Icon as={Ionicons} name="close" size="sm" color="white" />
                        </Pressable>
                    </HStack>
                </Box>

                <Modal.Body p={4} maxH="600px">
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <VStack space={4}>
                            <VStack space={1}>
                                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                                    Título *
                                </Text>
                                <Input
                                    value={titulo}
                                    onChangeText={setTitulo}
                                    placeholder="Digite o título"
                                    size="md"
                                    isDisabled={carregando}
                                />
                            </VStack>

                            <VStack space={1}>
                                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                                    URL da Imagem
                                </Text>
                                <Input
                                    value={imagemUrl}
                                    onChangeText={setImagemUrl}
                                    placeholder="https://exemplo.com/imagem.jpg"
                                    size="md"
                                    isDisabled={carregando}
                                />
                                {imagemUrl ? (
                                    <Box mt={2}>
                                        <Text fontSize="xs" color="gray.500" mb={1}>
                                            Pré-visualização:
                                        </Text>
                                        <Image
                                            source={{ uri: imagemUrl }}
                                            alt="Preview da imagem"
                                            w="full"
                                            h={32}
                                            borderRadius="md"
                                            resizeMode="cover"
                                            fallbackSource={{ uri: 'https://via.placeholder.com/300x150?text=Imagem+Inválida' }}
                                        />
                                    </Box>
                                ) : (
                                    <Box mt={2} w="full" h={32} bg="gray.100" borderRadius="md" justifyContent="center" alignItems="center">
                                        <Icon as={Ionicons} name="image-outline" size="lg" color="gray.400" />
                                        <Text fontSize="xs" color="gray.500" mt={1}>
                                            Nenhuma imagem carregada
                                        </Text>
                                    </Box>
                                )}
                            </VStack>

                            <VStack space={1}>
                                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                                    Descrição *
                                </Text>
                                <TextArea
                                    value={descricao}
                                    onChangeText={setDescricao}
                                    placeholder="Digite a descrição completa"
                                    numberOfLines={4}
                                    autoCompleteType={undefined}
                                    isDisabled={carregando}
                                />
                            </VStack>

                            <VStack space={1}>
                                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                                    Autor *
                                </Text>
                                <Input
                                    value={autor}
                                    onChangeText={setAutor}
                                    placeholder="Nome do autor"
                                    size="md"
                                    isDisabled={carregando}
                                />
                            </VStack>

                            <VStack space={1}>
                                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                                    Link da Notícia
                                </Text>
                                <Input
                                    value={link}
                                    onChangeText={setLink}
                                    placeholder="https://exemplo.com/noticia"
                                    size="md"
                                    isDisabled={carregando}
                                />
                            </VStack>

                            <VStack space={1}>
                                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                                    Categoria *
                                </Text>
                                <Select
                                    selectedValue={categoria}
                                    onValueChange={setCategoria}
                                    placeholder="Selecione a categoria"
                                    isDisabled={carregando}
                                    _selectedItem={{
                                        bg: "blue.100",
                                        endIcon: <CheckIcon size={4} />
                                    }}
                                >
                                    {categorias.map((cat) => (
                                        <Select.Item key={cat} label={cat} value={cat} />
                                    ))}
                                </Select>
                            </VStack>
                        </VStack>
                    </ScrollView>
                </Modal.Body>

                <Modal.Footer bg="gray.50" borderBottomRadius="xl">
                    <HStack space={3} w="full">
                        <Button
                            variant="outline"
                            flex={1}
                            onPress={handleCancelar}
                            isDisabled={carregando}
                        >
                            Cancelar
                        </Button>
                        <Button
                            bg="blue.600"
                            flex={1}
                            onPress={salvarAlteracoes}
                            isDisabled={carregando}
                            isLoading={carregando}
                            leftIcon={carregando ? <Spinner size="sm" color="white" /> : undefined}
                        >
                            Salvar
                        </Button>
                    </HStack>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
};

export default ModalEditarNoticia;