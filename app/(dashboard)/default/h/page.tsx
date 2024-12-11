"use client"
import { useState } from "react";

interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  text_explanation?: string;
  video_explanation?: string;
  img?: string;
}

interface YearData {
  [key: string]: Question[];
}

export default function Home() {
  const [year, setYear] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [type, setType] = useState<string>("multiple");
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [question, setQuestion] = useState<string>("");
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  const [incorrectAnswers, setIncorrectAnswers] = useState<string[]>([]);
  const [incorrectAnswerInput, setIncorrectAnswerInput] = useState<string>("");
  const [textExplanation, setTextExplanation] = useState<string>("");
  const [videoExplanation, setVideoExplanation] = useState<string>("");
  const [imgUrl, setImgUrl] = useState<string>("");
  const [data, setData] = useState<YearData>({});

  const handleAddIncorrectAnswer = () => {
    if (incorrectAnswerInput) {
      setIncorrectAnswers([...incorrectAnswers, incorrectAnswerInput]);
      setIncorrectAnswerInput("");
    }
  };

  const handleAddQuestion = () => {
    if (year && question && correctAnswer) {
      const newQuestion: Question = {
        category,
        type,
        difficulty,
        question,
        correct_answer: correctAnswer,
        incorrect_answers: incorrectAnswers,
        text_explanation: textExplanation,
        video_explanation: videoExplanation,
        img: imgUrl,
      };
      setData((prev) => ({
        ...prev,
        [year]: prev[year] ? [...prev[year], newQuestion] : [newQuestion],
      }));
      // Reset form fields
      setQuestion("");
      setCorrectAnswer("");
      setIncorrectAnswers([]);
      setTextExplanation("");
      setVideoExplanation("");
      setImgUrl("");
    }
  };

  const handleDownloadJSON = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "questions.json";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Question JSON Creator</h1>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Year</label>
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="e.g., UTME - 2001"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Chemistry"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Question</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter the question"
            className="w-full p-2 border rounded"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">
            Correct Answer
          </label>
          <input
            type="text"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            placeholder="Enter the correct answer"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">
            Incorrect Answers
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={incorrectAnswerInput}
              onChange={(e) => setIncorrectAnswerInput(e.target.value)}
              placeholder="Enter an incorrect answer"
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handleAddIncorrectAnswer}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add
            </button>
          </div>
          <div className="mt-2">
            {incorrectAnswers.map((answer, index) => (
              <span
                key={index}
                className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded mr-2 mb-2"
              >
                {answer}
              </span>
            ))}
          </div>
        </div>
        <div className="mb-4">
  <label className="block text-gray-700 font-medium">Text Explanation</label>
  <textarea
    value={textExplanation}
    onChange={(e) =>
      setTextExplanation(e.target.value.replace(/\n/g, "<br/>"))
    }
    placeholder="Enter a text explanation. Use Enter for spacing."
    className="w-full p-2 border rounded"
  ></textarea>
</div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">
            Video Explanation (URL)
          </label>
          <input
            type="text"
            value={videoExplanation}
            onChange={(e) => setVideoExplanation(e.target.value)}
            placeholder="Enter a video URL"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">
            Image URL
          </label>
          <input
            type="text"
            value={imgUrl}
            onChange={(e) => setImgUrl(e.target.value)}
            placeholder="Enter an image URL"
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          onClick={handleAddQuestion}
          className="w-full bg-green-500 text-white py-2 rounded"
        >
          Add Question
        </button>

        <button
          onClick={handleDownloadJSON}
          className="w-full bg-blue-500 text-white py-2 rounded mt-4"
        >
          Download JSON
        </button>

        <pre className="mt-6 bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
