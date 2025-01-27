import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import {
    MutationCache,
    QueryCache,
    QueryClient,
    QueryClientProvider
} from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AddCredential from './pages/AddCredential.tsx';
import Dashboard from './pages/Dashboard.tsx';
import EditCredential from './pages/EditCredential.tsx';
import Error from './pages/Error.tsx';
import Home from './pages/Home.tsx';
import { useAuthStore } from './store/auth.ts';
import { notifications } from '@mantine/notifications';

const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error) => {
            if (isAxiosError(error) && error.response?.status === 401) {
                useAuthStore.getState().clearAuth();
                notifications.show({
                    color: 'red',
                    title: 'Session Expired',
                    message: 'Please login again.'
                });
            }
        }
    }),
    mutationCache: new MutationCache({
        onError: (error) => {
            if (isAxiosError(error) && error.response?.status === 401) {
                useAuthStore.getState().clearAuth();
                notifications.show({
                    color: 'red',
                    title: 'Session Expired',
                    message: 'Please login again.'
                });
            }
        }
    })
});

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
        errorElement: <Error />
    },
    {
        path: '/dashboard',
        element: <Dashboard />
    },
    {
        path: '/add-credential',
        element: <AddCredential />
    },
    {
        path: '/edit-credential/:id',
        element: <EditCredential />
    }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <MantineProvider defaultColorScheme='dark'>
            <Notifications />
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </MantineProvider>
    </React.StrictMode>
);
