import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";

import Home from "@/pages/Home";
import AuthWelcome from "@/pages/AuthWelcome";
import RegisterShop from "@/pages/RegisterShop";
import ShopPage from "@/pages/ShopPage";
import ProductDetail from "@/pages/ProductDetail";
import CheckoutSteps from "@/pages/CheckoutSteps";
import OrderList from "@/pages/OrderList";
import OrderDetail from "@/pages/OrderDetail";
import MerchantDashboard from "@/pages/MerchantDashboard";
import ProductList from "@/pages/ProductList";
import OrderManagement from "@/pages/OrderManagement";
import AffiliateDashboard from "@/pages/AffiliateDashboard";
import UserProfile from "@/pages/UserProfile";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30000 }
  }
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/welcome" component={AuthWelcome} />
        <Route path="/register-shop" component={RegisterShop} />
        <Route path="/shop/:shopId" component={ShopPage} />
        <Route path="/product/:productId" component={ProductDetail} />
        <Route path="/checkout" component={CheckoutSteps} />
        <Route path="/orders" component={OrderList} />
        <Route path="/orders/:orderId" component={OrderDetail} />
        <Route path="/dashboard" component={MerchantDashboard} />
        <Route path="/dashboard/products" component={ProductList} />
        <Route path="/dashboard/orders" component={OrderManagement} />
        <Route path="/affiliate" component={AffiliateDashboard} />
        <Route path="/profile" component={UserProfile} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
