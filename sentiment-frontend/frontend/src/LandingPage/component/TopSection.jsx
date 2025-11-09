import {useNavigate} from 'react-router-dom'

function TopSection() {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/dashboard');
  };


  return (
    <div className="w-full h-full dark:bg-gradient">

    <div className='w-full md:w-[60vw] md:mx-auto h-[70vh] shadow-md shadow-neutral-200 bg-gradient-to-br from-transparent via-white to-neutral-300 rounded-md  flex flex-col items-center justify-center  gap-5  dark:bg-none dark:shadow-none'>
        <h1 className='text-5xl text-center w-full tracking-tighter line capitalize whitespace-normal font-bold dark:text-white/50 font-oleo'>
            Leverage Data Effectively
        </h1>
      <p className='text-sm md:text-md text-neutral-500 selection:text-purple-300 font-semibold font-oleo'>
        Advanced sentiment analysis for informed decisions..
      </p>
      <p className="text-xs md:text-sm text-neutral-500 selection:text-purple-300 px-3 font-oleo ">Our sentiment analysis tool processes user comments to quickly identify the prevailing emotional tone, categorizing feedback as positive, negative, or neutral. This provides an instant overview of public perception, highlighting key areas of satisfaction or concern without needing to manually review every remark.</p>
        <button
          className="w-[150px] h-fit px-3 py-1 text-lg bg-gradient-to-b from-purple-500 to-purple-200 
             font-bold rounded-md border-none shadow-md shadow-purple-800 text-neutral-900 
             font-oleo transition-transform duration-300 ease-out hover:scale-105"
          onClick={handleClick}
        >


          Analyse Now
        </button>
    </div>
  </div>
  )
}

export default TopSection
