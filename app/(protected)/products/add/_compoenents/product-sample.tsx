import ProductCard from '@/app/(protected)/_components/product-card'
import { Product } from '@/stores/product-store'
import React from 'react'

const ProductSample = ({product}: {product: Product}) => {
  return (
    <ProductCard product={product} />
  )
}

export default ProductSample