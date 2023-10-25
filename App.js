import {View, Text} from 'react-native';
import DailyWeather from './components/weather';
import Getlocate from './components/location';



export default function App() {
//const {latitude,longitude} = Getlocate();
return(
  <View style={{flex:1}}>
    <Getlocate></Getlocate>
    <DailyWeather></DailyWeather>
  </View>
  );
}