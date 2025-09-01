import React from "react";
 import { useState,useEffect,useRef } from "react";

const CANVAS_SIZE = 400;
const GRID_SIZE = 20;
const SCALE = CANVAS_SIZE / GRID_SIZE;
const INITIAL_SNAKE_POSITION = [{ x: 10, y: 10 }];
const INITIAL_FOOD_POSITION = { x: 15, y: 15 };
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 200;
const SnakeGame = () => {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE_POSITION);
  const [food, setFood] = useState(INITIAL_FOOD_POSITION);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || isGameOver) return;

    const gameInterval = setInterval(() => {
      setSnake(prevSnake => {
        const newSnake = JSON.parse(JSON.stringify(prevSnake));
        const head = {
          x: newSnake[0].x + direction.x,
          y: newSnake[0].y + direction.y,
        };

        newSnake.unshift(head);
        if (checkCollision(head, newSnake)) {
          endGame();
          return prevSnake; 
        }

        if (head.x === food.x && head.y === food.y) {
          setScore(prevScore => prevScore + 1);
          generateFood(newSnake); 
        } else {
          newSnake.pop(); 
        }
        
        return newSnake;
      });
    }, GAME_SPEED);

    return () => clearInterval(gameInterval);
  }, [snake, direction, isGameOver, isRunning]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#000'; 
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? 'green' : 'lime'; 
      ctx.fillRect(segment.x * SCALE, segment.y * SCALE, SCALE, SCALE);
    });
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * SCALE, food.y * SCALE, SCALE, SCALE);

  }, [snake, food, isGameOver]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [direction]); 
  const startGame = () => {
    setSnake(INITIAL_SNAKE_POSITION);
    setFood(INITIAL_FOOD_POSITION);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsRunning(true);
  };

  const endGame = () => {
    setIsGameOver(true);
    setIsRunning(false);
  };
  
  const generateFood = (currentSnake) => {
    let newFoodPosition;
    do {
      newFoodPosition = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (
      currentSnake.some(
        segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y
      )
    );
    setFood(newFoodPosition);
  };

  const checkCollision = (head, snake) => {
    
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true;
      }
    }
    return false;
  };

  return (
    <div style={{ textAlign: 'center', backgroundColor: '#333', padding: '20px', color: 'aquamarine' }}>
      <h1>React Snake Game</h1>
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        style={{ border: '2px solid white' }}
      />
      <h2>Score: {score}</h2>
      <button onClick={startGame} style={{ padding: '10px 20px', fontSize: '16px' }}>
        {isGameOver ? 'Play Again' : 'Start Game'}
      </button>
      {isGameOver && <h3 style={{ color: 'red' }}>Game Over!</h3>}
    </div>
  );
};

export default SnakeGame;
