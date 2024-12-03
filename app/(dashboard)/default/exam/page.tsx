"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalculatorIcon, ChevronLeft, ChevronRight, Timer, Youtube } from "lucide-react";
import { useRouter } from "next/navigation";
import Calculator from "../../_component/plugin.components/calculator";
import { useEffect, useState } from "react";
import { useData } from "@/app/db/DataProvider";
import NavigationPanel from "./navigation_panel";
import useTimer from "@/app/hook/useTimer";
import Image from "next/image";
import { Input } from "@/components/ui/input";

const ExamPage = () => {
  const router = useRouter();
  const href = "/";
  const onClick = () => {
    router.push(href);
  };

  const {
    questions,
    setQuestions,
    currentQuestion,
    setCurrentQuestion,
    selectedOption,
    setSelectedOption,
    setCategory,
    quizNames,
    timer
    
    
  } = useData();

  const markVisited = () => {
    let temp = [...questions];
    temp[currentQuestion].visited = true;
    setQuestions(temp);
    setSelectedOption(temp[currentQuestion]?.userOption ?? -1);
  };

  const saveAndNextFunction = () => {
    setQuestions((prevQuestions) => {
      const temp = [...prevQuestions];
      temp[currentQuestion].userOption = selectedOption;
      temp[currentQuestion].visited = true;
  
      if (selectedOption !== -1) {
        temp[currentQuestion].attempted = true;
      } else {
        temp[currentQuestion].attempted = false;
      }
  
      return temp;
    });
  
    setCurrentQuestion((prev) => (prev === questions.length - 1 ? 0 : prev + 1));
    setSelectedOption(
      questions[currentQuestion + 1]?.userOption ?? -1
    );
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    
    const handleKeyDown = (event: { key: string; }) => {
      const key = event.key.toLowerCase();
      const charCode = event.key.toUpperCase().charCodeAt(0);
      const index = charCode - 65; // Convert 'A' to 0, 'B' to 1, etc.
  
      if (index >= 0 && index < (questions[currentQuestion]?.options?.length ?? 0)) {
        setSelectedOption(index);
      }
      if (key === 'p') {
        if (currentQuestion > 0) {
          markVisited();
          setCurrentQuestion(currentQuestion - 1);
        }
      }

      if (key === 'n') {
        saveAndNextFunction();
      }
      if (key === 's') {  // Open the dialog on "S" key press
        setIsDialogOpen(true);
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [questions, currentQuestion, setSelectedOption, markVisited, saveAndNextFunction]);
  

  

  const getCheckedOption = (option: number) => {
    return selectedOption !== -1
      ? selectedOption === option
      : option === questions[currentQuestion].userOption;
  };

  const clearSelectionFunction = () => {
    setSelectedOption(-1);
    let temp = [...questions];
    temp[currentQuestion].userOption = -1;
    temp[currentQuestion].attempted = false;
    setQuestions(temp);
  };

  const saveAndSubmit = () => {
    let temp = [...questions];
    temp[currentQuestion].userOption = selectedOption;
    temp[currentQuestion].visited = true;

    if (selectedOption !== -1) {
      temp[currentQuestion].attempted = true;
    } else if (temp[currentQuestion].attempted) {
      temp[currentQuestion].attempted = true;
    } else {
      temp[currentQuestion].attempted = false;
    }

    setQuestions(temp);
    router.push('/default/exam/result');
  };
  const [minutes, setMinutes] = useState(timer || 10); // Default to 10 mins if `timer` is undefined
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true); // Start timer automatically
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
  
    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes > 0) {
            setMinutes((prevMinutes) => prevMinutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds((prevSeconds) => prevSeconds - 1);
        }
      }, 1000);
    } else if (isActive && minutes === 0 && seconds === 0) {
      // Timer finished, redirect to another page
      saveAndSubmit();
      setIsActive(false);
      setMinutes(0);
      setSeconds(0); // Reset to initial time
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, saveAndSubmit]); // Add dependencies
  
  

  return (
    <div className="flex flex-col mr-2 ml-1 h-[500px]">
      
      <div className=" flex-row hidden lg:flex  p-5 my-2">
  
        <div>
          <Button
            onClick={() => {
              if (currentQuestion !== 0) {
                markVisited();
                setCurrentQuestion(currentQuestion - 1);
              }
            }}
            variant="outline"
            className="dark:bg-black text-white bg-blue-600 border rounded-lg px-5 hover:bg-blue-400 hover:text-white"
          >
            <div className="h-[1.2rem] w-[5.0rem]">Previous</div>
          </Button>
        </div>
        <div className="w-10" />
        <div>
          <Button
            onClick={saveAndNextFunction}
            className="dark:bg-black dark:text-white bg-blue-600 border rounded-lg pr-10 hover:bg-blue-400"
          >
            <div className="h-[1.2rem] w-[5.0rem]">Save and Next</div>
          </Button>
        </div>
        <div className="w-full" />
        <div className="flex">
        
        </div>
        <div className="w-full" />
        <Dialog>
          <DialogTrigger asChild>
            <div>
              <Button size="icon" className="bg-red-600 rounded-lg px-10 hover:bg-red-400 dark:text-white">
                <div className="h-[1.2rem] w-[5.0rem]">Submit</div>
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent className="rounded-xl sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Submit</DialogTitle>
              <DialogDescription>Are you sure you want to submit</DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-end">
              <DialogClose asChild>
                <Button variant="destructive" type="submit" onClick={saveAndSubmit}>
                  Submit
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="w-10" />
        <div className="flex-row flex">
          <Button variant="outline" size="icon" className="px-20 gap-y-3">
            <div className="h-[1.2rem] w-[5.0rem] mr-6">
              <Timer className="h-[1.2rem] w-[1.2rem]" />
            </div>
            
            <div className="h-[1.2rem] w-[5.0rem]">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
          </Button>
        </div>
        <div className="w-10" />
        <Dialog>
          <DialogTrigger asChild>
            <div>
              <Button variant="outline" size="icon">
                <CalculatorIcon className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Calculator</DialogTitle>
              <DialogDescription>
                Simple Calculator
                <div className="mt-5">
                  <Calculator />
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className=" flex-row flex lg:hidden   p-5 my-2">
    
        <div>
          <Button
            onClick={() => {
              if (currentQuestion !== 0) {
                markVisited();
                setCurrentQuestion(currentQuestion - 1);
              }
            }}
            variant="outline"
            className="dark:bg-black text-white bg-blue-600 border rounded-lg hover:bg-blue-400 hover:text-white"
          >
                 <ChevronLeft className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </div>
        
        <div>
          <Button
            onClick={saveAndNextFunction}
            className="dark:bg-black dark:text-white bg-blue-600 border rounded-lg  hover:bg-blue-400"
          >
                <ChevronRight className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </div>
        <div className="w-full" />
     
        <div className="flex-row flex">
          <Button size="icon" className="px-10 gap-y-1 bg-white dark:bg-black text-black dark:text-white">
            <div className="h-[1.2rem] w-[5.0rem] mr-6">
             
            </div>
            
            <div className="h-[1.2rem] w-[5.0rem]">
           
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
          </Button>
        </div>
        <div className="w-10" />
        <Dialog>
          <DialogTrigger asChild>
            <div>
              <Button variant="outline" size="icon">
                <CalculatorIcon className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent className="w-fit items-center  sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Calculator</DialogTitle>
              <DialogDescription>
                Simple Calculator
                <div className="mt-5 w-fit">
                  <Calculator />
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <div className="w-10" />

        <Dialog  open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <div>
              <Button size="icon" className="bg-red-600 rounded-lg px-10 hover:bg-red-400 dark:text-white">
                <div className="h-[1.2rem] w-[5.0rem]">Submit</div>
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent className="rounded-xl sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Submit</DialogTitle>
              <DialogDescription>Are you sure you want to submit</DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-end">
              <DialogClose asChild>
                <Button variant="destructive" type="submit" onClick={saveAndSubmit}>
                  Submit
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Separator />
      <div className="flex flex-col px-10 my-10 w-auto h-fit">
        <Card className="h-full w-full ">
          <CardHeader>
            <CardTitle>
              <div className="flex flex-col w-full">
 <div className="flex flex-row">
                Questions <div className="w-full" /> {questions[currentQuestion]?._id?(<div>
                    {questions[currentQuestion]?._id}/{questions.length}
                </div>): (<div className="flex ">{questions.length} <div className="ml-2">questions</div></div>)} 
              </div>
                <div className="flex w-full items-center justify-end font-light text-sm  ">
                  <div className="flex space-x-3 mt-2">
              <Button variant={'outline'} className="items-center">
                  Subject :  {questions[currentQuestion]?.category}
                </Button>
                <Dialog>
          <DialogTrigger asChild>
                    <Button  variant={'outline'} className="items-center">
                  Explanation <Youtube className="ml-2" width={14} height={14}/>
                </Button>
          </DialogTrigger>
          <DialogContent className="flex rounded-xl w-fit">
            <DialogHeader>
              <DialogTitle> Explanation</DialogTitle>
              <DialogDescription className="flex flex-col w-full mt-4 items-center justify-between">
                
                <Tabs defaultValue="text" className="mt-4 w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="text">Text Explanation</TabsTrigger>
        <TabsTrigger value="video">Video Explanation</TabsTrigger>
      </TabsList>
      <TabsContent value="text">
        <Card className=" m-2 mt-2">
          <CardHeader>
           
            <CardDescription className="">
            <div className=" underline my-2">Solution</div> 
            
            <CardDescription className="select-none pointer-events-none my-2">{questions[currentQuestion]?.question}</CardDescription>
            {questions[currentQuestion]?.img?(<div>  <img
         className="select-none pointer-events-none"
       src={questions[currentQuestion]?.img} // Fallback image URL
    alt={``}
     width={100}
    height={100}
   
    style={{ width: '100%', height: 'auto', maxWidth: '100%', maxHeight: '100%' }}
  /></div>):(<div></div>)}


            </CardDescription>
          </CardHeader>

         
        </Card>
      </TabsContent>
      <TabsContent value="video">
        <Card>
          <CardHeader>
            <CardDescription>
             Video Explanation
            </CardDescription>
          </CardHeader>
        </Card>
      </TabsContent>
    </Tabs>     
              </DialogDescription>
            </DialogHeader>
           
          </DialogContent>
        </Dialog>
             
                  </div>
              
                </div>
                  
            
              </div>
             
            </CardTitle>
            <div className="h-1" />
            <CardDescription className="select-none pointer-events-none">{questions[currentQuestion]?.question}</CardDescription>
          </CardHeader>
          <div className="flex flex-row ">
            <CardContent className="flex flex-col ">
              <div className="flex flex-col select-none">
                {questions[currentQuestion]?.options?.map((option, index) => (
                  <div key={index} className="flex w-[500px] items-center p-3">
                    <input
                      type="radio"
                      className="justify-start items-start"
                      name="xyz"
                      id={`option-${index}`}
                      checked={getCheckedOption(index)}
                      value={index}
                      onChange={(e) => setSelectedOption(Number(e.target.value))}
                    />
                    <label htmlFor={`option-${index}`} className="ml-2">
                      {String.fromCharCode(65 + index)}. {option}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
            
            <div className="w-full" />
            <div className="w-[700px] mr-4">
              {questions[currentQuestion]?.img?(<div>  <img
         className="select-none pointer-events-none"
       src={questions[currentQuestion]?.img} // Fallback image URL
    alt={``}
     width={100}
    height={100}
  
    style={{ width: '100%', height: 'auto', maxWidth: '100%', maxHeight: '100%' }}
  /></div>):(<div></div>)}

</div>


          </div>
        </Card>

        <div className="h-full w-full mt-2 visible sm:hidden shadow-none">
            <CardDescription>
             <div className=" mr-4">
  <Image
  className="select-none pointer-events-none"
    src={questions[currentQuestion]?.img ?? '/favicon.ico'} // Fallback image URL
    alt={``}
    width={100}
    height={100}
    layout="responsive"
    style={{ width: '100%', height: 'auto', maxWidth: '100%', maxHeight: '100%' }}
  />
</div>
            </CardDescription>
        </div>
      </div>
      <div className="w-full flex items-start justify-start mx-[30px] mr-[30px] ">
        <NavigationPanel />
      </div>
      <div className="flex flex-row mx-10 w-auto h-fit"></div>
      <div className="h-full" />
      <div className="flex flex-row items-center shrink-0 justify-center mx-10 mt-10 w-auto h-fit">
        <div className="w-full" />
        <div className="flex-row flex">
    </div>
      </div>
    </div>
  );
};

export default ExamPage;
