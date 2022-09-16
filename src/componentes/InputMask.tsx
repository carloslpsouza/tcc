import React from "react";
import { Input } from '../componentes/Input';
import { Text, TextInput, StyleSheet, TextInputProps } from "react-native";

import { maskCpf, maskPhone, maskPressao, maskTemperatura } from "../utils/masks";

interface InputProps extends TextInputProps {
  mask: "cpf" | "phone" | "pressao" | "temperatura";
  inputMaskChange: any;
}

const InputMask: React.FC<InputProps> = ({ mask, inputMaskChange, ...rest }) => {
  function handleChange(text: string) {
    if (mask === "cpf") {
      const value = maskCpf(text);
      inputMaskChange(value);
    }
    if (mask === "phone") {
      const value = maskPhone(text);
      inputMaskChange(value);
    }
    if (mask === "pressao") {
      const value = maskPressao(text);
      inputMaskChange(value);
    }
    if (mask === "temperatura") {
        const value = maskTemperatura(text);
        inputMaskChange(value);
      }
  }

  return (
    <>
      <Input
        mt={4}
        onChangeText={(text) => handleChange(text)}
        {...rest}
      />
    </>
  );
};

export default InputMask;
