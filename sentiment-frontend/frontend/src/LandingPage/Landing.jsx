
import Footer from './component/Footer'
import HowItWorks from './component/HowItWorks'
import Navbar from './component/Navbar'
import Service from './component/Service'

import TopSection from './component/TopSection'

function Landing() {
  return (
    <div className='w-full h-full bg-white dark:bg-black transition-all duration-500'>
      <Navbar/>
      <TopSection/>
      <Service/>
      <HowItWorks/>
      <Footer/>
    </div>
  )
}

export default Landing
