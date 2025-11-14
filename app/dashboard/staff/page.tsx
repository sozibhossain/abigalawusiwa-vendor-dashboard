"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Edit2, Trash2, Search, X } from "lucide-react"
import { useToast } from "@/components/toast-provider"

interface StaffMember {
  id: number
  name: string
  email: string
  role: string
  phone: string
  status: string
}

const initialStaff: StaffMember[] = [
  { id: 1, name: "John Smith", email: "john@email.com", role: "Manager", phone: "+1-234-567-8900", status: "Active" },
  { id: 2, name: "Sarah Johnson", email: "sarah@email.com", role: "Staff", phone: "+1-234-567-8901", status: "Active" },
  {
    id: 3,
    name: "Mike Davis",
    email: "mike@email.com",
    role: "Supervisor",
    phone: "+1-234-567-8902",
    status: "Inactive",
  },
]

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: "", email: "", role: "Staff", phone: "", status: "Active" })
  const { addToast } = useToast()

  const filteredStaff = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddStaff = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      addToast({ title: "Please fill all fields", type: "error" })
      return
    }

    if (editingId) {
      setStaff(staff.map((s) => (s.id === editingId ? { ...s, ...formData } : s)))
      addToast({ title: "Staff member updated successfully", type: "success" })
      setEditingId(null)
    } else {
      const newMember: StaffMember = {
        id: Math.max(...staff.map((s) => s.id), 0) + 1,
        ...formData,
      }
      setStaff([...staff, newMember])
      addToast({ title: "Staff member added successfully", type: "success" })
    }

    setFormData({ name: "", email: "", role: "Staff", phone: "", status: "Active" })
    setShowForm(false)
  }

  const handleEdit = (member: StaffMember) => {
    setFormData({
      name: member.name,
      email: member.email,
      role: member.role,
      phone: member.phone,
      status: member.status,
    })
    setEditingId(member.id)
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    setStaff(staff.filter((s) => s.id !== id))
    addToast({ title: "Staff member deleted successfully", type: "success" })
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Manage Staff</h1>
        <Button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            setFormData({ name: "", email: "", role: "Staff", phone: "", status: "Active" })
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Staff
        </Button>
      </div>

      {showForm && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">{editingId ? "Edit Staff Member" : "Add New Staff"}</h2>
            <button onClick={() => setShowForm(false)}>
              <X className="w-5 h-5" />
            </button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Input
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white"
              />
              <Input
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-white"
              />
              <Input
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-white"
              />
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option>Staff</option>
                <option>Manager</option>
                <option>Supervisor</option>
                <option>Admin</option>
              </select>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white col-span-2"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddStaff} className="flex-1 bg-blue-600 hover:bg-blue-700">
                {editingId ? "Update" : "Add"} Staff
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((member) => (
                  <tr key={member.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900 font-medium">{member.name}</td>
                    <td className="py-3 px-4 text-gray-600">{member.email}</td>
                    <td className="py-3 px-4 text-gray-600">{member.role}</td>
                    <td className="py-3 px-4 text-gray-600">{member.phone}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          member.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(member)} className="p-1 hover:bg-gray-200 rounded">
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </button>
                        <button onClick={() => handleDelete(member.id)} className="p-1 hover:bg-gray-200 rounded">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
