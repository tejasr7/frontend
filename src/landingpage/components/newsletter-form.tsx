"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("https://api.convertkit.com/v3/forms/7968342/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: "4DJ5-pe8kA0fBB8zn3cm7A",
          email: email
        })
      });
      const data = await res.json();
      console.log(data);


      if (res.ok) {
        toast({
          title: "Success!",
          description: "You've been added to our waitlist. We'll notify you when we launch!",
        })
        setEmail("")
      } else {
        toast({
          title: "Error",
          description: "There was a problem joining the waitlist.",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
      })
    }
    setIsLoading(false)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
        {isLoading ? (
            <div className="flex items-center justify-center gap-2 animate-pulse">
                <svg
                className="animate-spin h-5 w-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="status"
                aria-label="loading"
                >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                />
                </svg>
                <span className="text-sm font-medium tracking-wide">Subscribing...</span>
            </div>
            ) : (
            "Join Waitlist"
            )}

        </Button>
      </form>
      <p className="text-xs text-gray-500 mt-2">Join our waitlist to be the first to know when we launch.</p>
      <Toaster />
    </div>
  )
}
