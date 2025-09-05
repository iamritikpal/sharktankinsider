import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Save, X, RefreshCw, Download, Upload, Image as ImageIcon, XCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { uploadImageToLocal } from '@/utils/imageStorage';

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

interface AdminProps {
  onLogout?: () => void;
}

const Admin = ({ onLogout }: AdminProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    image: '',
    affiliateLink: '',
    category: '',
    featured: false,
    discount: ''
  });

  // Image upload state
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const categories = [
    'Electronics',
    'Health & Wellness',
    'Food & Beverages',
    'Beauty & Personal Care',
    'Baby Care',
    'Fashion',
    'Home & Garden',
    'Sports & Fitness',
    'Books & Education',
    'Other'
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    try {
      // First try to load from localStorage
      const savedProducts = localStorage.getItem('admin-products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        // Fallback to loading from JSON file
        fetch('/data/products.json')
          .then(response => response.json())
          .then(data => {
            setProducts(data);
            // Save to localStorage for future edits
            localStorage.setItem('admin-products', JSON.stringify(data));
          })
          .catch(error => {
            console.error('Error loading products:', error);
            toast({
              title: "Error",
              description: "Failed to load products",
              variant: "destructive",
            });
          });
      }
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveProducts = (newProducts: Product[]) => {
    localStorage.setItem('admin-products', JSON.stringify(newProducts));
    setProducts(newProducts);
    
    // Also save to a backup file that can be used in incognito mode
    try {
      const dataStr = JSON.stringify(newProducts, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      // Create a download link for the updated products.json
      const link = document.createElement('a');
      link.href = url;
      link.download = 'products.json';
      
      // Store the blob URL for potential use
      localStorage.setItem('admin-products-blob', url);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating backup:', error);
    }
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('productsUpdated', { 
      detail: { products: newProducts } 
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      image: '',
      affiliateLink: '',
      category: '',
      featured: false,
      discount: ''
    });
    setUploadedImage(null);
    setImagePreview('');
    setIsEditing(false);
    setEditingProduct(null);
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    setUploadedImage(file);

    try {
      const result = await uploadImageToLocal(file);
      
      if (result.success) {
        setImagePreview(result.imageUrl);
        setFormData(prev => ({
          ...prev,
          image: result.imageUrl
        }));

        toast({
          title: "Success",
          description: "Image uploaded successfully!",
        });
      } else {
        toast({
          title: "Upload Error",
          description: result.error || "Failed to upload image",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeUploadedImage = () => {
    setUploadedImage(null);
    setImagePreview('');
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Name, Price, Category)",
        variant: "destructive",
      });
      return;
    }

    const newProduct: Product = {
      id: editingProduct ? editingProduct.id : Date.now(),
      name: formData.name,
      description: formData.description,
      price: formData.price,
      originalPrice: formData.originalPrice || undefined,
      image: formData.image || '/placeholder.svg',
      affiliateLink: formData.affiliateLink,
      category: formData.category,
      featured: formData.featured,
      discount: formData.discount || undefined
    };

    let updatedProducts;
    if (editingProduct) {
      updatedProducts = products.map(p => p.id === editingProduct.id ? newProduct : p);
      toast({
        title: "Success",
        description: "Product updated successfully!",
      });
    } else {
      updatedProducts = [...products, newProduct];
      toast({
        title: "Success",
        description: "Product added successfully!",
      });
    }

    saveProducts(updatedProducts);
    resetForm();
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || '',
      image: product.image,
      affiliateLink: product.affiliateLink,
      category: product.category,
      featured: product.featured || false,
      discount: product.discount || ''
    });
    setEditingProduct(product);
    setIsEditing(true);
    
    // Set image preview for existing images
    if (product.image) {
      setImagePreview(product.image);
    }
  };

  const handleDelete = (productId: number) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    saveProducts(updatedProducts);
    toast({
      title: "Success",
      description: "Product deleted successfully!",
    });
  };

  const calculateDiscount = () => {
    if (formData.price && formData.originalPrice) {
      const price = parseInt(formData.price.replace(/[₹,]/g, ''));
      const originalPrice = parseInt(formData.originalPrice.replace(/[₹,]/g, ''));
      if (originalPrice > price) {
        const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
        setFormData(prev => ({ ...prev, discount: `${discount}% OFF` }));
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">Admin Panel</h1>
              <p className="text-xl text-muted-foreground">
                Manage your Shark Tank products
              </p>
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Changes are saved to localStorage. To make them permanent and visible in incognito mode, 
                  use the "Export & Update JSON" button and replace the <code>public/data/products.json</code> file.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={loadProducts}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const dataStr = JSON.stringify(products, null, 2);
                  const dataBlob = new Blob([dataStr], { type: 'application/json' });
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'products.json';
                  link.click();
                  URL.revokeObjectURL(url);
                  toast({
                    title: "Success",
                    description: "Products exported! Replace public/data/products.json with this file to make changes permanent.",
                  });
                }}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export & Update JSON
              </Button>
              {onLogout && (
                <Button
                  variant="outline"
                  onClick={onLogout}
                  className="flex items-center gap-2 text-destructive hover:text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Edit className="w-5 h-5" />
                      Edit Product
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Add New Product
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Enter product description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price *</Label>
                      <Input
                        id="price"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        placeholder="₹1,299"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="originalPrice">Original Price</Label>
                      <Input
                        id="originalPrice"
                        value={formData.originalPrice}
                        onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                        placeholder="₹2,990"
                        onBlur={calculateDiscount}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="discount">Discount</Label>
                    <Input
                      id="discount"
                      value={formData.discount}
                      onChange={(e) => handleInputChange('discount', e.target.value)}
                      placeholder="57% OFF"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="image">Product Image</Label>
                    
                    {/* Image Upload Area */}
                    <div className="space-y-4">
                      {/* Upload Area */}
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                          isUploading
                            ? 'border-primary bg-primary/5'
                            : 'border-muted-foreground/25 hover:border-primary/50'
                        }`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                      >
                        {imagePreview ? (
                          <div className="space-y-4">
                            <div className="relative inline-block">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded-lg mx-auto"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2 w-6 h-6"
                                onClick={removeUploadedImage}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {uploadedImage ? uploadedImage.name : 'Current image'}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {isUploading ? 'Uploading...' : 'Upload an image'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Drag and drop or click to browse
                              </p>
                            </div>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleFileInputChange}
                              className="hidden"
                              id="image-upload"
                              disabled={isUploading}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById('image-upload')?.click()}
                              disabled={isUploading}
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              {isUploading ? 'Uploading...' : 'Choose File'}
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Alternative: Manual URL Input */}
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-2">Or enter image URL manually:</p>
                        <Input
                          id="image"
                          value={formData.image}
                          onChange={(e) => {
                            handleInputChange('image', e.target.value);
                            setImagePreview(e.target.value);
                          }}
                          placeholder="/images/product.jpg or https://example.com/image.jpg"
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="affiliateLink">Affiliate Link</Label>
                    <Input
                      id="affiliateLink"
                      value={formData.affiliateLink}
                      onChange={(e) => handleInputChange('affiliateLink', e.target.value)}
                      placeholder="https://affiliate-link.com/product"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => handleInputChange('featured', checked)}
                    />
                    <Label htmlFor="featured">Featured Product</Label>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      {isEditing ? 'Update' : 'Add'} Product
                    </Button>
                    {isEditing && (
                      <Button type="button" variant="outline" onClick={resetForm}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Products List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Products ({products.length})</span>
                  <Badge variant="secondary">
                    {products.filter(p => p.featured).length} Featured
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            // Only fallback to placeholder if it's not a data URL
                            if (!product.image.startsWith('data:')) {
                              target.src = '/placeholder.svg';
                            }
                          }}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{product.name}</h3>
                          {product.featured && (
                            <Badge variant="default" className="text-xs">Featured</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{product.category}</p>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-primary">{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {product.originalPrice}
                            </span>
                          )}
                          {product.discount && (
                            <Badge variant="destructive" className="text-xs">
                              {product.discount}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => window.open(product.affiliateLink, '_blank')}
                          disabled={!product.affiliateLink}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Product</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{product.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(product.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}

                  {products.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No products found. Add your first product!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
