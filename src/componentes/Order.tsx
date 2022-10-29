import { Box, Circle, HStack, Text, useTheme, VStack, Pressable, IPressableProps, Skeleton } from 'native-base';
import { ClockAfternoon, Hourglass, CircleWavyCheck, FirstAid, Truck, Buildings } from 'phosphor-react-native';
import { especColors } from "../styles/especColors"
import { msg } from "../utils/mensagensPadrao"

export type OrderProps = {
  id: string,
  id_at?: string,
  paciente: string,
  nome: string,
  nmPaciente: string,
  cpf?: string,
  risco: number,
  when: string,
  vtr?: string,
  noHospital?: number,
  status: 'open' | 'close',
}

type Props = IPressableProps & {
  data: OrderProps;
}

export function Order({ data, ...rest }: Props) {
  const { colors } = useTheme();
  const statusColor = (data.status === 'open' ? colors.gray[200] : colors.gray[100])
  const risco = (par: number) => {
    if (par === 1) { return { 'cor': especColors.risco.naoUrgencia, 'msg': msg.risco.naoUrgencia }; }
    if (par === 2) { return { 'cor': especColors.risco.poucaUrgencia, 'msg': msg.risco.poucaUrgencia }; }
    if (par === 3) { return { 'cor': especColors.risco.urgencia, 'msg': msg.risco.urgencia }; }
    if (par === 4) { return { 'cor': especColors.risco.muitaUrgencia, 'msg': msg.risco.muitaUrgencia }; }
    if (par === 5) { return { 'cor': especColors.risco.emergencia, 'msg': msg.risco.emergencia }; }
  }


  return (
    <Pressable {...rest}>
      <HStack
        bg="#FFFAF0"
        mb={4}
        alignItems="center"
        justifyContent="space-between"
        rounded="sm"
        overflow="hidden"
      >
        {
          data.noHospital && data.risco >= 3 ? 
          <Skeleton h={'full'} maxH={'149'} w={4} speed={6} startColor={risco(data.risco).cor}/> : 
          <Box h="full" w={4} bg={risco(data.risco).cor} />
        } 
        <VStack flex={1} my={5} ml={5}>
          {
            data.vtr &&
            <Text color={especColors.risco.emergencia} fontSize="md">
              Origem: {data.vtr}
            </Text>
          }
          <Text color="black" fontSize="md">
            Nome: {data.nmPaciente}
          </Text>
          <Text color="black" fontSize="md">
            CPF Parcial: {data.cpf.substring(0, 3)}
          </Text>

          <HStack alignItems="center">
            <ClockAfternoon size={15} color={colors.gray[700]} />
            <Text color="gray.700" fontSize="xs" ml={1}>
              {data.when}
            </Text>
          </HStack>
          <HStack alignItems="center">
            <FirstAid size={15} color={colors.gray[700]} />
            <Text color="gray.700" fontSize="xs" ml={1}>
              {risco(data.risco).msg}
            </Text>
          </HStack>
        </VStack>

        {
          data.vtr ?
            <Circle bg="gray.700" h={12} w={12} mr={5}>
              {
                data.status === 'open'
                  ? <Truck size={40} color={statusColor} />
                  : <Truck size={40} color={statusColor} />
              }
            </Circle> :
            <Circle bg="gray.700" h={12} w={12} mr={5}>
              {
                data.status === 'open'
                  ? <Buildings size={24} color={statusColor} />
                  : <Buildings size={24} color={statusColor} />
              }
            </Circle>
        }

      </HStack>
    </Pressable>
  );
}