import { Routes, Route } from 'react-router';
import Layout from './components/Layout';
import Home from './pages/Home';
import Subject from './pages/Subject';
import Game from './pages/Game';
import Profile from './pages/Profile';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/subject/:subject" element={<Subject />} />
        <Route path="/game/:subject/:gameId" element={<Game />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
