import { Route, Routes } from "react-router";
import CreateRecipeForm from "./recipes/create-form/CreateRecipeForm";

const Recipes = () => {
  return (
    <Routes>
      <Route path="/" element={<div>Recipes Page Placeholder</div>} />
      <Route path=":id/edit" element={<div>Edit Recipe Placeholder</div>} />
      <Route path="new" element={<CreateRecipeForm />} />
    </Routes>
  );
};

export default Recipes;
