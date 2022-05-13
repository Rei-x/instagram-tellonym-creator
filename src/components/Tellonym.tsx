import { Box, chakra, Text } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";

const CommentIcon = chakra(() => (
  <Box display="flex" alignItems="flex-end">
    <Image width="17" height="17" alt="" src="/img/comment.svg" />
  </Box>
));

const ThreeDotsIcon = chakra(() => (
  <Box minWidth="8px" display="flex" alignItems="flex-start">
    <Image width="6" height="18" alt="" src="/img/three_dots.svg" />
  </Box>
));

const Tellonym = React.forwardRef<HTMLDivElement | null, { value: string }>(
  function Tellonym({ value }: { value: string }, ref) {
    return (
      <Box
        ref={ref}
        height="400px"
        width="400px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        backgroundImage="url('/img/background.jpg')"
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
        backgroundSize="contain"
      >
        <Box backgroundColor="#1A222F" mx={7} p={4} width="300px">
          <Box
            display="flex"
            alignItems="flex-start"
            justifyContent="space-between"
          >
            <Text wordBreak="break-word" color="#CBCED3" mr={3}>
              {value || "Wpisz tellonyma! Tym razem obsługuje emotki 😎😎"}
            </Text>
            <ThreeDotsIcon />
          </Box>
          <Box display="flex" justifyContent="space-between" mx={3}>
            <CommentIcon mt={10} />
            <Text color="#7C838B" fontSize="sm" mt={4}>
              an hour ago
            </Text>
          </Box>
        </Box>
      </Box>
    );
  }
);

export default Tellonym;
