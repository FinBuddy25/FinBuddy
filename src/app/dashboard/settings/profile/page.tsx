"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Building, ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Define the GSTIN schema
const gstinSchema = z.object({
  gstin: z.string().length(15, "GSTIN must be 15 characters"),
  isPrimary: z.boolean()
})

// Define the form schema with Zod
const formSchema = z.object({
  business_name: z.string().min(1, "Business name is required").max(100, "Business name must be at most 100 characters"),
  business_address: z.string().min(1, "Address is required").max(200, "Address must be at most 200 characters"),
  business_place: z.string().min(1, "Place is required").max(50, "Place must be at most 50 characters"),
  business_state_code: z.string().min(1, "State code is required"),
  business_pincode: z.string().length(6, "Pincode must be 6 digits"),
  nature_of_business: z.string().min(1, "Nature of business is required"),
  industry: z.string().min(1, "Industry is required"),
  gstins: z.array(gstinSchema).min(1, "At least one GSTIN is required")
})

type FormValues = z.infer<typeof formSchema>

export default function MyProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [stateCodes, setStateCodes] = useState<{ state_code: string; state_name: string }[]>([])
  const [profileId, setProfileId] = useState<number | null>(null)

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      business_name: "",
      business_address: "",
      business_place: "",
      business_state_code: "",
      business_pincode: "",
      nature_of_business: "",
      industry: "",
      gstins: [{ gstin: "", isPrimary: true }]
    },
  })

  // Setup field array for multiple GSTINs
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "gstins"
  })

  // Fetch state codes
  useEffect(() => {
    const fetchStateCodes = async () => {
      const { data, error } = await supabase
        .from("state_codes")
        .select("state_code, state_name")
        .order("state_name")

      if (error) {
        console.error("Error fetching state codes:", error)
        toast.error("Failed to load state codes")
      } else {
        setStateCodes(data || [])
      }
    }

    fetchStateCodes()
  }, [supabase])

  // Fetch supplier profile data
  useEffect(() => {
    const fetchSupplierProfile = async () => {
      setIsLoading(true)

      try {
        // Get the first supplier profile (assuming there's only one)
        const { data, error } = await supabase
          .from("supplier_profiles")
          .select("*")
          .limit(1)
          .single()

        if (error && error.code !== "PGRST116") {
          // PGRST116 is the error code for "no rows returned"
          console.error("Error fetching supplier profile:", error)
          toast.error("Failed to load supplier profile")
        } else if (data) {
          // Parse GSTINs from JSON string if it exists
          let gstinsArray = [{ gstin: data.supplier_gstin || "", isPrimary: true }]

          if (data.supplier_gstins) {
            try {
              const parsedGstins = JSON.parse(data.supplier_gstins)
              if (Array.isArray(parsedGstins) && parsedGstins.length > 0) {
                gstinsArray = parsedGstins
              }
            } catch (e) {
              console.error("Error parsing GSTINs:", e)
            }
          }

          // Set the form values with the fetched data
          form.reset({
            business_name: data.supplier_name,
            business_address: data.supplier_address,
            business_place: data.supplier_place,
            business_state_code: data.supplier_state_code,
            business_pincode: data.supplier_pincode,
            nature_of_business: data.nature_of_business || "",
            industry: data.industry || "",
            gstins: gstinsArray
          })
          setProfileId(data.id)
        }
      } catch (error) {
        console.error("Error:", error)
        toast.error("An unexpected error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSupplierProfile()
  }, [supabase, form])

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    try {
      // Ensure one and only one GSTIN is marked as primary
      const hasPrimary = data.gstins.some(g => g.isPrimary)
      if (!hasPrimary && data.gstins.length > 0) {
        data.gstins[0].isPrimary = true
      }

      // Get the primary GSTIN for the main supplier_gstin field
      const primaryGstin = data.gstins.find(g => g.isPrimary)?.gstin || data.gstins[0]?.gstin || ""

      // Ensure the state code matches the primary GSTIN
      if (primaryGstin && primaryGstin.length >= 2) {
        const stateCode = primaryGstin.substring(0, 2)
        data.business_state_code = stateCode
      }

      if (profileId) {
        // Update existing profile
        const { error } = await supabase
          .from("supplier_profiles")
          .update({
            supplier_name: data.business_name,
            supplier_gstin: primaryGstin,
            supplier_address: data.business_address,
            supplier_place: data.business_place,
            supplier_state_code: data.business_state_code,
            supplier_pincode: data.business_pincode,
            nature_of_business: data.nature_of_business,
            industry: data.industry,
            supplier_gstins: JSON.stringify(data.gstins),
            updated_at: new Date().toISOString(),
          })
          .eq("id", profileId)

        if (error) {
          throw error
        }

        toast.success("Profile updated successfully")
      } else {
        // Create new profile
        const { error } = await supabase
          .from("supplier_profiles")
          .insert({
            supplier_name: data.business_name,
            supplier_gstin: primaryGstin,
            supplier_address: data.business_address,
            supplier_place: data.business_place,
            supplier_state_code: data.business_state_code,
            supplier_pincode: data.business_pincode,
            nature_of_business: data.nature_of_business,
            industry: data.industry,
            supplier_gstins: JSON.stringify(data.gstins),
          })

        if (error) {
          throw error
        }

        toast.success("Profile created successfully")
      }
    } catch (error) {
      console.error("Error saving profile:", error)
      toast.error(error instanceof Error ? error.message : "Failed to save profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to handle setting a GSTIN as primary
  const setPrimaryGstin = (index: number) => {
    // Update isPrimary status for all GSTINs
    const updatedGstins = form.getValues("gstins").map((gstin, i) => ({
      ...gstin,
      isPrimary: i === index
    }))
    form.setValue("gstins", updatedGstins)

    // Get the GSTIN that was marked as primary
    const primaryGstin = form.getValues("gstins")[index]?.gstin

    // If the GSTIN is valid (at least 2 characters), update the state code
    if (primaryGstin && primaryGstin.length >= 2) {
      const stateCode = primaryGstin.substring(0, 2)
      form.setValue("business_state_code", stateCode)

      // Log the state code update
      console.log(`Updated state code to ${stateCode} based on primary GSTIN`)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/settings")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your business information</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Business Information Card */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  <CardTitle>Business Information</CardTitle>
                </div>
                <CardDescription>
                  This information will be used on all your invoices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="business_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your business name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="nature_of_business"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nature of Business</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="trader">Trader</SelectItem>
                              <SelectItem value="service_provider">Service Provider</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="fmcg">FMCG</SelectItem>
                              <SelectItem value="metal">Metal</SelectItem>
                              <SelectItem value="food">Food</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="business_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your business address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="business_place"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Place</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter place" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="business_state_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {stateCodes.map((state) => (
                              <SelectItem key={state.state_code} value={state.state_code}>
                                {state.state_name} ({state.state_code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="business_pincode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pincode</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter pincode" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* GSTIN Management Card */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  <CardTitle>GSTIN Management</CardTitle>
                </div>
                <CardDescription>
                  Add multiple GSTINs and select a primary one for your invoices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-2">
                    <div className="flex-grow space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id={`primary-${index}`}
                          name="primary-gstin"
                          checked={form.getValues(`gstins.${index}.isPrimary`)}
                          onChange={() => setPrimaryGstin(index)}
                          className="h-4 w-4 text-primary"
                        />
                        <label htmlFor={`primary-${index}`} className="text-sm font-medium">
                          Primary
                        </label>
                      </div>
                      <FormField
                        control={form.control}
                        name={`gstins.${index}.gstin`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">GSTIN {index + 1}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter GSTIN (15 characters)"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e)
                                  // If this is the primary GSTIN and has at least 2 characters
                                  const isPrimary = form.getValues(`gstins.${index}.isPrimary`)
                                  const gstin = e.target.value
                                  if (isPrimary && gstin && gstin.length >= 2) {
                                    const stateCode = gstin.substring(0, 2)
                                    form.setValue("business_state_code", stateCode)
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => remove(index)}
                        className="mb-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ gstin: "", isPrimary: false })}
                  className="mt-2"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another GSTIN
                </Button>
              </CardContent>
            </Card>

            <div className="flex justify-end pt-4">
              <ShimmerButton
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Profile"
                )}
              </ShimmerButton>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
