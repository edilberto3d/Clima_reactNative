import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, Image, StyleSheet} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const fetchData = async () => {
    try {
        const response = await fetch('http://api.weatherapi.com/v1/forecast.json?key=738d57dee5df4fc0b2844649231010&q=Huejutla&days=5&aqi=no&alerts=no');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
};


const PronosticoHora = ({ time, temp, iconUrl }) => (
    <View style={styles.cardTime}>
        <Text style={styles.hourlyTime}>{time}</Text>
        <Image style={styles.hourlyImage} source={{ uri: iconUrl }} />
        <Text style={styles.hourlyTemp}>{temp}°C</Text>
    </View>
);

const TiempoActual = ({ weatherData }) => {
    const currentHour = new Date().getHours();

    const filteredHours = weatherData.forecast.forecastday[0].hour.filter(item => {
        return new Date(item.time).getHours() >= currentHour;
    });

    return (
        <View style={[styles.weatherContainer, styles.currentWeatherContainer]}>
            <View style={styles.weatherScreen}>
                <Text style={styles.locationName}>{weatherData.location.name}</Text>
                <Image
                    style={styles.currentConditionImage}
                    source={{ uri: `https:${weatherData.current.condition.icon}` }}
                />
                <Text style={styles.currentTemp}>{weatherData.current.temp_c}°C</Text>
                <Text style={styles.conditionText}>
                    {weatherData.current.condition.text} - {weatherData.forecast.forecastday[0].day.maxtemp_c}°C / {weatherData.forecast.forecastday[0].day.mintemp_c}°C
                </Text>
                <Text style={styles.hourlyHeader}>Pronóstico Del Día Actual 📰</Text>
                <FlatList
                    data={filteredHours}
                    renderItem={({ item }) => (
                        <PronosticoHora
                            time={`${new Date(item.time).getHours()}:00`}
                            temp={item.temp_c}
                            iconUrl={`https:${item.condition.icon}`}
                        />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.hourlyList}
                />
            </View>
        </View>
    );
};

const TiempoSemanal = ({ forecast }) => {
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    const renderItem = ({ item }) => {
        const date = new Date(item.date);
        const dayOfWeek = daysOfWeek[date.getDay()];
        return (
            <View style={styles.weeklyWeatherItem}>
                <Text style={styles.dayOfWeek}>{dayOfWeek}</Text>
                <View style={styles.weatherDetails}>
                    <Text style={styles.temperature}>{item.day.maxtemp_c}°C / {item.day.mintemp_c}°C</Text>
                    <Image style={styles.weatherIcon} source={{ uri: `https:${item.day.condition.icon}` }} />
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.weatherContainer, styles.weeklyWeatherContainer]}>
            <Text style={styles.hourlyHeader}>Pronóstico Semanal 📆</Text>
            <FlatList
                data={forecast.forecastday}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.weeklyWeatherList}
            />
        </View>
    );
};

const Clima = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const loadData = async () => {
            const data = await fetchData();
            setWeatherData(data);
            setIsLoading(false);
        };
        loadData();
    }, []);

    if (isLoading) {
        return (
            <LinearGradient colors={['#a6c6e0', '#8aa3cc', '#5b7ca6']} style={styles.linearGradient}>
                <View style={styles.loadingScreen}>
                    <ActivityIndicator size="large" color={'#FFF'} />
                    <Text style={styles.loadingText}>Cargando datos...</Text>
                </View>
            </LinearGradient>
        );
    }
    return (
        <LinearGradient colors={['#a6c6e0', '#8aa3cc', '#5b7ca6']} style={styles.linearGradient}>
        <View style={styles.container}>
            <FlatList
                data={[{ key: 'currentWeather' }, { key: 'weeklyWeather' }]}
                renderItem={({ item }) => {
                    if (item.key === 'currentWeather') {
                        return <TiempoActual weatherData={weatherData} />;
                    } else if (item.key === 'weeklyWeather') {
                        return <TiempoSemanal forecast={weatherData.forecast} />;
                    }
                }}
                keyExtractor={item => item.key}
            />
        </View>
    </LinearGradient>
    );
};

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
    },
    mainContainer: {
        padding: 20,
    },
    loadingScreen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#CCC',
    },
    weatherContainer: {
        marginTop: 20,
        marginBottom: 10,
        borderRadius: 30,
    },
    currentWeatherContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    weeklyWeatherContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    weatherScreen: {
        alignItems: 'center',
        padding: 20,
    },
    locationName: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#EEE',
    },
    currentConditionImage: {
        width: 150,
        height: 150,
    },
    currentTemp: {
        fontSize: 50,
        fontWeight: '300',
        color: '#EEE',
    },
    conditionText: {
        textAlign: 'center',
        marginBottom: 20,
        color: '#EEE',
    },
    hourlyHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: '#EEE',
        textAlign: "center",
    },
    hourlyList: {
        marginBottom: 20,
    },
    card: {
        alignItems: 'center',
        marginRight: 10,
        padding: 10,
        backgroundColor: 'transparent',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardDate: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#666',
    },
    cardImage: {
        height: 50,
        width: 50,
        margin: 5,
    },
    cardTemp: {
        fontSize: 16,
        color: '#666',
    },
    cardTime: {
        alignItems: 'center',
        marginRight: 10,
        padding: 10,
        backgroundColor: 'transparent',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
    hourlyTime: {
        fontSize: 16,
        color: '#EEE',
    },
    hourlyImage: {
        height: 40,
        width: 40,
        margin: 5,
    },
    hourlyTemp: {
        fontSize: 16,
        color: '#EEE',
    },
    weeklyWeatherList: {
        paddingHorizontal: 10,
    },
    weeklyWeatherItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: 'transparent',
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
    dayOfWeek: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#EEE',
    },
    weatherDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    temperature: {
        fontSize: 14,
        marginRight: 10,
        color: '#EEE',
    },
    weatherIcon: {
        width: 40,
        height: 40,
    },
    container:{
        padding:20
    }
});


export default Clima;