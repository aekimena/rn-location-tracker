import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import FAIcon from 'react-native-vector-icons/Ionicons';

export const Icon = ({
  name,
  size,
  color,
}: {
  name: string;
  size: number;
  color: string;
}) => {
  return <FAIcon name={name} color={color} size={size} />;
};

const styles = StyleSheet.create({});
