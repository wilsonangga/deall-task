"use client"
import React, { useEffect, useState } from 'react'

const Detail = ({ params }) => {
    const [cartData, setCartData] = useState([])
    const [userData, setUserData] = useState()

    useEffect(() => {
        fetch('https://dummyjson.com/carts/1')
            .then(res => res.json())
            .then((data) => setCartData(data));
    }, [])

    useEffect(() => {
        if (cartData?.length !== 0) {
            fetch(`https://dummyjson.com/users/${cartData?.userId}`)
                .then(res => res.json())
                .then((data) => setUserData(data));
        }
    }, [cartData])

    return (
        cartData.length === 0 ? (<div>Loading...</div>) : (
            <div className='p-5 w-full'>
                <h1 className='text-sm'>Cart {params.slug}</h1>
                <h2 className='text-sm mt-10'>Details</h2>
                <div className='border p-2 w-1/2 mt-2'>
                    <div className="flex text-sm">
                        <p className='w-1/2'>User: {userData?.firstName}</p>
                        <p># of items: {cartData?.totalProducts}</p>
                    </div>
                    <div className="flex text-sm">
                        <p className='w-1/2'>Added On: 20 Jan 2023</p>
                        <p>Total Amount: ${cartData?.total}</p>
                    </div>
                </div>
                <h3 className='text-sm mt-10'>Products</h3>
                <table className='w-full mt-2'>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                            <th>Discount (%)</th>
                            <th>Discount Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartData?.products?.map((item) => (
                            <tr key={item?.id}>
                                <td>{item?.title}</td>
                                <td>{item?.quantity}</td>
                                <td>${item?.price}</td>
                                <td>${item?.total}</td>
                                <td>{item?.discountPercentage}%</td>
                                <td>${item?.discountedPrice}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>)
    )
}

export default Detail