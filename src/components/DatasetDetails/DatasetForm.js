import React from "react";

// Chakra imports
import {
    Flex,
    Button,
    FormControl,
    FormLabel,
    Input,
    Text,
    Select,
    Spacer,
    Icon,
} from "@chakra-ui/react";
import {BsArrowClockwise} from 'react-icons/bs';

// Custom Components
import GradientBorder from "components/GradientBorder/GradientBorder";
import {default as MultiSelect} from 'react-select';
import {SunIcon} from "@chakra-ui/icons";
import dataProperties from "components/DatasetDetails/DataProperties.json";

function DsDetailsForm(props) {
    const titleColor="white";
    const textColor="gray.400";

    const onNameChange=(e) => {
        const value=e.target.value;
        props.passName(value);
    };

    const onDataTypeChange=(event) => {
        const {value}=event.target;
        props.passDataType(value);
    };

    const onAccuracyScoreChange=(event) => {
        const {value}=event.target;
        props.passAccuracyScore(value);
    };

    const onFileTypeChange=(event) => {
        const {value}=event.target;
        props.passFileType(value);
    };

    const onFileSizeChange=(event) => {
        const {value}=event.target;
        props.passFileSize(value);
    };

    const onModelListChange=(event) => {
        const value=[];
        event.map((item) => {
            value.push(item.value);
        });
        props.passModelList(value);
    };

    const onLibraryListChange=(event) => {
        const value=[];
        event.map((item) => {
            value.push(item.value);
        });
        props.passLibraryList(value);
    };

    const onDataDetailsSubmit=(event) => {
        event.preventDefault();
        props.passDataDetails(true);
    };


    const modelForm=() => {
        return (
            <Flex
                background='transparent'
                // borderRadius='30px'
                direction='column'
                p='40px'
                minW={{base: "unset", md: "430px", xl: "450px"}}
                w='100%'
                mx={{base: "0px"}}
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
                    w={{base: "100%"}}
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
                        w={{base: "100%"}}
                        maxW='100%'
                        h='46px'
                        type='text'
                        onChange={onAccuracyScoreChange}
                        value={props.accuracyScore}
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
                    w={{base: "100%"}}
                    borderRadius='20px'>
                    <MultiSelect
                        id="modelsId"
                        variant='outline'
                        color={textColor}
                        backgroundColor={{
                            base: "rgb(19,21,54)",
                        }}
                        border='transparent'
                        borderRadius='20px'
                        fontSize='md'
                        size='lg'
                        w={{base: "100%"}}
                        maxW='100%'
                        h='46px'
                        name="models"
                        placeholder='Choose your models'
                        isMulti
                        onChange={onModelListChange}
                        value={props.modelList}
                        options={dataProperties.models}
                    />

                    <MultiSelect
                        variant='outline'
                        color={textColor}
                        backgroundColor={{
                            base: "rgb(19,21,54)",
                        }}
                        border='transparent'
                        borderRadius='20px'
                        fontSize='md'
                        size='lg'
                        w={{base: "100%"}}
                        maxW='100%'
                        h='46px'
                        placeholder='Choose your libraries'
                        name="libraries"
                        isMulti
                        className="basic-multi-select"
                        classNamePrefix="select"
                        styles={colourStyles}
                        onChange={onLibraryListChange}
                        value={props.libraryList}
                        options={dataProperties.libraries}
                    />
                </GradientBorder>
                <FormLabel
                    htmlFor="datasizeId"
                    color={titleColor}
                    ms='4px'
                    fontSize='xl'
                    fontWeight='normal'>
                    Data size (MB)
                </FormLabel>
                <GradientBorder
                    mb='24px'
                    h='50px'
                    w={{base: "100%"}}
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
                        w={{base: "100%"}}
                        maxW='100%'
                        h='46px'
                        type='text'
                        pattern="[0-9]*"
                        onChange={onFileSizeChange}
                        value={props.fileSize}
                        placeholder='input size in MB'
                    />
                </GradientBorder>
                <Button
                    p='0px'
                    variant="ghost"
                    onClick={props.clearDataDetails}
                    colorScheme='brand'
                    my={{sm: '1.5rem', lg: '0px'}}>
                    <Text
                        fontSize='2xl'
                        color='#fff'
                        fontWeight='bold'
                        cursor='pointer'
                        transition='all .5s ease'
                        my={{sm: '1.5rem', lg: '0px'}}
                        _hover={{me: '4px'}}>
                        <Spacer />Clear form
                    </Text>
                    <Icon
                        as={BsArrowClockwise}
                        w='20px'
                        h='20px'
                        color='#fff'
                        fontSize='3xl'
                        transition='all .3s ease'
                        mx='.3rem'
                        cursor='pointer'
                        pt='4px'
                        _hover={{transform: 'translateX(30%)'}}
                    />
                </Button>
            </Flex>
        );
    }

    const dataOptions=(type) => {
        return dataProperties[type].map(data =>
            <option key={data.value} styles={[{"color": '#fff'}]} value={data.value}>{data.label}</option>
        )
    }


    const dot=(color='transparent') => ({
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

    const colourStyles=() => {
        return (
            {
                control: (styles) => ({...styles, backgroundColor: 'white'}),
                option: (styles, {data, isDisabled, isFocused, isSelected}) => {
                    const color=data.color;
                    return {
                        ...styles,
                        backgroundColor: isDisabled
                            ? undefined
                            :isSelected
                                ? data.color
                                :isFocused
                                    ? color.alpha(0.1).css()
                                    :undefined,
                        color: isDisabled
                            ? '#ccc'
                            :isSelected
                                ? color==='white'
                                    ? 'white'
                                    :'black'
                                :data.color,
                        cursor: isDisabled? 'not-allowed':'default',

                        ':active': {
                            ...styles[':active'],
                            backgroundColor: !isDisabled
                                ? isSelected
                                    ? data.color
                                    :color.alpha(0.3).css()
                                :undefined,
                        },
                    };
                },
                input: (styles) => ({...styles, ...dot()}),
                placeholder: (styles) => ({...styles, ...dot('#ccc')}),
                singleValue: (styles, {data}) => ({...styles, ...dot(data.color)}),
            }
        );
    };

    return (
        <Flex
            flexDirection='column'
            pt={{base: '120px', md: '15px'}}
            pb={{base: '120px', md: '15px'}}
        >
            <GradientBorder p='2px' me={{base: "none", sm: '1fr', md: '1fr 1fr', '2xl': '1fr 1fr'}} >
                <Flex
                    background='transparent'
                    borderRadius='30px'
                    direction='column'
                    p='40px'
                    minW={{base: "unset", md: "430px", xl: "450px"}}
                    w='100%'
                    mx={{base: "0px"}}
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
                            w={{base: "100%"}}
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
                                w={{base: "100%"}}
                                maxW='100%'
                                h='46px'
                                type='text'
                                onChange={onNameChange}
                                value={props.name}
                                placeholder='Place a name for your project'
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
                            w={{base: "100%"}}
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
                                w={{base: "100%"}}
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
                                w={{base: "100%"}}
                                maxW='100%'
                                h='46px'
                                onChange={onFileTypeChange}
                                placeholder='Select File Type'
                            >
                                {dataOptions("fileType")}
                            </Select>
                        </GradientBorder>
                        {modelForm()}

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
                </Flex>
            </GradientBorder>
        </Flex>
    );
}

export default DsDetailsForm;
