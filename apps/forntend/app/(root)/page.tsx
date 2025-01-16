import Hero from '@/app/components/Hero'
import Features from '@/app/components/Features'
import Community from '@/app/components/Community'
import Footer from '@/app/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Hero />
      <Features />
      <Community />
      <Footer />
    </main>
  )
}

