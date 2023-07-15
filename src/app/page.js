"use client"
import React, { useEffect, useState, useRef, useCallback } from 'react'
import debounce from 'lodash.debounce'

const Products = () => {
  const [data, setData] = useState([])
  const [limit, setLimit] = useState(5)
  const [skip, setSkip] = useState(0)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('search') || '' : '';
  });
  const prevSearchRef = useRef(null);
  const [filterCategory, setFilterCategory] = useState(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('filterCategory') || '' : '';
  })
  const [filterCategoryList, setFilterCategoryList] = useState([])

  const fetchData = useCallback(async () => {
    const url = filterCategory !== ''
      ? `https://dummyjson.com/products/category/${filterCategory}?limit=${limit}&skip=${skip}&q=${search}`
      : `https://dummyjson.com/products/search/?limit=${limit}&skip=${skip}&q=${search}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setData(data);
      setTotal(data?.total);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [limit, skip, search, filterCategory]);

  useEffect(() => {
    if (prevSearchRef.current !== search) {
      setSkip(0);
    }
    prevSearchRef.current = search;

    const debouncedFetch = debounce(fetchData, 300);
    debouncedFetch();

    localStorage.setItem('search', search);
    localStorage.setItem('filterCategory', filterCategory);

    return () => {
      debouncedFetch.cancel();
    };
  }, [skip, search, filterCategory, fetchData]);

  useEffect(() => {
    fetch('https://dummyjson.com/products/categories')
      .then(res => res.json())
      .then((data) => setFilterCategoryList(data));
  }, [])

  const nextPage = () => {
    setSkip((prev) => Math.min(prev + 5, total - limit));
  }

  const prevPage = () => {
    setSkip((prev) => Math.max(prev - 5, 0));
  }

  const handleChange = (event) => {
    setSearch(event.target.value)
  }

  const handleFilter = (event) => {
    setFilterCategory(event.target.value)
  }

  return (
    <div className='w-full p-5'>
      <div className="flex flex-col items-end mb-2">
        <input type="text" className='border p-1 px-2 outline-none text-xs rounded-sm' onChange={handleChange} placeholder="Cari produk" value={search} />
        <div className="flex mt-2">
          <select name="brand" id="brand" className='text-xs px-2 py-1 border outline-none' value={filterCategory} onChange={handleFilter}>
            <option value="">Choose Category</option>
            {filterCategoryList?.map((item, index) => (<option key={index}>{item}</option>))}
          </select>
        </div>
      </div>
      {
        data.length === 0 ? (<div className='text-sm'>Loading...</div>) : (
          <table className='w-full'>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {data?.products?.map((item) => (
                <tr key={item?.id}>
                  <td>{item?.title}</td>
                  <td>{item?.brand}</td>
                  <td>${item?.price}</td>
                  <td>{item?.stock}</td>
                  <td>{item?.category}</td>
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