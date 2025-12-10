import './App.css'
import { Routes, Route} from 'react-router'
import IndexPage from './components/pages/index'
import { Container, Navbar } from 'react-bootstrap';
import Recipes from './components/pages/Recipes.tsx';
import { use, useEffect, useState } from 'react';
import AppContext from './components/AppContext.tsx';

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
  const [options, setOptions] = useState({ categories: [], cuisines: [], units: [] });
  useEffect(() => {
    const getOptions = async () => {
      try {
        const response = await fetch('/api/options');
        const data = await response.json();
        setOptions(data);
        // console.log('Options:', data);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };
    getOptions();
  }, []);

  return (
    <>
    <AppContext.Provider value={options}>
      <Header />
      <Container className="mt-4">
        <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/recipes"  element={<Recipes />}>
              <Route path=":id" element={<Recipes />} />
              <Route path=":id/edit" element={<Recipes />} />
              <Route path="new" element={<Recipes />} />
            </Route>
        </Routes>
      </Container>
    </AppContext.Provider>
    </>
  )
}

export default App
