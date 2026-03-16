import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { Plus } from "lucide-react";
import { Table, Thead, Tbody, Tr, Th, Td, StatusBadge } from "../../components/ui/Table";
import { GlassCard } from "../../components/ui/GlassCard";
import { Button } from "../../components/ui/Button";
import { Input, Select } from "../../components/ui/Input";

function Subscriptions() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);

    const [customer, setCustomer] = useState("");
    const [product, setProduct] = useState("");
    const [quantity, setQuantity] = useState("");
    const [deliveryTime, setDeliveryTime] = useState("Morning");
    const [startDate, setStartDate] = useState("");

    const token = localStorage.getItem("access");

    useEffect(() => {
        fetchSubscriptions();
        fetchCustomers();
        fetchProducts();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            const res = await API.get("subscriptions/");
            setSubscriptions(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCustomers = async () => {
        try {
            const res = await API.get("customers/");
            setCustomers(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await API.get("products/");
            setProducts(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const addSubscription = async (e) => {
        e.preventDefault();

        try {

            const payload = {
                customer: parseInt(customer),
                product: parseInt(product),
                quantity_litres: parseInt(quantity),
                delivery_time: deliveryTime,
                start_date: startDate,
                active: true
            };

            await API.post("subscriptions/", payload);

            // reset form
            setCustomer("");
            setProduct("");
            setQuantity("");
            setDeliveryTime("Morning");
            setStartDate("");

            fetchSubscriptions();

        } catch (error) {
            console.error("Subscription create error:", error.response?.data || error);
        }
    };
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-black tracking-tight">Subscriptions</h1>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Left Panel: Form */}
                <div className="xl:col-span-1">
                    <GlassCard className="p-6 sticky top-6">
                        <h3 className="text-xl font-bold text-black mb-6">Create Subscription</h3>

                        <form onSubmit={addSubscription} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Customer</label>
                                <Select
                                    value={customer}
                                    onChange={(e) => setCustomer(e.target.value)}
                                >
                                    <option value="">Select Customer</option>
                                    {customers.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Product</label>
                                <Select
                                    value={product}
                                    onChange={(e) => setProduct(e.target.value)}
                                >
                                    <option value="">Select Product</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Quantity (Litres)</label>
                                <Input
                                    type="number"
                                    placeholder="e.g. 2"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Delivery Time</label>
                                <Select
                                    value={deliveryTime}
                                    onChange={(e) => setDeliveryTime(e.target.value)}
                                >
                                    <option value="Morning">Morning</option>
                                    <option value="Evening">Evening</option>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="pt-4">
                                <Button type="submit" className="w-full">
                                    <Plus className="w-5 h-5" />
                                    Add Subscription
                                </Button>
                            </div>
                        </form>
                    </GlassCard>
                </div>

                {/* Right Panel: Table */}
                <div className="xl:col-span-2">
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>Customer</Th>
                                <Th>Product</Th>
                                <Th>Qty (L)</Th>
                                <Th>Delivery</Th>
                                <Th>Start Date</Th>
                                <Th>Status</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {subscriptions.length > 0 ? subscriptions.map(sub => (
                                <Tr key={sub.id}>
                                    <Td className="font-bold text-black">{sub.customer_name}</Td>
                                    <Td className="text-black font-medium">{sub.product_name}</Td>
                                    <Td>
                                        <span className="text-brand-primary font-bold">{sub.quantity_litres}</span>
                                        <span className="text-gray-500 text-xs ml-1 font-bold">L</span>
                                    </Td>
                                    <Td className="text-black">{sub.delivery_time}</Td>
                                    <Td className="text-black">{sub.start_date}</Td>
                                    <Td><StatusBadge status={sub.active ? 'Active' : 'Inactive'} /></Td>
                                </Tr>
                            )) : (
                                <Tr>
                                    <Td colSpan="6" className="text-center py-10 text-black font-bold">
                                        No subscriptions found.
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

export default Subscriptions;