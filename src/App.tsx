// import './App.css'
import { Routes, Route} from 'react-router'
import IndexPage from './components/pages/index'
import { Container, Navbar } from 'react-bootstrap';

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
    <Container fluid>
        <Navbar.Brand href="/">Recipes</Navbar.Brand>
    </Container>
    </Navbar>
  );
};

const App = () => {

  return (
    <>
    <Header />
    <Routes>
        <Route path="/" element={<IndexPage />} />
    </Routes>
    </>
  )
}

export default App
