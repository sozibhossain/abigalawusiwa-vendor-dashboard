"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/toast-provider"
import { authApi } from "@/lib/api"
import { Eye, EyeOff, Upload, Trash2 } from "lucide-react"
import { DeleteModal } from "@/components/delete-modal"
import Image from "next/image"

export default function AccountPage() {
  const { data: session } = useSession()
  const { addToast } = useToast()
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [profileData, setProfileData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    address: "",
    birthday: "",
  })

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast({ title: "Passwords do not match", type: "error" })
      return
    }

    if (passwordData.newPassword.length < 6) {
      addToast({ title: "Password must be at least 6 characters", type: "error" })
      return
    }

    setLoading(true)

    try {
      await authApi.changePassword(passwordData.oldPassword, passwordData.newPassword)
      addToast({ title: "Password changed successfully", type: "success" })
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" })
      setShowPasswordForm(false)
    } catch (error: any) {
      addToast({
        title: error?.response?.data?.message || "Failed to change password",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Account</h1>
        <p className="text-gray-600 text-sm">Customize until match to your workflow</p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6 pb-6 border-b">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center overflow-hidden">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image || "/placeholder.svg"}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl text-white font-bold">{session?.user?.name?.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                <Upload className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{session?.user?.name}</h3>
              <p className="text-sm text-gray-600">{session?.user?.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <Input
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <Input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <Input
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="bg-white"
                placeholder="(400) 555-0120"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <Input
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                className="bg-white"
                placeholder="4317 Washington Ave"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Birthday</label>
              <Input
                type="date"
                value={profileData.birthday}
                onChange={(e) => setProfileData({ ...profileData, birthday: e.target.value })}
                className="bg-white"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Update Profile</Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Password Section */}
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showPasswordForm ? (
            <Button onClick={() => setShowPasswordForm(true)} className="bg-blue-600 hover:bg-blue-700">
              Change Password
            </Button>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                    className="bg-white pr-10"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="bg-white pr-10"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="bg-white"
                  disabled={loading}
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  {loading ? "Updating..." : "Update Password"}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  variant="outline"
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Delete Account Section */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-600">Delete account</CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            When you delete your account, you lose access to services, and we permanently delete your personal data. You
            can cancel the deletion for 14 days.
          </p>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setShowDeleteModal(true)} className="bg-red-600 hover:bg-red-700">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </CardContent>
      </Card>

      <DeleteModal
        open={showDeleteModal}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone. You have 14 days to cancel."
        confirmText="Yes, Delete My Account"
        onConfirm={() => {
          addToast({ title: "Account deletion initiated", type: "success" })
          setShowDeleteModal(false)
        }}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  )
}
