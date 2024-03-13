import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
import { getData, postData } from '../../util/api';
import Cart from '../../components/cart';

export default function Category() {

    const [category, setCategory] = useState([]);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const router = useRouter();

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
                <div class="container">
                    <header id="home">
                        <div class="title">JAYDENTV MALL</div>
                        <Cart
                            cartItems={cartItems}
                            changeCartItemQuantity={changeCartItemQuantity}
                            clearCart={clearCart}
                        />
                    </header>
                    <div class="ref-link">
                        <span><Link href="/">Home</Link></span>
                        <span> &gt; </span>
                        <span><Link href="#home">{category.name}</Link></span>
                    </div>
                    <div class="list-of-items">
                        <h1>{category.name}</h1>
                        <div class="products">
                            {products.map((product) => (
                                <div class="item" key={product.pid}>
                                    <div class="item-clickable" onClick={() => {
                                        router.push({
                                            pathname: `/${encodeURIComponent(category.name.toLowerCase())}/${encodeURIComponent(product.name.toLowerCase())}`,
                                            query: { cid: category.cid, pid: product.pid },
                                        })
                                    }}>
                                        <img src="/img/suisei.gif" alt="" />
                                        <h2>{product.name}</h2>
                                        <span>${product.price.toFixed(2)}</span>
                                    </div>
                                    <span>
                                        <button class="add-cart" onClick={() => addToCart(product)}>Add To Cart</button>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <footer>
                        <div class="footer">
                            Thanks for shopping at JaydenTV Mall!!!
                        </div>
                    </footer>
                </div>
            </main>
        </>
    );
}