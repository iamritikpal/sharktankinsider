import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductCard from '@/components/ProductCard';

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

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [isLoading, setIsLoading] = useState(true);
  const [urlParamsApplied, setUrlParamsApplied] = useState(false);

  useEffect(() => {
    // Load products - first try localStorage (admin edits), then fallback to JSON
    const loadProducts = () => {
      try {
        const savedProducts = localStorage.getItem('admin-products');
        if (savedProducts) {
          const data = JSON.parse(savedProducts);
          setProducts(data);
          setFilteredProducts(data);
          setIsLoading(false);
          
          // Dispatch event to notify other components
          window.dispatchEvent(new CustomEvent('productsUpdated', { 
            detail: { products: data } 
          }));
        } else {
          // Fallback to loading from JSON file
          fetch('/data/products.json')
            .then(response => response.json())
            .then(data => {
              setProducts(data);
              setFilteredProducts(data);
              setIsLoading(false);
              
              // Dispatch event to notify other components
              window.dispatchEvent(new CustomEvent('productsUpdated', { 
                detail: { products: data } 
              }));
            })
            .catch(error => {
              console.error('Error loading products:', error);
              setIsLoading(false);
            });
        }
      } catch (error) {
        console.error('Error loading products:', error);
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    console.log('Filtering products:', {
      totalProducts: products.length,
      searchTerm,
      selectedCategory,
      sortBy
    });

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      console.log('Filtering by category:', selectedCategory);
      filtered = filtered.filter(product => {
        const productCategory = product.category;
        const selectedCategoryDecoded = decodeURIComponent(selectedCategory);
        const match = productCategory === selectedCategoryDecoded;
        console.log('Product category:', productCategory, 'Selected (decoded):', selectedCategoryDecoded, 'Match:', match);
        return match;
      });
    }

    // Sort products
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return parseInt(a.price.replace(/[₹,]/g, '')) - parseInt(b.price.replace(/[₹,]/g, ''));
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy]);

  // Reset URL params applied flag when searchParams change
  useEffect(() => {
    setUrlParamsApplied(false);
  }, [searchParams]);

  // Apply URL parameters after products are loaded
  useEffect(() => {
    if (!isLoading && products.length > 0 && !urlParamsApplied) {
      const search = searchParams.get('search') || '';
      const category = decodeURIComponent(searchParams.get('category') || 'all');
      const sort = searchParams.get('sort') || 'name';
      const view = (searchParams.get('view') as 'grid' | 'list') || 'grid';

      console.log('Applying URL parameters:', { search, category, sort, view });

      setSearchTerm(search);
      setSelectedCategory(category);
      setSortBy(sort);
      setViewMode(view);
      setUrlParamsApplied(true);
    }
  }, [isLoading, products, searchParams, urlParamsApplied]);

  // Function to update URL parameters
  const updateURLParams = (updates: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== 'name') {
        // Properly encode the value for URL
        newSearchParams.set(key, encodeURIComponent(value));
      } else {
        newSearchParams.delete(key);
      }
    });
    
    setSearchParams(newSearchParams, { replace: true });
  };

  // Function to handle search term changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    updateURLParams({ search: value });
  };

  // Function to handle category changes
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    updateURLParams({ category: value });
  };

  // Function to handle sort changes
  const handleSortChange = (value: string) => {
    setSortBy(value);
    updateURLParams({ sort: value });
  };

  // Function to handle view mode changes
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    updateURLParams({ view: mode });
  };

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Shark Tank Products</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover innovative products from India's most successful entrepreneurs
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-card shadow-card rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="text-sm font-medium mb-2 block">Search Products</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by name, description, or category..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div>
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Mode */}
            <div>
              <label className="text-sm font-medium mb-2 block">View</label>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => handleViewModeChange('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => handleViewModeChange('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters
            </p>
            <Button onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSortBy('name');
              setViewMode('grid');
              updateURLParams({ search: '', category: 'all', sort: 'name', view: 'grid' });
            }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;