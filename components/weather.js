import { StyleSheet, Text, View, ScrollView, ActivityIndicator,Image } from 'react-native';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { weatherConditions } from '../utils/WeatherConditions';
import {Screen} from '../Dimension';
import moment from 'moment/moment';

function DailyWeather() {
  const [location, setLocation] = useState("");
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
    //console.log(result.hourly);
    const temp = result.daily.apparent_temperature_max;
    const weather = result.daily.weathercode;
    const date = result.daily.time;

    const day = temp.map((temp,index) => {
      const desc = weather[index];
      const dates = date[index];
      return {temp,desc,dates};
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
         //pagingEnabled
         contentContainerStyle={styles.weather}>
          <Text style={{color:'white',fontSize:80}}>Daily weather</Text>
        {days.length === 0 ? (
          <View style={styles.indicate}>
            <ActivityIndicator size="large"></ActivityIndicator>
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <Text style={{fontSize: 20, color: 'white', margin:'auto'}}>{moment(day.dates).format('DD/MM')}</Text>
              <Image source={{uri: weatherConditions[day.desc].icon}} style={{width:60,height:60, marginLeft:10,}}/>
              <Text style={styles.temp}>{day.temp}º</Text>
              <Text style={styles.description}>{weatherConditions[day.desc].title}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
    );
  }

export default DailyWeather; 
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    margin:3,
    justifyContent: 'flex-start',
  },
  city: {
    margin:5,
    alignItems:'center',
  },
  cityname: {
    fontSize: 50,
    height:70,
    paddingTop: 20,
    color:'black',
  },
  weather: {
    backgroundColor: '#87ceeb',
    opacity:0.7,
    borderRadius:20,
  },
  text: {
    color: 'white',
  },
  day: {
    flex: 0.6,
    width: Screen.width,
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth:0.3,
    borderTopColor:'#dcdcdc',
    borderBottomWidth:0,
    borderLeftWidth:0,
    borderRightWidth:0,
    
  },
  indicate: {
    width: Screen.width,
    alignItems: 'center',
  },
  temp: {
    fontSize: 20,
    color: 'white',
    marginLeft:20,
  },
  description: {
    fontSize: 20,
    color: 'white',
    marginLeft: 20,
  },
});