import { ExternalLink, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

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

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const handleAffiliateClick = () => {
    // In a real app, you'd track this click for analytics
    window.open(product.affiliateLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="group bg-gradient-card shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">
      <div className="relative overflow-hidden">
        {product.discount && (
          <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground px-2 py-1 rounded-md text-xs font-semibold z-10">
            {product.discount}
          </div>
        )}
        
        <div className="absolute top-3 right-3 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 hover:bg-background text-muted-foreground hover:text-destructive"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              // Only fallback to placeholder if it's not a data URL
              if (!product.image.startsWith('data:')) {
                target.src = '/placeholder.svg';
              }
            }}
          />
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-2">
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
        
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold text-primary">{product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {product.originalPrice}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAffiliateClick}
          className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;