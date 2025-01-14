import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h3 className="text-2xl font-bold text-white">CashSplit</h3>
          <p className="mt-2">Split bills, not friendships</p>
        </div>
        <nav className="flex flex-wrap justify-center gap-4">
          <Link href="#" className="hover:text-white transition-colors">Home</Link>
          <Link href="#" className="hover:text-white transition-colors">Features</Link>
          <Link href="#" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="#" className="hover:text-white transition-colors">About</Link>
          <Link href="#" className="hover:text-white transition-colors">Contact</Link>
        </nav>
      </div>
      <div className="mt-8 text-center text-sm">
        © {new Date().getFullYear()} CashSplit. All rights reserved.
      </div>
    </footer>
  )
}

