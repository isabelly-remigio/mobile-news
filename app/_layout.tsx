// App.tsx ou _layout.tsx (dependendo do Expo Router)
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }} 
        // Redireciona para home se acessar a raiz
        redirect={true}
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
        name="pages/admin/admin" 
        options={{ headerShown: false }} 
      />
    </Stack>
  );
}