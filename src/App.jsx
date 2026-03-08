import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/AppRouter';
import { useUIStore } from './store/useUIStore';

function App() {
  const theme = useUIStore((state) => state.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
