import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ListPage from './pages/ListPage'
import ViewPage from './pages/ViewPage'
import AddPage from './pages/AddPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListPage />} />
        <Route path="/add" element={<AddPage />} />
        <Route path="/view/:id" element={<ViewPage />} />
        <Route path="/edit/:id" element={<AddPage />} />
      </Routes>
    </BrowserRouter>
  )
}
