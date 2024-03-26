import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from 'dompurify';
import { setup } from '../lib/csrf';

import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getData, postData } from '../utils/api';

export default function Admin() {
    const router = useRouter();
    const { data, status } = useSession();

    useEffect(() => {
        if (status === 'unauthenticated' || status === 'authenticated' && !data.user.isAdmin) {
            router.replace('/login');
        }
    }, [data, status]);

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState({});
    const [selectedProduct, setSelectedProduct] = useState({});
    const [selectedImages, setSelectedImages] = useState({});
    const [isSubmitted, setIsSubmitted] = useState();
    const [isLoading, setIsLoading] = useState();

    useEffect(() => {
        // Fetch initial data
        getData('database')
            .then((data) => {
                // Handle the fetched data
                setCategories(data.categories);
                setProducts(data.products);
                setSelectedCategory({ name: "" });
                setSelectedProduct({ cid: 0, name: "", price: "", description: "", quantity: "" });
                setSelectedImages({});
                setIsSubmitted(false);
                setIsLoading(false);
            })
            .catch((error) => {
                // Handle errors
                console.error(error);
            });
    }, [isSubmitted]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        // File
        if (selectedImages[e.target.type.value + '-image']) {
            const fileFormData = new FormData();
            // const fileName = String.prototype.concat(file.name, '_', e.target.type === "add-category" || "edit-category" ? categories.slice(-1).cid + 1 : products.slice(-1).pid + 1);
            fileFormData.set('image', selectedImages[e.target.type.value + '-image']);
            await postData('upload', fileFormData)
                .then((data) => {
                    if (data.success !== true) {
                        window.alert(JSON.stringify(data));
                        setIsLoading(false);
                        return;
                    }
                })
                .catch((error) => {
                    // Handle errors
                    console.error(error);
                    window.alert(error);
                    setIsLoading(false);
                    return;
                });
        }

        // DB
        const dbFormData = new FormData(e.target);
        if (selectedImages[e.target.type.value + '-image']) {
            dbFormData.set('image', selectedImages[e.target.type.value + '-image'].name.replace(/ /g, "_").replace(/[^a-zA-Z0-9_.-]+/g, ""));
        }
        const cleanDbFormData = new FormData();
        for (let [key, value] of dbFormData.entries()) {
            cleanDbFormData.append(key, DOMPurify.sanitize(value));
        }
        await postData('database', Object.fromEntries(cleanDbFormData))
            .then((data) => {
                // Handle the updated data
                if (data.success === true) {
                    window.alert("Success!");
                    setIsSubmitted(true);
                    e.target.reset();
                } else {
                    window.alert(JSON.stringify(data));
                    setIsLoading(false);
                }
            })
            .catch((error) => {
                // Handle errors
                console.error(error);
                window.alert(error);
                setIsLoading(false);
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

    const handleDrop = (e) => {
        e.preventDefault();

        const files = e.dataTransfer.files;
        if (files && files[0] && files[0].type.startsWith('image/')) {
            const file = files[0];
            handleImageSelect({ target: { files: [file], id: e.target.id } });
        } else {
            alert('Only image files are allowed!');
        }
    };

    const handleImageSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedImages({ ...selectedImages, [e.target.id]: e.target.files[0] });
        }
    };

    const handleImageRemove = (e) => {
        e.preventDefault();

        setSelectedImages({ ...selectedImages, [e.target.id]: null });
    }

    if (status === 'loading') {
        return (
            <>
                <Head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>JaydenTV Mall Admin Panel</title>
                </Head>

                <main>
                    <div className="loading-screen">
                        <div className="loader"></div>
                        <div className="overlay"></div>
                    </div>
                </main>
            </>
        )
    }

    if (status === 'authenticated' && data.user.isAdmin) {
        return (
            <>
                <Head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>JaydenTV Mall Admin Panel</title>
                </Head>

                <main className="admin-panel" >
                    {isLoading && (
                        <div className="loading-screen">
                            <div className="loader"></div>
                            <div className="overlay"></div>
                        </div>
                    )}
                    <div className="panel-container">
                        <header>
                            <div className="title">
                                <h1>JAYDENTV MALL - ADMIN PANEL</h1>
                            </div>
                        </header>

                        <div className="links">
                            <span className="admin-panel-link"><Link href="./">Back To Home Page</Link></span>
                        </div>
                        <div className="flex-container">
                            <div className="add-category">
                                <form onSubmit={handleSubmit}>
                                    <input type="hidden" name="type" value="add-category" />
                                    <fieldset>
                                        <h3>Add Category</h3>
                                        <div className="name">
                                            <label htmlFor="name">Name</label>
                                            <input type="text" name="name" id="name" required />
                                        </div>
                                        <div className="image">
                                            <label htmlFor="image">Image</label>
                                            <div className="drop-area"
                                                id="add-category-image"
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={handleDrop}>
                                                {!selectedImages['add-category-image'] && (<>Drop image here or</>)}
                                                {selectedImages['add-category-image'] && (
                                                    <>
                                                        <figure>
                                                            <img src={URL.createObjectURL(selectedImages['add-category-image'])} alt="Preview" />
                                                            <figcaption>New Image: {selectedImages['add-category-image'].name}</figcaption>
                                                        </figure>
                                                        {/* <button id="add-category-image" onClick={handleImageRemove}>Remove Image</button> */}
                                                    </>
                                                )}
                                                <br /><input type="file" name="image" id="add-category-image" onChange={handleImageSelect} accept="image/png, image/jpeg, image/gif" />
                                            </div>
                                        </div>
                                        <br />
                                        <button type="submit">Submit</button>
                                    </fieldset>
                                </form>
                            </div>
                            <div className="delete-category">
                                <form onSubmit={handleSubmit}>
                                    <input type="hidden" name="type" value="delete-category" />
                                    <fieldset>
                                        <h3>Delete Category</h3>
                                        <div className="cid">
                                            <select name="cid" id="cid" required>
                                                <option hidden selected value="">-- SELECT --</option>
                                                {categories.map((category) => (
                                                    <option key={category.cid} value={category.cid}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="image">
                                            <img src="" alt="" />
                                        </div>
                                        <br />
                                        <button type="submit">Submit</button>
                                    </fieldset>
                                </form>
                            </div>
                            <div className="edit-category">
                                <form onSubmit={handleSubmit}>
                                    <input type="hidden" name="type" value="edit-category" />
                                    <fieldset>
                                        <h3>Edit Category</h3>
                                        <div className="cid">
                                            <select name="cid" id="cid" required onChange={handleCategorySelect}>
                                                <option hidden selected value="">-- SELECT --</option>
                                                {categories.map((category) => (
                                                    <option key={category.cid} value={category.cid}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="name">
                                            <label htmlFor="name">Name</label>
                                            <input type="text" name="name" id="name" required defaultValue={selectedCategory.name} />
                                        </div>
                                        <div className="image">
                                            <label htmlFor="image">Image</label>
                                            {selectedCategory.image && (
                                                <figure>
                                                    <img src={String.prototype.concat("/img/", selectedCategory.image)} alt="Preview" />
                                                    <figcaption>Original Image: {selectedCategory.image}</figcaption>
                                                </figure>
                                            )}
                                            <div className="drop-area"
                                                id="edit-category-image"
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={handleDrop}>
                                                {!selectedImages['edit-category-image'] && (<>Drop image here or</>)}
                                                {selectedImages['edit-category-image'] && (
                                                    <figure>
                                                        <img src={URL.createObjectURL(selectedImages['edit-category-image'])} alt="Preview" />
                                                        <figcaption>New Image: {selectedImages['edit-category-image'].name}</figcaption>
                                                    </figure>
                                                )}
                                                <br /><input type="file" name="image" id="edit-category-image" onChange={handleImageSelect} accept="image/png, image/jpeg, image/gif" />
                                            </div>
                                        </div>
                                        <br />
                                        <button type="submit">Submit</button>
                                    </fieldset>
                                </form>
                            </div>
                        </div>
                        <br />
                        <br />
                        <div className="flex-container">
                            <div className="add-product">
                                <form onSubmit={handleSubmit}>
                                    <input type="hidden" name="type" value="add-product" />
                                    <fieldset>
                                        <h3>New Product</h3>
                                        <div className="cid">
                                            <label htmlFor="cid">Category</label>
                                            <select name="cid" id="cid" required>
                                                <option hidden selected value="">-- SELECT --</option>
                                                {categories.map((category) => (
                                                    <option key={category.cid} value={category.cid}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="name">
                                            <label htmlFor="name">Name</label>
                                            <input type="text" name="name" id="name" required />
                                        </div>
                                        <div className="price">
                                            <label htmlFor="price">Price</label>
                                            <input type="double" name="price" id="price" required />
                                        </div>
                                        <div className="description">
                                            <label htmlFor="description">Description</label>
                                            <textarea name="description" id="description" cols="20" rows="2" required></textarea>
                                        </div>
                                        <div className="quantity">
                                            <label htmlFor="quantity">Quantity</label>
                                            <input type="number" name="quantity" id="quantity" required />
                                        </div>
                                        <div className="image">
                                            <label htmlFor="image">Image</label>
                                            <div className="drop-area"
                                                id="add-product-image"
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={handleDrop}>
                                                {!selectedImages['add-product-image'] && (<>Drop image here or</>)}
                                                {selectedImages['add-product-image'] && (
                                                    <>
                                                        <figure>
                                                            <img src={URL.createObjectURL(selectedImages['add-product-image'])} alt="Preview" />
                                                            <figcaption>New Image: {selectedImages['add-product-image'].name}</figcaption>
                                                        </figure>
                                                        {/* <button id="add-product-image" onClick={handleImageRemove}>Remove Image</button> */}
                                                    </>
                                                )}
                                                <br /><input type="file" name="image" id="add-product-image" onChange={handleImageSelect} accept="image/png, image/jpeg, image/gif" />
                                            </div>
                                        </div>
                                        <br />
                                        <button type="submit">Submit</button>
                                    </fieldset>
                                </form>
                            </div>
                            <div className="delete-product">
                                <form onSubmit={handleSubmit}>
                                    <input type="hidden" name="type" value="delete-product" />
                                    <fieldset>
                                        <h3>Delete Product</h3>
                                        <div className="name">
                                            <select name="pid" id="pid" required>
                                                <option hidden selected value="">-- SELECT --</option>
                                                {products.map((product) => (
                                                    <option key={product.pid} value={product.pid}>
                                                        {product.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="image">
                                            <img src="" alt="" />
                                        </div>
                                        <br />
                                        <button type="submit">Submit</button>
                                    </fieldset>
                                </form>
                            </div>
                            <div className="edit-product">
                                <form onSubmit={handleSubmit}>
                                    <input type="hidden" name="type" value="edit-product" />
                                    <fieldset>
                                        <h3>Edit Product</h3>
                                        <div className="pid">
                                            <select name="pid" id="pid" required onChange={handleProductSelect}>
                                                <option hidden selected value="">-- SELECT --</option>
                                                {products.map((product) => (
                                                    <option key={product.pid} value={product.pid}>
                                                        {product.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="cid">
                                            <label htmlFor="cid">Category</label>
                                            <select name="cid" id="cid" required >
                                                <option hidden selected value=""></option>
                                                {categories.map((category) => (
                                                    <option key={category.cid} value={category.cid} selected={selectedProduct.cid === category.cid}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="name">
                                            <label htmlFor="name">Name</label>
                                            <input type="text" name="name" id="name" required defaultValue={selectedProduct.name} />
                                        </div>
                                        <div className="price">
                                            <label htmlFor="price">Price</label>
                                            <input type="number" name="price" id="price" required defaultValue={selectedProduct.price} />
                                        </div>
                                        <div className="description">
                                            <label htmlFor="description">Description</label>
                                            <textarea name="description" id="description" cols="20" rows="2" required defaultValue={selectedProduct.description} ></textarea>
                                        </div>
                                        <div className="quantity">
                                            <label htmlFor="quantity">Quantity</label>
                                            <input type="number" name="quantity" id="quantity" required defaultValue={selectedProduct.quantity} />
                                        </div>
                                        <div className="image">
                                            <label htmlFor="image">Image</label>
                                            {selectedProduct.image && (
                                                <figure>
                                                    <img src={String.prototype.concat("/img/", selectedProduct.image)} alt="Preview" />
                                                    <figcaption>Original Image: {selectedProduct.image}</figcaption>
                                                </figure>
                                            )}
                                            <div className="drop-area"
                                                id="edit-product-image"
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={handleDrop}>
                                                {!selectedImages['edit-product-image'] && (<>Drop image here or</>)}
                                                {selectedImages['edit-product-image'] && (
                                                    <figure>
                                                        <img src={URL.createObjectURL(selectedImages['edit-product-image'])} alt="Preview" />
                                                        <figcaption>New Image: {selectedImages['edit-product-image'].name}</figcaption>
                                                    </figure>
                                                )}
                                                <br /><input type="file" name="image" id="edit-product-image" onChange={handleImageSelect} accept="image/png, image/jpeg, image/gif" />
                                            </div>
                                        </div>
                                        <br />
                                        <button type="submit">Submit</button>
                                    </fieldset>
                                </form>
                            </div>
                        </div>
                        <footer></footer>
                    </div>
                </main>
            </>
        )
    }
}

export const getServerSideProps = setup(async ({ req, res }) => {
    return { props: {} }
});
