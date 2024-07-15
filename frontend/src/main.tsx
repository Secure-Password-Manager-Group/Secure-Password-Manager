import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './pages/Dashboard.tsx';
import Home from './pages/Home.tsx';
import Error from './pages/Error.tsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
        errorElement: <Error />
    },
    {
        path: '/Dashboard',
        element: <Dashboard />
    }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <MantineProvider>
            <RouterProvider router={router} />
        </MantineProvider>
    </React.StrictMode>
);
