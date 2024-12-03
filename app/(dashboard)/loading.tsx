import { Loader } from "lucide-react";

  const Loading = () => {
    return ( 
    <div className="flex flex-col w-screen h-screen items-center justify-center">
      <Loader className="animate-spin"/>
    </div> );
  }
   
  export default Loading;