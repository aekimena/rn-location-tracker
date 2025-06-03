import React, {useEffect} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from './src/navigation';
import {StatusBar} from 'react-native';
import {theme} from './src/constants/colors';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar backgroundColor={'transparent'} translucent />

      <NavigationContainer>
        <GestureHandlerRootView>
          <RootNavigator />
        </GestureHandlerRootView>
      </NavigationContainer>
    </QueryClientProvider>
  );
};

export default App;
