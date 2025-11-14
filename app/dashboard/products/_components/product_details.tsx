"use client"

import { useEffect, useState } from "react"
import { productApi } from "@/lib/api"

export default function ProductDetails({ productId }: { productId: string }) {
  const [product, setProduct] = useState<any>(null)

  useEffect(() => {
    fetchProduct()
  }, [])

  const fetchProduct = async () => {
    const res = await productApi.getById(productId)
    setProduct(res.data.data)
  }

  if (!product) return <div>Loading product details...</div>

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{product.title}</h1>

      <p><strong>Main Category:</strong> {product.mainCategory}</p>
      <p><strong>Sub Category:</strong> {product.subCategory?.name}</p>
      <p><strong>Child Category:</strong> {product.childCategory?.name}</p>

      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Discount Price:</strong> ${product.discountPrice || "-"}</p>

      <p><strong>Description:</strong></p>
      <p className="text-gray-700">{product.description}</p>

      <div className="mt-4">
        <strong>Tags:</strong>
        <div className="flex gap-2 flex-wrap mt-1">
          {product.tags?.map((tag: string, i: number) => (
            <span key={i} className="px-3 py-1 bg-gray-200 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
