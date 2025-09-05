import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  structuredData?: any;
}

const SEO = ({ 
  title = "SharkTankInsider - Discover Shark Tank Products & Success Stories",
  description = "Explore curated affiliate products from successful Shark Tank India entrepreneurs. Read inspiring success stories, get exclusive deals, and support innovative Indian startups.",
  keywords = "shark tank india, affiliate products, entrepreneur stories, indian startups, exclusive deals, business success",
  canonical,
  ogImage = "https://sharktankinsider.shop/og-image.jpg",
  structuredData
}: SEOProps) => {
  const fullTitle = title.includes("SharkTankInsider") ? title : `${title} | SharkTankInsider`;
  const fullCanonical = canonical || "https://sharktankinsider.shop/";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonical} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="SharkTankInsider" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
