import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {useMutation, useQuery} from '@tanstack/react-query';
import React, {useEffect, useState} from 'react';
import {TextInput, FlatList, Text, TouchableOpacity, View} from 'react-native';
import {useDebounce} from 'use-debounce';
import {SearchBar} from './SearchBar';
import {GOOGLE_API_KEY} from '../../../keys.config';

export const SearchInput = ({
  onPlaceSelected,
}: {
  onPlaceSelected: (val: {
    name: string;
    latitude: string;
    longitude: string;
  }) => void;
}) => {
  const [query, setQuery] = useState('');
  const [debounceValue] = useDebounce(query, 1000);
  const [results, setResults] = useState<
    {place_id: string; description: string}[]
  >([]);

  const {data, isLoading, isLoadingError} = useQuery({
    queryKey: ['locations-search', debounceValue],
    queryFn: async () => {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${GOOGLE_API_KEY}&input=${debounceValue}&limit=3`;
      const res = await fetch(url);
      return res.json();
    },
    enabled: !!debounceValue.trim() && debounceValue.length > 2,
  });

  useEffect(() => {
    if (data && data.predictions) {
      setResults(data.predictions);
    }
  }, [data]);

  const onSelect = (item: any) => {
    const location = item.result.geometry.location;
    onPlaceSelected({
      name: item.result.name,
      latitude: location.lat,
      longitude: location.lng,
    });
  };

  const {mutateAsync, isPending} = useMutation({
    mutationFn: async placeId => {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${GOOGLE_API_KEY}`;
      const res = await fetch(url);
      const json = await res.json();
      return json;
    },
    onSuccess(data, variables, context) {
      console.log('selected: ', data);

      onSelect(data);
      setResults([]);
      setQuery('');
    },
    onError(error, variables, context) {
      console.log(error);
    },
  });

  return (
    <>
      <SearchBar onChangeText={setQuery} />
      <BottomSheetFlatList
        data={results}
        contentContainerStyle={{paddingHorizontal: 20, gap: 20}}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => mutateAsync(item.place_id)}
            disabled={isPending}>
            <Text style={{padding: 10}}>{item.description}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.place_id}
      />
    </>
  );
};
