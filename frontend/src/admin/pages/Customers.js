import React, { useEffect, useState, useMemo } from "react";
import API from "../../services/api";
import { Edit2, Trash2, Plus, Search, X } from "lucide-react";
import { Table, Thead, Tbody, Tr, Th, Td } from "../../components/ui/Table";
import { GlassCard } from "../../components/ui/GlassCard";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

function Customers() {
    const [customers, setCustomers] = useState([]);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [area, setArea] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const [editingId, setEditingId] = useState(null);

    const token = localStorage.getItem("access");

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await API.get("customers/");
            setCustomers(response.data);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    const addCustomer = async (e) => {
        e.preventDefault();
        try {
            await API.post(
                "customers/",
                { name, phone, address, delivery_area: area }
            );
            clearForm();
            fetchCustomers();
        } catch (error) {
            console.error("Add error:", error);
        }
    };

    const updateCustomer = async (e) => {
        e.preventDefault();
        try {
            await API.put(
                `customers/${editingId}/`,
                { name, phone, address, delivery_area: area }
            );
            clearForm();
            fetchCustomers();
        } catch (error) {
            console.error("Update error:", error);
        }
    };

    const deleteCustomer = async (id) => {
        if (!window.confirm("Delete this customer?")) return;
        try {
            await API.delete(`customers/${id}/`);
            fetchCustomers();
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const startEdit = (customer) => {
        setEditingId(customer.id);
        setName(customer.name);
        setPhone(customer.phone);
        setAddress(customer.address);
        setArea(customer.delivery_area);
    };

    const clearForm = () => {
        setName("");
        setPhone("");
        setAddress("");
        setArea("");
        setEditingId(null);
    };

    const filteredCustomers = useMemo(() => {
        return customers.filter(customer =>
            customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.phone.includes(searchQuery) ||
            customer.delivery_area.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.address.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [customers, searchQuery]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-black tracking-tight">Customers</h1>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Form Panel */}
                <div className="xl:col-span-1">
                    <GlassCard className="p-6 sticky top-6">
                        <h3 className="text-xl font-bold text-black mb-6">
                            {editingId ? "Edit Customer" : "Add New Customer"}
                        </h3>

                        <form onSubmit={editingId ? updateCustomer : addCustomer} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-600 font-bold mb-1">Full Name</label>
                                <Input
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 font-bold mb-1">Phone Number</label>
                                <Input
                                    placeholder="+91 9876543210"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 font-bold mb-1">Address</label>
                                <Input
                                    placeholder="123 Main St..."
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 font-bold mb-1">Delivery Area</label>
                                <Input
                                    placeholder="Sector 42"
                                    value={area}
                                    onChange={(e) => setArea(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button type="submit" className="flex-1">
                                    {editingId ? "Save Changes" :
                                        <><Plus className="w-5 h-5" /> Add Customer</>}
                                </Button>

                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={clearForm}
                                        className="p-2.5 rounded-xl text-black bg-gray-100 hover:bg-gray-200 transition-colors font-bold"
                                        title="Cancel Edit"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </form>
                    </GlassCard>
                </div>

                {/* Right Table Panel */}
                <div className="xl:col-span-2">
                    <Table>
                        <Thead>
                            <Tr>
                                <Th className="w-16">ID</Th>
                                <Th>Name</Th>
                                <Th>Contact Info</Th>
                                <Th>Delivery Details</Th>
                                <Th className="text-right">Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
                                <Tr key={customer.id}>
                                    <Td className="text-black font-bold">#{customer.id}</Td>
                                    <Td className="font-bold text-black">{customer.name}</Td>
                                    <Td>
                                        <div className="text-black text-sm font-medium">{customer.phone}</div>
                                    </Td>
                                    <Td>
                                        <div className="text-black text-sm font-medium truncate max-w-[200px]" title={customer.address}>{customer.address}</div>
                                        <div className="text-gray-600 text-xs mt-0.5 font-bold">{customer.delivery_area}</div>
                                    </Td>
                                    <Td>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => startEdit(customer)}
                                                className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-xl transition-colors"
                                                title="Edit Customer"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteCustomer(customer.id)}
                                                className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors"
                                                title="Delete Customer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </Td>
                                </Tr>
                            )) : (
                                <Tr>
                                    <Td colSpan="5" className="text-center py-10 text-black font-bold">
                                        No customers found.
                                    </Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

export default Customers;