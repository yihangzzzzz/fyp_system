import React from "react";
import { Route, Routes } from "react-router-dom";
import "./styles/index.css";
import Home from "./pages/Home.jsx";
import Inventory from "./pages/Inventory.jsx";
import Orders from "./pages/Orders.jsx";
import Transfers from "./pages/Transfers.jsx";
import NewOrder from "./pages/NewOrder.jsx";
import LowStock from "./pages/LowStock.jsx";
import NewTransfer from "./pages/NewTransfer.jsx";
import NewItem from "./pages/NewItem.jsx";
import EditItem from "./pages/EditItem.jsx";
import AcceptTransfer from "./pages/AcceptTransfer.jsx";
import Login from "./pages/Login.jsx";
import NewDelivery from "./pages/NewDelivery.jsx";
import Users from "./pages/Users.jsx";
import MainPage from "./pages/MainPage.jsx";
import EmailTemplates from "./pages/EmailTemplates.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
import NotFound from "./pages/NotFound.jsx";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory/lowstock"
          element={
            <ProtectedRoute>
              <LowStock />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory/newitem"
          element={
            <ProtectedRoute>
              <NewItem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory/edititem/:itemID"
          element={
            <ProtectedRoute>
              <EditItem />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/neworder"
          element={
            <ProtectedRoute>
              <NewOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/newdelivery"
          element={
            <ProtectedRoute>
              <NewDelivery />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transfers/accepttransfer/:transferID"
          element={<AcceptTransfer />}
        />
        <Route
          path="/transfers"
          element={
            <ProtectedRoute>
              <Transfers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transfers/newtransfer"
          element={
            <ProtectedRoute>
              <NewTransfer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings/usermanagement"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/emailtemplates"
          element={
            <ProtectedRoute>
              <EmailTemplates />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
