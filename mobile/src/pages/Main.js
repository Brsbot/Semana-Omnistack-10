import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native'; 
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

import api from '../services/api';
import { connect, disconnect, subscribeToNewDevs } from '../services/socket';

function Main( {navigation} ){
    const [currentRegion, setCurrentRegion] = useState(null);
    const [devs, setDevs] = useState([]);
    const [techs, setTechs] = useState('');

    useEffect(
        () => {
            async function loadInitialPosition() {
                const {granted} = await requestPermissionsAsync();

                if (granted) {
                    const { coords } = await getCurrentPositionAsync({
                        enableHighAccuracy: true,
                    });
                    const { latitude, longitude } = coords;

                    setCurrentRegion({
                        latitude,
                        longitude,
                        latitudeDelta: 0.04,
                        longitudeDelta: 0.04,
                    })
                }
            }
            loadInitialPosition();
        }, []
    );

    useEffect(
        () => {
            async function loadAllDevs() {
            
                const response = await api.get('/devs', {});

                setDevs(response.data);
            };
            loadAllDevs();            
        }, []
    );    
    
    useEffect(() => {
        subscribeToNewDevs(dev => setDevs([...devs, dev]));
    }, [devs]);

    function setupWebsocket(){
        disconnect();

        const { latitude, longitude } = currentRegion;

        connect(
            latitude,
            longitude,
            techs,
        );
    }

    async function loadDevs(){
        const { latitude, longitude } = currentRegion;

        const response = await api.get('/search', {
            params: {
                latitude,
                longitude,
                techs,
            }
        });

        setDevs(response.data.devs);
        setupWebsocket();
    }

    function handleRegionChaged( region ){
        setCurrentRegion(region);
    }

    if(!currentRegion) {
        return null;
    };

    return ( 
    <>
    <MapView initialRegion={currentRegion} onRegionChangeComplete={handleRegionChaged} style={mapStyle.map}>
        
        {devs.map(dev => (

          <Marker key={dev._id} coordinate={{ latitude: dev.location.coordinates[1], longitude: dev.location.coordinates[0] }}>  
            <Image source={{ uri:dev.avatar_url }}  style={mapStyle.avatar}/>  
            <Callout onPress={
                () => {
                    navigation.navigate('Profile', { github_username:  dev.github_username });
                }}>
                <View style={mapStyle.callout}>
                    <Text style={mapStyle.devName}>{dev.github_username}</Text>
                    <Text style={mapStyle.devBio}>{dev.bio}</Text>
                    <Text style={mapStyle.devTechs}>{dev.techs.join(', ')}</Text>
                </View>
            </Callout>

          </Marker>
        ))}
        
    </MapView>
    <View style={viewStyle.searchForm}>
        <TextInput
        style={viewStyle.searchInput}
        placeholder="Buscar Devs por Tecnologias ..."
        placeholderTextColor="#999"
        autoCapitalize="words"
        autoCorrect={false}
        value={techs}
        onChangeText={text => setTechs(text)} 
        />

        <TouchableOpacity onPress={loadDevs} style={viewStyle.loadButton}>
            <MaterialIcons name="my-location" size={30} color="#fff"/>
        </TouchableOpacity>

    </View>
    </>
    );
};

const mapStyle = StyleSheet.create({
    map: {
        flex: 1
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#ccc',
    },
    callout: {
        width:260,
    },
    devName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    devBio: {
        color: '#666',
        marginTop: 5,
    },
    devTechs: {
        marginTop: 5,
    },
});

const viewStyle = StyleSheet.create({
    searchForm: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row',

    },
    searchInput: {
        flex: 1,
        height: 60,
        backgroundColor: '#fff',
        color:'#333',
        borderRadius: 25,
        fontSize: 16,
        paddingHorizontal: 20,
        shadowColor: '#555',
        shadowOpacity: 0.8,
        shadowRadius: 30,
        shadowOffset: {
            height: 5,
        }
    },
    loadButton: {
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: '#8e4dff',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 15,
        marginTop: 5,
    },

});

export default Main;