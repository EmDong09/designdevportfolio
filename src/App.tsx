import Header from './components/Header'
import Hero from './components/Hero'
import SelectedWork from './components/SelectedWork'
import About from './components/About'
import Explorations from './components/Explorations'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <div id="top">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <SelectedWork />
        <About />
        <Explorations />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
