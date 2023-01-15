// Chakra imports
import React, { useState } from 'react';
import {
	Box,
	Button,
	CircularProgress,
	CircularProgressLabel,
	Flex,
	Grid,
	Icon,
	SimpleGrid,
	Spacer,
	Stack,
	Stat,
	StatHelpText,
	StatLabel,
	StatNumber,
	Table,
	Tbody,
	Text,
	Th,
	Thead,
	Tr
} from '@chakra-ui/react';
// Custom components
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import CardHeader from 'components/Card/CardHeader.js';
import IconBox from 'components/Icons/IconBox';
// Icons
import { DocumentIcon, WalletIcon } from 'components/Icons/Icons.js';
import DashboardTableRow from 'components/Tables/DashboardTableRow';
import TimelineRow from 'components/Tables/TimelineRow';
import { AiFillCheckCircle } from 'react-icons/ai';
import { BiHappy } from 'react-icons/bi';
import { BsArrowRight } from 'react-icons/bs';
import { IoCheckmarkDoneCircleSharp } from 'react-icons/io5';
import medusa from 'assets/img/cardimgfree.png';

import { dashboardTableData, timelineData } from 'variables/general';
// React
import { useEffect, useCallback } from 'react';

// Solana imports
import idl from '../../smart_contract/idl.json';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { AnchorProvider, Program, web3 } from '@project-serum/anchor';
import kp from '../../smart_contract/keypair.json'
import DsDetailsForm from 'components/DatasetDetails/DatasetForm';

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram } = web3;

// Create a keypair for the account that will hold the GIF data.
// let baseAccount = Keypair.generate();
const arr = Object.values(kp._keypair.secretKey)
const secret = new Uint8Array(arr)
const baseAccount = web3.Keypair.fromSecretKey(secret)


// Get our program's id from the IDL file.
const programID = new PublicKey(idl.metadata.address);

// Set our network to devnet.
const network = clusterApiUrl('devnet');

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: "processed"
}

