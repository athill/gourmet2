import { Route, Routes } from "react-router";
import CreateRecipeForm from "./recipes/create-form/CreateRecipeForm";
import EditRecipeForm from "./recipes/edit-form/EditRecipeForm";
import ViewRecipe from "./recipes/view-recipe/ViewRecipe";
import IndexPage from "./index";

const Recipes = () => {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path=":id/edit" element={<EditRecipeForm />} />
      <Route path=":id" element={<ViewRecipe />} />
      <Route path="new" element={<CreateRecipeForm />} />
    </Routes>
  );
};

export default Recipes;
