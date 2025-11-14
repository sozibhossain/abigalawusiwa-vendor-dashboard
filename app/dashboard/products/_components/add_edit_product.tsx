"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/toast-provider"
import { productApi } from "@/lib/api"

type ProductType = "generalgoods" | "vehicles" | "services"

interface ProductFormData {
  title: string
  briefDescription: string
  description: string
  deliveryPolicy: string
  childCategory: string
  regularPrice: string
  discountPrice: string
  tags: string[]
  document: string
  photo: string
  images: string[]
  stockQuantity?: string
  wholesalePrice?: string
  size?: string
  brands?: string
  colour?: string
  vehicleCondition?: string
  registration?: string
  specialFeatures?: string
  fuelType?: string
  cc?: string
  transmission?: string
  serviceFeatures?: string
}

const initialFormData: ProductFormData = {
  title: "",
  briefDescription: "",
  description: "",
  deliveryPolicy: "",
  childCategory: "",
  regularPrice: "",
  discountPrice: "",
  tags: [],
  document: "",
  photo: "",
  images: [],
  stockQuantity: "",
  wholesalePrice: "",
  size: "",
  brands: "",
  colour: "",
  vehicleCondition: "",
  registration: "",
  specialFeatures: "",
  fuelType: "",
  cc: "",
  transmission: "",
  serviceFeatures: "",
}

