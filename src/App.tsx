import './App.css'
import { Routes, Route} from 'react-router'
import IndexPage from './components/pages/index'
import { Container, Navbar } from 'react-bootstrap';
import Recipes from './components/pages/Recipes.tsx';

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
    <Container className="mt-4">
      <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/recipes"  element={<Recipes />}>
            <Route path=":id/edit" element={<Recipes />} />
            <Route path="new" element={<Recipes />} />
          </Route>
      </Routes>
    </Container>
    </>
  )
}

export default App
