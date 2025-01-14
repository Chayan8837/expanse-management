import React from 'react'

const Loader = () => {
  return (
    <div className='fixed top-0 left-0 w-full h-screen flex items-center justify-center z-50 backdrop-blur-sm'>
      <div className='relative w-24 h-24'>
        <div className='absolute w-full h-full rounded-full border-8 border-t-blue-400 border-r-purple-400 border-b-pink-400 border-l-transparent animate-spin'></div>
        <div className='absolute w-full h-full flex items-center justify-center'>
          <svg 
            className='w-12 h-12 text-white animate-pulse' 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-.566 21.613c-5.3-.336-9.499-4.536-9.835-9.835l9.835 9.835zm1.132 0v-9.835l9.835 9.835c-5.3-.336-9.499-4.536-9.835-9.835zm9.835-10.967l-9.835-9.835v9.835h9.835zm-10.967-9.835l-9.835 9.835h9.835v-9.835z"/>
          </svg>
        </div>
      </div>
    </div>
  )
}

export default Loader