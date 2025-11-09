import {React,useState,useEffect} from "react";
import Switch from "../../utils/Switch.jsx";
import {motion} from 'motion/react'
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (// border-b-2  border-neutral-300 dark:border-purple-300
    <motion.nav className={`sticky top-0 w-full h-fit py-1 flex justify-between items-center transition-all duration-500 ease-in  z-20
    ${scrolled?"border-none px-[2rem] md:px-[6rem] ": " px-4"} `}
  initial={{
    opacity:0,
    y:-50,
  }}
  animate={
    {
      opacity:1,
      y:0,
      transition:{
        duration:0.2,
        ease:'easeIn'
      }
    }
  }
  
    >
      {
     !scrolled && <div className="w-[90%] absolute h-[2px] bottom-1  bg-gradient-to-r from-transparent via-purple-200 via-purple-600 dark:via-purple-400 via-purple-200 to-transparent"></div>
}
      <div className="w-fit h-full">
        <h1 className="text-2xl font-bold text-neutral-700 dark:text-neutral-500 ">XSentiment</h1>
      </div>
      <Switch />
    </motion.nav>
  );
}

export default Navbar;
