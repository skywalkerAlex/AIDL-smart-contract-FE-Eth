import React, { useEffect, useState } from "react";

// Chakra imports
import {
  Flex,
  Button,
  FormControl,
  FormLabel,
  Input,
  Link,
  Text,
  Select,
  color,
  Switch,
} from "@chakra-ui/react";


// Custom Components
import GradientBorder from "components/GradientBorder/GradientBorder";
import {default as MultiSelect } from 'react-select';
import { SunIcon } from "@chakra-ui/icons";
import dataProperties from "components/DatasetDetails/DataProperties.json";

function DsDetailsForm(props) {
    const titleColor = "white";
    const textColor = "gray.400";

    const [showModel, setShowModel] = useState(false);

    const onNameChange = (e) => {
		const value = e.target.value;
		props.passName(value);
	};

	const onDataTypeChange = (event) => {
		const { value } = event.target;
		props.passDataType(value);
	};
	
	const onAccuracyScoreChange = (event) => {
		const { value } = event.target;
		props.passAccuracyScore(value);
	};
	
	const onFileTypeChange = (event) => {
		const { value } = event.target;
		props.passFileType(value);
	};
	
	const onFileSizeChange = (event) => {
		const { value } = event.target;
		props.passFileSize(value);
	};

	const onModelListChange = (event) => {
		const { value } = event.target;
		props.passModelList(value);
	};
	
	const onLibraryListChange = (event) => {
		const { value } = event.target;
		props.passLibraryList(value);
	};

    const onDataDetailsSubmit = (event) => {
        event.preventDefault();
        props.passDataDetails(true);
	};
    

    const showModelForm = (event) => {
        console.log("showModel = ", showModel);
        setShowModel(!showModel);
    };

    // UseEffects
    useEffect(() => {

	}, [setShowModel]);


    const modelForm = () => {
        return (
        <Flex
            background='transparent'
            // borderRadius='30px'
            direction='column'
            p='40px'
            minW={{ base: "unset", md: "430px", xl: "450px" }}
            w='100%'
            mx={{ base: "0px" }}
            bg={{
                base: "rgb(19,21,56)",
            }}
            boxShadow='dark-lg'
        >
            <FormLabel
            htmlFor="accuracyScoreId"
                color={titleColor}
                ms='4px'
                fontSize='xl'
                fontWeight='normal'>
                Accuracy score
            </FormLabel>
            <GradientBorder
                mb='24px'
                h='50px'
                w={{ base: "100%"}}
                borderRadius='20px'>
                <Input
                    id="accuracyScoreId"
                    isRequired={true}
                    color={titleColor}
                    bg={{
                        base: "rgb(19,21,54)",
                    }}
                    border='transparent'
                    borderRadius='20px'
                    fontSize='md'
                    size='lg'
                    w={{ base: "100%"}}
                    maxW='100%'
                    h='46px'
                    type='text'
                    onChange={onAccuracyScoreChange}
                    placeholder='Place your accuracy score'
                />
            </GradientBorder>
            
            <FormLabel
                color={titleColor}
                ms='4px'
                fontSize='xl'
                fontWeight='normal'
                htmlFor="modelsId">
                Model Type and Libraries
            </FormLabel>
            <GradientBorder
                mb='24px'
                h='50px'
                w={{ base: "100%"}}
                borderRadius='20px'>
                <MultiSelect 
                    id="modelsId"
                    // variant='outline' 
                    // color={textColor}
                    // backgroundColor={{
                    // base: "rgb(19,21,54)",
                    // }}
                    // border='transparent'
                    // borderRadius='20px'
                    // fontSize='md'
                    // size='lg'
                    // w={{ base: "100%"}}
                    // maxW='100%'
                    // h='46px'
                    name="models"
                    placeholder='Choose your models'
                    isMulti
                    onChange={onModelListChange}
                    options={dataProperties.models}
                />
                    
                <MultiSelect 
                    // variant='outline' 
                    // color={textColor}
                    // backgroundColor={{
                    // base: "rgb(19,21,54)",
                    // }}
                    // border='transparent'
                    // borderRadius='20px'
                    // fontSize='md'
                    // size='lg'
                    // w={{ base: "100%"}}
                    // maxW='100%'
                    // h='46px'
                    placeholder='Choose your libraries'
                    name="libraries"
                    isMulti
                    className="basic-multi-select"
                    classNamePrefix="select"
                    styles={colourStyles}
                    onChange={onLibraryListChange}
                    options={dataProperties.libraries}
                    />
                </GradientBorder>
                <FormLabel
                    htmlFor="datasizeId"
                    color={titleColor}
                    ms='4px'
                    fontSize='xl'
                    fontWeight='normal'>
                    Data size
                </FormLabel>
                <GradientBorder
                    mb='24px'
                    h='50px'
                    w={{ base: "100%" }}
                    borderRadius='20px'>
                    <Input
                        id="datasizeId"
                        color={titleColor}
                        bg={{
                            base: "rgb(19,21,54)",
                        }}
                        border='transparent'
                        borderRadius='20px'
                        fontSize='md'
                        size='lg'
                        w={{ base: "100%"}}
                        maxW='100%'
                        h='46px'
                        type='text'
                        onChange={onFileSizeChange}
                        placeholder='Data size (MB)'
                    />
                </GradientBorder>
            </Flex>
        );
    }

    const dataOptions = (type) => {
        return dataProperties[type].map(data => 
            <option key={data.value} styles={  [{"color": textColor}] } value={data.value}>{data.label}</option>
        )
    }
    // backgroundColor="rgb(19,21,54)" 


    const dot = (color = 'transparent') => ({
        alignItems: 'center',
        display: 'flex',
        
        ':before': {
            backgroundColor: color,
            borderRadius: 10,
            content: '" "',
            display: 'block',
            marginRight: 8,
            height: 10,
            width: 10,
        },
        });
        
    const colourStyles = () => {
        return (
        {control: (styles) => ({ ...styles, backgroundColor: 'white' }),
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
            const color = data.color;
            return {
            ...styles,
            backgroundColor: isDisabled
                ? undefined
                : isSelected
                ? data.color
                : isFocused
                ? color.alpha(0.1).css()
                : undefined,
            color: isDisabled
                ? '#ccc'
                : isSelected
                ? color === 'white'
                ? 'white'
                : 'black'
                : data.color,
            cursor: isDisabled ? 'not-allowed' : 'default',
        
            ':active': {
                ...styles[':active'],
                backgroundColor: !isDisabled
                ? isSelected
                    ? data.color
                    : color.alpha(0.3).css()
                : undefined,
            },
            };
        },
        input: (styles) => ({ ...styles, ...dot() }),
        placeholder: (styles) => ({ ...styles, ...dot('#ccc') }),
        singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),}
        );
        };

  return (
    <Flex 
        flexDirection='column' 
        pt={{ base: '120px', md: '15px' }}
        pb={{ base: '120px', md: '15px' }} 
        >
          <GradientBorder p='2px' me={{ base: "none", sm: '1fr', md: '1fr 1fr', '2xl': '1fr 1fr'}} >
            <Flex
              background='transparent'
              borderRadius='30px'
              direction='column'
              p='40px'
              minW={{ base: "unset", md: "430px", xl: "450px" }}
              w='100%'
              mx={{ base: "0px" }}
              bg={{
                base: "rgb(19,21,56)",
              }}
              boxShadow='dark-lg'
              >
              <Text
                fontSize='3xl'
                color={titleColor}
                fontWeight='bold'
                textAlign='center'
                mb='22px'>
                Fill the form below to create new Dataset record
              </Text>
              <FormControl>
                <FormLabel
                  color={titleColor}
                  ms='4px'
                  fontSize='xl'
                  fontWeight='normal'>
                  Project name
                </FormLabel>
                <GradientBorder
                  mb='24px'
                  h='50px'
                  w={{ base: "100%" }}
                  borderRadius='20px'>
                  <Input
                    color={titleColor}
                    bg={{
                      base: "rgb(19,21,54)",
                    }}
                    border='transparent'
                    borderRadius='20px'
                    fontSize='md'
                    size='lg'
                    w={{ base: "100%"}}
                    maxW='100%'
                    h='46px'
                    type='text'
                    onChange={onNameChange}
                    placeholder='Your name'
                  />
                </GradientBorder>
                <FormLabel
                  color={titleColor}
                  ms='4px'
                  fontSize='xl'
                  fontWeight='normal'
                  htmlFor="dataTypeId">
                  Data Type and Format
                </FormLabel>
                <GradientBorder
                  mb='24px'
                  h='50px'
                  w={{ base: "100%"}}
                  borderRadius='20px'>
                <Select 
                    id="dataTypeId"
                    isRequired={true}
                    variant='outline' 
                    color={textColor}
                    backgroundColor={{
                      base: "rgb(19,21,54)",
                    }}
                    border='transparent'
                    borderRadius='20px'
                    fontSize='md'
                    size='lg'
                    w={{ base: "100%"}}
                    maxW='100%'
                    h='46px'
                    onChange={onDataTypeChange}
                    placeholder='Select Data Type'
                >
                    {dataOptions("dataType")}
                </Select>
                <Select 
                    isRequired={true}
                    variant='outline' 
                    color={textColor}
                    backgroundColor={{
                      base: "rgb(19,21,54)",
                    }}
                    border='transparent'
                    borderRadius='20px'
                    fontSize='md'
                    size='lg'
                    w={{ base: "100%"}}
                    maxW='100%'
                    h='46px'
                    onChange={onFileTypeChange}
                    placeholder='Select File Type'
                >
                    {dataOptions("fileType")}
                </Select>
                </GradientBorder>
                <Flex align='center' mb='20px'>
                    <Switch 
                    id="hasModelFormId" 
                    variant='brand' 
                        colorScheme='brand' me='10px' 
                        isChecked={showModel} 
                        onChange={showModelForm}
                        />
                    <FormLabel  htmlFor="hasModelFormId" 
                        noOfLines={1} fontSize='md' 
                        color={textColor} fontWeight='400'>
                        Do you want to upload the characteristics of the model?
                    </FormLabel >
                </Flex>
            {showModel ? modelForm() : null}
                
            <Button
                variant='brand'
                fontSize='md'
                type='submit'
                w='100%'
                maxW='350px'
                h='45'
                mb='20px'
                rightIcon={<SunIcon boxSize={4} />}
                onClick={onDataDetailsSubmit}
                mt='20px'
            >
                Upload Dataset
            </Button>
            </FormControl>
              {/* <Flex
                flexDirection='column'
                justifyContent='center'
                alignItems='center'
                maxW='100%'
                mt='0px'>
                <Text color={textColor} fontWeight='medium'>
                  Already have an account?
                  <Link
                    color={titleColor}
                    as='span'
                    ms='5px'
                    href='#'
                    fontWeight='bold'>
                    Sign In
                  </Link>
                </Text>
              </Flex> */}
            </Flex>
          </GradientBorder>
    </Flex>
  );
}

export default DsDetailsForm;