export default function Dashboard() {
	// ##### Solana Connect to Wallet Start #####
		// State
		const [walletAddress, setWalletAddress] = useState(null);

		const [storedDatasetDetails, setStoredDatasetDetails] = useState([{}]);
		const [name, setName] = useState('');
		const [accuracyScore, setAccuracyScore] = useState('');
		const [dataType, setDataType] = useState('');
		const [fileType, setFileType] = useState('');
		const [fileSize, setFileSize] = useState('');
		const [modelList, setModelList] = useState([]);
		const [libraryList, setLibraryList] = useState([]);
		
		// Actions
		const checkIfWalletIsConnected = async () => {
			try {
			const { solana } = window;
		
			if (solana) {
				if (solana.isPhantom) {
				console.log('Phantom wallet found!');
				const response = await solana.connect({ onlyIfTrusted: true });
				console.log(
					'Connected with Public Key:',
					response.publicKey.toString()
				);
		
				/*
				* Set the user's publicKey in state to be used later!
				*/
				setWalletAddress(response.publicKey.toString());
				}
			} else {
				alert('Solana object not found! Get a Phantom Wallet 👻');
			}
			} catch (error) {
			console.error(error);
			}
		};

		/*
		* Let's define this method so our code doesn't break.
		* We will write the logic for this next!
		*/
		const connectWallet = async () => {
			const { solana } = window;
		
			if (solana) {
				const response = await solana.connect();
				console.log('Connected with Public Key:', response.publicKey.toString());
				setWalletAddress(response.publicKey.toString());
				createDataseDetailsAccount();
			}
		};

	// ##### Solana Connect to Wallet End #####

	// ##### Rendering Options Start #####
	
		const renderUser = () => (
			<>
				<Text fontSize='lg' color='gray.400' fontWeight='bold' >
					Welcome back,
				</Text>
				<Text fontSize='xl' color='#fff' fontWeight='bold' mb='18px' >
					{walletAddress}
				</Text>
				<Text fontSize='md' color='gray.400' fontWeight='normal' mb='auto'>
					Glad to see you again! <br />
				</Text>
			</>
		);

		const renderWellcomeUser = () => (
			<>
				<Text fontSize='3xl' color='gray.400' fontWeight='bold' >
					Welcome!
				</Text>
				<Text fontSize='4xl' color='#fff' fontWeight='bold' mb='18px' noOfLines={[1, 2, 3]}>
					Here you can validate the dataset, or even better the results of your Neural Network!
				</Text>
				<Text fontSize='xl' color='gray.400' fontWeight='normal' mb='auto'>
					Connect to the Solana Wallet and start validating the dataset!
				</Text>
				<Spacer />
				<Flex align='center' >
					<Button
						p='0px'
						variant="ghost"
						onClick={connectWallet}
						colorScheme='brand'
						my={{ sm: '1.5rem', lg: '0px' }}>
						<Text
							fontSize='2xl'
							color='#fff'
							fontWeight='bold'
							cursor='pointer'
							transition='all .5s ease'
							my={{ sm: '1.5rem', lg: '0px' }}
							_hover={{ me: '4px' }}>
							<Spacer />Tap to Log In
						</Text>
						<Icon
							as={BsArrowRight}
							w='20px'
							h='20px'
							color='#fff'
							fontSize='3xl'
							transition='all .3s ease'
							mx='.3rem'
							cursor='pointer'
							pt='4px'
							_hover={{ transform: 'translateX(30%)' }}
						/>
					</Button>
				</Flex>
			</>
		);

		/*
		* We want to render this UI when the user hasn't connected
		* their wallet to our app yet.
		*/
		const renderNotConnectedContainer = () => (
			<>
			<Button
				variant="solid"
				colorScheme='brand'
				onClick={connectWallet}
				>
					<Text
						fontSize='2xl'
						color='purple.200'
						fontWeight='bold'
						cursor='pointer'
						transition='all .3s ease'
						my={{ sm: '1.5rem', lg: '0px' }}>
						Connect to Wallet
					</Text>
			</Button>
			</>
		);

		const renderConnectedContainer = () => {

			if (storedDatasetDetails.length === 0) {
				return (
					<Flex
						background='transparent'
						borderRadius='20px'
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
						<Button
							variant="solid"
							colorScheme='brand'
							onClick={createDataseDetailsAccount}
							>
								<Text
									fontSize='2xl'
									color='purple.200'
									fontWeight='bold'
									cursor='pointer'
									transition='all .3s ease'
									my={{ sm: '1.5rem', lg: '0px' }}>
									Do One-Time Initialization For Dataset Details
								</Text>
						</Button>
					  
					</Flex>
				  )
			} else {

				return (
				<>
				{/* <DsDetailsForm /> */}
				<DsDetailsForm 
					passName = {setName}
					passAccuracyScore = {setAccuracyScore}
					passDataType = {setDataType}
					passFileType = {setFileType}
					passFileSize = {setFileSize}
					passModelList = {setModelList}
					passLibraryList = {setLibraryList}
					passDataDetails = {uploadDatasetDetails}
				/>
				<Grid templateColumns={{ sm: '1fr', md: '1fr 1fr', lg: '2fr 1fr' }} gap='24px'>
					{/* Projects */}
					<Card p='16px' overflowX={{ sm: 'scroll', xl: 'hidden' }}>
						<CardHeader p='12px 0px 28px 0px'>
							<Flex direction='column'>
								<Text fontSize='lg' color='#fff' fontWeight='bold' pb='8px'>
									Projects
								</Text>
								<Flex align='center'>
									<Icon as={IoCheckmarkDoneCircleSharp} color='teal.300' w={4} h={4} pe='3px' />
									<Text fontSize='sm' color='gray.400' fontWeight='normal'>
										<Text fontWeight='bold' as='span'>
											30 done
										</Text>{' '}
										this month.
									</Text>
								</Flex>
							</Flex>
						</CardHeader>
						<Table variant='simple' color='#fff'>
							<Thead>
								<Tr my='.8rem' ps='0px'>
									<Th
										ps='0px'
										color='gray.400'
										fontFamily='Plus Jakarta Display'
										borderBottomColor='#56577A'>
										Companies
									</Th>
									<Th color='gray.400' fontFamily='Plus Jakarta Display' borderBottomColor='#56577A'>
										Members
									</Th>
									<Th color='gray.400' fontFamily='Plus Jakarta Display' borderBottomColor='#56577A'>
										Budget
									</Th>
									<Th color='gray.400' fontFamily='Plus Jakarta Display' borderBottomColor='#56577A'>
										Completion
									</Th>
								</Tr>
							</Thead>
							<Tbody>
								{dashboardTableData.map((row, index, arr) => {
									return (
										<DashboardTableRow
											name={row.name}
											logo={row.logo}
											members={row.members}
											budget={row.budget}
											progression={row.progression}
											lastItem={index === arr.length - 1 ? true : false}
										/>
									);
								})}
							</Tbody>
						</Table>
					</Card>
					{/* Orders Overview */}
					<Card>
						<CardHeader mb='32px'>
							<Flex direction='column'>
								<Text fontSize='lg' color='#fff' fontWeight='bold' mb='6px'>
									Orders overview
								</Text>
								<Flex align='center'>
									<Icon as={AiFillCheckCircle} color='green.500' w='15px' h='15px' me='5px' />
									<Text fontSize='sm' color='gray.400' fontWeight='normal'>
										<Text fontWeight='bold' as='span' color='gray.400'>
											+30%
										</Text>{' '}
										this month
									</Text>
								</Flex>
							</Flex>
						</CardHeader>
						<CardBody>
							<Flex direction='column' lineHeight='21px'>
								{timelineData.map((row, index, arr) => {
									return (
										<TimelineRow
											logo={row.logo}
											title={row.title}
											date={row.date}
											color={row.color}
											index={index}
											arrLength={arr.length}
										/>
									);
								})}
							</Flex>
						</CardBody>
					</Card>
					</Grid>
				</>
				);
			}
		}
	// ##### Rendering Options End #####
		
	// ##### Connected Solana Wallet Actions Start #####
	  const uploadDatasetDetails = async () => {
		if (name.length === 0) {
		  console.log("Not enough Details given!")
		  return
		}
		let inputValue =  {
				name: name,
				dataType: dataType,
				accuracyScore: accuracyScore,
				fileType: fileType,
				size: fileSize,
				modelsUsed: modelList,
				librariesUsed: libraryList,
			}
		console.log('uploadDatasetDetails :', inputValue);
		try {
		  const provider = getProvider();
		  const program = new Program(idl, programID, provider);
	  
		  await program.rpc.uploadDatasetDetails(inputValue, {
			accounts: {
			  baseAccount: baseAccount.publicKey,
			  user: provider.wallet.publicKey,
			},
		  });
		  console.log("Dataset Details successfully sent to Blockchain", inputValue)
	  
		  await createDataseDetailsAccount();
		} catch (error) {
		  console.log("Error sending Dataset Details :", error)
		}
	  };
	
	  const getProvider = () => {
		const connection = new Connection(network, opts.preflightCommitment);
		const provider = new AnchorProvider(
		  connection, window.solana, opts.preflightCommitment,
		);
		return provider;
	  }

	  const createDataseDetailsAccount = async () => {
		try {
		  const provider = getProvider();
		  const program = new Program(idl, programID, provider);
		  console.log("ping")
		  await program.rpc.initialize({
			accounts: {
			  baseAccount: baseAccount.publicKey,
			  user: provider.wallet.publicKey,
			  systemProgram: SystemProgram.programId,
			},
			signers: [baseAccount]
		  });
			console.log("Created a new BaseAccount w/ address:", baseAccount.publicKey.toString())
			await createDataseDetailsAccount();
	  
		} catch(error) {
		  console.log("Error creating BaseAccount account:", error)
		}
	  }
	// ##### Connected Solana Wallet Actions End #####


	  /*
   * When our component first mounts, let's check to see if we have a connected
   * Phantom Wallet
   */
	// UseEffects
	useEffect(() => {
		const onLoad = async () => {
			await checkIfWalletIsConnected();
		};
		window.addEventListener('load', onLoad);
		return () => window.removeEventListener('load', onLoad);
	}, []);
	
	useEffect(() => {

	}, [setAccuracyScore, setDataType, setFileType, setFileSize, setLibraryList, setModelList, setName]);

	const getDatasetDetails = useCallback(async() => {
		try {
			const provider = getProvider();
			const program = new Program(idl, programID, provider);
			const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
			
			console.log("Got the account", account)
			setDataType(account.dataType)
			setStoredDatasetDetails(account.datasetsList)
	
		} catch (error) {
			console.log("Error in getDatasetDetails: ", error)
			setStoredDatasetDetails(null);
		}
	})
	
	return (
		<Flex flexDirection='column' pt={{ base: '120px', md: '75px' }}>
			<Grid templateColumns={{ sm: '1fr', md: '1fr 1fr', '2xl': '1fr 1fr' }} my='26px' gap='18px'>
				{/* Welcome Card */}
				<Card
					p='0px'
					gridArea={{ md: '1 / 1 / 2 / 3', '2xl': 'auto' }}
					bgImage={medusa}
					bgSize='cover'
					bgPosition='50%'>
					<CardBody w='100%' h='100%'>
						<Flex flexDirection={{ sm: 'column', lg: 'row' }} w='100%' h='100%'>
							<Flex flexDirection='column' h='100%' p='50px' minW='60%' lineHeight='1.6'>
								{walletAddress ? renderUser() : renderWellcomeUser()}
							</Flex>
						</Flex>
					</CardBody>
				</Card>
				<SimpleGrid columns={{ sm: 1, md: 2, xl: 2 }} spacing='24px'>
					{/* MiniStatistics Card Total Datasets uploaded*/}
					<Card>
						<CardBody>
							<Flex flexDirection='row' align='center' justify='center' w='100%'>
								<Stat me='auto'>
									<StatLabel fontSize='sm' color='gray.400' fontWeight='bold' pb='2px'>
										Total Datasets uploaded
									</StatLabel>
									<Flex>
										<StatNumber fontSize='lg' color='#fff'>
											$53,000
										</StatNumber>
										<StatHelpText
											alignSelf='flex-end'
											justifySelf='flex-end'
											m='0px'
											color='green.400'
											fontWeight='bold'
											ps='3px'
											fontSize='md'>
											+55%
										</StatHelpText>
									</Flex>
								</Stat>
								<IconBox as='box' h={'45px'} w={'45px'} bg='brand.200'>
									<WalletIcon h={'24px'} w={'24px'} color='#fff' />
								</IconBox>
							</Flex>
						</CardBody>
					</Card>
					{/* MiniStatistics Card Total Size */}
					<Card>
						<CardBody>
							<Flex flexDirection='row' align='center' justify='center' w='100%'>
								<Stat>
									<StatLabel fontSize='sm' color='gray.400' fontWeight='bold' pb='2px'>
										Total Size in MB uploaded
									</StatLabel>
									<Flex>
										<StatNumber fontSize='lg' color='#fff'>
											3,020 MB
										</StatNumber>
										{/* <StatHelpText
											alignSelf='flex-end'
											justifySelf='flex-end'
											m='0px'
											color='red.500'
											fontWeight='bold'
											ps='3px'
											fontSize='md'>
											-14%
										</StatHelpText> */}
									</Flex>
								</Stat>
								<Spacer />
								<IconBox as='box' h={'45px'} w={'45px'} bg='brand.200'>
									<DocumentIcon h={'24px'} w={'24px'} color='#fff' />
								</IconBox>
							</Flex>
						</CardBody>
					</Card>
				</SimpleGrid>
				{/* Satisfaction Rate */}
				<Card gridArea={{ md: '2 / 1 / 3 / 2', '2xl': 'auto' }}>
					<CardHeader mb='24px'>
						<Flex direction='column'>
							<Text color='#fff' fontSize='lg' fontWeight='bold' mb='4px'>
								Satisfaction Rate
							</Text>
							<Text color='gray.400' fontSize='sm'>
								From all projects
							</Text>
						</Flex>
					</CardHeader>
					<Flex direction='column' justify='center' align='center'>
						<Box zIndex='-1'>
							<CircularProgress
								size={200}
								value={50}
								thickness={8}
								color='#582CFF'
								variant='vision'
								bottom='20%'
								rounded>
								<CircularProgressLabel>
									<IconBox mb='10px' mx='auto' bg='brand.200' 
									borderRadius='50%' w='48px' h='48px'>
										<Icon as={BiHappy} color='#fff' w='30px' h='30px' />
									</IconBox>
								</CircularProgressLabel>
							</CircularProgress>
						</Box>
						<Stack
							direction='row'
							spacing={{ sm: '42px', md: '68px' }}
							justify='center'
							maxW={{ sm: '270px', md: '300px', lg: '100%' }}
							mx={{ sm: 'auto', md: '0px' }}
							p='18px 22px'
							bg='linear-gradient(126.97deg, rgb(6, 11, 40) 28.26%, rgba(10, 14, 35) 91.2%)'
							borderRadius='20px'
							position='absolute'
							bottom='-5%'>
							<Text fontSize='xs' color='gray.400'>
								0%
							</Text>
							<Flex direction='column' align='center' minW='80px'>
								<Text color='#fff' fontSize='28px' fontWeight='bold'>
									95%
								</Text>
								<Text fontSize='xs' color='gray.400'>
									Based on likes
								</Text>
							</Flex>
							<Text fontSize='xs' color='gray.400'>
								100%
							</Text>
						</Stack>
					</Flex>
				</Card>
			</Grid>

			{walletAddress ? renderConnectedContainer() : renderNotConnectedContainer()}
			
		</Flex>
	);
}
