import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';
import { dateFormat } from './firestoreDateFormats';

export function getDado(COLLECTION: string, IDDOC: string, SOLICITANTE?: string) {
    console.log("Parametros: " +COLLECTION +", "+ IDDOC +", "+ SOLICITANTE);
  
    return new Promise((resolve, reject) => {
  
      const docRef = firestore().collection(COLLECTION).doc(IDDOC);
      docRef.get().then((doc) => {
        if (doc.exists) {
          let dt = doc.data();
          resolve(dt);
        } else {          
          reject(console.log(SOLICITANTE + ": Documento não encontrado"));
        }
      }).catch((error) => {
        console.log(SOLICITANTE + ": Erro buscando Documento:", error);
      });
  
    })
  }