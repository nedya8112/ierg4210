import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getData, postData } from '../../utils/api';
import Cart from '../../components/cart';

export default function Category() {
    const router = useRouter();
    const { data, status } = useSession();

    const [category, setCategory] = useState([]);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        // Fetch initial data
        if (router.isReady) {
            getData('database')
                .then((data) => {
                    // Handle the fetched data
                    setCategory(data.categories.find(category => category.cid == router.query.cid));
                    setProducts(data.products.filter(product => product.cid == router.query.cid));
                    const cartItemPids = JSON.parse(localStorage.getItem("cartItemPids"));
                    const cartItemQuantities = JSON.parse(localStorage.getItem("cartItemQuantities"));
                    setCartItems(data.products.filter(product => cartItemPids.includes(product.pid))
                        .toSorted((a, b) => cartItemPids.indexOf(a.pid) - cartItemPids.indexOf(b.pid))
                        .map((product, index) => ({ ...product, quantity: cartItemQuantities.at(index) })));
                })
                .catch((error) => {
                    // Handle errors
                    console.error(error);
                });
        }
    }, [router.isReady]);

    const addToCart = (product) => {
        const existingItem = cartItems.find(item => item.pid === product.pid);

        const newCartItems = existingItem
            ? cartItems.map(item =>
                item.pid === product.pid
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
            : [...cartItems, Object.assign(product, { quantity: 1 })];

        saveToLocalStorage(newCartItems);
        setCartItems(newCartItems);
    }

    const changeCartItemQuantity = (e, product) => {
        e.preventDefault();

        const newCartItems = cartItems.map(item =>
            item.pid === product.pid
                ? { ...item, quantity: e.target.value }
                : item);
        saveToLocalStorage(newCartItems);
        setCartItems(newCartItems);
    }

    const saveToLocalStorage = (items) => {
        localStorage.setItem("cartItemPids", JSON.stringify(Object.values(items.map(item => item.pid))));
        localStorage.setItem("cartItemQuantities", JSON.stringify(Object.values(items.map(item => item.quantity))));
    }

    const clearCart = (e) => {
        e.preventDefault();

        setCartItems([]);
        localStorage.setItem("cartItemPids", []);
        localStorage.setItem("cartItemQuantities", []);
    }

    return (
        <>
            <Head>
                <title>JaydenTV Mall</title>
                <meta name="description" content="1155176645 IERG4210" />
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>

            <main>
                <div className="container">
                    <header id="home">
                        <div className="title">JAYDENTV MALL</div>
                        <Cart
                            cartItems={cartItems}
                            changeCartItemQuantity={changeCartItemQuantity}
                            clearCart={clearCart}
                        />
                    </header>
                    <div className="links">
                        <span className="ref-link">
                            <span><Link href="/">Home</Link></span>
                            <span> &gt; </span>
                            <span><Link href="#home">{category.name}</Link></span>
                        </span>
                        {status === 'authenticated' && data.user.isAdmin == true && (
                            <span className="admin-panel-link"><Link href="./admin" target="_blank">Admin Panel</Link></span>
                        )}
                        {status === 'authenticated' ? (
                            <span className="logout-link"><Link href="" onClick={() => signOut({ redirect: false })}>Logout</Link></span>
                        ) : (
                            <span className="login-link"><Link href="/login">Login</Link></span>
                        )
                        }
                    </div>
                    <div className="list-of-items">
                        <h1>{category.name}</h1>
                        <div className="products">
                            {products.map((product) => (
                                <div className="item" key={product.pid}>
                                    <div className="item-clickable" onClick={() => {
                                        router.push({
                                            pathname: `/${encodeURIComponent(category.name.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(product.name.toLowerCase().replace(/\s+/g, '-'))}`,
                                            query: { cid: category.cid, pid: product.pid },
                                        })
                                    }}>
                                        <div className="image">
                                            <Image src={String.prototype.concat("/img/", product.image)} alt={product.image || "No image"} fill />
                                        </div>
                                        <h2>{product.name}</h2>
                                        <div className="price">${product.price.toFixed(2)}</div>
                                    </div>
                                    <div className="add-cart">
                                        <button onClick={() => addToCart(product)}>Add To Cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <footer>
                        <div className="footer">
                            Thanks for shopping at JaydenTV Mall!!!
                        </div>
                    </footer>
                </div>
            </main>
        </>
    );
}