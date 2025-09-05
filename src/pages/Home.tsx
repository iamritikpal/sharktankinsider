import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, TrendingUp, Users, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/ProductCard';
import heroImage from '@/assets/hero-image.jpg';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  image: string;
  affiliateLink: string;
  category: string;
  featured?: boolean;
  discount?: string;
}

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Load featured products - first try localStorage (admin edits), then fallback to JSON
    const loadFeaturedProducts = () => {
      try {
        const savedProducts = localStorage.getItem('admin-products');
        if (savedProducts) {
          const data = JSON.parse(savedProducts);
          const featured = data.filter((product: Product) => product.featured).slice(0, 3);
          setFeaturedProducts(featured);
        } else {
          // Fallback to loading from JSON file
          fetch('/data/products.json')
            .then(response => response.json())
            .then(data => {
              const featured = data.filter((product: Product) => product.featured).slice(0, 3);
              setFeaturedProducts(featured);
            })
            .catch(error => console.error('Error loading products:', error));
        }
      } catch (error) {
        console.error('Error loading featured products:', error);
      }
    };

    loadFeaturedProducts();

    // Listen for storage changes to update featured products in real-time
    const handleStorageChange = () => {
      loadFeaturedProducts();
    };

    // Listen for page focus to refresh when returning from admin
    const handlePageFocus = () => {
      loadFeaturedProducts();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('productsUpdated', handleStorageChange);
    window.addEventListener('focus', handlePageFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('productsUpdated', handleStorageChange);
      window.removeEventListener('focus', handlePageFocus);
    };
  }, []);

  const stats = [
    {
      icon: Star,
      value: '50+',
      label: 'Featured Products',
      description: 'Curated from Shark Tank'
    },
    {
      icon: TrendingUp,
      value: '₹1L+',
      label: 'Savings Generated',
      description: 'For our community'
    },
    {
      icon: Users,
      value: '5K+',
      label: 'Happy Customers',
      description: 'Trust our recommendations'
    },
    {
      icon: ShoppingBag,
      value: '10+',
      label: 'Brand Partners',
      description: 'From Shark Tank India'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-overlay" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Discover 
              <span className="bg-gradient-primary bg-clip-text text-transparent"> Shark Tank</span>
              <br />Products
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Explore handpicked affiliate products and success stories from India's most innovative entrepreneurs
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" asChild className="bg-gradient-primary hover:opacity-90 shadow-primary">
                <Link to="/products">
                  Shop Products
                  <ShoppingBag className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" asChild className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Link to="/blogs">
                  Read Success Stories
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-2">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-white/80 font-medium">{stat.label}</div>
                  <div className="text-xs text-white/60">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Handpicked products from successful Shark Tank entrepreneurs, 
              now available with exclusive deals and offers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" asChild className="bg-gradient-primary">
              <Link to="/products">
                View All Products
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              Join the Success Revolution
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Get exclusive access to Shark Tank products, entrepreneur insights, 
              and the best deals from India's most innovative brands
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90">
                <Link to="/products">Start Shopping Now</Link>
              </Button>
              <Button size="lg" variant="default" asChild className="border-white text-white hover:bg-white/10">
                <Link to="/about">Learn More About Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;