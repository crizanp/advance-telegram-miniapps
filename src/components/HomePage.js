import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { usePoints } from '../context/PointsContext';
import {
  HomeContainer,
  PointsDisplayContainer,
  PointsDisplay,
  DollarIcon,
  MiddleSection,
  Message,
  EagleContainer,
  EagleImage,
  Description,
  FlyingNumber,
  SlapEmoji,
  EnergyDisplay, // New styled component for energy display
} from './HomePageStyles'; // Import your styled components
import { debounce } from 'lodash';
import UserInfo from './UserInfo';
import eagleImage from '../assets/eagle.png'; // Your existing eagle image
import dollarImage from '../assets/dollar-homepage.png'; // Your existing dollar icon image
import { getUserID } from '../utils/getUserID';

function HomePage() {
  const { points, setPoints, userID, setUserID, setUsername } = usePoints();
  const [tapCount, setTapCount] = useState(0);
  const [flyingNumbers, setFlyingNumbers] = useState([]);
  const [slapEmojis, setSlapEmojis] = useState([]);
  const [lastTapTime, setLastTapTime] = useState(Date.now());
  const [offlinePoints, setOfflinePoints] = useState(0);
  const [energy, setEnergy] = useState(1000); // Initial energy level

  useEffect(() => {
    const initializeUser = async () => {
      const userID = await getUserID(setUserID, setUsername);
      const savedPoints = localStorage.getItem(`points_${userID}`);
      if (savedPoints) {
        setPoints(parseFloat(savedPoints));
      }
    };
    initializeUser();
  }, [setUserID, setUsername, setPoints, userID]);

  const getMessage = useMemo(() => {
    if (tapCount >= 150) return "He's feeling it! Keep going!";
    if (tapCount >= 100) return "Ouch! That's gotta hurt!";
    if (tapCount >= 50) return "Yeah, slap him more! :)";
    return "Slap this eagle, he took my Golden CHICK!";
  }, [tapCount]);

  const calculatePoints = () => {
    return 3;
  };

  const syncPointsWithServer = useCallback(
    debounce(async (totalPointsToAdd) => {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/user-info/update-points/${userID}`,
          { pointsToAdd: totalPointsToAdd }
        );
        setPoints(response.data.points);
        localStorage.setItem(`points_${userID}`, response.data.points);
        setOfflinePoints(0);
      } catch (error) {
        console.error('Error syncing points with server:', error);
      }
    }, 1000),
    [userID, setPoints]
  );

  const handleTap = useCallback(
    (e) => {
      if (energy <= 0) {
        // Do not allow tapping if energy is depleted
        return;
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const width = rect.width;
      const height = rect.height;

      if (clickX >= 0 && clickX <= width && clickY >= 0 && clickY <= height) {
        const pointsToAdd = calculatePoints();

        const currentTime = Date.now();
        const timeDiff = currentTime - lastTapTime;
        const tapSpeedMultiplier = Math.max(1, 500 / timeDiff);

        setLastTapTime(currentTime);

        const addedPoints = pointsToAdd * tapSpeedMultiplier;

        setPoints((prevPoints) => {
          const newPoints = prevPoints + addedPoints;
          localStorage.setItem(`points_${userID}`, newPoints);
          return newPoints;
        });

        setTapCount((prevTapCount) => prevTapCount + 1);

        setFlyingNumbers((prevNumbers) => [
          ...prevNumbers,
          { id: Date.now(), x: e.clientX, y: e.clientY, value: addedPoints },
        ]);

        setSlapEmojis((prevEmojis) => [
          ...prevEmojis,
          { id: Date.now(), x: e.clientX, y: e.clientY },
        ]);

        setOfflinePoints((prevOfflinePoints) => prevOfflinePoints + addedPoints);

        // Reduce energy on tap
        setEnergy((prevEnergy) => Math.max(prevEnergy - 10, 0));

        if (navigator.onLine) {
          syncPointsWithServer(offlinePoints + addedPoints);
        }
      }
    },
    [lastTapTime, syncPointsWithServer, setPoints, offlinePoints, energy, userID]
  );

  // Regenerate energy over time
  useEffect(() => {
    const regenInterval = setInterval(() => {
      setEnergy((prevEnergy) => Math.min(prevEnergy + 1, 1000)); // Regenerate 1 energy point per second
    }, 1000);

    return () => clearInterval(regenInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlyingNumbers((prevNumbers) =>
        prevNumbers.filter((number) => Date.now() - number.id < 1000)
      );
      setSlapEmojis((prevEmojis) =>
        prevEmojis.filter((emoji) => Date.now() - emoji.id < 600)
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <HomeContainer>
      <UserInfo />
      <PointsDisplayContainer>
        <PointsDisplay>
          <DollarIcon src={dollarImage} alt="Dollar Icon" />
          {Math.floor(points)}
        </PointsDisplay>
        <EnergyDisplay>{`Energy: ${energy}/1000`}</EnergyDisplay> {/* Display energy level */}
      </PointsDisplayContainer>
      <MiddleSection>
        <Message>{getMessage}</Message>
        <EagleContainer>
          <EagleImage
            src={eagleImage}
            alt="Eagle"
            onClick={handleTap}
          />
        </EagleContainer>
        <Description>
          Slap the eagle to earn <span>points</span>! Collect more as you <span>play</span>.
          Stay tuned for <span>updates</span> and <span>rewards</span>!
        </Description>
      </MiddleSection>

      {flyingNumbers.map((number) => (
        <FlyingNumber key={number.id} x={number.x} y={number.y}>
          +{number.value.toFixed(2)}
        </FlyingNumber>
      ))}
      {slapEmojis.map((emoji) => (
        <SlapEmoji key={emoji.id} x={emoji.x} y={emoji.y}>
          👋
        </SlapEmoji>
      ))}
    </HomeContainer>
  );
}

export default HomePage;
