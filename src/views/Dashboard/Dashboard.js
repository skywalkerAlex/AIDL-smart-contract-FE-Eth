// Chakra imports
import React, {useState} from 'react';
import {
	Button,
	Flex,
	Grid,
	Icon,
	SimpleGrid,
	Spacer,
	Stat,
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
import {DocumentIcon, WalletIcon} from 'components/Icons/Icons.js';
import DashboardTableRow from 'components/Tables/DashboardTableRow';
import {BsArrowRight, BsArrowClockwise} from 'react-icons/bs';
import {IoCheckmarkDoneCircleSharp} from 'react-icons/io5';
import medusa from 'assets/img/cardimgfree.png';
// React
import {useEffect} from 'react';

// Ethereum imports
import abi from '../../smart_contract/idl.json';
import DsDetailsForm from 'components/DatasetDetails/DatasetForm';
require("dotenv").config();
const ethers=require("ethers");

export default function Dashboard() {
	// ##### Ethereum Connect to Wallet Start #####
	// State
	const getEthereumObject=() => window.ethereum;
	const [walletAddress, setWalletAddress]=useState(null);
	const [totalNumberOfDataset, setTotalNumberOfDataset]=useState(null);
	const [sizeOfDataset, setSizeOfDataset]=useState(null);

	/**
	 * Create a variable here that holds the contract address after you deploy!
	 */
	const contractAddress=process.env.REACT_APP_DATASET_PORTAL_ADDRESS;

	/**
	 * Create a variable here that references the abi content!
	 */
	const contractABI=abi.abi;

	/*
	* All state property to store the dataset details.
	*/
	const [storedDatasetDetails, setStoredDatasetDetails]=useState([{}]);
	const [name, setName]=useState('');
	const [accuracyScore, setAccuracyScore]=useState('');
	const [dataType, setDataType]=useState('');
	const [fileType, setFileType]=useState('');
	const [fileSize, setFileSize]=useState('');
	const [modelList, setModelList]=useState([]);
	const [libraryList, setLibraryList]=useState([]);

	// Actions

	/*
	* Connect to the user's wallet.
	*/
	const connectWallet=async () => {
		try {
			const ethereum=getEthereumObject();
			if(!ethereum) {
				alert(<><h2>we strongly suggest to download the <a href='https://metamask.io/download/' title='Metamask wallet' target="_blank">Metamask wallet</a></h2></>);
				return;
			}

			const accounts=await ethereum.request({
				method: "eth_requestAccounts",
			});

			console.log("Connected", accounts[0]);
			setWalletAddress(accounts[0]);
			getAllDataSets();
		} catch(error) {
			console.error(error);
		}
	};

	const checkIfWalletIsConnected=async () => {
		try {
			const ethereum=getEthereumObject();
			/*
			* First make sure we have access to the Ethereum object.
			*/
			if(!ethereum) {
				console.error("Make sure you have Metamask!");
				alert('Ethereum Wallet not found! Get Metamask to connect 👻');
				return null;
			}

			console.log("We have the Ethereum wallet: ", ethereum);
			const accounts=await ethereum.request({method: "eth_accounts"});
			getTotalNumbers();

			if(accounts.length!==0) {
				const account=accounts[0];
				console.log("Found an authorized account:", account);
				/*
				* Set the user's publicKey in state to be used later!
				*/
				const accounts=await ethereum.request({
					method: "eth_requestAccounts",
				});

				console.log("Connected: ", accounts[0]);
				setWalletAddress(accounts[0]);
				return account;
			} else {
				console.error("No authorized account found");
				// alert('Authorized Account not found! Please use a valid account to connect 👻');
				return null;
			}
		} catch(error) {
			console.error(error);
		}
	};
	// ##### Ethereum Connect to Wallet End #####

	// ##### Rendering Options Start #####
	const renderUser=() => (
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

	const renderWelcomeUser=() => (
		<>
			<Text fontSize='3xl' color='gray.400' fontWeight='bold' >
				Welcome!
			</Text>
			<Text fontSize='4xl' color='#fff' fontWeight='bold' mb='18px' noOfLines={[1, 2, 3]}>
				Here you can validate the dataset, or even better the results of your Neural Network!
			</Text>
			<Text fontSize='xl' color='gray.400' fontWeight='normal' mb='auto'>
				Connect to your favourite Wallet and start validating the dataset! <br />
				We suggest to use the <a href='https://metamask.io/download/' title='Metamask wallet' target="_blank">Metamask wallet</a>
			</Text>
			<Spacer />
			<Flex align='center' >
				<Button
					p='0px'
					variant="ghost"
					onClick={connectWallet}
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
						_hover={{transform: 'translateX(30%)'}}
					/>
				</Button>
			</Flex>
		</>
	);

	/*
	* We want to render this UI when the user hasn't connected
	* their wallet to our app yet.
	*/
	const renderNotConnectedContainer=() => (
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
					my={{sm: '1.5rem', lg: '0px'}}>
					Connect to Wallet
				</Text>
			</Button>
		</>
	);

	const renderConnectedContainer=() => {

		if(storedDatasetDetails.length===0||storedDatasetDetails===undefined||(storedDatasetDetails.length===1&&storedDatasetDetails[0].name==="")) {
			return (
				<>
					<Flex
						background='transparent'
						borderRadius='20px'
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
						<Button
							variant="solid"
							colorScheme='brand'
							onClick={uploadDatasetDetails}
						>
							<Text
								fontSize='2xl'
								color='purple.200'
								fontWeight='bold'
								cursor='pointer'
								transition='all .3s ease'
								my={{sm: '1.5rem', lg: '0px'}}>
								Upload your first Dataset Details
							</Text>
						</Button>

					</Flex>
					<DsDetailsForm
						passName={setName}
						passAccuracyScore={setAccuracyScore}
						passDataType={setDataType}
						passFileType={setFileType}
						passFileSize={setFileSize}
						passModelList={setModelList}
						passLibraryList={setLibraryList}
						passDataDetails={uploadDatasetDetails}
					/>
				</>
			)
		} else {
			return (
				<>
					<DsDetailsForm
						passName={setName}
						passAccuracyScore={setAccuracyScore}
						passDataType={setDataType}
						passFileType={setFileType}
						passFileSize={setFileSize}
						passModelList={setModelList}
						passLibraryList={setLibraryList}
						passDataDetails={uploadDatasetDetails}
					/>
					<Grid templateColumns={{sm: '1fr', md: '1fr', lg: '2fr'}} gap='24px'>
						{/* Projects */}
						<Card p='16px' overflowX={{sm: 'scroll', xl: 'hidden'}}>
							<CardHeader p='12px 0px 28px 0px'>
								<Flex direction='column'>
									<Text fontSize='lg' color='#fff' fontWeight='bold' pb='8px'>
										Data Sets
										<Button
											p='0px'
											variant="no-hover"
											onClick={getAllDataSets}
											colorScheme='brand'
											my={{sm: '1.5rem', lg: '0px'}}>
											<Icon
												as={BsArrowClockwise}
												w='20px'
												h='20px'
												color='#fff'
												fontSize='3xl'
												mx='.3rem'
												cursor='pointer'
												pt='4px'
											/>
										</Button>
									</Text>
									<Flex align='center'>
										<Icon as={IoCheckmarkDoneCircleSharp} color='teal.300' w={4} h={4} pe='3px' />
										<Text fontSize='sm' color='gray.400' fontWeight='normal'>
											<Text fontWeight='bold' as='span'>
												Total {storedDatasetDetails.length}
											</Text>{' '}
											uploaded.
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
											Address
										</Th>
										<Th color='gray.400' fontFamily='Plus Jakarta Display' borderBottomColor='#56577A'>
											Name
										</Th>
										<Th color='gray.400' fontFamily='Plus Jakarta Display' borderBottomColor='#56577A'>
											Data Type
										</Th>
										<Th color='gray.400' fontFamily='Plus Jakarta Display' borderBottomColor='#56577A'>
											Size
										</Th>
										<Th color='gray.400' fontFamily='Plus Jakarta Display' borderBottomColor='#56577A'>
											Libraries Used
										</Th>
										<Th color='gray.400' fontFamily='Plus Jakarta Display' borderBottomColor='#56577A'>
											Models Used
										</Th>
										<Th color='gray.400' fontFamily='Plus Jakarta Display' borderBottomColor='#56577A'>
											Accuracy Score
										</Th>
									</Tr>
								</Thead>
								<Tbody>
									{storedDatasetDetails.map((row, index, arr) => {
										return (
											<DashboardTableRow
												address={row.address}
												name={row.name}
												dataType={row.dataType}
												dataSize={row.size}
												progression={row.accuracyScore}
												librariesUsed={row.librariesUsed}
												modelsUsed={row.modelsUsed}
												lastItem={index===arr.length-1}
											/>
										);
									})}
								</Tbody>
							</Table>
						</Card>
					</Grid>
				</>
			);
		}
	}
	// ##### Rendering Options End #####

	// ##### Connected Ethereum Wallet Actions Start #####
	const uploadDatasetDetails=async () => {
		if(name.length===0) {
			console.log("Not enough Details are given!")
			alert('Not enough Details are given 👻');
			return
		}
		const ethereum=getEthereumObject();

		if(!ethereum) {
			console.error("Make sure you have Metamask!");
			alert('Ethereum Wallet not found! Get Metamask to connect 👻');
			return null;
		}

		let inputValue={
			name: name,
			dataType: dataType,
			accuracyScore: accuracyScore,
			fileType: fileType,
			size: parseInt(fileSize)<1||NaN? 0:parseInt(fileSize),
			modelsUsed: modelList,
			librariesUsed: libraryList,
		}
		console.log('uploadDatasetDetails :', inputValue);
		try {
			const provider=new ethers.providers.Web3Provider(ethereum);
			const signer=provider.getSigner();
			const datasetPortalContract=new ethers.Contract(contractAddress, contractABI, signer);
			console.log('datasetPortalContract :', datasetPortalContract);

			const datasetPortal=await datasetPortalContract.getAllDatasets();
			console.log("Retrieved all Datasets ", datasetPortal);

			/*
			* Execute the actual wave from your smart contract
			*/
			const uploadDataset=await datasetPortalContract.upload_dataset_details(
				inputValue.name,
				inputValue.size,
				inputValue.accuracyScore,
				inputValue.dataType,
				inputValue.fileType,
				inputValue.modelsUsed,
				inputValue.librariesUsed,
				{gasLimit: 800000});
			console.log("Mining...", uploadDataset.hash);

			await uploadDataset.wait();
			console.log("Mined -- ", uploadDataset.hash);
			clearForm();
			getAllDataSets();
			console.log("Dataset Details successfully sent to Blockchain", inputValue)
		} catch(error) {
			console.log("Error sending Dataset Details :", error)
		}

	};

	/*
	* This method gets all Datasets from connected User on the blockchain
	*/
	const getAllDataSets=async () => {
		try {
			const ethereum=getEthereumObject();
			if(ethereum) {
				const provider=new ethers.providers.Web3Provider(ethereum);
				const signer=provider.getSigner();
				const datasetPortalContract=new ethers.Contract(contractAddress, contractABI, signer);

				/*
				 * Call the getAllDataSets method from your Smart Contract
				 */
				const datasetPortal=await datasetPortalContract.getAllDatasets();
				console.log("Retrieved all Datasets [getAllDataSets()] ", datasetPortal);

				/*
				 * We only need address, timestamp, name, size, accuracyScore and dataType in our UI 
				 * so let's pick those out
				 */
				const storedDatasets=datasetPortal.map(dtset => {
					return {
						address: dtset.user_address,
						timestamp: new Date(dtset.timestamp*1000),
						name: dtset.name,
						size: dtset.size,
						accuracyScore: dtset.accuracy_score,
						dataType: dtset.data_type,
						librariesUsed: dtset.libraries_used,
						modelsUsed: dtset.models_used,
					};
				});

				/*
				 * Store our data in React State
				 */
				setStoredDatasetDetails(storedDatasets);
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch(error) {
			console.log(error);
		}
	}
	/*
	* This method gets total number of datasets and total size of datasets from connected User on the blockchain
	*/
	const getTotalNumbers=async () => {
		try {
			const ethereum=getEthereumObject();
			if(ethereum) {
				const provider=new ethers.providers.Web3Provider(ethereum);
				const datasetPortalContract=new ethers.Contract(contractAddress, contractABI, provider);

				let totals=await datasetPortalContract.getTotalNumbers();
				console.log("Retrieved total number of dataset uploaded..."+totals.numberOfDataset);
				console.log("Retrieved total size in MB of dataset uploaded..."+totals.size);
				setTotalNumberOfDataset(totals.numberOfDataset);
				setSizeOfDataset(totals.size);
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch(error) {
			console.log(error);
		}
	}
	const clearForm=() => {
		setName("");
		setAccuracyScore("");
		setDataType("");
		setFileType("");
		setFileSize("");
		setLibraryList("");
		setModelList("");
	}
	// ##### Connected Ethereum Wallet Actions End #####


	/*
	* When our component first mounts, 
	* let's check if we have a connected Wallet
	*/
	// UseEffects
	useEffect(() => {
		const onLoad=async () => {
			await checkIfWalletIsConnected();
		};
		window.addEventListener('load', onLoad);
		return () => window.removeEventListener('load', onLoad);
	}, []);

	/**
	* Listen in for emitter events!
	*/
	useEffect(() => {
		let datasetPortalContract;

		const onNewDataset=(from, timestamp, dataset) => {
			console.log("NewDataset ", from, timestamp, dataset);
			setStoredDatasetDetails(prevState => [
				...prevState,
				{
					address: dataset.user_address,
					timestamp: new Date(dataset.timestamp*1000),
					name: dataset.name,
					size: dataset.size,
					accuracyScore: dataset.accuracy_score,
					dataType: dataset.data_type,
					librariesUsed: dataset.libraries_used,
					modelsUsed: dataset.models_used
				},
			]);
		};

		if(window.ethereum) {
			const provider=new ethers.providers.Web3Provider(getEthereumObject());
			const signer=provider.getSigner();

			datasetPortalContract=new ethers.Contract(contractAddress, contractABI, signer);
			datasetPortalContract.on("NewDataset", onNewDataset);
		}

		return () => {
			if(datasetPortalContract) {
				datasetPortalContract.off("NewDataset", onNewDataset);
			}
		};
	}, []);

	useEffect(() => {

	}, [setAccuracyScore, setDataType, setFileType, setFileSize, setLibraryList, setModelList, setName]);

	return (
		<Flex flexDirection='column' pt={{base: '120px', md: '75px'}}>
			<Grid templateColumns={{sm: '1fr', md: '1fr 1fr', '2xl': '1fr 1fr'}} my='26px' gap='18px'>
				{/* Welcome Card */}
				<Card
					p='0px'
					gridArea={{md: '1 / 1 / 2 / 3', '2xl': 'auto'}}
					bgImage={medusa}
					bgSize='cover'
					bgPosition='50%'>
					<CardBody w='100%' h='100%'>
						<Flex flexDirection={{sm: 'column', lg: 'row'}} w='100%' h='100%'>
							<Flex flexDirection='column' h='100%' p='50px' minW='60%' lineHeight='1.6'>
								{walletAddress? renderUser():renderWelcomeUser()}
							</Flex>
						</Flex>
					</CardBody>
				</Card>
				<Button
					p='0px'
					variant="ghost"
					onClick={getTotalNumbers}
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
						<Spacer />Refresh the numbers
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
				<SimpleGrid columns={{sm: 1, md: 2, xl: 2}} spacing='24px'>
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
											{""+totalNumberOfDataset}
										</StatNumber>
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
											{""+sizeOfDataset+" MB"}
										</StatNumber>
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
			</Grid>

			{walletAddress? renderConnectedContainer():renderNotConnectedContainer()}

		</Flex>
	);
}
