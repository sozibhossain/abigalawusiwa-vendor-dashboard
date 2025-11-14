"use client"

import { useParams } from "next/navigation"
import AddEditProductPage from "../../_components/add_edit_product"

export default function EditProductPage() {
  const { id } = useParams()  

  return <AddEditProductPage productId={id as string} />
}
