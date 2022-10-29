import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';
import { dateFormat } from './firestoreDateFormats';

export function atualizaDados(COLLECTION: string, IDDOC: string, DATA: any, SOLICITANTE?: string, MSG?: string) {
    console.log("Parametros: " + IDDOC, SOLICITANTE, DATA);
  
    return new Promise((resolve, reject) => {
      if (!DATA) {
        return Alert.alert(MSG, 'Verifique os campos e tente novamente');
      }
      firestore().collection(COLLECTION).doc(IDDOC)
        .update(
          DATA
        )
        .then(() => {
          console.log(SOLICITANTE + " - Update com sucesso! ");
          resolve(true);
        })
        .catch((error) => {
          reject(SOLICITANTE + " - Falha na atualização: " + error);
        });
    })
  }