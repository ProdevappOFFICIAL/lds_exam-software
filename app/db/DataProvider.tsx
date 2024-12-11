"use client";
import React, { useContext, createContext, useState, useEffect, ReactNode, FC } from "react";
import { useRouter } from "next/navigation";
import mathQuestions from './data/mathQues.json';
import englishQuestions from './data/englishQues.json';
import physicsQuestions from './data/phyQues.json';
import chemistryQuestions from './data/chemQues.json';
import biologyQuestions from './data/biologyQues.json';
import { Question } from "../commonTypes"; 

interface DataContextType {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  currentQuestion: number;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<number>>;
  userEmail: string;
  setUserEmail: React.Dispatch<React.SetStateAction<string>>;
  selectedOption: number;
  setSelectedOption: React.Dispatch<React.SetStateAction<number>>;
  Reset: () => void;
  navigateToQuiz: (quizName: string) => void;
  quizNames: string[];
  timer: number;
  setTimer:  React.Dispatch<React.SetStateAction<number>>;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  startMixedQuiz: () => void;
  CustomixedQuiz: () => void;
  JambQuiz: () => void;
  setNumQuestions: React.Dispatch<React.SetStateAction<number>>;
  setSelectedYear: React.Dispatch<React.SetStateAction<string>>;
  selectedYear: string;  
  math: boolean;
  setmath: React.Dispatch<React.SetStateAction<boolean>>;
  eng: boolean;
  seteng: React.Dispatch<React.SetStateAction<boolean>>;
  chm: boolean;
  setchm: React.Dispatch<React.SetStateAction<boolean>>;
  phy: boolean;
  setphy: React.Dispatch<React.SetStateAction<boolean>>;
  bio: boolean;
  setbio: React.Dispatch<React.SetStateAction<boolean>>;
 
  mathno: number;
  setmathno: React.Dispatch<React.SetStateAction<number>>;
  engno: number;
  setengno: React.Dispatch<React.SetStateAction<number>>;
  chmno: number;
  setchmno: React.Dispatch<React.SetStateAction<number>>;
  phyno: number;
  setphyno: React.Dispatch<React.SetStateAction<number>>;
  biono: number;
  setbiono: React.Dispatch<React.SetStateAction<number>>;
}

interface DataProviderProps {
  children: ReactNode;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);


