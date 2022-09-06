
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { VStack, Text, HStack, useTheme, ScrollView } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

import { Header } from '../componentes/Header';
import { Loading } from '../componentes/Loading';
import { Button } from '../componentes/Button';
import { CardDetails } from '../componentes/CardDetails';

import { OrderProps } from '../componentes/Order';
import { OrderFirestoreDTO } from '../DTOs/OderFirestoreDTO';
import { dateFormat } from '../utils/firestoreDateFormats';
import { CircleWavyCheck, Heart, Hourglass, Clipboard } from 'phosphor-react-native';
import { Input } from '../componentes/Input';

type RouteParams = {
  orderId: string;
}

type OrderDetails = OrderProps & {
  frequencia: string;
  pressao: string;
  saturacao: string;
  temperatura: string;
  problema: string;
  when: string;
  atendimento: string;
  closed: string;
}

export function Details() {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [atendimento, setAtendimento] = useState('');
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);
  const route = useRoute();
  const navigation = useNavigation();
  const { orderId } = route.params as RouteParams; 

  function handleOrderClose(){
    if(!atendimento){
      return Alert.alert('Atendimento', 'Descrever  ')
    }
    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .update({
        status: 'close',
        atendimento,
        closed_at: firestore.FieldValue.serverTimestamp()
      })
      .then(()=>{
        Alert.alert('Atendimento', 'Paciente Liberado')
        navigation.goBack();
      })
      .catch((error)=>{
        console.log(error);
        Alert.alert('Atendimento', 'Não foi possivel finalizar o atendimento')
      })

  }

  useEffect(()=>{
    firestore()
    .collection<OrderFirestoreDTO>('ATENDIMENTO')
    .doc(orderId)
    .get()
    .then((doc) => {
      const {
        cpf,
        paciente,
        nmPaciente, 
        created_at, 
        frequencia,  
        nome, 
        pressao,  
        problema, 
        risco, 
        saturacao,  
        status, 
        temperatura, 
        closed_at, 
        atendimento 
      } = doc.data();
      const closed = closed_at ? dateFormat(closed_at) : null;
      setOrder({
        id: doc.id, //local
        paciente, 
        nome, 
        nmPaciente, 
        risco,
        frequencia,
        pressao,
        saturacao,
        temperatura, 
        problema,
        when: dateFormat(created_at),//local
        status,//Externo
        atendimento, //Local
        closed //Local
      });

      setIsLoading(false);
    })
  },[])

  if(isLoading){
    return <Loading/>
  }

  return (
    <VStack flex={1} bg="#565656">
        <Header title="Detalhe Atendimento"/>
        <HStack bg="gray.500" justifyContent="center" p={4}>
          {
            order.status === 'close'
            ? <CircleWavyCheck size={22} color={colors.green[300]}/>
            : <Hourglass size={22} color={colors.green[300]}/>
          }

          <Text
            fontSize="sm"
            color={order.status === 'close' ? colors.green[300] : colors.secondary[700]}
            ml={2}
            textTransform="uppercase"
          >
            {order.status === 'close' ? 'Liberado' : 'Aguardando'}
          </Text>
        </HStack>
        <ScrollView
          mx={5}
          showsVerticalScrollIndicator={false}
        >
          <CardDetails 
            title={order.nome}
            pressao={'Freq: ' + order.frequencia}
            saturacao={'Pressão: ' + order.pressao}
            frequencia={'Sat: ' + order.saturacao}
            temperatura={'Temp: ' + order.temperatura}
            icon={Heart}
            footer={'Entrada: ' + order.when}
          />
          <CardDetails 
            title='Motivo entrada'
            description={'Reclamação: ' + order.problema}
            icon={Clipboard}
          />
          <CardDetails 
            title='Atendimento'
            description={order.atendimento}
            footer={order.closed && 'Alta em: ' + order.closed}
            icon={CircleWavyCheck}
          >
            {
              order.status === 'open' &&
              <Input 
                bg="gray.600"
                color={colors.light[100]}
                placeholder='Descrição:'
                placeholderTextColor={colors.light[100]}
                onChangeText={setAtendimento}
                textAlignVertical="top"
                multiline
                h={24}
              />
              
            }
            
          </CardDetails>
        </ScrollView>
        {
          order.status === 'open' &&
          <Button
            title='Finalizar atendimento'
            m={5}
            onPress={handleOrderClose}
          />
        }

    </VStack>
  );
}