import './App.css'
import { Routes, Route, Outlet, useLocation} from 'react-router'
import IndexPage from './components/pages/index'
import { Alert, Container, Navbar } from 'react-bootstrap';
import Recipes from './components/pages/Recipes.tsx';
import { useEffect, useState } from 'react';
import AppContext from './components/AppContext.tsx';
import PrintRecipe from './components/pages/recipes/view-recipe/PrintRecipe.tsx';
import Test from './components/Test.tsx';

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
  const [options, setOptions] = useState({ categories: [], cuisines: [], units: [], yieldsUnits: [] });
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

const AppLayout = () => {
  const location = useLocation();
  const pageAlert = location?.state?.pageAlert;
  return (
    <>
      <Header />
      <Container className="mt-4">
        {!!pageAlert && <Alert {...pageAlert} />}
        <Outlet />
      </Container>
    </>
  );
};

  const PrintPayout = () => (
  <Container className="mt-4">
    <Outlet />
  </Container>
);

  return (
    <>
    <AppContext.Provider value={options}>
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<IndexPage />} />
          <Route path="/recipes/*"  element={<Recipes />}>
            <Route path=":id" element={<Recipes />} />
            <Route path=":id/edit" element={<Recipes />} />
            <Route path="new" element={<Recipes />} />
          </Route>
        </Route>
        <Route element={<PrintPayout />}>
          <Route path="/print/recipes/:id"  element={<PrintRecipe />}></Route>
          <Route path="/test" element={<Test />} />
        </Route>
      </Routes>
    </AppContext.Provider>
    </>
  )
}

export default App
