// components/CardNews.tsx
import React from "react";
import { router } from "expo-router"; 
import { 
  Box, 
  VStack, 
  Text, 
  Image, 
  HStack, 
  Pressable, 
  Icon, 
  Button 
} from "native-base";
import { Ionicons } from "@expo/vector-icons";

interface NewsCardProps {
  id: number; // ADICIONE ESTA LINHA
  image: string;
  title: string;
  authors: string;
  description: string;
  categoria?: string; // ADICIONE ESTA LINHA TAMBÉM
}

function CardNews({
  id, // RECEBA O ID
  image,
  title,
  authors,
  description,
  categoria,
}: NewsCardProps) {

  // FUNÇÃO PARA NAVEGAR COM O ID
  const handleLerMais = () => {
    console.log('Navegando para notícia ID:', id);
    router.push({
      pathname: '/pages/detalhesNoticias',
      params: { id: id.toString() } // PASSA O ID COMO PARÂMETRO
    });
  };

  return (
    <Box bg="white" rounded="2xl" shadow={3} overflow="hidden">
      <Image
        source={{ uri: image }}
        alt={title}
        w="full"
        h={48}
        resizeMode="cover"
      />

      {/* card */}
      <VStack p={5} space={3}>
        {/* Categoria (se disponível) */}
        {categoria && (
          <Box alignSelf="flex-start">
            <Text 
              fontSize="xs" 
              color="primary.700" 
              fontWeight="bold"
              bg="blue.50"
              px={2}
              py={1}
              rounded="md"
            >
              {categoria}
            </Text>
          </Box>
        )}

        <Text 
          fontSize="lg" 
          fontWeight="bold" 
          color="gray.800" 
          lineHeight="sm"
          numberOfLines={2} // Limita a 2 linhas
        >
          {title}
        </Text>

        <Text 
          fontSize="sm" 
          color="blue.600" 
          fontWeight="semibold"
          numberOfLines={1} // Limita a 1 linha
        >
          {authors}
        </Text>

        <Text 
          fontSize="sm" 
          color="gray.600" 
          lineHeight="sm"
          numberOfLines={3} // Limita a 3 linhas
        >
          {description}
        </Text>

        <HStack justifyContent="space-between" alignItems="center" mt={3}>
          <HStack space={5} alignItems="center">
            <Pressable>
              {({ isPressed }) => (
                <HStack alignItems="center" space={1} opacity={isPressed ? 0.7 : 1}>
                  <Icon 
                    as={Ionicons} 
                    name="heart-outline" 
                    size="sm" 
                    color="gray.500" 
                  />
                </HStack>
              )}
            </Pressable>

            {/* Comentários e shares podem ser adicionados depois */}
          </HStack>

          {/* BOTÃO CORRIGIDO - AGORA PASSA O ID */}
          <Button
            size="sm"
            bg="blue.500"
            rounded="lg"
            shadow={2}
            onPress={handleLerMais} // USA A FUNÇÃO QUE PASSA O ID
            _pressed={{ bg: "blue.600" }}
          >
            <Text 
              fontSize="xs" 
              color="white" 
              fontWeight="semibold"
            >
              Ler mais
            </Text>
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}

export default CardNews;