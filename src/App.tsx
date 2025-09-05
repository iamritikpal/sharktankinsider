import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import About from "./pages/About";
import ProtectedAdmin from "./components/ProtectedAdmin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Helmet prioritizeSeoTags>
          <title>Shark tank insider – Discover & Buy Top Shark Tank Products</title>
          <meta name="description" content="Explore the best Shark Tank products, startups, and deals in India. Find affiliate links, blogs, and exclusive product insights." />
          <meta name="keywords" content="Shark Tank, Shark Tank India, Shark Tank products, affiliate deals, startup info, blogs" />
          <meta name="author" content="Your Name or Brand" />
          <meta property="og:title" content="Shark Tank Deals – Discover & Buy Top Shark Tank Products" />
          <meta property="og:description" content="Explore the best Shark Tank products, startups, and deals in India. Find affiliate links, blogs, and exclusive product insights." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={typeof window !== "undefined" ? window.location.origin : "https://example.com"} />
          <meta property="og:image" content="/logo.png" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Shark Tank Deals – Discover & Buy Top Shark Tank Products" />
          <meta name="twitter:description" content="Explore the best Shark Tank products, startups, and deals in India. Find affiliate links, blogs, and exclusive product insights." />
          <meta name="twitter:image" content="/logo.png" />
        </Helmet>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<ProtectedAdmin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
