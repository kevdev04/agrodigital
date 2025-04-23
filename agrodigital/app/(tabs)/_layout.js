import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.light.tint,
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Inicio',
                    tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="cultivos"
                options={{
                    title: 'Cultivos',
                    tabBarIcon: ({ color }) => <Feather name="grid" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="finanzas"
                options={{
                    title: 'Finanzas',
                    tabBarIcon: ({ color }) => <Feather name="dollar-sign" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="perfil"
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
} 