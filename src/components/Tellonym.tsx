import styled, { Box, css, Text } from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';
import ThreeDotsImage from "../assets/img/three_dots.svg";

const Tellonym = ({ value }: { value: string; }) => {
  return (
    <Box
      mx="auto"
      height="400px"
      width="400px"
      display="flex"
      justifyContent="center"
      alignItems="center"
      backgroundImage="url('/img/background.jpg')"
      backgroundRepeat="no-repeat"
      backgroundPosition="center"
      backgroundSize="contain">
      <Box backgroundColor="#1A222F" mx={7} p={4} width="300px">
        <Box display="flex" alignItems="flex-start" justifyContent="space-between">
          <Text color="#CBCED3">{value}
          </Text>
          <Image width="8" height="20" alt="" src="/img/three_dots.svg" />
        </Box>
        <Box display="flex" justifyContent="space-between" mx={3}>
          <Image width="17" height="17" alt="" className="message__comment" src="/img/comment.svg" />
          <Text color="#7C838B" fontSize="sm" mt={4}>an hour ago</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Tellonym;