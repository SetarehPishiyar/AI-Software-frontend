import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import RTLProvider from "./ThemeProvider";
import HomePage from "./components/User/HomePage";
import LoginPage from "./components/Login";
import Header from "./components/User/Header";
import UserSignUp from "./components/User/SignUp";
import RestaurantSignUp from "./components/Restaurant/SignUp";
import UserProvider from "./contexts/UserContext";
import CustomerProfile from "./components/User/profile";
import RestaurantProfile from "./components/Restaurant/Profile";
import UserEditProfile from "./components/User/EditProfile";
import RestaurantEditProfile from "./components/Restaurant/EditProfile";
import FavoritesPage from "./components/User/FavoritesPage";
import SearchPage from "./components/User/SearchPage.js";
import RestaurantPage from "./components/User/RestaurantPage";
import EditMenu from "./components/Restaurant/EditMenu";
import FoodItemPage from "./components/User/MenuItem";
import CartsList from "./components/User/CartsList";
import CartPage from "./components/User/CartPage.js";

function App() {
  function isAuthenticated() {
    const accessToken = localStorage.getItem("access");
    const refreshToken = localStorage.getItem("refresh");
    return !!(accessToken && refreshToken);
  }

  return (
    <div className="app-container">
      <RTLProvider>
        <UserProvider>
          <Router>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Header isAuthenticated={isAuthenticated} />
                    <HomePage isAuthenticated={isAuthenticated} />
                  </>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/customer/signup" element={<UserSignUp />} />
              <Route path="/restuarant/signup" element={<RestaurantSignUp />} />
              <Route
                path="/customer/profile"
                element={
                  isAuthenticated() ? (
                    <CustomerProfile />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/customer/favorites"
                element={
                  isAuthenticated() ? (
                    <FavoritesPage />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/restaurant/:id/profile"
                element={<RestaurantProfile />}
              />
              <Route
                path="/customer/edit-profile"
                element={
                  isAuthenticated() ? (
                    <UserEditProfile />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/restaurant/:id/profileEdit"
                element={
                  isAuthenticated() ? (
                    <RestaurantEditProfile />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route path="/search" element={<SearchPage />} />
              <Route
                path="/customer/restaurants/:id"
                element={<RestaurantPage />}
              />
              <Route
                path="/restaurant/:res_id/menu"
                element={
                  isAuthenticated() ? <EditMenu /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/customer/restaurants/:id/:item_id"
                element={<FoodItemPage />}
              />
              <Route
                path="/customer/cart-list"
                element={
                  isAuthenticated() ? (
                    <CartsList />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/customer/carts"
                element={
                  isAuthenticated() ? <CartPage /> : <Navigate to="/login" />
                }
              />
            </Routes>
          </Router>
        </UserProvider>
      </RTLProvider>
    </div>
  );
}

export default App;
