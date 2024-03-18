import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
import { getData, postData } from '../util/api';
import Cart from '../components/cart';

export default function Home() {

  const [categories, setCategories] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch initial data
    getData('database')
      .then((data) => {
        // Handle the fetched data
        setCategories(data.categories);
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
  }, []);

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
        <meta charset="UTF-8" />
        <meta name="description" content="1155176645 IERG4210" />
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
            <span className="ref-link"><Link href="">Home</Link></span>
            <span className="admin-panel-link"><Link href="./admin" target="_blank">Admin Panel</Link></span>
          </div>
          <div className="list-of-items">
            <h1>Catagories</h1>
            <div className="catagories">
              {categories.map((category) => (
                <div className="item" key={category.cid} onClick={() => {
                  router.push({
                    pathname: `/${encodeURIComponent(category.name.toLowerCase().replace(/\s+/g, '-'))}`,
                    query: { cid: category.cid },
                  })
                }}>
                  <div className="image">
                    <Image src={String.prototype.concat("/img/", category.image)} alt={category.image || "No image"} fill />
                  </div>
                  <h2>{category.name}</h2>
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
      </main >
    </>
  );
}
