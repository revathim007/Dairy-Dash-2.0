import { useEffect, useState } from "react";
import API from "../../services/api";

export default function AdminProducts() {

    const [products, setProducts] = useState([]);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await API.get("products/");
            setProducts(res.data);
        } catch (error) {
            console.error("Error loading products", error);
        }
    };

    const addProduct = async () => {


        try {

            await API.post("products/", {
                name: name,
                price: price
            });

            setName("");
            setPrice("");

            fetchProducts();

        } catch (error) {
            console.error("Error adding product", error);
        }


    };

    const updateProduct = async () => {


        try {

            await API.put(`products/${editingId}/`, {
                name: name,
                price: price
            });

            setEditingId(null);
            setName("");
            setPrice("");

            fetchProducts();

        } catch (error) {
            console.error("Error updating product", error);
        }


    };

    const deleteProduct = async (id) => {


        if (!window.confirm("Delete this product?")) return;

        try {

            await API.delete(`products/${id}/`);

            fetchProducts();

        } catch (error) {
            console.error("Error deleting product", error);
        }


    };

    const startEdit = (product) => {
        setEditingId(product.id);
        setName(product.name);
        setPrice(product.price);
    };

    return (<div>


        <h1 className="text-2xl font-bold mb-6">
            Products Management
        </h1>

        {/* Add / Edit Product */}

        <div className="bg-[#2B1338] p-6 rounded-xl mb-6 border border-[#4F1C51]">

            <h2 className="text-lg font-semibold mb-4">
                {editingId ? "Edit Product" : "Add Product"}
            </h2>

            <div className="flex gap-4">

                <input
                    type="text"
                    placeholder="Product Name"
                    className="p-2 rounded bg-[#3B1140] border border-[#4F1C51] text-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Price"
                    className="p-2 rounded bg-[#3B1140] border border-[#4F1C51] text-white"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />

                {editingId ? (

                    <button
                        onClick={updateProduct}
                        className="bg-blue-500 px-4 py-2 rounded text-white"
                    >
                        Update
                    </button>

                ) : (

                    <button
                        onClick={addProduct}
                        className="bg-green-500 px-4 py-2 rounded text-white"
                    >
                        Add
                    </button>

                )}

            </div>

        </div>


        {/* Products Table */}

        <div className="bg-[#2B1338] rounded-xl border border-[#4F1C51] overflow-hidden">

            <table className="w-full text-left">

                <thead className="bg-[#3B1140]">
                    <tr>
                        <th className="p-4">Product</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Actions</th>
                    </tr>
                </thead>

                <tbody>

                    {products.map((product) => (

                        <tr
                            key={product.id}
                            className="border-t border-[#4F1C51]"
                        >

                            <td className="p-4">{product.name}</td>

                            <td className="p-4">₹{product.price}</td>

                            <td className="p-4 space-x-2">

                                <button
                                    onClick={() => startEdit(product)}
                                    className="bg-blue-500 px-3 py-1 rounded text-white"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => deleteProduct(product.id)}
                                    className="bg-red-500 px-3 py-1 rounded text-white"
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    </div>


    );
}
