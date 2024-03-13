import React from 'react';
import PropTypes from 'prop-types';

const Cart = ({ cartItems, changeCartItemQuantity, clearCart }) => {

    return (
        <div class="cart">
            {<>
                SHOPPING LIST ${cartItems.reduce((acc, obj) =>
                    acc + obj.price * obj.quantity, 0).toFixed(2)}
            </>}
            <div class="cart-tab">
                {<h1>
                    Shopping List (Total: ${cartItems.reduce((acc, obj) =>
                        acc + obj.price * obj.quantity, 0).toFixed(2)})
                </h1>}
                <div class="list-cart">
                    {cartItems.map((item) => (
                        <div class="item" key={item.pid}>
                            <div class="image">
                                <img src="/img/suisei.gif" alt="" />
                            </div>
                            <div class="name">{item.name}</div>
                            <div class="quantity">
                                <input type="text" name="quantity" id="quantity" value={item.quantity} inputMode="numeric"
                                    onChange={(e) => changeCartItemQuantity(e, item)} />
                            </div>
                            <div class="unitPrice">@${item.price.toFixed(2)}</div>
                        </div>
                    ))}
                </div>
                <div class="btn">
                    <button class="checkout">Checkout</button>
                </div>
                <div class="btn">
                    <button class="clear" onClick={clearCart}>Clear Cart</button>
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