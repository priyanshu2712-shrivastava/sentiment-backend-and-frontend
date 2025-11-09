
import Footer from './component/Footer'
import Navbar from './component/Navbar'
import Service from './component/Service'
import TopSection from './component/TopSection'

function Landing() {
  return (
    <div className='w-full h-full bg-gradient-to-r from-transparent via-neutral-100 to-neutral-300  dark:bg-gradient'>
      <Navbar/>
      <TopSection/>
      <Service/>
      <Footer/>
    </div>
  )
}

export default Landing
