import { Alert, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Heading, HStack, IconButton, KeyboardAvoidingView, useTheme, VStack, Text, FormControl } from 'native-base';
import { SignOut } from 'phosphor-react-native';
import { useNavigation, useRoute } from '@react-navigation/native'
import { Hourglass } from 'phosphor-react-native';
import { Input } from '../componentes/Input';
import { Button } from '../componentes/Button';
import firestore from '@react-native-firebase/firestore';
import Logo from '../assets/Screening.svg';
import { Out } from '../utils/Out';

type RouteParams = { // Essa tipagem foi criada apenas para que o auto complite pudesse achar esse paramentro (Testar sem)
    hospitalId: string; //Erro de tipo não pode ser und (Consultar navigation.d.ts)
}

export function Register() {
    const [isLoading, setIsLoading] = useState(false);
    
    const [nmPaciente, setnmPaciente] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');

    const [pressao, setPressao] = useState('');
    const [frequencia, setFrequencia] = useState('');
    const [saturacao, setSaturacao] = useState('');
    const [temperatura, setTemperatura] = useState('');
    const [problema, setProblema] = useState('');
    const [risco, setRisco] = useState('G');
    const [status, setStatus] = useState('open');
    const [ocultaDados, setOcDados] = useState(false);

    const navigation = useNavigation();
    const route = useRoute();
    const { hospitalId } = route.params as RouteParams; // o route.params não sabe qual é então foi criada a tipagem acima

    const handleLogout = Out();
    const { colors } = useTheme();

    function sinaisVitais(idPaciente: string){
        if(!pressao || !frequencia || !saturacao || !temperatura){
            return Alert.alert('Registrar', 'Verifique os campos e tente novamente');
        }        
        setIsLoading(true);        
        firestore()
        .collection('ATENDIMENTO')
        .add({
            hospital: hospitalId,
            paciente: idPaciente,
            pressao,
            frequencia,
            saturacao,
            temperatura,
            problema,
            risco,
            status,
            created_at: firestore.FieldValue.serverTimestamp()           
        })
        .then(()=>{
            Alert.alert('Entrada', 'Registrado com sucesso!');
            navigation.goBack();
        })
        .catch((error) => {
            console.log(error);
            setIsLoading(false);
            return Alert.alert('Registrar', 'Não foi possivel gravar o registro.');
        });
    }

    function dadosPessoais(){
        if(!nmPaciente || !cpf ){
            return Alert.alert('Registrar', 'Verifique os campos e tente novamente');
        }        
        setIsLoading(true);        
        firestore()
        .collection('PACIENTE')
        .add({
            nmPaciente,
            cpf,
            telefone,                       
        })
        .then((docRef)=>{
            sinaisVitais(docRef.id)
            //Alert.alert('Entrada', 'Registrado com sucesso!');
            //console.log("Last Insert ID: "+ docRef.id);            
            //navigation.goBack();
        })
        .catch((error) => {
            console.log(error);
            setIsLoading(false);
            return Alert.alert('Registrar', 'Não foi possivel gravar o registro.');
        });
    }

    async function handleNewOrderRegister(){
        dadosPessoais()

    }
    function exibeDadosTriagem(){
        return(
            <VStack px={6}>
                <Input onChangeText={setPressao} placeholder="Pressão" mt={4} keyboardType='numbers-and-punctuation' returnKeyType='done'/>
                <Input onChangeText={setFrequencia} placeholder="Frequência" mt={4} keyboardType='number-pad' returnKeyType='done'/>
                <Input onChangeText={setSaturacao} placeholder="Saturação" mt={4} keyboardType='number-pad' returnKeyType='done'/>
                <Input onChangeText={setTemperatura} placeholder="Temperatura" mt={4} keyboardType='decimal-pad' returnKeyType='done'/>
                <Input
                    onChangeText={setProblema} 
                    placeholder="Descrição do Problema"
                    flex={1}
                    mt={5}
                    textAlignVertical="top"
                    multiline
                    h={24}  
                />
                <Button 
                    title="Cadastrar"
                    mt={5}
                    isLoading={isLoading}
                    onPress={handleNewOrderRegister}
                />
            </VStack>
        )
    }

    
    function ocultaDadosPessoais(){
        if(!nmPaciente || !cpf){
            return Alert.alert('Registrar', 'Verifique os campos e tente novamente');
        }
        setOcDados(true);
    }

    function exibeDadosPessoais(){
           
        return(
            <VStack px={6}>
                <FormControl isRequired>
                <Input isRequired onChangeText={setnmPaciente} placeholder="Nome" mt={4} returnKeyType='done'/>
                <Input onChangeText={setCpf} placeholder="cpf" mt={4} keyboardType='number-pad' returnKeyType='done'/>
                <Input onChangeText={setTelefone} placeholder="(xx)Tele-fone" mt={4} keyboardType='phone-pad' returnKeyType='done'/>
                <Button 
                    title="Próximo"
                    mt={5}
                    isLoading={isLoading}
                    onPress={ocultaDadosPessoais}
                />
                </FormControl>
            </VStack>
        )
        
    }

    useEffect(()=>{
        exibeDadosPessoais();
        console.log(ocultaDados);
        console.log(hospitalId);
        
    },[ocultaDados])

  return (
        <KeyboardAvoidingView
        behavior="height"
        keyboardVerticalOffset={80}
        style={{ flex: 1 }} 
        bg="#565656"
    >
        <ScrollView>
            <HStack 
                w="full" 
                justifyContent="space-between" 
                alignItems="center" 
                bg="#FFFAF0" 
                pt={1} 
                pb={1} 
                px={2}
            >
            <Logo />
            <IconButton 
                icon={ <SignOut size={26} color={colors.black}/> }
                onPress={handleLogout}
            />
            </HStack>

            <HStack bg="gray.500" justifyContent="center" p={4}>
                <Hourglass size={22} color={colors.green[300]}/>
                <Text
                    fontSize="sm"
                    ml={2}
                    textTransform="uppercase"
                    color = {colors.green[300]}
                >
                    Novo Paciente
                </Text>
            </HStack>
            
            {ocultaDados ? exibeDadosTriagem() : exibeDadosPessoais()}

            
        </ScrollView> 
    </KeyboardAvoidingView>
    
  );
}