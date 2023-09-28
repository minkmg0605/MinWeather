import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { weatherConditions } from './utils/WeatherConditions';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

export default function App() {
  const [location, setLocation] = useState("loading...");
  const [ok, setOk] = useState(true);
  const [days, setDays] = useState([]);
  

  const ask = async() => {
    let { status }  = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
    setOk(false);
    }

    let {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync({latitude,longitude},{useGoogleMaps:false});
    setLocation(location[0].city);

    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,apparent_temperature_max&timezone=auto`)
    const result = await res.json();

    const temp = result.daily.apparent_temperature_max;
    const weather = result.daily.weathercode;

    const day = temp.map((temp,index) => {
      const desc = weather[index];
      return {temp,desc};
    });

    setDays(day);
  }
  useEffect(() => {
    ask();
  },[])

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityname}>{location}</Text>
      </View>
      <ScrollView 
         horizontal
         pagingEnabled
         contentContainerStyle={styles.weather}>
        {days.length === 0 ? (
          <View style={styles.indicate}>
            <ActivityIndicator size="large"></ActivityIndicator>
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <Text style={styles.temp}>{day.temp}º</Text>
              <Text style={styles.description}>{weatherConditions[day.desc].title}</Text>
            </View>
          ))
        )}
        
      </ScrollView>
    </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  city: {
    flex: 0.6,
    justifyContent: 'flex-end',
  },
  cityname: {
    fontSize: 50,
  },
  weather: {
    backgroundColor: 'black',
  },
  text: {
    color: 'white',
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  indicate: {
    marginTop: 140,
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  temp: {
    marginTop: 50,
    fontSize: 148,
    color: 'white',
  },
  description: {
    fontSize: 70,
    marginTop: -25,
    color: 'white',
  },
});