import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from '@/store';
import TournamentsListPage from '@/pages/TournamentsListPage';
import TournamentDetailPage from '@/pages/TournamentDetailPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30 * 1000, // 30 seconds
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<TournamentsListPage />} />
            <Route path="/tournament/:id" element={<TournamentDetailPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
