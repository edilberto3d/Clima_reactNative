import React, { useState } from "react";
import {Alert, Button, Image, Pressable, StyleSheet, Text, TextInput, View,} from "react-native";
import { styles } from "./src/componetes/Estilos";
import Clima from "./src/componetes/clima";


export default function App() {

  return (
    <View style={styles.container}>
      <Body/>
    </View>
  );
}

export const Header = () => {
  return (
    <View style={styles.encabezado}>
      <Text style={styles.textF}>
        New to Expo? <Text style={styles.link}> Sign Up</Text>{" "}
      </Text>
    </View>
  );
};

export const Footer = () => {
  return (
    <View style={styles.pie}>
      <Text style={styles.textF}>
     <Text style={styles.link}> Ediberto hernandez ramirez</Text>
      </Text>
    </View>
  );
};

export const Boton = () => {
  return (
    <Pressable style={styles.boton}>
      <Text style={styles.textoB}>Bienvenido</Text>
    </Pressable>
  );
};

export const Body = () => {
  return (
    <View style={styles.cuerpo}>
      <Clima/>
    </View>
  );
};