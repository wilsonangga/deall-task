"use client"
import React, { useEffect, useState, useRef, useCallback } from 'react'
import debounce from 'lodash.debounce'
import { useRouter } from 'next/navigation'

const Products = () => {
  const router = useRouter()
  const [data, setData] = useState([])
  const [limit, setLimit] = useState(5)
  const [skip, setSkip] = useState(0)
  const [total, setTotal] = useState(0)

  const fetchData = useCallback(async () => {
    const url = `https://dummyjson.com/carts?skip=${skip}&limit=${limit}`

    try {
      const response = await fetch(url);
      const data = await response.json();
      setData(data);
      setTotal(data?.total);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [skip, limit]);

  useEffect(() => {
    const debouncedFetch = debounce(fetchData, 300);
    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [skip, fetchData]);

  const nextPage = () => {
    setSkip((prev) => Math.min(prev + 5, total - limit));
  }

  const prevPage = () => {
    setSkip((prev) => Math.max(prev - 5, 0));
  }

  return (
    <div className='w-full p-5'>
      {
        data.length === 0 ? (<div className='text-sm'>Loading...</div>) : (
          <table className='w-full'>
            <thead>
              <tr>
                <th>#</th>
                <th>User Id</th>
                <th>Total Products</th>
                <th>Total Quantity</th>
                <th>Total</th>
                <th>Discount Total</th>
              </tr>
            </thead>
            <tbody>
              {data?.carts?.map((item) => (
                <tr key={item?.id}>
                  <td onClick={() => router.push(`/carts/${item?.id}`)} className="cursor-pointer text-[#6913D8]">{item?.id}</td>
                  <td>{item?.userId}</td>
                  <td>{item?.totalProducts}</td>
                  <td>${item?.totalQuantity}</td>
                  <td>${item?.total}</td>
                  <td>${item?.discountedTotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }
      <div className="flex gap-2 justify-end mt-2">
        <button className='text-xs cursor-pointer text-[#6913D8]' onClick={() => prevPage()}>Prev</button>
        <span className='text-xs'>Page {total > 0 ? skip / 5 + 1 : 0} / {Math.ceil(total / limit)}</span>
        <button className='text-xs cursor-pointer text-[#6913D8]' onClick={() => nextPage()}>Next</button>
      </div>
    </div >
  )
}

export default Products