export default function AddEditProductPage({ productId }: { productId?: string }) {
  const [activeTab, setActiveTab] = useState<ProductType>("generalgoods")
  const [formData, setFormData] = useState<ProductFormData>(initialFormData)
  const [loading, setLoading] = useState(true)
  const [tagInput, setTagInput] = useState("")
  const { addToast } = useToast()

  const isEditing = !!productId

  // 🔥 Load product if editing
  useEffect(() => {
    if (productId) loadProduct()
    else setLoading(false)
  }, [productId])

  const loadProduct = async () => {
    try {
      const res = await productApi.getById(productId!)
      const p = res.data.data

      setFormData({
        title: p.title || "",
        briefDescription: p.briefDescription || "",
        description: p.description || "",
        deliveryPolicy: p.deliveryAndReturnPolicy || "",
        childCategory: p.childCategory?._id || "",
        regularPrice: String(p.price || ""),
        discountPrice: String(p.discountPrice || ""),
        tags: p.tags || [],
        document: "",
        photo: "",
        images: [],
        stockQuantity: p.generalGoods?.stockQuantity || "",
        wholesalePrice: p.generalGoods?.wholesalePrice || "",
        size: p.generalGoods?.size || "",
        brands: p.generalGoods?.brand || "",
        colour: p.generalGoods?.color?.[0] || "",
        vehicleCondition: p.vehicleCondition || "",
        registration: p.registration || "",
        specialFeatures: p.specialFeatures || "",
        fuelType: p.fuelType || "",
        cc: p.cc || "",
        transmission: p.transmission || "",
        serviceFeatures: p.serviceFeatures || "",
      })

      // 🔥 Set product type by main category
      if (p.mainCategory === "services") setActiveTab("services")
      else if (p.mainCategory === "vehicles") setActiveTab("vehicles")
      else setActiveTab("generalgoods")

      setLoading(false)
    } catch (err) {
      addToast({ title: "Failed to load product", type: "error" })
      setLoading(false)
    }
  }

  // 🔥 Add Tag
  const handleAddTag = () => {
    if (tagInput.trim()) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tagInput] }))
      setTagInput("")
    }
  }

  const handleRemoveTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }))
  }

  // 🔥 Submit Form
  const handleConfirm = async () => {
    if (!formData.title || !formData.childCategory) {
      addToast({ title: "Please fill in required fields", type: "error" })
      return
    }

    try {
      addToast({
        title: isEditing
          ? "Product updated successfully"
          : "Product added successfully",
        type: "success",
      })
    } catch (e) {
      addToast({ title: "Something went wrong", type: "error" })
    }
  }

  // 🔥 Fields Renderers
  const renderCommonFields = () => (
    <>
      <div>
        <label className="block text-sm font-medium mb-2">
          Title <span className="text-red-500">*</span>
        </label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter product title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Detailed Description</label>
        <textarea
          rows={4}
          className="w-full px-3 py-2 border rounded-lg"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Brief Description</label>
        <textarea
          rows={3}
          className="w-full px-3 py-2 border rounded-lg"
          value={formData.briefDescription}
          onChange={(e) => setFormData({ ...formData, briefDescription: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Delivery & Return Policy</label>
        <textarea
          rows={3}
          className="w-full px-3 py-2 border rounded-lg"
          value={formData.deliveryPolicy}
          onChange={(e) => setFormData({ ...formData, deliveryPolicy: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Child Category <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.childCategory}
          onChange={(e) => setFormData({ ...formData, childCategory: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="">Select Category</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Regular Price</label>
          <Input
            type="number"
            value={formData.regularPrice}
            onChange={(e) => setFormData({ ...formData, regularPrice: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Discount Price</label>
          <Input
            type="number"
            value={formData.discountPrice}
            onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
          />
        </div>
      </div>
    </>
  )

  const renderGeneralGoodsFields = () => (
    <>
      {renderCommonFields()}
      <div>
        <label className="block text-sm font-medium mb-2">Stock Quantity</label>
        <Input
          type="number"
          value={formData.stockQuantity}
          onChange={(e) =>
            setFormData({ ...formData, stockQuantity: e.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Wholesale Price</label>
          <Input
            type="number"
            value={formData.wholesalePrice}
            onChange={(e) =>
              setFormData({ ...formData, wholesalePrice: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Size</label>
          <select
            value={formData.size}
            onChange={(e) =>
              setFormData({ ...formData, size: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Select Size</option>
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
            <option>XL</option>
          </select>
        </div>
      </div>
    </>
  )

  const renderVehiclesFields = () => (
    <>
      {renderCommonFields()}
      <div>
        <label className="block text-sm font-medium mb-2">Special Features</label>
        <Input
          value={formData.specialFeatures}
          onChange={(e) =>
            setFormData({ ...formData, specialFeatures: e.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Vehicle Condition</label>
          <select
            value={formData.vehicleCondition}
            onChange={(e) =>
              setFormData({ ...formData, vehicleCondition: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Select</option>
            <option>New</option>
            <option>Used</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Registration</label>
          <select
            value={formData.registration}
            onChange={(e) =>
              setFormData({ ...formData, registration: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Select</option>
            <option>Registered</option>
            <option>Unregistered</option>
          </select>
        </div>
      </div>
    </>
  )

  const renderServicesFields = () => (
    <>
      {renderCommonFields()}
      <div>
        <label className="block text-sm font-medium mb-2">Service Features</label>
        <Input
          value={formData.serviceFeatures}
          onChange={(e) =>
            setFormData({ ...formData, serviceFeatures: e.target.value })
          }
        />
      </div>
    </>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "vehicles":
        return renderVehiclesFields()
      case "services":
        return renderServicesFields()
      default:
        return renderGeneralGoodsFields()
    }
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/products">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <h1 className="text-3xl font-bold">
          {isEditing ? "Edit Product" : "Add New Product"}
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b">
        {[
          { id: "generalgoods", label: "General Goods" },
          { id: "vehicles", label: "Vehicles" },
          { id: "services", label: "Services" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ProductType)}
            className={`px-4 py-2 font-medium border-b-2 ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FORM LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">{renderTabContent()}</CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>

                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                  />
                  <Button onClick={handleAddTag} className="bg-blue-600">
                    +
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-2"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(index)}
                        className="text-blue-800 hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* IMAGE UPLOAD */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                <p className="text-sm">Drag & drop or click to upload</p>
                <Button className="mt-4 bg-blue-600">Upload Image</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4">
        <Link href="/dashboard/products">
          <Button variant="outline" className="border-red-500 text-red-500">
            Cancel
          </Button>
        </Link>

        <Button onClick={handleConfirm} className="bg-blue-600">
          Confirm
        </Button>
      </div>
    </div>
  )
}
