import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";
import {useNavigate} from "react-router-dom"
export const ShopContext= createContext();
const ShopContextProvider=(props)=>{
    const currency="$";
    const delivery_fee=10;
    const backendURL=import.meta.env.VITE_BACKEND_URL 
    const [search,setSearch]=useState('');
    const [showSearch,setShowSearch]=useState(false);
    const [products,setProducts]=useState([]);
    const [token,setToken]=useState('');
    const [cartItems,setCartItems]=useState({});
    const navigate=useNavigate()

    const addToCart=async (itemId,size)=>{
        console.log("ADD TO CART CLICKED", itemId, size);
        console.log(token)
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
        
        if(token){
            console.log('inside cart added')
            try {
                await axios.post(backendURL+'/api/cart/add',{itemId,size},{headers:{token}})
                console.log('backend call')
            } catch (error) {
                 console.log(error);
                toast.error(error.message)
            }
        }
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

const updateQuantity=async (itemId,size,quantity)=>{
    let cartData=structuredClone(cartItems);
    cartData[itemId][size]=quantity;
    setCartItems(cartData);
}

const getCartAmount=() =>{
    let totalAmount=0;
    for(const items in cartItems){
          let itemInfo=products.find((product)=> product._id===items);
          for(const item in cartItems[items]){
            try{
                if(cartItems[items][item]>0){
                    totalAmount+=itemInfo.price*cartItems[items][item]
                }
            }catch(error){

            }
          }
    }
    return totalAmount;
}

const getProductsData=async()=>{
    try {
         const response=await axios.get(backendURL+'/api/product/list');
         console.log(backendURL)
          if(response.data.success){
            setProducts(response.data.products)
          }else{
            toast.error(response.data.message)
          }
    } catch (error) {
        console.log(error);
        toast.error(error.message);
    }
}
useEffect(()=>{
    getProductsData();
},[])
    const value={
        products,currency,delivery_fee,search,setSearch,showSearch,setShowSearch,cartItems,addToCart,getCartCount,updateQuantity,getCartAmount,navigate,backendURL,setToken,token,setCartItems
    }
    return(
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}
export default ShopContextProvider;