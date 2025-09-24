import React, { useState, useEffect } from 'react';

// --- Helper Components ---

const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const SearchIcon = () => <Icon path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />;
const UserIcon = () => <Icon path="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />;
const ShoppingBagIcon = () => <Icon path="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />;
const MenuIcon = () => <Icon path="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />;
const XMarkIcon = () => <Icon path="M6 18L18 6M6 6l12 12" />;

// --- Main App Component ---

export default function App() {
  const [page, setPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [products, setProducts] = useState([]);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // This relative URL works because of the "proxy" in package.json for local
        // and because the backend serves the frontend in production.
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);


  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      if (existingItem) {
        return prevCart.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    alert(`${product.name} has been added to your cart!`);
  };
  
  const removeFromCart = (productId) => {
      setCart(cart.filter(item => item._id !== productId));
  };
  
  const updateQuantity = (productId, amount) => {
      setCart(cart.map(item =>
          item._id === productId ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
      ));
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const navigate = (newPage) => {
    setPage(newPage);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const Header = () => (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <a href="#" onClick={() => navigate('home')} className="text-3xl font-bold text-violet-700 tracking-wider">Flickrly</a>
          </div>
          <nav className="hidden md:flex md:items-center md:space-x-8">
            <a href="#" onClick={() => navigate('home')} className="text-gray-600 hover:text-violet-700 transition-colors">Home</a>
            <a href="#" onClick={() => navigate('about')} className="text-gray-600 hover:text-violet-700 transition-colors">About</a>
            <a href="#" onClick={() => navigate('contact')} className="text-gray-600 hover:text-violet-700 transition-colors">Contact</a>
            <a href="#" onClick={() => navigate('subscribe')} className="bg-violet-600 text-white px-4 py-2 rounded-full hover:bg-violet-700 transition-all text-sm font-semibold">Subscribe</a>
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
                <input type="text" placeholder="Search candles..." className="border rounded-full py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all w-48" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></div>
            </div>
            <button onClick={() => navigate('login')} className="text-gray-600 hover:text-violet-700"><UserIcon /></button>
            <button onClick={() => navigate('cart')} className="relative text-gray-600 hover:text-violet-700">
              <ShoppingBagIcon />
              {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-violet-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{cart.length}</span>}
            </button>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => navigate('cart')} className="relative text-gray-600 hover:text-violet-700 mr-4">
              <ShoppingBagIcon />
              {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-violet-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{cart.length}</span>}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">{isMenuOpen ? <XMarkIcon /> : <MenuIcon />}</button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-4 items-center">
                <a href="#" onClick={() => navigate('home')} className="text-gray-600 hover:text-violet-700 transition-colors">Home</a>
                <a href="#" onClick={() => navigate('about')} className="text-gray-600 hover:text-violet-700 transition-colors">About</a>
                <a href="#" onClick={() => navigate('contact')} className="text-gray-600 hover:text-violet-700 transition-colors">Contact</a>
                <a href="#" onClick={() => navigate('subscribe')} className="bg-violet-600 text-white px-4 py-2 rounded-full hover:bg-violet-700 transition-all text-sm font-semibold">Subscribe</a>
                <a href="#" onClick={() => navigate('login')} className="text-gray-600 hover:text-violet-700 pt-2 transition-colors">Login/Signup</a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );

  const Footer = () => (
    <footer className="bg-gray-100 text-gray-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div><h3 className="text-2xl font-bold text-violet-700 tracking-wider">Flickrly</h3><p className="mt-2 text-sm">Handmade with love in Jamshedpur.</p></div>
          <div><h4 className="font-semibold text-gray-800">Quick Links</h4><ul className="mt-2 space-y-1"><li><a href="#" onClick={() => navigate('home')} className="hover:text-violet-700">Home</a></li><li><a href="#" onClick={() => navigate('about')} className="hover:text-violet-700">About Us</a></li><li><a href="#" onClick={() => navigate('contact')} className="hover:text-violet-700">Contact</a></li></ul></div>
          <div><h4 className="font-semibold text-gray-800">Contact Us</h4><p className="mt-2 text-sm">Jamshedpur, Jharkhand, India</p><p className="text-sm">Phone: 1234567890</p><p className="text-sm">Email: support@flickrly.com</p></div>
          <div><h4 className="font-semibold text-gray-800">Newsletter</h4><p className="mt-2 text-sm">Subscribe for new product alerts!</p><div className="mt-2 flex"><input type="email" placeholder="Your email" className="w-full border rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500" /><button className="bg-violet-600 text-white px-4 rounded-r-md hover:bg-violet-700 text-sm">Go</button></div></div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm"><p>&copy; {new Date().getFullYear()} Flickrly. All rights reserved.</p></div>
      </div>
    </footer>
  );

  const HomePage = () => (
    <div>
      <section className="bg-violet-50"><div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center"><h1 className="text-4xl md:text-6xl font-extrabold text-gray-800">Light Up Your Moments</h1><p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">Discover our collection of exquisite handmade candles, crafted with natural ingredients and captivating scents.</p><button onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })} className="mt-8 bg-violet-600 text-white font-bold py-3 px-8 rounded-full hover:bg-violet-700 transition-transform hover:scale-105">Shop Now</button></div></section>
      {searchQuery && (<div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 container mx-auto my-4 rounded-r-lg"><p className="font-bold">AI Suggestion</p><p>Since you searched for "{searchQuery}", you might also like candles with calming or floral notes!</p></div>)}
      <section id="products" className="py-16"><div className="container mx-auto px-4 sm:px-6 lg:px-8"><h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Our Collection</h2>{filteredProducts.length > 0 ? (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">{filteredProducts.map(product => (<div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden group"><img src={product.image} alt={product.name} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" /><div className="p-6"><h3 className="text-xl font-semibold text-gray-800">{product.name}</h3><p className="text-gray-500 mt-2">{product.description}</p><div className="flex justify-between items-center mt-4"><p className="text-2xl font-bold text-violet-700">₹{product.price}</p><button onClick={() => addToCart(product)} className="bg-violet-100 text-violet-700 font-semibold px-4 py-2 rounded-full hover:bg-violet-600 hover:text-white transition-all">Add to Cart</button></div></div></div>))}</div>) : (<p className="text-center text-gray-500">No products found. Add some to your database!</p>)}</div></section>
    </div>
  );

  const AboutPage = () => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"><div className="max-w-4xl mx-auto text-center"><h1 className="text-4xl font-bold text-gray-800">About Flickrly</h1><p className="mt-4 text-lg text-gray-600">We are more than just a candle company.</p></div><div className="mt-12 grid md:grid-cols-2 gap-12 items-center"><div className="text-gray-700 space-y-4 text-justify"><p>Flickrly was born from a passion for simple joys and the cozy ambiance that only a flickering candle can provide. Based in the heart of Jamshedpur, Jharkhand, we are a small business dedicated to creating high-quality, handmade candles that soothe the soul and brighten your space.</p><p>Each candle is hand-poured in small batches using natural soy wax, premium fragrance oils, and cotton wicks. We believe in sustainable practices and creating products that are both beautiful and kind to the environment. Our mission is to bring a little bit of warmth and light into every home.</p></div><div><img src="https://placehold.co/600x400/e9d5ff/581c87?text=Our+Workshop" alt="Our Workshop" className="rounded-lg shadow-xl" /></div></div></div>
  );
  
  const ContactPage = () => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"><div className="max-w-4xl mx-auto text-center"><h1 className="text-4xl font-bold text-gray-800">Get In Touch</h1><p className="mt-4 text-lg text-gray-600">We'd love to hear from you! Send us a message or find us on the map.</p></div><div className="mt-12 grid md:grid-cols-2 gap-12"><div className="bg-white p-8 rounded-lg shadow-md"><h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Form</h2><form className="space-y-4"><div><label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label><input type="text" id="name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-violet-500 focus:border-violet-500" /></div><div><label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label><input type="email" id="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-violet-500 focus:border-violet-500" /></div><div><label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label><textarea id="message" rows="4" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-violet-500 focus:border-violet-500"></textarea></div><button type="submit" className="w-full bg-violet-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-violet-700 transition-all">Send Message</button></form></div><div className="space-y-6"><div className="bg-white p-8 rounded-lg shadow-md"><h3 className="text-lg font-semibold text-gray-800">Our Location</h3><p className="text-gray-600 mt-1">Flickrly HQ, Jamshedpur, Jharkhand, India</p></div><div className="bg-white p-8 rounded-lg shadow-md"><h3 className="text-lg font-semibold text-gray-800">Contact Details</h3><p className="text-gray-600 mt-1">Phone: 1234567890</p><p className="text-gray-600">Email: support@flickrly.com</p></div></div></div></div>
  );
  
  const SubscribePage = () => (
    <div className="bg-violet-50 py-20"><div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl"><h1 className="text-4xl font-bold text-gray-800">Join the Flickrly Family</h1><p className="mt-4 text-lg text-gray-600">Subscribe to our newsletter to receive updates on new products, special offers, and a dash of delightful news delivered right to your inbox.</p><form className="mt-8 flex flex-col sm:flex-row gap-2 max-w-md mx-auto" onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing!'); }}><input type="email" required placeholder="Enter your email address" className="flex-grow border border-gray-300 rounded-full shadow-sm py-3 px-5 focus:outline-none focus:ring-violet-500 focus:border-violet-500" /><button type="submit" className="bg-violet-600 text-white font-bold py-3 px-8 rounded-full hover:bg-violet-700 transition-all">Subscribe</button></form></div></div>
  );

  const AuthPage = ({ isLogin }) => {
    const title = isLogin ? 'Welcome Back!' : 'Create Your Account';
    const subtitle = isLogin ? 'Log in to continue your scented journey.' : 'Sign up to get started with Flickrly.';
    const buttonText = isLogin ? 'Log In' : 'Sign Up';
    const handleSubmit = (e) => { e.preventDefault(); alert(`This is a prototype. In a real app, this would ${isLogin ? 'log you in' : 'create your account'}.`); navigate('home'); };
    return (<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center"><div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md"><h1 className="text-3xl font-bold text-center text-gray-800">{title}</h1><p className="mt-2 text-center text-gray-500">{subtitle}</p><form onSubmit={handleSubmit} className="mt-8 space-y-6">{!isLogin && (<div><label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label><input type="text" id="name" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-violet-500 focus:border-violet-500" /></div>)}<div><label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label><input type="email" id="email" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-violet-500 focus:border-violet-500" /></div><div><label htmlFor="password"className="block text-sm font-medium text-gray-700">Password</label><input type="password" id="password" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-violet-500 focus:border-violet-500" /></div><button type="submit" className="w-full bg-violet-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-violet-700 transition-all">{buttonText}</button><div className="text-center text-sm">{isLogin ? (<p>Don't have an account? <a href="#" onClick={() => navigate('signup')} className="font-medium text-violet-600 hover:text-violet-500">Sign up</a></p>) : (<p>Already have an account? <a href="#" onClick={() => navigate('login')} className="font-medium text-violet-600 hover:text-violet-500">Log in</a></p>)}</div></form></div></div>);
  };
  
  const CartPage = () => (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"><h1 className="text-4xl font-bold text-gray-800 text-center">Your Shopping Cart</h1>{cart.length === 0 ? (<div className="text-center mt-8"><p className="text-gray-600 text-lg">Your cart is empty.</p><button onClick={() => navigate('home')} className="mt-4 bg-violet-600 text-white font-bold py-3 px-8 rounded-full hover:bg-violet-700 transition-all">Continue Shopping</button></div>) : (<div className="mt-12">{cart.map(item => (<div key={item._id} className="flex items-center justify-between border-b py-4"><div className="flex items-center gap-4"><img src={item.image} alt={item.name} className="w-20 h-20 rounded-md object-cover"/><div><h3 className="font-semibold">{item.name}</h3><p className="text-gray-500 text-sm">₹{item.price}</p></div></div><div className="flex items-center gap-4"><div className="flex items-center border rounded-full"><button onClick={() => updateQuantity(item._id, -1)} className="px-3 py-1">-</button><span className="px-3">{item.quantity}</span><button onClick={() => updateQuantity(item._id, 1)} className="px-3 py-1">+</button></div><p className="font-semibold w-20 text-right">₹{item.price * item.quantity}</p><button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700"><Icon path="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.718c-1.123 0-2.033.954-2.033 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></button></div></div>))}
      <div className="mt-8 flex justify-end"><div className="w-full max-w-sm text-right"><div className="flex justify-between text-lg"><span>Subtotal</span><span className="font-semibold">₹{cartTotal.toFixed(2)}</span></div><p className="text-sm text-gray-500 mt-1">Shipping & taxes calculated at checkout.</p><button onClick={() => alert('This would proceed to a secure payment gateway. This is a prototype.')} className="w-full mt-4 bg-violet-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-violet-700 transition-all">Proceed to Checkout</button></div></div></div>)}</div>
  );

  const renderPage = () => {
    switch (page) {
      case 'home': return <HomePage />;
      case 'about': return <AboutPage />;
      case 'contact': return <ContactPage />;
      case 'subscribe': return <SubscribePage />;
      case 'login': return <AuthPage isLogin={true} />;
      case 'signup': return <AuthPage isLogin={false} />;
      case 'cart': return <CartPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="font-sans bg-gray-50">
        <Header />
        <main>{renderPage()}</main>
        <Footer />
    </div>
  );
}

