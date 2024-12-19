import Footer from './components/Footer'
import Home from './components/Home'
import Life from './components/Life'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Blog from './components/Blog';
import Blogin from './components/Blogin';
import BlogPost from './components/BlogPost';
import CreateBlogPost from './components/CreateBlogPost';
import SignUpForWaitlist from './components/SignupForWaitlist';
import Redirect from './components/Redirect';

function App() {
  return <div className='flex flex-col w-screen max-w-screen min-h-screen overflow-y-scroll bg-white'>
    <Life />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/new" element={<CreateBlogPost />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/blog/:slug/edit" element={<CreateBlogPost editMode={true} />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Blogin />} />
        <Route path="/waitlist" element={<SignUpForWaitlist />} />
        <Route path="/kpn" element={<Redirect to="https://pertinent.hosting.uncentered.systems/coordinator:coordinator:haecceity.os/user" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
    <Footer />
  </div>
}

export default App
