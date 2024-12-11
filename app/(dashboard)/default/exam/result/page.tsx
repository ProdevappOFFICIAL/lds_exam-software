"use client";
import { useData } from '@/app/db/DataProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Check, X } from 'lucide-react';
import React from 'react';
import { useRouter } from 'next/navigation';

const Result = () => {
  const router = useRouter();
  const { questions, Reset } = useData();

  // Function to calculate the percentage score for a given category
  const calculateCategoryScore = (category: string) => {
    const categoryQuestions = questions.filter(ques => ques.category === category);
    const correctAnswers = categoryQuestions.reduce((total, ques) => {
      if (ques.correct_answer === ques.options?.[ques.userOption ?? -1]) {
        return total + 1;
      } else {
        return total;
      }
    }, 0);
    const scorePercentage = (correctAnswers / categoryQuestions.length) * 100;
    return {
      total: categoryQuestions.length,
      correct: correctAnswers,
      percentage: Math.round(scorePercentage),
    };
  };

  // Get unique categories from the questions
  const categories = Array.from(new Set(questions.map(ques => ques.category)));
  const scores = categories.map(category => ({
    category,
    ...calculateCategoryScore(category)
  }));

  // Calculate overall score
  const score = questions.reduce((total, ques) => {
    if (ques.correct_answer === ques.options?.[ques.userOption ?? -1]) {
      return total + 1;
    } else {
      return total;
    }
  }, 0);

  const overallPercentage = Math.round((score / questions.length) * 100);

  return (
    <div className="flex flex-col p-10 w-full h-full  text-black dark:text-white bg-white dark:bg-black justify-center items-center">
      <div className="flex w-full space-x-5">
        <h2 className="header">
          <div className="flex items-center justify-center rounded-full text-[52px] w-52 h-52 bg-zinc-200/20 border select-none pointer-events-none">
            {overallPercentage}%
          </div>
          <div className="h-5" />
        </h2>
 
        <div className="flex flex-col w-full space-y-2">
          <h3 className=" text-muted-foreground">General Performance</h3>
          <Progress className={`${overallPercentage <= questions.length ? 'border border-gray-400/20' : 'bg-white'}`} value={overallPercentage} />
   
          <h3 className=" text-muted-foreground">Average Performance</h3>
          <Progress value={50} />
          <div className="mt-10">
            <h2 className="text-xl font-semibold tracking-tight">
              Subject Grades
            </h2>
            {scores.map(({ category, correct, total, percentage }) => (
              <div key={category} className="mt-2">
                <h3 className="flex text-md items-center mb-2"><div className='bg-gray-300/20  rounded-full px-2 py-1'>{category}</div>: {correct}/{total} ({percentage}%)</h3>
                <Progress value={percentage} />
              </div>
            ))}
          </div>
        </div>
        <div className="h-5" />
      </div>
      <div className="h-5" />
      <Button
        onClick={() => {
          router.push('/default');
          setTimeout(() => {
              Reset();
          }, 2000);
        
        }}
      >
        Start New Quiz
      </Button>
      <div className="px-10">
        <div className="report-holder-top ">
          <h1 className="text-xl font-semibold tracking-tight text-white">
            Questions
          </h1>
          <div className="flex">
            Correct Option: <p className="ml-2 text-[9px] px-2 py-1 bg-green-600 rounded-sm text-white">Correct Answer</p>
          </div>
          <div className="h-3" />
          <div className="flex">
            Your Answer: <p className="ml-2 text-[9px] px-2 py-1 bg-red-600 rounded-sm text-white">Your Answer</p>
          </div>
        </div>
        <div className="h-5" />
        <Card className="p-5 bg-zinc-200/20 border ">
          {questions.map((ques, qIndex) => (
            <div className="rounded-sm select-none pointer-events-none" key={qIndex}>
              <div className="single-question select-none pointer-events-none">
                {qIndex + 1}. {ques.question}
              </div>
              <div>
                {ques.options?.map((option, oIndex) => (
                  <div
                    className={`flex flex-row `}
                    key={oIndex}
                  >
                    {String.fromCharCode(65 + oIndex)}. {option}
                    {option === ques.correct_answer && (
                      <span>
                        <p className="ml-2 text-[9px] px-2 py-1 bg-green-400 rounded-sm text-white">Correct Answer</p>
                      </span>
                    )}
                    {ques.userOption === oIndex && option !== ques.correct_answer && (
                      <span className="ml-2 flex">
                     
                        <p className="ml-2 text-[9px] px-2 py-1 bg-red-400 rounded-sm text-white">Your Answer</p>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default Result;
