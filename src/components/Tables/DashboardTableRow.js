/*!

=========================================================
* Vision UI Free Chakra - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-chakra
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-chakra/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import {
  Flex,
  Progress,
  Td,
  Text,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

function DashboardTableRow(props) {
  const {address, name, dataType, dataSize, librariesUsed, modelsUsed, progression, lastItem}=props;
  return (
    <Tr key={address+"_"+name+"_"+progression} >
      <Td
        minWidth={{sm: "250px"}}
        ps='0px'
        borderBottomColor='#56577A'
        border={lastItem? "none":null}>
        <Flex align='center' py='.8rem' minWidth='100%' flexWrap='nowrap'>
          {/* <Icon as={logo} h={"24px"} w={"24px"} me='18px' /> */}
          <Text fontSize='sm' color={'#fff'} fontWeight='normal' minWidth='100%'>
            {address}
          </Text>
        </Flex>
      </Td>

      <Td borderBottomColor='#56577A' border={lastItem? "none":null}>
        <Text fontSize='sm' color='#fff' fontWeight='bold' pb='.5rem'>
          {name}
        </Text>
      </Td>
      <Td borderBottomColor='#56577A' border={lastItem? "none":null}>
        <Text fontSize='sm' color='#fff' fontWeight='bold' pb='.5rem'>
          {dataType}
        </Text>
      </Td>
      <Td borderBottomColor='#56577A' border={lastItem? "none":null}>
        <Text fontSize='sm' color='#fff' fontWeight='bold' pb='.5rem'>
          {""+dataSize}
        </Text>
      </Td>
      <Td borderBottomColor='#56577A' border={lastItem? "none":null}>
        {librariesUsed? librariesUsed.map((lib) => {
          return (
            <Text fontSize='sm' color='#fff' fontWeight='bold' pb='.5rem'>
              {lib}
            </Text>
          );
        }):null}
      </Td>
      <Td borderBottomColor='#56577A' border={lastItem? "none":null}>
        {modelsUsed? modelsUsed.map((model) => {
          return (
            <Text fontSize='sm' color='#fff' fontWeight='bold' pb='.5rem'>
              {model}
            </Text>
          );
        }):null}
      </Td>
      <Td borderBottomColor='#56577A' border={lastItem? "none":null}>
        <Flex direction='column'>
          <Text
            fontSize='sm'
            color='#fff'
            fontWeight='bold'
            pb='.2rem'>{`${progression*100}%`}</Text>
          <Progress
            colorScheme='brand'
            h='3px'
            bg='#2D2E5F'
            value={progression*100}
            borderRadius='30px'
          />
        </Flex>
      </Td>
    </Tr>
  );
}

export default DashboardTableRow;
