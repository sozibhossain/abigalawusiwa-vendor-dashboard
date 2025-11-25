"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function PaymentModal({ open, onClose, onSubmit, amount }) {
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [street, setStreet] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zip, setZip] = useState("")
  const [mobile, setMobile] = useState("")

  const handlePay = () => {
    if (!email) {
      alert("Email required")
      return
    }

    onSubmit({
      email,
      firstName,
      lastName,
      street,
      city,
      state,
      zip,
      mobile
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <h2 className="text-xl font-bold mb-4">Billing Details</h2>

        <div className="space-y-3">
          <input
            className="border rounded w-full p-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="flex gap-2">
            <input
              className="border rounded w-full p-2"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              className="border rounded w-full p-2"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <input
            className="border rounded w-full p-2"
            placeholder="Street address"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />

          <input
            className="border rounded w-full p-2"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <div className="flex gap-2">
            <input
              className="border rounded w-full p-2"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            <input
              className="border rounded w-full p-2"
              placeholder="ZIP code"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
            />
          </div>

          <input
            className="border rounded w-full p-2"
            placeholder="Mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>

        <Button className="w-full mt-4" onClick={handlePay}>
          Pay ${amount}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
