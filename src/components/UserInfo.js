import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaRegGem, FaBell, FaLevelUpAlt } from 'react-icons/fa'; // Import necessary icons
import { Link } from 'react-router-dom';
import { usePoints } from '../context/PointsContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getUserID } from '../utils/getUserID'; // Assuming the file is named getUserID.js

// Main container with dark theme and compact mobile-first size
const UserInfoContainer = styled.div`
  color: white;
  background-color: #000000;  // Dark background
  padding: 7px 10px;
  border-radius: 20px;
  border: #3baeef 1px solid;
  top: 2.75%;
  width: 85%;  
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  font-weight: bold;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  font-family: 'Orbitron', sans-serif;
  animation: fadeIn 0.6s ease-in-out;  /* Wake-up animation */
`;

// Username and Level container
const UserLevelContainer = styled.div`
  display: flex;
  align-items: center;
`;

// Username display with mobile-optimized size
const Username = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-right: 8px;  // Space between username and level
`;

// Icon for gems
const GemIcon = styled(FaRegGem)`
  color: #36a8e5;
  margin-right: 5px;
  font-size: 1.2rem;
`;

// Points container with compact styling for mobile
const PointsContainer = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 4px 8px;
  font-size: 13px;
  display: flex;
  align-items: center;
  color: white;
`;

// Level container styled next to username
const LevelContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #222;
  text-decoration: none;
  border-radius: 10px;
  padding: 6px 10px;
  margin-right: 5px;
  font-size: 13px;
  color: #ffac00;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);  // Add shadow for depth
`;

// Level icon styled for mobile
const LevelIcon = styled(FaLevelUpAlt)`
  color: #ffac00;
  font-size: 1rem;
  margin-right: 4px;
`;

// Bell icon styled smaller for mobile notification
const BellIcon = styled(FaBell)`
  color: #ffac00;
  font-size: 1.2rem;
  margin-left: 6px;
`;

// Styled Link to remove underline
const StyledLink = styled(Link)`
  text-decoration: none;  // Remove the underline
`;

const fetchUserLevel = async (userID) => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/user-level/user-level/${userID}`);
  return data;
};

const UserInfo = () => {
  const [firstName, setFirstName] = useState('User');
  const { points } = usePoints();  // Points context

  // Fetch userID and handle firstName from Telegram WebApp
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userID = await getUserID();

        // Get the first name from Telegram WebApp or fallback to 'User'
        let firstNameFromTelegram = window.Telegram.WebApp?.initDataUnsafe?.user?.first_name || 'User';
        firstNameFromTelegram = firstNameFromTelegram.split(/[^\w]+/)[0].slice(0, 10); // Trim first name

        setFirstName(firstNameFromTelegram);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setFirstName('User');  // Default to 'User' on error
      }
    };

    fetchUserData();
  }, []);

  // Fetch user level using React Query v5 object syntax
  const { data: userLevelData, isLoading, isError } = useQuery({
    queryKey: ['userLevel'],
    queryFn: async () => {
      const userID = await getUserID();
      return fetchUserLevel(userID);
    },
  });

  if (isLoading) {
    return <UserInfoContainer>Loading...</UserInfoContainer>;
  }

  if (isError) {
    return <UserInfoContainer>Error loading user info</UserInfoContainer>;
  }

  const userLevel = userLevelData?.currentLevel ?? 0;  // Default to 0 if no level is found

  return (
    <UserInfoContainer>
      {/* Display the username and level together */}
      <UserLevelContainer>
        <Username>Hi {firstName}</Username>
        {/* Apply the styled Link here */}
        <StyledLink to="/levelpage">
          <LevelContainer>
            <LevelIcon /> Lvl {userLevel}  {/* Dynamically display user level */}
          </LevelContainer>
        </StyledLink>
      </UserLevelContainer>

      {/* Display points and bell icon */}
      <PointsContainer>
        <GemIcon /> {Math.floor(points)} GEMS  {/* Keep points functionality */}
        {/* Link to Telegram for notifications */}
        <a href="https://t.me/gemhuntersclub" target="_blank" rel="noopener noreferrer">
          <BellIcon />
        </a>
      </PointsContainer>
    </UserInfoContainer>
  );
};

export default UserInfo;
