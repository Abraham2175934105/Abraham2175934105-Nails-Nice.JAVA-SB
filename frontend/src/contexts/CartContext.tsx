import React, { createContext, useContext, useEffect, useState } from "react";
import apiCart from "@/lib/apiCart";
import { useAuth } from "./AuthContext";

type CartItem = { id?: number; idProducto: number; nombre?: string; precio: number; cantidad: number; imagen?: string };

type CartState = {
  items: CartItem[];
  add: (item: CartItem) => Promise<void>;
  remove: (idProducto: number) => Promise<void>;
  updateQty: (idProducto: number, qty: number) => Promise<void>;
  count: number;
  total: number;
  sync: () => Promise<void>;
  clear: () => Promise<void>;
};

const CartContext = createContext<CartState | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => {
    const s = localStorage.getItem("nn_cart");
    return s ? JSON.parse(s) : [];
  });

  useEffect(() => {
    localStorage.setItem("nn_cart", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    // cuando hay token, intentar sincronizar carrito server -> local
    (async () => {
      if (token) {
        try {
          const server = await apiCart.fetchCartServer(token);
          if (Array.isArray(server)) {
            const mapped = server.map((it: any) => ({
              id: it.id,
              idProducto: it.id_producto ?? it.productoId ?? it.producto?.id,
              nombre: it.nombre ?? it.productoNombre ?? it.producto?.nombre,
              precio: Number(it.precio ?? it.precio_unitario ?? it.precioUnitario ?? 0),
              cantidad: Number(it.cantidad ?? it.cantidad_producto ?? 1),
              imagen: it.imagen ?? it.producto?.imagen ?? "",
            }));
            setItems(mapped);
          }
        } catch (err) {
          // console.debug("no sync cart", err);
        }
      }
    })();
  }, [token]);

  const sync = async () => {
    if (!token) return;
    try {
      // estrategia simple: añadir todos al server (puede crear duplicados si backend no deduplica)
      for (const it of items) {
        await apiCart.addToCartServer({ productoId: it.idProducto, cantidad: it.cantidad, precioUnitario: it.precio }, token);
      }
    } catch (err) {
      // ignore
    }
  };

  const add = async (item: CartItem) => {
    const exists = items.find(i => i.idProducto === item.idProducto);
    if (exists) {
      setItems(prev => prev.map(i => i.idProducto === item.idProducto ? { ...i, cantidad: i.cantidad + item.cantidad } : i));
      if (token && exists.id) {
        try {
          await apiCart.updateCartItemServer(exists.id, { cantidad: exists.cantidad + item.cantidad }, token);
        } catch {}
      }
    } else {
      setItems(prev => [item, ...prev]);
      if (token) {
        try {
          const added = await apiCart.addToCartServer({ productoId: item.idProducto, cantidad: item.cantidad, precioUnitario: item.precio }, token);
          if (added?.id) {
            setItems(prev => prev.map(it => it.idProducto === item.idProducto ? { ...it, id: added.id } : it));
          }
        } catch {}
      }
    }
  };

  const remove = async (idProducto: number) => {
    const found = items.find(i => i.idProducto === idProducto);
    setItems(prev => prev.filter(i => i.idProducto !== idProducto));
    if (token && found?.id) {
      try {
        await apiCart.deleteCartItemServer(found.id, token);
      } catch {}
    }
  };

  const updateQty = async (idProducto: number, qty: number) => {
    setItems(prev => prev.map(i => i.idProducto === idProducto ? { ...i, cantidad: qty } : i));
    const found = items.find(i => i.idProducto === idProducto);
    if (token && found?.id) {
      try {
        await apiCart.updateCartItemServer(found.id, { cantidad: qty }, token);
      } catch {}
    }
  };

  const clear = async () => {
    const snapshot = items.slice();
    setItems([]);
    localStorage.removeItem("nn_cart");
    if (token) {
      try {
        for (const it of snapshot) {
          if (it.id) {
            await apiCart.deleteCartItemServer(it.id, token);
          }
        }
      } catch (e) {
        // ignore server errors while clearing
      }
    }
  };

  const count = items.reduce((s, i) => s + i.cantidad, 0);
  const total = items.reduce((s, i) => s + i.precio * i.cantidad, 0);

  return <CartContext.Provider value={{ items, add, remove, updateQty, count, total, sync, clear }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
};