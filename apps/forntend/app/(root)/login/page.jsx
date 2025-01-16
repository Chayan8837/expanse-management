"use client"
import React, { useState, useEffect } from 'react'
import { Mail, Lock, User, Phone, AlertCircle } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useMediaQuery } from 'react-responsive';
import { useDispatch,useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '@/app/Redux/User/userSlice';
import { useRouter } from 'next/navigation';
import Loader from '@/app/components/Loader';
import { Provider } from 'react-redux';
import store from '@/app/Redux/store';

// Custom Button Component
const Button = ({ onClick, className, children, type = "button", disabled }) => (
  <button
    onClick={onClick}
    type={type}
    disabled={disabled}
    className={`px-6 py-3 rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {children}
  </button>
)

// Custom Input Component
const Input = ({ id, name, type, required, className, placeholder, value, onChange, icon: Icon }) => (
  <div className="relative">
    {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />}
    <input
      id={id}
      name={name}
      type={type}
      required={required}
      className={`w-full px-5 py-3 bg-gray-700/30 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${Icon ? 'pl-10' : ''} ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
)

// Custom Label Component
const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-300 mb-1">
    {children}
  </label>
)
// Notification Component
const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`fixed z-50 top-4 right-4 px-6 py-3 rounded-full ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white flex items-center shadow-lg`}>
      <AlertCircle className="mr-2" />
      {message}
      <button onClick={onClose} className="ml-2 focus:outline-none">
        &times;
      </button>
    </div>
  )
}

// Auth Page Component
export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: ''
  })
  const [notification, setNotification] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Handle Login
  const handleLogin = async (email, password) => {
    try {
      dispatch(loginStart());
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()
      if (data.token) {
        localStorage.setItem('userId', data.userId);
      }

      if (!response.ok) {
        dispatch(loginFailure(data.message));
        throw new Error(data.message)
      }

      dispatch(loginSuccess(data));
      console.log(data);
      console.log(`redux data user`,user);


      return { success: true, userId: data.userId }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Handle Registration  
  const handleRegister = async (name, phone, email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          phone, 
          email,
          password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message)
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true);
    
    let result
    if (isLogin) {
      result = await handleLogin(formData.email, formData.password)
      if (result.success) {
        setNotification({
          message: 'Login successful!',
          type: 'success'
        });
        setTimeout(() => {
          router.push(`/user/${result.userId}`);
        }, 1000);
      } else {
        setNotification({
          message: result.error || 'An error occurred',
          type: 'error'
        });
      }
    } else {
      result = await handleRegister(formData.name, formData.phone, formData.email, formData.password)
      if (result.success) {
        setNotification({
          message: 'Registration successful!',
          type: 'success'
        });
        setIsLogin(true);
      } else {
        setNotification({
          message: result.error || 'An error occurred',
          type: 'error'
        });
      }
    }
    setIsLoading(false);
  }

  const showNotification = (message, type) => {
    setNotification({ message, type })
  }

  const closeNotification = () => {
    setNotification(null)
  }

  const toggleAuthMode = () => {
    setIsLogin(!isLogin)
    setFormData({
      name: '',
      phone: '',
      email: '',
      password: ''
    })
  }
  return (
    <Provider store={store}>      
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4  absolute inset-0 ${isMobile ? 'top-20' : ''}`}>
      {isLoading && <Loader />}
      <div className="w-full max-w-6xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-filter backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-gray-700/50 overflow-hidden">
        <div className="flex flex-col md:flex-row ">
          {/* Image Side */}
          <div className="w-full md:w-1/2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 z-10"></div>
            <img
              src="https://media.istockphoto.com/id/682961712/vector/pink-piggy-bank-with-falling-coins-saving-money-investments-in-future.jpg?s=612x612&w=0&k=20&c=GywpFsJSe-1hW2P68vfCpO4-GPEmHV3LuL6p37DZO5A="
              alt="Abstract financial illustration"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Expense Tracker</h1>
                <p className="text-xl text-gray-200">Manage your finances with ease</p>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <div className="max-w-md mx-auto">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                {isLogin ? 'Welcome Back' : 'Join Us'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <>
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        icon={User}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        placeholder="+1234567890"
                        value={formData.phone}
                        onChange={handleChange}
                        icon={Phone}
                      />
                    </div>
                  </>
                )}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    icon={Mail}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="********"
                    value={formData.password}
                    onChange={handleChange}
                    icon={Lock}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transform hover:scale-105"
                >
                  {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
                </Button>
                {/* Google Login */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 text-gray-400 bg-black">continue with</span>
                  </div>
                </div>
                <Button 
                  type="button"
                  onClick={() => signIn('google')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-900 transform hover:scale-105"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="blue"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="blue"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="blue"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="blue"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </form>
              <p className="mt-6 text-center text-gray-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <button 
                  onClick={toggleAuthMode} 
                  disabled={isLoading}
                  className="text-purple-400 hover:underline"
                >
                  {isLogin ? 'Register' : 'Login'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
    </div>
    </Provider>
  )
}