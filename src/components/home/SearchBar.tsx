import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import {theme} from '../../constants/colors';

export const SearchBar = ({
  onChangeText,
}: {
  onChangeText: (val: string) => void;
}) => {
  return (
    <View style={{padding: 20}}>
      <TextInput
        placeholder="Search location..."
        style={styles.input}
        placeholderTextColor={'#555'}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 45,
    borderRadius: 50,
    paddingHorizontal: 15,
    backgroundColor: theme.card,
    color: theme.textPrimary,
  },
});
