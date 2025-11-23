import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import ProductList from "./components/ProductList";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadMoreMode, setLoadMoreMode] = useState(false); 

  const fetchProducts = useCallback(async (opts = {}) => {
    setLoading(true);
    try {
      const q = {
        search: opts.search ?? search,
        category: opts.category ?? category,
        page: opts.page ?? page,
        limit,
      };
     
      const params = {};
      Object.keys(q).forEach((k) => {
        if (q[k] !== "" && q[k] !== undefined && q[k] !== null) params[k] = q[k];
      });

      const url = `${API}/api/products`;
      const res = await axios.get(url, { params });
     
      if (opts.append) {
        setProducts((p) => [...p, ...res.data.products]);
      } else {
        setProducts(res.data.products);
      }
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Fetch products failed:", err);
    } finally {
      setLoading(false);
    }
  }, [API, search, category, page, limit]);

  useEffect(() => {
    if (!loadMoreMode) {
      fetchProducts({ page, search, category });
    }
  }, [fetchProducts, page, search, category, loadMoreMode]);

  useEffect(() => {
    if (loadMoreMode) {
      setProducts([]);
      setPage(1);
      fetchProducts({ page: 1, search, category });
    }
  }, [fetchProducts, search, category, loadMoreMode]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    setPage(1);
  
  };

  const uniqueCategories = React.useMemo(() => {
   
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ["", ...Array.from(set)];
  }, [products]);

  const totalPages = Math.max(1, Math.ceil((total || 0) / limit));

  const handleLoadMore = async () => {
    const next = page + 1;
    setPage(next);
    await fetchProducts({ page: next, append: true });
  };

  return (
    <div className="container">
      <h1>Mini eCommerce — Products</h1>

      <div className="header">
        <form onSubmit={handleSearchSubmit} style={{display:"flex", gap:8, flex:1}}>
          <input
            className="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="primary">Search</button>
        </form>

        <div className="controls">
          <select className="select" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
            <option value="">All categories</option>
            {uniqueCategories.map((c, i) => c ? <option key={i} value={c}>{c}</option> : null)}
          </select>

          <label style={{display:"flex", alignItems:"center", gap:6}}>
            <input type="checkbox" checked={loadMoreMode} onChange={(e) => setLoadMoreMode(e.target.checked)} />
            <span className="small">Load More mode</span>
          </label>
        </div>
      </div>

      <ProductList products={products} />

      <div className="footer">
        {loading ? <div className="small">Loading...</div> : null}

        {loadMoreMode ? (
          (products.length < total) ? (
            <button onClick={handleLoadMore} className="primary">Load more</button>
          ) : (
            <div className="small">No more products</div>
          )
        ) : (
         
          <div style={{display:"flex", gap:8, alignItems:"center"}}>
            <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Prev
            </button>
            <div className="small">Page {page} / {totalPages}</div>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
