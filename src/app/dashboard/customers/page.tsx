"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Trash2,
  Pencil,
  AlertCircle,
  CheckCircle,
  Plus,
  RefreshCw,
  MoreHorizontal,
  Search,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// Define the Customer type
type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  gstin: string;
  address: string;
  state_code: string;
  pincode: string;
  place: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
};

// Mock data for customers
const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Acme Corporation",
    email: "contact@acmecorp.com",
    phone: "9876543210",
    gstin: "27AADCB2230M1Z3",
    address: "123 Business Park",
    state_code: "27",
    pincode: "400001",
    place: "Mumbai",
    status: "active",
    created_at: "2023-10-15",
    updated_at: "2024-01-20",
  },
  {
    id: "2",
    name: "TechSolutions Pvt Ltd",
    email: "info@techsolutions.in",
    phone: "8765432109",
    gstin: "29AABCT1332L1ZP",
    address: "456 Tech Hub",
    state_code: "29",
    pincode: "560001",
    place: "Bangalore",
    status: "active",
    created_at: "2023-11-05",
    updated_at: "2024-02-10",
  },
  {
    id: "3",
    name: "Global Traders",
    email: "sales@globaltraders.com",
    phone: "7654321098",
    gstin: "33AABCG4321R1Z9",
    address: "789 Trade Center",
    state_code: "33",
    pincode: "600001",
    place: "Chennai",
    status: "inactive",
    created_at: "2023-09-20",
    updated_at: "2023-12-15",
  },
  {
    id: "4",
    name: "Sunrise Industries",
    email: "contact@sunrise.co.in",
    phone: "6543210987",
    gstin: "24AADCS5678Q1Z4",
    address: "101 Industrial Area",
    state_code: "24",
    pincode: "380001",
    place: "Ahmedabad",
    status: "active",
    created_at: "2024-01-10",
    updated_at: "2024-03-05",
  },
  {
    id: "5",
    name: "Prime Enterprises",
    email: "info@primeenterprises.in",
    phone: "9876123450",
    gstin: "06AADCP7890B1Z2",
    address: "202 Business Complex",
    state_code: "06",
    pincode: "122001",
    place: "Gurgaon",
    status: "active",
    created_at: "2023-08-15",
    updated_at: "2024-02-28",
  },
  {
    id: "6",
    name: "Omega Solutions",
    email: "support@omegasolutions.com",
    phone: "8765123490",
    gstin: "07AABCO4567C1Z8",
    address: "303 Tech Park",
    state_code: "07",
    pincode: "110001",
    place: "Delhi",
    status: "inactive",
    created_at: "2023-07-20",
    updated_at: "2023-11-15",
  },
  {
    id: "7",
    name: "Delta Exporters",
    email: "exports@deltaexp.com",
    phone: "7654123980",
    gstin: "19AABCD2345E1Z7",
    address: "404 Export Zone",
    state_code: "19",
    pincode: "700001",
    place: "Kolkata",
    status: "active",
    created_at: "2023-12-05",
    updated_at: "2024-03-10",
  },
  {
    id: "8",
    name: "Pinnacle Traders",
    email: "info@pinnacletraders.in",
    phone: "6543129870",
    gstin: "36AADCP6789F1Z5",
    address: "505 Trade Tower",
    state_code: "36",
    pincode: "500001",
    place: "Hyderabad",
    status: "active",
    created_at: "2024-02-15",
    updated_at: "2024-03-20",
  },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if all customers are selected
  const allSelected =
    customers.length > 0 && selectedCustomers.length === customers.length;

  // Toggle select all customers
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(customers.map((customer) => customer.id));
    }
  };

  // Toggle select a single customer
  const toggleSelectCustomer = (id: string) => {
    if (selectedCustomers.includes(id)) {
      setSelectedCustomers(
        selectedCustomers.filter((customerId) => customerId !== id)
      );
    } else {
      setSelectedCustomers([...selectedCustomers, id]);
    }
  };

  // Handle delete selected customers
  const handleDeleteSelected = () => {
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete selected customers
  const confirmDeleteSelected = () => {
    setIsDeleting(true);

    // Simulate API call to delete customers
    setTimeout(() => {
      setCustomers(
        customers.filter((customer) => !selectedCustomers.includes(customer.id))
      );
      setSelectedCustomers([]);
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      toast.success(
        `${selectedCustomers.length} customer(s) deleted successfully`
      );
    }, 1000);
  };

  // Handle edit customer
  const handleEdit = (id: string) => {
    // In a real app, this would navigate to an edit form
    toast.info(`Edit customer with ID: ${id}`);
  };

  // Handle add new customer
  const handleAddNew = () => {
    // In a real app, this would navigate to a create form
    toast.info("Add new customer");
  };

  // Simulate fetching customers from an API
  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API call
        setTimeout(() => {
          setCustomers(mockCustomers);
          setFilteredCustomers(mockCustomers);
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Error fetching customers:", error);
        setError("Failed to fetch customers");
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Filter customers based on search term
  useEffect(() => {
    if (searchTerm) {
      setFilteredCustomers(
        customers.filter(
          (customer) =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.gstin.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.place.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchTerm, customers]);

  // Get status badge based on customer status
  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          <CheckCircle className="mr-1 h-3 w-3" />
          Active
        </Badge>
      );
    }
    return (
      <Badge
        variant="outline"
        className="bg-gray-50 text-gray-700 border-gray-200"
      >
        <AlertCircle className="mr-1 h-3 w-3" />
        Inactive
      </Badge>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-2xl">Customer Management</CardTitle>
              <CardDescription>
                Manage your customers with options to add, edit, and delete
                records.
              </CardDescription>
            </div>
            <div className="mt-4 flex space-x-2 md:mt-0">
              <ShimmerButton
                className="flex items-center gap-1"
                onClick={handleAddNew}
                size="sm"
              >
                <Plus className="h-4 w-4" />
                Add Customer
              </ShimmerButton>
              <Button
                variant="outline"
                className="flex items-center gap-1"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
          ) : error ? (
            <div className="p-4 text-red-500 border border-red-300 rounded-md">
              <p>Error: {error}</p>
            </div>
          ) : customers.length === 0 ? (
            <div className="p-4 text-center">
              <p>No customers found.</p>
            </div>
          ) : (
            <>
              {/* Search and filter */}
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-4">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, phone, GSTIN, or location..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteSelected}
                    disabled={selectedCustomers.length === 0}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Selected
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    {selectedCustomers.length > 0 ? (
                      <span>{selectedCustomers.length} selected</span>
                    ) : (
                      <span>{filteredCustomers.length} customers</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer table with selection */}
              <div className="mb-6 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={allSelected}
                          onCheckedChange={toggleSelectAll}
                          aria-label="Select all customers"
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>GSTIN</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow
                        key={customer.id}
                        data-state={
                          selectedCustomers.includes(customer.id)
                            ? "selected"
                            : undefined
                        }
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedCustomers.includes(customer.id)}
                            onCheckedChange={() =>
                              toggleSelectCustomer(customer.id)
                            }
                            aria-label={`Select customer ${customer.name}`}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {customer.name}
                        </TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>{customer.gstin}</TableCell>
                        <TableCell>{`${customer.place}, ${customer.state_code}`}</TableCell>
                        <TableCell>{getStatusBadge(customer.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEdit(customer.id)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleEdit(customer.id)}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    setSelectedCustomers([customer.id]);
                                    handleDeleteSelected();
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedCustomers.length} selected
              customer(s). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDeleteSelected();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
