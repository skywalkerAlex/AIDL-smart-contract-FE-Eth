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

/*eslint-disable*/
import React from "react";
import { Flex, Image, Link, List, ListItem, Text } from "@chakra-ui/react";
import GitHubButton from "react-github-btn";
import linkedinLogo from '../../assets/img/icons8-linkedin-48.png';

export default function Footer(props) {
  return (
    <Flex
      flexDirection={{
        base: "column",
        xl: "row",
      }}
      alignItems={{
        base: "center",
        xl: "start",
      }}
      justifyContent='space-between'
      px='30px'
      pb='20px'>
      <Text
        fontSize='sm'
        color='white'
        textAlign={{
          base: "center",
          xl: "start",
        }}
        mb={{ base: "20px", xl: "0px" }}>
        &copy; {1900 + new Date().getYear()},{" "}
        <Text as='span'>
          Made with ❤️ by
        </Text>
        <Link href='https://www.simmmple.com' target='_blank'>
          Alexander Liakopoulos
        </Link>
      </Text>
      <List display='flex'>
        <ListItem
          me={{
            base: "20px",
            md: "44px",
          }}>
          <GitHubButton
              href='https://github.com/creativetimofficial/vision-ui-dashboard-chakra'
              data-color-scheme="no-preference: light; light: light_high_contrast; dark: dark_dimmed;" 
              data-size="large" 
              data-show-count="false" 
              aria-label='Star creativetimofficial/vision-ui-dashboard-chakra on GitHub'>
              Follow @creativetimofficial
          </GitHubButton>
        </ListItem>
        <ListItem
          me={{
            base: "20px",
            md: "44px",
          }}>
          <GitHubButton 
              href="https://github.com/skywalkerAlex" 
              data-color-scheme="no-preference: light; light: light_high_contrast; dark: dark_dimmed;" 
              data-size="large" 
              data-show-count="false" 
              aria-label="Follow @skywalkerAlex on GitHub">
                Follow @skywalkerAlex
          </GitHubButton>
        </ListItem>
        <ListItem
          me={{
            base: "20px",
            md: "44px",
          }}>
            <Link
            color='white'
            fontSize='sm'
            href='https://aidl.uniwa.gr/'
            target={'_blank'}>
              <Image
                src='https://aidl.uniwa.gr/wp-content/uploads/2021/03/cropped-newLogo_1-180x45_trans_ar.png'
                borderRadius='20px' />
            </Link>
        </ListItem>
        <ListItem>
        <Link
            color='white'
            fontSize='sm'
            href='https://gr.linkedin.com/in/alexander-liakopoulos-b32077ab'
            target={'_blank'}>
              <Image
                src={linkedinLogo}
                alt="LinkedIn Liakopoulos"
                borderRadius='20px' />
        </Link>  
        </ListItem>
      </List>
    </Flex>
  );
}

export const appendScript = (scriptToAppend) => {
  const script = document.createElement("script");
  script.src = scriptToAppend;
  script.async = true;
  document.body.appendChild(script);
}