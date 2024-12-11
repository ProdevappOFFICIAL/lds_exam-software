import { BellRing } from "lucide-react";

   const SlideOne = () => {
    return ( 
        <div className="flex flex-row w-full items-center justify-between px-5   bg-yellow-200/20  dark:bg-yellow-200/20 rounded-md border border-gray-300/30 py-4">
        <BellRing className="dark:text-white w-6 h-6" width={9} height={9} />
      
        <div className="flex text-black   text-sm dark:text-white">
          Welcome to LearningDeck
        </div>
      
        <p className="flex  text-sm px-2 py-1 rounded-full bg-green-200/20 text-black">
          v1.01
        </p>

    </div>
    );
   }
    
   export default SlideOne;