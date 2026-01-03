import { createContext, useEffect, useState } from "react";
import { products } from "../assets/assets";
import { toast } from "react-toastify";

export const ShopContext= createContext();
const ShopContextProvider=(props)=>{
    const currency="$";
    const delivery_fee=10; 
    const [search,setSearch]=useState('');
    const [showSearch,setShowSearch]=useState(false);
    const [cartItems,setCartItems]=useState({});

    const addToCart=async (itemId,size)=>{
        if(!size){
            toast.error('Select product size');
            return
        }
        let cartData=structuredClone(cartItems);
        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size]+=1;
            }else{
                cartData[itemId][size]=1;
            }
        }else{
            cartData[itemId]={};
            cartData[itemId][size]=1;

        }
        setCartItems(cartData);
    }
    const getCartCount = () => {
    let totalCount = 0;

    for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
            totalCount += cartItems[productId][size];
        }
    }

    return totalCount;
};

    const value={
        products,currency,delivery_fee,search,setSearch,showSearch,setShowSearch,cartItems,addToCart,getCartCount
    }
    return(
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}
export default ShopContextProvider;