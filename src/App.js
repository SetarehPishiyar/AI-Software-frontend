import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import RTLProvider from "./ThemeProvider";

// User Pages
import HomePage from "./pages/User/HomePage";
import UserSignUp from "./pages/User/SignUp";
import CustomerProfile from "./pages/User/profile";
import UserEditProfile from "./pages/User/EditProfile";
import FavoritesPage from "./pages/User/FavoritesPage";
import SearchPage from "./pages/User/SearchPage";
import RestaurantPage from "./pages/User/RestaurantPage";
import FoodItemPage from "./pages/User/MenuItem";
import CartsList from "./pages/User/CartsList";
import CartPage from "./pages/User/CartPage";
import CartCompletion from "./pages/User/CartCompletion";
import CheckoutPage from "./pages/User/Checkout";
import MyOrders from "./pages/User/MyOrders";
import TrackOrderPage from "./pages/User/TrackOrder";
import ReviewPage from "./pages/User/ReviewPage";

// Restaurant Pages
import RestaurantSignUp from "./pages/Restaurant/SignUp";
import RestaurantProfile from "./pages/Restaurant/Profile";
import RestaurantEditProfile from "./pages/Restaurant/EditProfile";
import EditMenu from "./pages/Restaurant/EditMenu";
import RestaurantOrderList from "./pages/Restaurant/Orders";

// Shared Components
import Header from "./pages/User/Header";
import LoginPage from "./pages/Login";

// Context
import UserProvider from "./contexts/UserContext";
import { FoodCartProvider } from "./contexts/FoodCartContext";

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
          <FoodCartProvider>
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
                <Route
                  path="/restuarant/signup"
                  element={<RestaurantSignUp />}
                />
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
                <Route
                  path="/customer/carts/:id/cart-completion"
                  element={
                    isAuthenticated() ? (
                      <CartCompletion />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/customer/carts/:id/checkout"
                  element={
                    isAuthenticated() ? (
                      <CheckoutPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/customer/orders"
                  element={
                    isAuthenticated() ? (
                      <MyOrders />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
                <Route
                  path="/restaurant/:id/orders"
                  element={
                    isAuthenticated() ? (
                      <RestaurantOrderList />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/customer/orders/:id/track-order"
                  element={
                    isAuthenticated() ? (
                      <TrackOrderPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="customer/orders/:id/review"
                  element={
                    isAuthenticated() ? (
                      <ReviewPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
              </Routes>
            </Router>
          </FoodCartProvider>
        </UserProvider>
      </RTLProvider>
    </div>
  );
}

export default App;
