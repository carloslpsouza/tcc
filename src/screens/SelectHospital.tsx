import { useState, useEffect } from 'react';

import  firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { HStack, IconButton, VStack, useTheme, Text, Heading, FlatList, Center } from 'native-base';
import { SignOut } from 'phosphor-react-native';
import { ChatTeardropText } from 'phosphor-react-native';

import Logo from '../assets/Screening.svg';
import { Hospital, HospitalProps } from '../componentes/Hospital'

import { Loading } from '../componentes/Loading';
import { Out } from '../utils/Out';

type RouteParams = {
    hospitalId: string;
  }

export function SelectHospital() {
    const [isLoading, setIsLoading] = useState(true);
    const { colors } = useTheme();
    const [hospitais, setHospitais] = useState<HospitalProps[]>([]);
    const [qtdeRegistros, setQtderegistros] = useState(0);
    
    
    const handleLogout = Out();
    
    const navigation = useNavigation();
    
    function handleSetaHospital(hospitalId: string){
        console.log(hospitalId);
        navigation.navigate('home', { hospitalId })
    }


  useEffect(()=>{
    setIsLoading(true);
    const subscribe = firestore()
    .collection('HOSPITAL')
    //.where('status', '==', 'valor')
    .onSnapshot( snapshot =>{
        const data = snapshot.docs.map(doc =>{
            const { nm_hospital, latitude, longitude, bairro, cidade, lotacao } = doc.data();

            return{
                id: doc.id,
                nm_hospital,
                latitude,
                longitude,
                bairro,
                cidade,
                lotacao
            }
        });
        setHospitais(data);
        setIsLoading(false);
        setQtderegistros(data.length);
    });
    return subscribe;
  },[]);

  return (
    <VStack flex={1} pb={1} bg="#565656">
        <HStack w="full" justifyContent="space-between" alignItems="center" bg="#FFFAF0" pt={1} pb={1} px={2}>
            
            <Logo />
            <IconButton 
                icon={ <SignOut size={26} color={colors.black}/> }
                onPress={handleLogout}
            />
        </HStack>

        <VStack flex={1} px={6}>
            <HStack w="full" mt={8} mb={4} justifyContent="space-between" alignItems="center">
                <Heading fontSize={16} color="#fff">
                    Hospitais Disponíveis
                </Heading>
                <Text fontSize={16} color="#fff">
                    {qtdeRegistros}
                </Text>
            </HStack>

            <HStack space={3} mb={8}>
                

            </HStack>
            {
            isLoading ? <Loading/>:
                <FlatList 
                    data={hospitais}
                    keyExtractor={ item => item.id}
                    renderItem={({ item }) => <Hospital dataHospital={item} onPress={() => handleSetaHospital(item.id)}/>}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{paddingBottom:50}}
                    ListEmptyComponent={() => (
                        <Center>
                            <ChatTeardropText color={colors.gray[700]} size={40}/>
                        </Center>
                    )}
                />
            }

        </VStack>

        

    </VStack>
  );
}