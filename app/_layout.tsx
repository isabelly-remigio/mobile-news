// app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="pages/home" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="pages/login" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="pages/cadastro" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="pages/detalhesNoticias" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="pages/favoritos" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="pages/perfil" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="pages/admin/admin" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="pages/admin/cadastroNews" 
        options={{ headerShown: false }} 
      />
    </Stack>
  );
}