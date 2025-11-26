"use client"

import { useState, useEffect } from "react"
import { Search, MessageCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { customerApi, adminApi } from "@/lib/api"

export interface Customer {
  _id: string
  name: string
  email: string
  profileImage?: string
  totalOrders?: number
  moneySpent?: number
  // optional flag so you know who you're talking to on the parent side if needed
  userType?: "customer" | "admin"
}

interface ChatSidebarProps {
  selectedCustomer: Customer | null
  onSelectCustomer: (customer: Customer) => void
  onStartConversation: (customer: Customer) => void
}

export function ChatSidebar({
  selectedCustomer,
  onSelectCustomer,
  onStartConversation,
}: ChatSidebarProps) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [admins, setAdmins] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch customers (paginated)
      const customerResponse = await customerApi.getAll(page, 10)
      const customersData = customerResponse?.data?.data?.customers || []
      const mappedCustomers: Customer[] = customersData.map((c: any) => ({
        _id: c._id,
        name: c.name || c.fullName || c.email || "Unknown",
        email: c.email || "",
        profileImage: c.profileImage || c.avatar,
        totalOrders: c.totalOrders,
        moneySpent: c.moneySpent,
        userType: "customer",
      }))

      setCustomers(mappedCustomers)
      setTotalPages(customerResponse?.data?.data?.pagination?.totalPages || 1)

      // Fetch admins (usually smaller list, so you can request more)
      const adminResponse = await adminApi.getAllAdmins(1, 50)
      const adminsData = adminResponse?.data?.data?.admins || adminResponse?.data?.data || []

      const mappedAdmins: Customer[] = adminsData.map((a: any) => ({
        _id: a._id,
        name: a.name || a.fullName || a.email || "Unknown",
        email: a.email || "",
        profileImage: a.profileImage || a.avatar,
        totalOrders: 0,
        moneySpent: 0,
        userType: "admin",
      }))

      setAdmins(mappedAdmins)
    } catch (error) {
      console.error("Failed to fetch customers/admins:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const term = searchTerm.toLowerCase().trim()

  const filterBySearch = (item: Customer) =>
    item.name.toLowerCase().includes(term) || item.email.toLowerCase().includes(term)

  const filteredCustomers = customers.filter(filterBySearch)
  const filteredAdmins = admins.filter(filterBySearch)

  const renderRow = (user: Customer) => (
    <div
      key={`${user.userType}-${user._id}`}
      role="button"
      tabIndex={0}
      onClick={() => onSelectCustomer(user)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelectCustomer(user)
      }}
      className={`group w-full p-4 border-b border-gray-100 text-left transition-colors cursor-pointer ${
        selectedCustomer?._id === user._id ? "bg-blue-50" : "hover:bg-gray-50"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative">
          {user.profileImage ? (
            <img
              src={user.profileImage || "/placeholder.svg"}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">
            {user.name}
            {user.userType === "admin" && (
              <span className="ml-1 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                Admin
              </span>
            )}
          </p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
          {user.userType === "customer" && (
            <p className="text-xs text-gray-600 mt-1">
              Orders: {user.totalOrders || 0} • Spent: ${user.moneySpent || 0}
            </p>
          )}
        </div>

        {/* Message Button */}
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation()
            onStartConversation(user)
          }}
          className="opacity-0 group-hover:opacity-100"
        >
          <MessageCircle className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )

  return (
    <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Messages</h2>
        <p className="text-sm text-gray-500 mb-4">Chat with admins & customers</p>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-50"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading users...</div>
        ) : filteredAdmins.length === 0 && filteredCustomers.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No admins or customers found</div>
        ) : (
          <>
            {/* Admins */}
            {filteredAdmins.length > 0 && (
              <div>
                <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Admins
                </div>
                {filteredAdmins.map(renderRow)}
              </div>
            )}

            {/* Customers */}
            {filteredCustomers.length > 0 && (
              <div>
                <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Customers
                </div>
                {filteredCustomers.map(renderRow)}
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination (customers only) */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600 flex items-center px-2">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
