import { Route, Routes } from "react-router";
import CreateRecipeForm from "./recipes/create-form/CreateRecipeForm";
import EditRecipeForm from "./recipes/edit-form/EditRecipeForm";

const Recipes = () => {
  return (
    <Routes>
      <Route path="/" element={<div>Recipes Page Placeholder</div>} />
      <Route path=":id/edit" element={<EditRecipeForm />} />
      <Route path="new" element={<CreateRecipeForm />} />
    </Routes>
  );
};

export default Recipes;
