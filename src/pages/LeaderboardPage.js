import React from "react";
import axios from "axios";
import styled, { css } from "styled-components";
import { FaGamepad, FaTasks, FaUserFriends, FaRegGem } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import SkeletonLoader from "../components/skeleton/SkeletonLoader"; // Keep using your SkeletonLoader component
import {
  EarnBoxTitle,
  EarnBoxIcon,
  EarnBox,
  EarnMoreContainer,
  NoUsersMessage,
  UserAvatar,
  PointsCell,
  UserCell,
  RankCell,
  Top30LeaderText,
  TableRow,
  TableHeader,
  PointsDisplay,
  Table,
  PointsDisplayContainer,
  LeaderboardContainer,
  avatarImages,
} from "../style/LeaderboardStyles";

// Fetching the top users data
const fetchTopUsers = async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/fetchdata`);
  return response.data.sort((a, b) => b.points - a.points).slice(0, 30); // Sort and limit to 30 users
};

// Styled component for announcement box with improved spacing and hover effect
export const AnnouncementBox = styled(Link)`
  background-color: #6023f5;
  color: #ffffff;
  padding: 14px;
  text-align: center;
  margin: 20px auto;
  display: block;
  font-size: 20px;
  font-weight: bold;
  width: 90%; /* Ensures it scales well on smaller screens */
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #4c1bb5;
    transform: translateY(-3px);
  }
`;

function LeaderboardPage() {
  const { data: users = [], isLoading, isError } = useQuery(
    ["topUsers"],
    fetchTopUsers,
    {
      staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
      cacheTime: 1000 * 60 * 30, // Cache data for 30 minutes
      refetchOnWindowFocus: false, // Prevent automatic refetch on window focus
    }
  );

  // Function to truncate the username if too long
  const truncateUsername = (username) => {
    if (username.length <= 5) return username;
    return `${username.slice(0, 3)}...${username.slice(-2)}`;
  };

  // Utility function to format points with K and M for large numbers
  const formatPoints = (points) => {
    if (points >= 1000000) {
      return (points / 1000000).toFixed(2) + "M";
    } else if (points >= 1000) {
      return (points / 1000).toFixed(2) + "K";
    } else {
      return points.toFixed(0);
    }
  };

  if (isError) {
    return <NoUsersMessage>Error fetching leaderboard data. Please try again later.</NoUsersMessage>;
  }

  return (
    <>
      {/* Announcement Box */}
      <AnnouncementBox to="/weekly-leaderboard">
        🎉 Weekly leaderboard is open! Click here 🎉
      </AnnouncementBox>

      {/* Earn More Container */}
      <EarnMoreContainer>
        <EarnBox to="/home">
          <EarnBoxIcon>
            <FaGamepad />
          </EarnBoxIcon>
          <EarnBoxTitle>Play Game</EarnBoxTitle>
        </EarnBox>

        <EarnBox to="/earn">
          <EarnBoxIcon>
            <FaTasks />
          </EarnBoxIcon>
          <EarnBoxTitle>Complete Task</EarnBoxTitle>
        </EarnBox>

        <EarnBox to="/friend">
          <EarnBoxIcon>
            <FaUserFriends />
          </EarnBoxIcon>
          <EarnBoxTitle>Refer Friends</EarnBoxTitle>
        </EarnBox>
      </EarnMoreContainer>

      {/* Leaderboard Section */}
      <LeaderboardContainer>
        <PointsDisplayContainer>
          <PointsDisplay>
            <img
              src="https://i.ibb.co/pxGzrY8/leaderboard-1.png"
              alt="Leaderboard Logo"
              style={{ width: "150px", height: "150px", marginTop: "20px" }}
            />
          </PointsDisplay>
          <Top30LeaderText>Top 30 Leaders</Top30LeaderText>
        </PointsDisplayContainer>

        {/* Display Skeleton Loader when loading */}
        {isLoading ? (
          <SkeletonLoader />
        ) : users.length === 0 ? (
          <NoUsersMessage>No users found</NoUsersMessage>
        ) : (
          <Table>
            <thead>
              <tr>
                <TableHeader>#</TableHeader>
                <TableHeader>User</TableHeader>
                <TableHeader>Total</TableHeader>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <TableRow key={user.userID}>
                  <RankCell rank={index + 1}>
                    {index + 1 === 1 && (
                      <img src="https://i.ibb.co/5cZBk7J/3d-5.png" alt="First Place" />
                    )}
                    {index + 1 === 2 && (
                      <img src="https://i.ibb.co/swJQnL0/3d-6.png" alt="Second Place" />
                    )}
                    {index + 1 === 3 && (
                      <img src="https://i.ibb.co/tqBDBFv/3d-7.png" alt="Third Place" />
                    )}
                    {index + 1 > 3 && index + 1}
                  </RankCell>
                  <UserCell>
                    <UserAvatar src={avatarImages[(user.userID % 20) + 1]} alt="User Avatar" />
                    <span>{truncateUsername(user.username)}</span>
                  </UserCell>
                  <PointsCell>
                    <FaRegGem style={{ marginRight: "8px", color: "#36a8e5" }} />
                    {formatPoints(user.points)}
                  </PointsCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}
      </LeaderboardContainer>
    </>
  );
}

export default LeaderboardPage;
