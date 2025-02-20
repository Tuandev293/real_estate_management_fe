import { Route, Routes } from "react-router-dom";
import DetailPage from "../pages/DetailPage";
import HomePage from "../pages/HomePage";
import AddPage from "../pages/AddPage";

function Router() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add" element={<AddPage />} />
        <Route path="/details/:id" element={<DetailPage />} />
      </Routes>
    </div>
  );
}

export default Router;
