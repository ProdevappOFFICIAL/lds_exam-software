'use client'
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Calculator() {
  const [result, setResult] = useState('');
  const [expression, setExpression] = useState('');

  // Handle button clicks
  const handleButtonClick = (value: string) => {
    if (value === '=') {
      try {
        setResult(eval(expression).toString());
      } catch (error) {
        setResult('Syntax Error');
      }
    } else if (value === 'C') {
      setResult('');
      setExpression('');
    } else {
      setExpression((prevExpression) => prevExpression + value);
    }
  };

  // Button layout
  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', 'C', '+',
    '='
  ];

  // Handle keyboard events
  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key;

    // Check if the pressed key is a valid calculator key
    const validKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '/', '*', '-', '+', '.', '=', 'Enter', 'Backspace'];
    if (!validKeys.includes(key)) return;

    // Map the keypress to the calculator action
    if (key === 'Enter' || key === '=') {
      handleButtonClick('=');
    } else if (key === 'Backspace' || key.toLowerCase() === 'c') {
      handleButtonClick('C');
    } else {
      handleButtonClick(key);
    }
  };

  // Add event listener for keyboard input
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [expression]);

  return (
    <div className='flex flex-col'>
      <div className='flex px-4 py-2 w-full justify-between border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400'>
        <Input className='border-transparent' value={expression} />
        <div className='w-full' />
        <Input
          value={result}
          className='border-transparent bg-gray-300/30 text-center'
          placeholder='Answer'
          readOnly
        />
      </div>

      <div className='h-4' />
      <div className="grid grid-cols-4 gap-2 items-end justify-end">
        {buttons.map((btn) => (
          <Button
            key={btn}
            onClick={() => handleButtonClick(btn)}
            className="text-xl bg-white text-black border hover:bg-zinc-300/20 rounded-lg dark:border-gray-200 dark:bg-gray-900 dark:text-gray-200"
          >
            {btn}
          </Button>
        ))}
      </div>
    </div>
  );
}
