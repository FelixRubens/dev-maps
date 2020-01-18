import React, {useEffect, useState } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native'
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import {MaterialIcons} from '@expo/vector-icons';
import api from '../services/api';



function Main({navigation}){
    const [devs, setDevs] = useState([])
    const [currentPosition, setCurrentPosition] = useState(null)
    const [techs, setTechs] = useState('')
    
    useEffect(() => {
        async function loadPosition(){
            const { granted } = await requestPermissionsAsync();

            if(granted){
                const {coords} = await getCurrentPositionAsync({
                    enableHighAccuracy: true,
                })

                const { latitude, longitude } = coords;
                setCurrentPosition({
                    latitude,
                    longitude,
                    latitudeDelta: 0.06,
                    longitudeDelta: 0.06,
                })
            }
        }
        loadPosition();
    }, [])

    async function loadDevs() {
        const { latitude, longitude } = currentPosition

        const response = await api.get('/search', {
            params: {
            latitude,
            longitude,
            techs,
        }})
        console.log(response.data)
        setDevs(response.data)
    }

    function handleRegionChanged(region){
        setCurrentPosition(region);
        console.log(currentPosition)
    }

    if(!currentPosition){
        return null;
    }

    return (
        <>
            <MapView onRegionChangeComplete={handleRegionChanged} initialRegion = {currentPosition} style={styles.map}>
                {devs.map(dev => (
                    <Marker key={dev._id} coordinate= {{latitude: dev.location.coordinates[1],longitude: dev.location.coordinates[0]}}>
                    <Image style={styles.avatar} source={{uri: dev.avatar_url}}/>
                        <Callout onPress={() => navigation.navigate('Profile', {github_username: dev.github_username})}>
                            <View style={styles.callout}>
                                <Text style={styles.name}>{dev.name}</Text>
                                <Text style={styles.bio}>{dev.bio}</Text>
                                <Text style={styles.techs}>{dev.techs.join(', ')}</Text>
                            </View>
                        </Callout>
                    </Marker>
                    )
                )}
            </MapView>
            <View style={styles.searchForm}>
                <TextInput
                   style={styles.searchInput}
                   placeholder= "Filtar devs por techs..."
                   placeholderTextColor="#999"
                   autoCapitalize="words"
                   autoCorrect= {false}
                   value={techs}
                   onChangeText={setTechs}
                /> 

                <TouchableOpacity style={styles.touchButton} onPress = {loadDevs}>
                    <MaterialIcons name="done" size={35} color="#fff" />
                </TouchableOpacity>
            </View>
        </>
    )
}


const styles = StyleSheet.create({
    map: {
        flex: 1,
        
    },

    avatar: {
        width: 54,
        height: 54,
        borderRadius: 12,
    },

    callout: {
        width: 260,
        borderRadius: 20,
    },

    name: {
        fontWeight: 'bold',
        fontSize: 16,
    },

    bio: {
        color: '#666',
        marginTop: 5,
    },

    techs: {
        marginTop: 5
    }, 

    searchForm: {
        flexDirection: 'row',
        width: "85%",
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 30,
        left: 20
    },

    searchInput: {
        height: 50,
        width: '85%',
        borderRadius: 25,
        elevation: 2,
        backgroundColor: '#fff',
        color: "#333",
        paddingHorizontal: 20,
    },

    touchButton: {
        height: 50,
        width: 50,
        backgroundColor: '#fff',
        marginLeft: '5%',
        borderRadius: 25,
        backgroundColor: '#38ab20',
        justifyContent: "center",
        alignItems: "center",
        elevation: 4
    }
})
export default Main;