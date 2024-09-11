import styled, { keyframes, css } from "styled-components";
import { FaBolt } from "react-icons/fa";
const eagleShiftUp = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px); /* Slight upward movement */
  }
  100% {
    transform: translateY(0); /* Return to original position */
  }
`;
const pointFlyingAnimation = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-120px) scale(2);  /* Increased height and size */
  }
`;

const slapEffectAnimation = keyframes`
  0% {
    transform: scale(1) translateY(0) translateX(0);
    opacity: 1;
  }
  50% {
    transform: scale(1.2) translateY(-8px) translateX(8px);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.5) translateY(-16px) translateX(-16px);
    opacity: 0;
  }
`;

export const HomeContainer = styled.div`
  font-family: "Orbitron", sans-serif;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  min-height: 87vh;
  overflow: hidden;
  user-select: none;
  padding: 20px 20px;
  position: relative;

  /* Add the background image to the whole screen */
  background-image: url('https://i.ibb.co/wYKcvh3/bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

export const PointsDisplayContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PointsDisplay = styled.div`
  font-size: 37px;
  color: white;
  display: flex;
  align-items: center;
  font-weight: bold;
  justify-content: center;
`;

export const DollarIcon = styled.img`
  width: 48px;
  height: 48px;
  margin-right: 10px;
`;

export const MiddleSection = styled.div`
  display: flex;
  flex-grow: 1;
  position: relative;
  justify-content: space-around;
  align-content: space-around;
  flex-direction: column;
  margin-top: 5px;
`;

export const Message = styled.div`
  color: white;
  text-transform: uppercase;
  @media (max-width: 480px) {
    font-size: 14px;
    margin-bottom: 10px;
  }
`;

export const EagleContainer = styled.div`
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
`;

export const EagleImage = styled.img`
  width: 95%;
  height: auto;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  margin-top: 10px;

  &.shift-up {
    animation: ${eagleShiftUp} 0.3s ease-in-out; /* Smooth and fast animation */
  }
`;
export const BottomContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

  padding: 0 20px;
  box-sizing: border-box;
`;

export const EarnMoreBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: #2a2a2a00;
  border-radius: 12px;
  padding: 10px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  width: 100px;
  height: 45px;
  text-align: right;
  border: 2px solid #1fa3e6;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

  & svg {
    margin-right: 5px;
  }

  &:hover {
    background-color: #575757;
  }
`;

export const EnergyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2a2a2a00;
  border-radius: 30px;
  padding: 0px 17px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  width: 100px;
  height: 45px;
  text-align: justify;
  border: 2px solid #1fa3e6;

  & svg {
    margin-right: 5px;
  }
`;

export const EnergyIcon = styled(FaBolt)`
  width: 20px;
  height: 20px;
  color: ${({ energy }) => (energy > 500 ? "#ffcc00" : "#ff6600")};
  transition: color 0.3s ease;
`;

export const EnergyCounter = styled.div`
  font-size: 14px;
  color: white;
  font-weight: bold;
`;

export const FlyingNumber = styled.div`
  position: absolute;
  font-size: 36px; /* Increased font size */
  color: #ffffff; /* Changed color to white */
  animation: ${pointFlyingAnimation} 1.5s ease-in-out; /* Increased duration for smoother animation */
  top: ${({ y }) => `${y}px`};
  left: ${({ x }) => `${x}px`};
  z-index: 10;
  pointer-events: none;
  transform: translate(-50%, -100%);
`;

export const SlapEmoji = styled.div`
  position: absolute;
  top: ${({ y }) => y}px;
  left: ${({ x }) => x}px;
  font-size: 36px;
  color: #ffffff;
  z-index: 10;
  transform: translate(-50%, -50%);
  animation: ${slapEffectAnimation} 0.6s ease forwards;
`;
export const CurvedBorderContainer = styled.div`
  width: 110%;
  height: 21px;
  margin-top: 70px;
  border-top: solid 3px #c5b8b8;
  border-radius: 50% / 100px 100px 0 0;
  position: relative;
  box-sizing: border-box;
`;

export const UserInfoSection = styled.div`
  /* Your existing styles for the UserInfo component */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
  position: relative;
`;
export const BackgroundWrapper = styled.div`
  background-image: url(${(props) => props.backgroundImage});
  background-size: cover;
  background-position: center;
  width: 100%;
  height: calc(100vh - 150px); // Adjusted to fit between sections
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;
