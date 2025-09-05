// Utility to directly update products.json file
// This will create a downloadable file that can replace the JSON file

export const updateProductsJsonDirect = (products: any[]) => {
  try {
    // Create a JSON string with proper formatting
    const jsonString = JSON.stringify(products, null, 2);
    
    // Create a blob with the JSON data
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Create a download URL
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.download = 'products.json';
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return {
      success: true,
      message: 'products.json file downloaded successfully. Replace public/data/products.json with this file.'
    };
  } catch (error) {
    console.error('Error updating products.json:', error);
    return {
      success: false,
      message: 'Failed to update products.json file'
    };
  }
};

// Function to save products and trigger JSON download
export const saveProductsAndUpdateJson = (products: any[]) => {
  // Dispatch event to notify other components
  window.dispatchEvent(new CustomEvent('productsUpdated', { 
    detail: { products } 
  }));
  
  // Create downloadable JSON file
  const result = updateProductsJsonDirect(products);
  
  return {
    success: result.success,
    message: result.message,
    products: products
  };
};
