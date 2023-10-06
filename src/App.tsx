import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'

import RootLayout from '@/layouts/RootLayout'
import MainLayout, { mainLayoutLoader } from '@/layouts/MainLayout'
import CategoriesLayout, { categoriesLayoutLoader } from '@/layouts/CategoriesLayout'
import ProfileLayout, { profileLayoutLoader } from '@/layouts/ProfileLayout'
import SellerDashboardLayout, { sellerDashboardLayoutLoader } from '@/layouts/SellerDashboardLayout'
import HomePage, { homePageLoader } from '@/pages/HomePage'
import CategoriesPage, { categoriesPageLoader } from '@/pages/CategoriesPage'
import CategoryProductsPage, { categoryProductsPageLoader } from '@/pages/CategoryProductsPage'
import ProductPage, { productPageLoader } from '@/pages/ProductPage'
import CartPage, { cartPageLoader } from '@/pages/CartPage'
import CheckoutSuccessPage, { checkoutSuccessPageLoader } from '@/pages/CheckoutSuccessPage'
import CheckoutCancelPage, { checkoutCancelPageLoader } from '@/pages/CheckoutCancelPage'
import AuthPage from '@/pages/AuthPage'
import ProfilePage, { profilePageLoader } from '@/pages/ProfilePage'
import OrdersPage, { ordersPageLoader } from '@/pages/OrdersPage'
import WishlistPage, { wishlistPageLoader } from '@/pages/WishlistPage'
import BecomeASellerPage, { becomeASellerPageLoader } from '@/pages/BecomeASellerPage'
import SellerDashboardPage, { sellerDashboardPageLoader } from '@/pages/SellerDashboardPage'
import SellerProductsPage, { sellerProductsPageLoader } from '@/pages/SellerProductsPage'
import AddOrEditProductPage, { addOrEditProductPageLoader } from '@/pages/AddOrEditProductPage'
import { authPageLoader } from '@/pages/AuthPage'
import ErrorPage from '@/pages/ErrorPage'

const App = () => {
  return (
    <RouterProvider router={createBrowserRouter(
      createRoutesFromElements(
        <Route path="/" element={<RootLayout />}>
          <Route path="/" element={<MainLayout />} loader={mainLayoutLoader} errorElement={<ErrorPage statusCode={500} message="Internal Server Error" />}>
            <Route path="/" element={<HomePage />} loader={homePageLoader} errorElement={<ErrorPage statusCode={500} message="Internal Server Error" />} />
            <Route path="/categories" element={<CategoriesLayout />} loader={categoriesLayoutLoader} errorElement={<ErrorPage statusCode={500} message="Internal Server Error" />}>
              <Route path="/categories" element={<CategoriesPage />} loader={categoriesPageLoader} errorElement={<ErrorPage statusCode={500} message="Internal Server Error" />} />
              <Route path="/categories/:categoryId/products" element={<CategoryProductsPage />} loader={categoryProductsPageLoader} errorElement={<ErrorPage statusCode={500} message="Internal Server Error" />} />
            </Route>
            <Route path="/categories/:categoryId/products/:productId" element={<ProductPage />} loader={productPageLoader} errorElement={<ErrorPage statusCode={500} message="Internal Server Error" />} />
            <Route path="/cart" element={<CartPage />} loader={cartPageLoader} errorElement={<ErrorPage statusCode={500} message="Internal Server Error" />} />
            <Route path="/profile/:userId" element={<ProfileLayout />} loader={profileLayoutLoader} errorElement={<ErrorPage statusCode={500} message="Internal Server Error" />}>
              <Route path="/profile/:userId" element={<ProfilePage />} loader={profilePageLoader} errorElement={<ErrorPage statusCode={500} message="Internal Server Error" />} />
              <Route path="/profile/:userId/orders" element={<OrdersPage />} loader={ordersPageLoader} errorElement={<ErrorPage statusCode={500} message="Internal Server Error" />} />
              <Route path="/profile/:userId/wishlist" element={<WishlistPage />} loader={wishlistPageLoader} errorElement={<ErrorPage statusCode={500} message="Internal Server Error" />} />
              <Route path="/profile/:userId/become-a-seller" element={<BecomeASellerPage />} loader={becomeASellerPageLoader} errorElement={<ErrorPage statusCode={500} message="Internal Server Error" />} />
              <Route path="/profile/:userId/seller-dashboard" element={<SellerDashboardLayout />} loader={sellerDashboardLayoutLoader} errorElement={<ErrorPage statusCode={500} message="Internal Server Error" />}>
                <Route path="/profile/:userId/seller-dashboard" element={<SellerDashboardPage />} loader={sellerDashboardPageLoader} errorElement={<ErrorPage statusCode={500} message="Internal Server Error" />} />
                <Route path="/profile/:userId/seller-dashboard/products" element={<SellerProductsPage />} loader={sellerProductsPageLoader} />
                <Route path="/profile/:userId/seller-dashboard/products/:productId" element={<AddOrEditProductPage />} loader={addOrEditProductPageLoader} />
              </Route>
            </Route>
          </Route>
          <Route path="/auth" element={<AuthPage />} loader={authPageLoader} errorElement={<ErrorPage statusCode={500} message="Internal Server Error" />} />
          <Route path="/:orderId/checkout/success" element={<CheckoutSuccessPage />} loader={checkoutSuccessPageLoader} errorElement={<ErrorPage statusCode={500} message="Internal Server Error" />} />
          <Route path="/:orderId/checkout/cancel" element={<CheckoutCancelPage />} loader={checkoutCancelPageLoader} errorElement={<ErrorPage statusCode={500} message="Internal Server Error" />} />
          <Route path="*" element={<ErrorPage statusCode={404} message="Page Not Found" />} />
        </Route>
      )
    )} />
  )
}

export default App