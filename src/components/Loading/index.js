import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  to: {
    transform: rotate(0deg);
  }

  from  {
    transform: rotate(360deg);
  }
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  svg {
    animation: ${rotate} 2s linear infinite;
  }
`;

export default Loading;
