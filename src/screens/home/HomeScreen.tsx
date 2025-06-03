import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {BottomSheetSection} from '../../components/home/BottomSheetSection';
import Geolocation from '@react-native-community/geolocation';
import polyline from '@mapbox/polyline';
import {_styles} from '../../constants/styles';
import {GOOGLE_API_KEY} from '../../../keys.config';
import {theme} from '../../constants/colors';

const delta = 0.003;

const HomeScreen = () => {
  const [mode, setMode] = useState<'location' | 'direction'>('location');

  const [destination, setDestination] = useState(null);
  const [userLocation, setUserLocation] = useState<{
    heading: number;
    latitude: number;
    longitude: number;
  }>(null);
  const [coords, setCoords] = useState([]);
  const [info, setInfo] = useState({distance: '', duration: ''});

  const mapRef = useRef(null);

  const fetchDirections = async (origin, dest) => {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${dest.latitude},${dest.longitude}&key=${GOOGLE_API_KEY}`;

    const res = await fetch(url);
    const json = await res.json();

    if (json.routes.length) {
      const route = json.routes[0];
      const points = polyline
        .decode(route.overview_polyline.points)
        .map(([lat, lng]) => ({
          latitude: lat,
          longitude: lng,
        }));
      setCoords(points);
      const leg = route.legs[0];
      setInfo({distance: leg.distance.text, duration: leg.duration.text});
    }
  };

  const centerMap = () => {
    if (mode === 'location' && destination) {
      mapRef.current?.animateToRegion(
        {
          latitude: destination.latitude,
          longitude: destination.longitude,
          latitudeDelta: delta,
          longitudeDelta: delta,
        },
        1000,
      );
    } else if (userLocation) {
      mapRef.current?.animateToRegion(
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: delta,
          longitudeDelta: delta,
        },
        1000,
      );
    }
  };

  useEffect(() => {
    Geolocation.getCurrentPosition(
      pos => {
        const {latitude, longitude} = pos.coords;
        setUserLocation({latitude, longitude});
      },
      err => {
        console.error(err);
      },
      {enableHighAccuracy: true, distanceFilter: 10},
    );
  }, []);

  useEffect(() => {
    if (userLocation && destination) {
      fetchDirections(userLocation, destination);
    }
  }, [userLocation, destination]);

  useEffect(() => {
    centerMap();
  }, [mode, destination, userLocation]);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {!userLocation && (
        <View style={{flex: 1, ..._styles.allCenter}}>
          <Text>Loading map...</Text>
        </View>
      )}
      {userLocation && (
        <>
          <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFillObject}
            region={{
              ...userLocation,
              latitudeDelta: delta,
              longitudeDelta: delta,
            }}
            loadingEnabled
            showsBuildings>
            {userLocation && (
              <Marker coordinate={userLocation} title="My Location" />
            )}
            {destination && (
              <Marker coordinate={destination} pinColor={theme.primary} />
            )}
            {mode == 'direction' && destination && (
              <>
                {coords.length > 0 && (
                  <Polyline
                    coordinates={coords}
                    strokeWidth={6}
                    strokeColor={theme.primary}
                  />
                )}
              </>
            )}
          </MapView>
        </>
      )}
      <BottomSheetSection
        mode={mode}
        selectedLocation={destination}
        setDestination={data => {
          setDestination(data);
        }}
        locationInfo={info}
        setMode={setMode}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
