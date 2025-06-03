import {Button, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useMemo, useRef} from 'react';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {SearchInput} from './SearchInput';
import {Icon} from '../Icon';
import {SelectedLocation} from '../../types/location.types';
import {_styles} from '../../constants/styles';

export const BottomSheetSection = ({
  selectedLocation,
  mode,
  setDestination,
  locationInfo,
  setMode,
}: {
  selectedLocation: SelectedLocation;
  setDestination: (val: any) => void;
  mode: 'location' | 'direction';
  locationInfo: {distance: number; duration: number};
  setMode: (val: 'location' | 'direction') => void;
}) => {
  const sheetRef = useRef<BottomSheet>(null);

  const searchView = useMemo(() => {
    return (
      <SearchInput
        onPlaceSelected={data => {
          console.log('selected from sheet: ', data);
          setDestination(data);
          sheetRef.current?.collapse();
        }}
      />
    );
  }, [selectedLocation, mode, setDestination]);

  const locationView = useMemo(() => {
    if (!selectedLocation || !locationInfo || !selectedLocation.name)
      return null;
    return (
      <View style={{padding: 20, gap: 10}}>
        <Pressable
          style={{alignSelf: 'flex-end'}}
          onPress={() => setDestination(null)}>
          <Icon name="close" size={20} color="#555" />
        </Pressable>

        <Text style={{fontSize: 16, fontWeight: '600'}}>
          {selectedLocation.name}
        </Text>

        <>
          <Text style={{fontSize: 22, fontWeight: '700'}}>
            {locationInfo.duration}{' '}
            <Text style={{fontSize: 14, fontWeight: '500'}}>
              ({locationInfo.distance})
            </Text>
          </Text>
        </>

        <View style={{..._styles.flexRow, gap: 15, marginTop: 20}}>
          <Button
            title="Location"
            color={mode == 'location' ? '#007AFF' : '#999'}
            onPress={() => {
              if (mode !== 'location') setMode('location');
            }}
          />
          <Button
            title="Direction"
            color={mode == 'direction' ? '#007AFF' : '#999'}
            onPress={() => {
              if (mode !== 'direction') setMode('direction');
            }}
          />
        </View>
      </View>
    );
  }, [selectedLocation, locationInfo, mode, setDestination]);

  return (
    <BottomSheet
      snapPoints={['30%', '90%']}
      index={0}
      ref={sheetRef}
      animateOnMount={false}
      enableDynamicSizing={false}>
      <BottomSheetView>
        {!selectedLocation && searchView}
        {!!selectedLocation && locationView}
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({});
