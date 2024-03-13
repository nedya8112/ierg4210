import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { useState, useEffect } from 'react';
import { getData, postData } from '../util/api';

export default function Admin() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState({});
    const [selectedProduct, setSelectedProduct] = useState({});
    const [selectedImages, setSelectedImages] = useState({});
    const [isSubmitted, setIsSubmitted] = useState();
    let i = 0;
    useEffect(() => {
        // Fetch initial data
        getData('database')
            .then((data) => {
                // Handle the fetched data
                console.log(i++);
                setCategories(data.categories);
                setProducts(data.products);
                setSelectedCategory({ name: "" });
                setSelectedProduct({ cid: 0, name: "", price: "", description: "", quantity: "" });
                setSelectedImages({});
                setIsSubmitted(0);
            })
            .catch((error) => {
                // Handle errors
                console.error(error);
            });
    }, [isSubmitted]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // File
        if (e.target.image) {
            const fileFormData = new FormData();
            fileFormData.set('image', e.target.image.files[0]);
            postData('upload', fileFormData)
                .then((data) => {
                    if (data.success !== true) {
                        window.alert(JSON.stringify(data));
                    }
                })
                .catch((error) => {
                    // Handle errors
                    console.error(error);
                });
        }

        // DB
        const dbFormData = new FormData(e.target);
        dbFormData.set('image', e.target.image.files[0].name);
        postData('database', Object.fromEntries(dbFormData))
            .then((data) => {
                // Handle the updated data
                console.log(data);
                if (data.success === true) {
                    window.alert("Success!");
                    setIsSubmitted(1);
                    e.target.reset();
                } else {
                    window.alert(JSON.stringify(data));
                }
            })
            .catch((error) => {
                // Handle errors
                console.error(error);
            });
    };

    const handleCategorySelect = (e) => {
        var selected = categories.find(category => category.cid == e.target.value);
        if (selected)
            setSelectedCategory(selected);
    }

    const handleProductSelect = (e) => {
        var selected = products.find(product => product.pid == e.target.value);
        if (selected)
            setSelectedProduct(selected);
    }

    const handleImageSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedImages({ ...selectedImages, [e.target.id]: e.target.files[0] });
        }
        console.log(selectedImages)
    };

    return (
        <>
            <Head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>JaydenTV Mall Admin Panel</title>
            </Head>

            <main class="admin-panel" >
                <div class="panel-container">
                    <header>
                        <div class="title">
                            <h1>JAYDENTV MALL - ADMIN PANEL</h1>
                        </div>
                    </header>
                    <div class="flex-container">
                        <div class="add-category">
                            <form onSubmit={handleSubmit}>
                                <input type="hidden" name="type" value="add-category" />
                                <fieldset>
                                    <h3>Add Category</h3>
                                    <div class="name">
                                        <label for="name">Name</label>
                                        <input type="text" name="name" id="name" required />
                                    </div>
                                    <div class="image">
                                        <label for="image">Image</label>
                                        <input type="file" name="image" id="add-category-image" onChange={handleImageSelect} accept="image/png, image/jpeg, image/gif" />
                                        {selectedImages['add-category-image'] && (
                                            <img src={URL.createObjectURL(selectedImages['add-category-image'])} alt="Preview" />
                                        )}
                                    </div>
                                    <br />
                                    <button type="submit">Submit</button>
                                </fieldset>
                            </form>
                        </div>
                        <div class="delete-category">
                            <form onSubmit={handleSubmit}>
                                <input type="hidden" name="type" value="delete-category" />
                                <fieldset>
                                    <h3>Delete Category</h3>
                                    <div class="cid">
                                        <select name="cid" id="cid" required>
                                            <option hidden selected value="">-- SELECT --</option>
                                            {categories.map((category) => (
                                                <option key={category.cid} value={category.cid}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div class="image">
                                        <img src="" alt="" />
                                    </div>
                                    <br />
                                    <button type="submit">Submit</button>
                                </fieldset>
                            </form>
                        </div>
                        <div class="edit-category">
                            <form onSubmit={handleSubmit}>
                                <input type="hidden" name="type" value="edit-category" />
                                <fieldset>
                                    <h3>Edit Category</h3>
                                    <div class="cid">
                                        <select name="cid" id="cid" required onChange={handleCategorySelect}>
                                            <option hidden selected value="">-- SELECT --</option>
                                            {categories.map((category) => (
                                                <option key={category.cid} value={category.cid}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div class="name">
                                        <label for="name">Name</label>
                                        <input type="text" name="name" id="name" required defaultValue={selectedCategory.name} />
                                    </div>
                                    <div class="image">
                                        <label for="image">Image</label>
                                        <input type="file" name="image" id="editCategory" onChange={handleImageSelect} accept="image/png, image/jpeg, image/gif" />
                                        {selectedImages.editCategory && (
                                            <img src={URL.createObjectURL(selectedImages.editCategory)} alt="Preview" />
                                        )}
                                    </div>
                                    <br />
                                    <button type="submit">Submit</button>
                                </fieldset>
                            </form>
                        </div>
                    </div>
                    <br />
                    <br />
                    <div class="flex-container">
                        <div class="add-product">
                            <form onSubmit={handleSubmit}>
                                <input type="hidden" name="type" value="add-product" />
                                <fieldset>
                                    <h3>New Product</h3>
                                    <div class="cid">
                                        <label for="cid">Category</label>
                                        <select name="cid" id="cid" required>
                                            <option hidden selected value="">-- SELECT --</option>
                                            {categories.map((category) => (
                                                <option key={category.cid} value={category.cid}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div class="name">
                                        <label for="name">Name</label>
                                        <input type="text" name="name" id="name" required />
                                    </div>
                                    <div class="price">
                                        <label for="price">Price</label>
                                        <input type="number" name="price" id="price" required />
                                    </div>
                                    <div class="description">
                                        <label for="description">Description</label>
                                        <textarea name="description" id="description" cols="20" rows="2" required></textarea>
                                    </div>
                                    <div class="quantity">
                                        <label for="quantity">Quantity</label>
                                        <input type="number" name="quantity" id="quantity" required />
                                    </div>
                                    <div class="image">
                                        <label for="image">Image</label>
                                        <input type="file" name="image" id="add-product-image" onChange={handleImageSelect} accept="image/png, image/jpeg, image/gif" />
                                        {selectedImages['add-product-image'] && (
                                            <img src={URL.createObjectURL(selectedImages['add-product-image'])} alt="Preview" />
                                        )}
                                    </div>
                                    <br />
                                    <button type="submit">Submit</button>
                                </fieldset>
                            </form>
                        </div>
                        <div class="delete-product">
                            <form onSubmit={handleSubmit}>
                                <input type="hidden" name="type" value="delete-product" />
                                <fieldset>
                                    <h3>Delete Product</h3>
                                    <div class="name">
                                        <select name="pid" id="pid" required>
                                            <option hidden selected value="">-- SELECT --</option>
                                            {products.map((product) => (
                                                <option key={product.pid} value={product.pid}>
                                                    {product.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div class="image">
                                        <img src="" alt="" />
                                    </div>
                                    <br />
                                    <button type="submit">Submit</button>
                                </fieldset>
                            </form>
                        </div>
                        <div class="edit-product">
                            <form onSubmit={handleSubmit}>
                                <input type="hidden" name="type" value="edit-product" />
                                <fieldset>
                                    <h3>Edit Product</h3>
                                    <div class="pid">
                                        <select name="pid" id="pid" required onChange={handleProductSelect}>
                                            <option hidden selected value="">-- SELECT --</option>
                                            {products.map((product) => (
                                                <option key={product.pid} value={product.pid}>
                                                    {product.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div class="cid">
                                        <label for="cid">Category</label>
                                        <select name="cid" id="cid" required >
                                            <option hidden selected value=""></option>
                                            {categories.map((category) => (
                                                <option key={category.cid} value={category.cid} selected={selectedProduct.cid === category.cid}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div class="name">
                                        <label for="name">Name</label>
                                        <input type="text" name="name" id="name" required defaultValue={selectedProduct.name} />
                                    </div>
                                    <div class="price">
                                        <label for="price">Price</label>
                                        <input type="number" name="price" id="price" required defaultValue={selectedProduct.price} />
                                    </div>
                                    <div class="description">
                                        <label for="description">Description</label>
                                        <textarea name="description" id="description" cols="20" rows="2" required defaultValue={selectedProduct.description} ></textarea>
                                    </div>
                                    <div class="quantity">
                                        <label for="quantity">Quantity</label>
                                        <input type="number" name="quantity" id="quantity" required defaultValue={selectedProduct.quantity} />
                                    </div>
                                    <div class="image">
                                        <label for="image">Image</label>
                                        <input type="file" name="image" id="editProduct" onChange={handleImageSelect} accept="image/png, image/jpeg, image/gif" />
                                        {selectedImages.editProduct && (
                                            <img src={URL.createObjectURL(selectedImages.editProduct)} alt="Preview" />
                                        )}
                                    </div>
                                    <br />
                                    <button type="submit">Submit</button>
                                </fieldset>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}