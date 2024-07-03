import Footer from './components/Footer'
import Home from './components/Home'
import Life from './components/Life'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Projects from './components/Projects';
import Contact from './components/Contact';

function App() {
  return <div className='flex flex-col w-screen h-screen max-w-screen max-h-screen overflow-y-scroll'>
    <Life />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
    <Footer />
  </div>
}

export default App
