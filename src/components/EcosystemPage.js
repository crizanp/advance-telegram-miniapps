import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePoints } from '../context/PointsContext';
import UserInfo from './UserInfo';
import {
  QuizContainer,
  ScrollableContent,
  QuizBox,
  QuestionText,
  Option,
  SubmitButton,
  HeaderText,
  CategoryContainer,
  CategoryButton,
  NextButton,
  NoQuestionsMessage,
} from './EcosystemStyles';

function EcosystemPage() {
  const { points, setPoints, userID } = usePoints();
  const [categories, setCategories] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('random');
  const [loading, setLoading] = useState(true);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [correctOption, setCorrectOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [noMoreQuizzes, setNoMoreQuizzes] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/categories`);
        setCategories([{ name: 'Random', _id: 'random' }, ...response.data]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchRandomQuiz = async () => {
      try {
        const url =
          selectedCategory === 'random'
            ? `${process.env.REACT_APP_API_URL}/quizzes/random`
            : `${process.env.REACT_APP_API_URL}/quizzes/random?category=${selectedCategory}`;
        const response = await axios.get(url);

        if (!response.data) {
          setCurrentQuiz(null);
          setNoMoreQuizzes(true); // No more quizzes in this category
        } else {
          setCurrentQuiz(response.data);

          const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/${userID}`);
          const userData = userResponse.data;
          const quizCompleted = userData.quizHistory.some(q => q.quizId === response.data._id);
          setAlreadyCompleted(quizCompleted);
          setNoMoreQuizzes(false); // Reset no more quizzes flag
        }

        setLoading(false);
        setSelectedOption(null);
        setDisableSubmit(false);
        setCorrectOption(null);
        setShowFeedback(false);
      } catch (error) {
        console.error('Error fetching random quiz:', error);
        setLoading(false);
        setCurrentQuiz(null); // No quizzes available
        setNoMoreQuizzes(true); // No more quizzes in this category
      }
    };

    fetchRandomQuiz();
  }, [selectedCategory, userID]);

  const handleOptionSelect = (index) => {
    if (!disableSubmit) {
      setSelectedOption(index);
    }
  };

  const handleSubmit = async () => {
    if (selectedOption === null || alreadyCompleted) return;

    const isCorrect = currentQuiz.options[selectedOption].isCorrect;
    const pointsEarned = isCorrect ? currentQuiz.points : 0;

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/user-info/submit-quiz`, {
        userID,
        quizId: currentQuiz._id,
        pointsEarned,
      });

      setPoints((prevPoints) => prevPoints + pointsEarned);
      setDisableSubmit(true); // Disable the submit button and options after submission
      setCorrectOption(isCorrect ? selectedOption : currentQuiz.options.findIndex(option => option.isCorrect));
      setShowFeedback(true); // Show feedback (correct/wrong option)

    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const handleNextQuiz = async () => {
    setLoading(true);

    try {
      const url =
        selectedCategory === 'random'
          ? `${process.env.REACT_APP_API_URL}/quizzes/random`
          : `${process.env.REACT_APP_API_URL}/quizzes/random?category=${selectedCategory}`;
      const response = await axios.get(url);

      if (!response.data) {
        setCurrentQuiz(null);
        setNoMoreQuizzes(true); // No more quizzes in this category
      } else {
        setCurrentQuiz(response.data);
        setSelectedOption(null);
        setDisableSubmit(false);

        const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/${userID}`);
        const userData = userResponse.data;
        const quizCompleted = userData.quizHistory.some(q => q.quizId === response.data._id);
        setAlreadyCompleted(quizCompleted);
        setNoMoreQuizzes(false); // Reset no more quizzes flag
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching next quiz:', error);
      setLoading(false);
      setCurrentQuiz(null); // No quizzes available
      setNoMoreQuizzes(true); // No more quizzes in this category
    }
  };

  return (
    <QuizContainer>
      <UserInfo />
      <HeaderText>Answer and Earn</HeaderText>
      <CategoryContainer>
        {categories.map((category) => (
          <CategoryButton
            key={category._id}
            selected={category._id === selectedCategory}
            onClick={() => setSelectedCategory(category._id)}
          >
            {category.name}
          </CategoryButton>
        ))}
      </CategoryContainer>

      <ScrollableContent>
        {loading ? (
          <p>Loading quiz...</p>
        ) : noMoreQuizzes ? (
          <NoQuestionsMessage>No quiz within this category, you can surf more in the next category.</NoQuestionsMessage>
        ) : currentQuiz ? (
          <QuizBox>
            <QuestionText>{currentQuiz.questionText}</QuestionText>
            {currentQuiz.options.map((option, index) => (
              <Option
                key={index}
                selected={selectedOption === index}
                correct={showFeedback && index === correctOption}
                wrong={showFeedback && index === selectedOption && !option.isCorrect}
                isDisabled={disableSubmit}
                onClick={() => handleOptionSelect(index)}
              >
                {option.text}
              </Option>
            ))}
            <SubmitButton
              onClick={handleSubmit}
              disabled={selectedOption === null || alreadyCompleted || disableSubmit}
            >
              {alreadyCompleted ? 'Quiz Completed' : 'Submit'}
            </SubmitButton>
          </QuizBox>
        ) : (
          <NoQuestionsMessage>No quiz within this category, you can surf more in the next category.</NoQuestionsMessage>
        )}
      </ScrollableContent>
      {!noMoreQuizzes && (
        <NextButton onClick={handleNextQuiz} disabled={loading}>
          Next
        </NextButton>
      )}
    </QuizContainer>
  );
}

export default EcosystemPage;
