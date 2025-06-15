"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SimpleDatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  className?: string
}

export function SimpleDatePicker({ date, setDate, className }: SimpleDatePickerProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = React.useState("")

  // Update input value when date changes
  React.useEffect(() => {
    if (date) {
      setInputValue(format(date, "yyyy-MM-dd"))
    } else {
      setInputValue("")
    }
  }, [date])

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setInputValue(value)
    
    if (value) {
      const newDate = new Date(value)
      if (!isNaN(newDate.getTime())) {
        setDate(newDate)
      }
    } else {
      setDate(undefined)
    }
  }

  const handleButtonClick = () => {
    // Trigger the native date picker by clicking the hidden input
    if (inputRef.current) {
      if (inputRef.current.showPicker) {
        inputRef.current.showPicker()
      } else {
        inputRef.current.focus()
      }
    }
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant={"outline"}
        className={cn(
          "w-full justify-start text-left font-normal relative z-10",
          !date && "text-muted-foreground",
          className
        )}
        onClick={handleButtonClick}
      >
        <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
        {date ? format(date, "dd/MM/yyyy") : <span className="text-sm">Pick a date</span>}
      </Button>
      <Input
        ref={inputRef}
        type="date"
        value={inputValue}
        onChange={handleDateChange}
        className="absolute inset-0 opacity-0 pointer-events-none"
        tabIndex={-1}
      />
    </div>
  )
}