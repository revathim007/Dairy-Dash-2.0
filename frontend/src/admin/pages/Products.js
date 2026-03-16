import React, { useEffect, useState, useMemo } from "react";
import API from "../../services/api";
import { Edit2, Trash2, Plus, Search, X } from "lucide-react";
import { Table, Thead, Tbody, Tr, Th, Td, StatusBadge } from "../../components/ui/Table";
import { GlassCard } from "../../components/ui/GlassCard";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

function Products() {

    const [products, setProducts] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {

        const res = await API.get("products/");
        setProducts(res.data);

    };

    const resetForm = () => {

        setName("");
        setDescription("");
        setPrice("");
        setQuantity("");
        setImage(null);
        setImagePreview(null);

    };

    const handleImageChange = (e) => {

        const file = e.target.files[0];

        if (file) {

            setImage(file);
            setImagePreview(URL.createObjectURL(file));

        }

    };

    // -----------------------------
    // CREATE PRODUCT
    // -----------------------------

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const formData = new FormData();

            formData.append("name", name);
            formData.append("description", description);
            formData.append("price_per_litre", price);
            formData.append("quantity", quantity);

            if (image) {
                formData.append("image", image);
            }

            await API.post("products/", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            resetForm();
            fetchProducts();

        } catch (error) {

            console.log(error);
            alert("Failed to create product");

        }

    };

    // -----------------------------
    // DELETE PRODUCT
    // -----------------------------

    const deleteProduct = async (id) => {

        if (!window.confirm("Delete this product?")) return;

        await API.delete(`products/${id}/`);
        fetchProducts();

    };

    // -----------------------------
    // OPEN EDIT
    // -----------------------------

    const openEdit = (product) => {

        setEditingProduct(product);

        setName(product.name);
        setDescription(product.description);
        setPrice(product.price_per_litre);
        setQuantity(product.quantity || 0);

        setImage(null);

        const img = product.image
            ? product.image.startsWith("http")
                ? product.image
                : `http://127.0.0.1:8000${product.image}`
            : null;

        setImagePreview(img);

    };

    // -----------------------------
    // UPDATE PRODUCT
    // -----------------------------

    const updateProduct = async (e) => {
        e.preventDefault();

        try {

            const formData = new FormData();

            formData.append("name", name);
            formData.append("description", description);
            formData.append("price_per_litre", price);
            formData.append("quantity", quantity);

            // IMPORTANT: only send image if a new file was selected
            if (image && image instanceof File) {
                formData.append("image", image);
            }

            await API.patch(
                `products/${editingProduct.id}/`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            setEditingProduct(null);
            resetForm();
            fetchProducts();

        } catch (error) {

            console.log("Update product error:", error.response?.data);
            alert("Failed to update product");

        }
    };

    // -----------------------------
    // FILTER PRODUCTS
    // -----------------------------

    const filteredProducts = useMemo(() => {

        return products.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (product.description &&
                product.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );

    }, [products, searchQuery]);

    const getImageUrl = (imgStr) => {

        if (!imgStr) return null;

        return imgStr.startsWith("http")
            ? imgStr
            : `http://127.0.0.1:8000${imgStr}`;

    };

    return (
        <div className="space-y-6">

            {/* HEADER */}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

                <h1 className="text-3xl font-bold text-black tracking-tight">
                    Products
                </h1>

            </div>

            {/* ADD PRODUCT */}

            <GlassCard className="p-6">

                <h3 className="text-lg font-bold text-black mb-4">
                    Add New Product
                </h3>

                <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">

                    <Input
                        placeholder="Product Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <Input
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <Input
                        type="number"
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />

                    <Input
                        type="number"
                        placeholder="Quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />

                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />

                    {imagePreview && (

                        <img
                            src={imagePreview}
                            alt="preview"
                            className="w-10 h-10 rounded-lg object-cover"
                        />

                    )}

                    <Button type="submit">

                        <Plus className="w-4 h-4" />
                        Add Product

                    </Button>

                </form>

            </GlassCard>

            {/* PRODUCTS TABLE */}

            <Table>

                <Thead>

                    <Tr>

                        <Th>ID</Th>
                        <Th>Image</Th>
                        <Th>Name</Th>
                        <Th>Description</Th>
                        <Th>Price</Th>
                        <Th>Qty</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>

                    </Tr>

                </Thead>

                <Tbody>

                    {filteredProducts.map((product) => (

                        <Tr key={product.id}>

                            <Td>#{product.id}</Td>

                            <Td>

                                {getImageUrl(product.image) ? (

                                    <img
                                        src={getImageUrl(product.image)}
                                        alt={product.name}
                                        className="w-12 h-12 rounded-lg object-cover"
                                    />

                                ) : "No Image"}

                            </Td>

                            <Td>{product.name}</Td>

                            <Td>{product.description}</Td>

                            <Td>₹{product.price_per_litre}</Td>

                            <Td>{product.quantity || 0}</Td>

                            <Td>

                                <StatusBadge status="Active" />

                            </Td>

                            <Td className="flex gap-2">

                                <button
                                    onClick={() => openEdit(product)}
                                    className="p-2 bg-blue-500/20 rounded-lg"
                                >
                                    <Edit2 className="w-4 h-4 text-blue-400" />
                                </button>

                                <button
                                    onClick={() => deleteProduct(product.id)}
                                    className="p-2 bg-red-500/20 rounded-lg"
                                >
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                </button>

                            </Td>

                        </Tr>

                    ))}

                </Tbody>

            </Table>

            {/* EDIT MODAL */}

            {editingProduct && (

                <div className="fixed inset-0 bg-black/70 flex items-center justify-center">

                    <GlassCard className="p-6 w-[400px] relative">

                        <button
                            className="absolute top-4 right-4"
                            onClick={() => setEditingProduct(null)}
                        >
                            <X />
                        </button>

                        <h2 className="text-xl font-bold text-black mb-4">
                            Edit Product #{editingProduct.id}
                        </h2>

                        <form onSubmit={updateProduct} className="space-y-4">

                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            <Input
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />

                            <Input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />

                            <Input
                                type="number"
                                placeholder="Quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />

                            {imagePreview && (

                                <img
                                    src={imagePreview}
                                    className="w-full h-32 object-cover rounded-lg"
                                />

                            )}

                            <Input
                                type="file"
                                onChange={handleImageChange}
                            />

                            <Button type="submit">
                                Save Changes
                            </Button>

                        </form>

                    </GlassCard>

                </div>

            )}

        </div>
    );
}

export default Products;