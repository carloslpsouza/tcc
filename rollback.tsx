import { useState, useEffect } from 'react';

import firestore from '@react-native-firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HStack, IconButton, VStack, useTheme, Text, Heading, FlatList, Center } from 'native-base';
import { SignOut } from 'phosphor-react-native';

import { dateFormat } from '../utils/firestoreDateFormats'

import Logo from '../assets/Screening.svg';
import { Filter } from '../componentes/Filter';
import { Button } from '../componentes/Button';
import { Order, OrderProps } from '../componentes/Order'

import { Loading } from '../componentes/Loading';
import { Out } from '../utils/Out';

type RouteParams = { // Essa tipagem foi criada apenas para que o auto complite pudesse achar esse paramentro (Testar sem)
    hospitalId: string; //Erro de tipo não pode ser und (Consultar navigation.d.ts)
}

export function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [statusSelected, setStatusSelected] = useState<'open' | 'close'>('open');
    const { colors } = useTheme();
    const [orders, setOrders] = useState<OrderProps[]>([]);
    const [qtdeRegistros, setQtderegistros] = useState(0);
    const [pacientes, setPacientes] = useState([])
    const [atendimentos, setAtendimentos] = useState([])

    const navigation = useNavigation();
    const route = useRoute();
    const { hospitalId } = route.params as RouteParams; // o route.params não sabe qual é então foi criada a tipagem acima


    const handleLogout = Out();

    function handleNewOrder() {
        navigation.navigate('new')
    }

    function handleOpenDetails(orderId: string) {
        navigation.navigate('details', { orderId })
    }

     function associaNome(){
        let arrTempAtend = [];
         atendimentos.map((atend)=>{
          pacientes.map((pac)=>{
            if(atend.paciente == pac.id){
              let temp = ({...atend, ...pac})
              arrTempAtend.push(temp)
              //console.log(arrTempAtend)
            }
          })
        })
        setOrders(arrTempAtend);
        setIsLoading(false); 
      }

    const db = firestore()
    function getPacientes(){
        const pacient = db.collection('PACIENTE')
        //.where('hospital', '==', hospitalId)
        .onSnapshot( snapshot =>{
            const data = snapshot.docs.map(doc =>{
                const { nmPaciente } = doc.data();
    
                return{
                    id: doc.id,
                    nmPaciente
                }
            });
            setPacientes(data);
            //setIsLoading(false);
            setQtderegistros(data.length);
        });
        return pacient;

    }

    function getAtendimentos(){
        const atendim = db.collection('ATENDIMENTO')
        .where('hospital', '==', hospitalId)
        .where('status', '==', statusSelected)
        .onSnapshot( snapshot =>{
            const data = snapshot.docs.map(doc =>{
                const { status, paciente, created_at } = doc.data();
    
                return{
                    id: doc.id,
                    paciente,
                    status,
                    when: dateFormat(created_at)
                }
            });
            setAtendimentos(data);
            console.log(statusSelected); 
            //setIsLoading(false);
            setQtderegistros(data.length);
        });
        return atendim;
    }

    useEffect(()=>{
        setIsLoading(true);
        getAtendimentos()
        getPacientes()
        associaNome()
        //console.log(orders);
        //console.log(pacientes);
              
      },[statusSelected]);

    return (
        <VStack flex={1} pb={1} bg="#565656">
            <HStack w="full" justifyContent="space-between" alignItems="center" bg="#FFFAF0" pt={1} pb={1} px={2}>

                <Logo />
                <IconButton
                    icon={<SignOut size={26} color={colors.black} />}
                    onPress={handleLogout}
                />
            </HStack>

            <VStack flex={1} px={6}>
                <HStack w="full" mt={8} mb={4} justifyContent="space-between" alignItems="center">
                    <Heading fontSize={16} color="#fff">
                        Fila de atendimento
                    </Heading>
                    <Text fontSize={16} color="#fff">
                        {qtdeRegistros}
                    </Text>
                </HStack>

                <HStack space={3} mb={8}>
                    < Filter
                        type="open"
                        title="Aguardando"
                        onPress={() => setStatusSelected('open')}
                        isActive={statusSelected === 'open'}
                    />

                    < Filter
                        type="closed"
                        title="finalizado"
                        onPress={() => setStatusSelected('close')}
                        isActive={statusSelected === 'close'}
                    />

                </HStack>
                {
                    isLoading ? <Loading /> :
                        <FlatList
                            data={orders}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => <Order data={item} onPress={() => handleOpenDetails(item.id)} />}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 50 }}
                            ListEmptyComponent={() => (
                                <Center>
                                    <Text color="#fff" fontSize="xl" mt={6} textAlign="center">
                                        0 Pacientes {'\n'}
                                        {statusSelected === 'open' ? 'aguardando atendimento' : 'liberados'}
                                    </Text>
                                </Center>
                            )}
                        />
                }

                <Button title="Novo Paciente" mb={5} onPress={handleNewOrder} />
            </VStack>

        </VStack>
    );
}