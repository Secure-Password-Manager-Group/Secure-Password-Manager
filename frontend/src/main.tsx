import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AddCredential from './pages/AddCredential.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Error from './pages/Error.tsx';
import Home from './pages/Home.tsx';
import EditCredential from './pages/EditCredential.tsx';

const queryClient = new QueryClient();

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
        <MantineProvider>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </MantineProvider>
    </React.StrictMode>
);