export const DataProvider: FC<DataProviderProps> = ({ children }) => {
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timer, setTimer] = useState<number>(0)
  const [userEmail, setUserEmail] = useState("");
  const [selectedOption, setSelectedOption] = useState(-1);
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [category, setCategory] = useState("Math");
  const [numQuestions, setNumQuestions] = useState(60);
  const [examlink, setexamlink] = useState('');
  const [selectedYear, setSelectedYear] = useState("");
  const [math, setmath] = useState(false)
  const [eng , seteng] = useState(false)
  const [chm , setchm] = useState(false)
  const [phy , setphy] = useState(false)
  const [bio , setbio] = useState(false)
  const [mathno, setmathno] = useState<number>(0)
  const [engno , setengno] = useState(0)
  const [chmno , setchmno] = useState(0)
  const [phyno , setphyno] = useState(0)
  const [biono , setbiono] = useState(0)

  const getQuizNames = (category: string): string[] => {
    switch (category) {
      case "Math":
        return Object.keys(mathQuestions);
      case "English":
        return Object.keys(englishQuestions);
      case "Physics":
        return Object.keys(physicsQuestions);
      case "Chemistry":
        return Object.keys(chemistryQuestions);
      case "Biology":
        return Object.keys(biologyQuestions);
      default:
        return [];
    }
  };

  const quizNames = getQuizNames(category);

  const startMixedQuiz = () => {
    const selectedSubjects = [];
    
    
    // Collect selected subjects
    if (math) selectedSubjects.push(...Object.values(mathQuestions).flat().slice(0, mathno));
    
    if (eng) selectedSubjects.push(...Object.values(englishQuestions).flat().slice(0, engno));
    if (chm) selectedSubjects.push(...Object.values(chemistryQuestions).flat().slice(0, chmno));
    if (phy) selectedSubjects.push(...Object.values(physicsQuestions).flat().slice(0, phyno));
    if (bio) selectedSubjects.push(...Object.values(biologyQuestions).flat().slice(0, biono));
  
    if (selectedSubjects.length === 0) {
     // alert("Please select at least one subject!");
      return;
    }
  
    // Shuffle and select questions
    const shuffledQuestions = selectedSubjects
      .map((ques, index) => ({
        ...ques,
        _id: index + 1, 
        visited: false,
        attempted: false,
        userOption: -1,
        options: [...ques.incorrect_answers, ques.correct_answer].sort(() => Math.random() - 0.5),
      }))
      .sort(() => Math.random() - 0.5);
  
    // Limit the number of questions to `numQuestions`
    const selectedQuestions = shuffledQuestions.slice(0);
  
    setQuestions(selectedQuestions);
  };
  
  const getData = (quizName: string) => {
    const quizQuestions: Question[] = (() => {
      switch (category) {
        case "Math":
          return (mathQuestions as any)[quizName];
        case "English":
          return (englishQuestions as any)[quizName];
        case "Physics":
          return (physicsQuestions as any)[quizName];
        case "Chemistry":
          return (chemistryQuestions as any)[quizName];
        case "Biology":
          return (biologyQuestions as any)[quizName];
        default:
          return [];
      }
    })();

    const formattedQuestions: Question[] = quizQuestions.map((ques, index) => {
      let options: string[] = [];
      options.push(...ques?.incorrect_answers);
      options.push(ques?.correct_answer);
      return {
        ...ques,
        _id: index + 1,
        visited: false,
        attempted: false,
        userOption: -1,
        options: options.sort(() => Math.random() - 0.5),
        img: ques.img,
        text_explanation: ques.text_explanation,
        video_explanation: ques.video_explanation,
        category: ques.category
      };
    });
    setQuestions(formattedQuestions.slice(0, numQuestions));
  };

  const getAllQuestions = () => {
    // Function to ensure each question is typed correctly
    const ensureQuestionType = (data: any): Question => {
      return {
        category: data.category || "",
        type: data.type || "",
        difficulty: data.difficulty || "",
        question: data.question || "",
        correct_answer: data.correct_answer || "",
        incorrect_answers: data.incorrect_answers || [],
        img: data.img || "",
        text_explanation: data.text_explanation || "",
        video_explanation: data.video_explanation || "",
        _id: data._id || 0,
        visited: data.visited || false,
        attempted: data.attempted || false,
        userOption: data.userOption || -1,
        options: data.options || []
      };
    };
  
    const allQuestions: Question[] = [
      ...Object.values(mathQuestions).flat().map(ensureQuestionType).slice(0, 40),
      ...Object.values(englishQuestions).flat().map(ensureQuestionType).slice(0, 40),
      ...Object.values(physicsQuestions).flat().map(ensureQuestionType).slice(0, 40),
      ...Object.values(chemistryQuestions).flat().map(ensureQuestionType).slice(0, 40),
      ...Object.values(biologyQuestions).flat().map(ensureQuestionType).slice(0, 40),
    ];
  
    const selectedQuestions: Question[] = [];
    while (selectedQuestions.length < numQuestions && allQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * allQuestions.length);
      const [question] = allQuestions.splice(randomIndex, 1);
      selectedQuestions.push({
        ...question,
        visited: false,
        attempted: false,
        userOption: -1,
        options: [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5),
        img: question.img
      });
    }
  
    setQuestions(selectedQuestions);
  };
  

  const CustomQuiz = async () => {
    try {
      const response = await fetch(`https://localhost:5000/` + examlink);
      const data = await response.json();
      const allQuestions: Question[] = data.flat();
      const selectedQuestions: Question[] = [];
      while (selectedQuestions.length < numQuestions && allQuestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * allQuestions.length);
        const [question] = allQuestions.splice(randomIndex, 1);
        selectedQuestions.push({
          ...question,
          visited: false,
          attempted: false,
          userOption: -1,
          options: [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5),
          img: question.img
        });
      }
      setQuestions(selectedQuestions);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const Reset = () => {
    setQuestions([]);
    setCurrentQuestion(0);
    setUserEmail("");
    setSelectedOption(-1);
    router.push('/default');
  };

  const navigateToQuiz = (quizName: string) => {
    setSelectedQuiz(quizName);
    getData(quizName);
  };


const JambQuiz = () => {
  getAllQuestions();
  
}
  

  const CustomixedQuiz = () => {
    CustomQuiz();
  };

  return (
    <DataContext.Provider
      value={{
        questions,
        setQuestions,
        currentQuestion,
        setCurrentQuestion,
        userEmail,
        setUserEmail,
        selectedOption,
        setSelectedOption,
        Reset,
        navigateToQuiz,
        quizNames,
        setCategory,
        startMixedQuiz,
        CustomixedQuiz,
        setNumQuestions,
        setSelectedYear,
        selectedYear,
        timer,
        setTimer,
        math,
        setmath,
        eng,
        seteng,
        chm,
        setchm,
        phy,
        setphy,
        bio,
        setbio,
        mathno,
        setmathno,
        engno,
        setengno,
        chmno,
        setchmno,
        phyno,
        setphyno,
        biono,
        setbiono,
        JambQuiz
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
