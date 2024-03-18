import React from 'react';
import PropTypes from 'prop-types';
import Image from "next/image";

const Cart = ({ cartItems, changeCartItemQuantity, clearCart }) => {

    return (
        <div className="cart">
            {<>
                SHOPPING LIST ${cartItems.reduce((acc, obj) =>
                    acc + obj.price * obj.quantity, 0).toFixed(2)}
            </>}
            <div className="cart-tab">
                {<h1>
                    Shopping List (Total: ${cartItems.reduce((acc, obj) =>
                        acc + obj.price * obj.quantity, 0).toFixed(2)})
                </h1>}
                <div className="list-cart">
                    {cartItems.map((item) => (
                        <div className="item" key={item.pid}>
                            <div className="image">
                                <Image src={String.prototype.concat("/img/", item.image)} alt={item.image || "No image"} fill />
                            </div>
                            <div className="name">{item.name}</div>
                            <div className="quantity">
                                <input type="text" name="quantity" id="quantity" value={item.quantity} inputMode="numeric"
                                    onChange={(e) => changeCartItemQuantity(e, item)} />
                            </div>
                            <div className="unitPrice">@${item.price.toFixed(2)}</div>
                        </div>
                    ))}
                </div>
                <div className="btn">
                    <button className="checkout">Checkout</button>
                </div>
                <div className="btn">
                    <button className="clear" onClick={clearCart}>Clear Cart</button>
                </div>
            </div>
        </div>
    );
};

Cart.propTypes = {
    cartItems: PropTypes.array.isRequired,
    changeCartItemQuantity: PropTypes.func.isRequired,
    clearCart: PropTypes.func.isRequired,
};

export default Cart;