"use client"

import { useState } from "react"
import { Search, Send, MoreVertical } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/toast-provider"

const chats = [
  {
    id: 1,
    name: "Guy Hawkins",
    status: "Not replied",
    message: "I new job in California matches your preferences.",
    time: "2:22 PM",
    avatar: "GH",
    online: true,
  },
  {
    id: 2,
    name: "Guy Hawkins",
    status: "Not replied",
    message: "I new job in California matches your preferences.",
    time: "2:22 PM",
    avatar: "GH",
    online: false,
  },
  {
    id: 3,
    name: "Guy Hawkins",
    status: "Not replied",
    message: "I new job in California matches your preferences.",
    time: "2:22 PM",
    avatar: "GH",
    online: true,
  },
]

const messages = [
  {
    id: 1,
    sender: "customer",
    text: "Hey, I'd like to have your contact information if you're comfortable sharing it. Let me know if you have any questions!",
    time: "2:15 PM",
  },
  {
    id: 2,
    sender: "admin",
    text: "Hey, sure! I can share my contact information with you. Feel free to reach out if you need anything!",
    time: "2:55 PM",
  },
]

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState(1)
  const [messageText, setMessageText] = useState("")
  const { addToast } = useToast()

  const handleSendMessage = () => {
    if (messageText.trim()) {
      addToast({
        title: "Message sent",
        description: "Your message has been sent successfully",
        type: "success",
      })
      setMessageText("")
    }
  }

  return (
    <div className="flex h-full bg-white">
      {/* Chat List */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Messages</h2>
          <p className="text-sm text-gray-500 mb-4">Communicate with Customers and support</p>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent">
              Customer Chats
            </Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Admin Supports</Button>
          </div>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search" className="pl-10 bg-gray-50" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`w-full p-4 border-b border-gray-100 text-left transition-colors ${
                selectedChat === chat.id ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                    {chat.avatar}
                  </div>
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{chat.name}</p>
                  <p className="text-xs text-gray-500">{chat.status}</p>
                  <p className="text-sm text-gray-600 truncate">{chat.message}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">{chat.time}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Interested in your contact</h3>
            <p className="text-sm text-gray-500">Active now</p>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender === "admin" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.sender === "admin" ? "text-blue-100" : "text-gray-500"}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message here"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="bg-white"
            />
            <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
