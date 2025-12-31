import { useState } from "react";
import "./App.css";

const productsData = [
  {
    image: { thumbnail: "./assets/images/image-waffle-thumbnail.jpg" },
    name: "Waffle with Berries",
    category: "Waffle",
    price: 6.5,
    id: 1,
  },
  {
    image: { thumbnail: "./assets/images/image-creme-brulee-thumbnail.jpg" },
    name: "Vanilla Bean Crème Brûlée",
    category: "Crème Brûlée",
    price: 7.0,
    id: 2,
  },
  {
    image: { thumbnail: "./assets/images/image-macaron-thumbnail.jpg" },
    name: "Macaron Mix of Five",
    category: "Macaron",
    price: 8.0,
    id: 3,
  },
  {
    image: { thumbnail: "./assets/images/image-tiramisu-thumbnail.jpg" },
    name: "Classic Tiramisu",
    category: "Tiramisu",
    price: 5.5,
    id: 4,
  },
  {
    image: { thumbnail: "./assets/images/image-baklava-thumbnail.jpg" },
    name: "Pistachio Baklava",
    category: "Baklava",
    price: 4.0,
    id: 5,
  },
];

export default function App() {
  const [addProducts, setAddProducts] = useState([]);

  // وظيفة إضافة منتج أو زيادة الكمية
  function handleAddToCart(product) {
    setAddProducts((currentItems) => {
      const isProductInCart = currentItems.find((p) => p.id === product.id);
      if (isProductInCart) {
        return currentItems.map((p) =>
          p.id === product.id ? { ...p, itemsNo: p.itemsNo + 1 } : p
        );
      } else {
        return [...currentItems, { ...product, itemsNo: 1 }];
      }
    });
  }

  // وظيفة تقليل الكمية أو الحذف تماماً
  function handleRemoveFromCart(id) {
    setAddProducts((currentItems) => {
      return currentItems
        .map((p) => (p.id === id ? { ...p, itemsNo: p.itemsNo - 1 } : p))
        .filter((p) => p.itemsNo > 0);
    });
  }

  // وظيفة حذف المنتج تماماً بالزرار (X)
  function deleteItem(id) {
    setAddProducts((currentItems) => currentItems.filter((p) => p.id !== id));
  }

  return (
    <div className="App">
      <div className="container">
        <ListProducts>
          <Heading />
          <Main
            products={productsData}
            addProducts={addProducts}
            onAdd={handleAddToCart}
            onRemove={handleRemoveFromCart}
          />
        </ListProducts>
        <Checkout addProducts={addProducts} onDelete={deleteItem} />
      </div>
    </div>
  );
}

// --- المكونات الفرعية ---

function ListProducts({ children }) {
  return <div className="products-section">{children}</div>;
}

function Heading() {
  return <h2 className="title">Desserts</h2>;
}

function Main({ products, addProducts, onAdd, onRemove }) {
  return (
    <ul className="p-list">
      {products.map((item) => (
        <Dessert
          key={item.id}
          item={item}
          // بنشوف المنتج ده موجود منه كام حالياً في الكارت
          quantity={addProducts.find((p) => p.id === item.id)?.itemsNo || 0}
          onAdd={onAdd}
          onRemove={onRemove}
        />
      ))}
    </ul>
  );
}

function Dessert({ item, quantity, onAdd, onRemove }) {
  return (
    <li>
      <div className="p">
        <div className="p-box">
          {/* تغيير الـ border لو المنتج في الكارت */}
          <img
            src={item.image.thumbnail}
            alt={item.name}
            className={quantity > 0 ? "active-border" : ""}
          />
          <div className="p-box-relative">
            <div className="p-cart">
              {quantity === 0 ? (
                <div className="p-cart-front cart" onClick={() => onAdd(item)}>
                  <i className="fa-solid fa-cart-shopping"></i> Add to cart
                </div>
              ) : (
                <div className="p-cart-back cart">
                  <button onClick={() => onRemove(item.id)}>-</button>
                  <span>{quantity}</span>
                  <button onClick={() => onAdd(item)}>+</button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="p-content">
          <h6>{item.category}</h6>
          <p className="p-name">{item.name}</p>
          <p className="p-price">${item.price.toFixed(2)}</p>
        </div>
      </div>
    </li>
  );
}

function Checkout({ addProducts, onDelete }) {
  const totalItems = addProducts.reduce((sum, item) => sum + item.itemsNo, 0);

  return (
    <div className="cart-container">
      <h2>Your Cart ({totalItems})</h2>
      {addProducts.length === 0 ? (
        <EmptyCart />
      ) : (
        <Order addProducts={addProducts} onDelete={onDelete} />
      )}
    </div>
  );
}

function Order({ addProducts, onDelete }) {
  const totalPrice = addProducts.reduce(
    (sum, item) => sum + item.price * item.itemsNo,
    0
  );

  return (
    <div className="order-summary">
      {addProducts.map((product) => (
        <div className="order-check" key={product.id}>
          <div>
            <h4>{product.name}</h4>
            <p className="p-order">
              <span className="order-Num">{product.itemsNo}x</span>
              <span className="order-price">@${product.price.toFixed(2)}</span>
              <span className="order-total">
                ${(product.itemsNo * product.price).toFixed(2)}
              </span>
            </p>
          </div>
          <button className="btn-check" onClick={() => onDelete(product.id)}>
            ×
          </button>
        </div>
      ))}
      <div className="cart-total">
        <span>Order Total</span>
        <span className="total-amount">${totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="empty-cart-ui">
      {/* نفس الـ SVG بتاعك هنا */}
      <p>Your added items will appear here</p>
    </div>
  );
}
