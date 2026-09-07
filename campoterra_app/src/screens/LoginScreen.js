import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView, useWindowDimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const [tecnico, setTecnico] = useState('Marco Ramón');
  const [turno, setTurno] = useState('1° Turno');

  // Detectamos el ancho para saber si es tablet o celular
  const { width } = useWindowDimensions();
  const isTablet = width >= 600; 

  return (
    <View style={styles.mainContainer}>
      
      {/* Fondo absoluto anclado a la derecha */}
      <Image 
        source={require('../../assets/images/fondo_login.png')} 
        style={[
          styles.absoluteBackground,
          {
            // Si es celular, hacemos el contenedor de la imagen un 60% más ancho 
            // y lo pegamos a la derecha (right: 0) para obligar a que se vea el texto completo.
            width: isTablet ? '100%' : width * 1.6,
            right: 0,
          }
        ]}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={[styles.scrollContainer, { paddingHorizontal: isTablet ? 50 : 20 }]} 
          showsVerticalScrollIndicator={false}
        >
          
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.logoTextContainer}>
              <Image source={require('../../assets/images/logo.png')} style={[styles.logo, { width: isTablet ? 65 : 50, height: isTablet ? 65 : 50 }]} />
              <View style={styles.brandContainer}>
                <Text style={[styles.brandTitle, { fontSize: isTablet ? 22 : 18 }]}>CAMPOTERRA</Text>
                <Text style={styles.brandSubtitle}>CONGELADORA</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.settingsBtn}>
              <Ionicons name="settings-sharp" size={isTablet ? 26 : 22} color="#0b437a" />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />
          <Text style={styles.areaText}>Á R E A   D E   M A N T E N I M I E N T O</Text>

          {/* Textos de Bienvenida */}
          <View style={[styles.welcomeSection, { marginBottom: isTablet ? 40 : 25 }]}>
            <Text style={styles.helloText}>HOLA</Text>
            <Text style={[styles.welcomeTitle, { fontSize: isTablet ? 44 : 34 }]}>¡Bienvenido!</Text>
            <Text style={[styles.welcomeSubtitle, { fontSize: isTablet ? 17 : 14 }]}>Selecciona tu información{'\n'}para iniciar tu jornada en Mantenimiento.</Text>
          </View>

          {/* Tarjeta de Empleado */}
          <TouchableOpacity style={styles.selectorCard}>
            <View style={[styles.iconBox, { backgroundColor: '#e3f0fa', width: isTablet ? 65 : 55, height: isTablet ? 65 : 55 }]}>
              <Ionicons name="person" size={isTablet ? 28 : 22} color="#0b437a" />
            </View>
            <View style={styles.selectorInfo}>
              <Text style={styles.labelText}>EMPLEADO</Text>
              <Text style={[styles.valueText, { fontSize: isTablet ? 22 : 18 }]}>{tecnico}</Text>
              <Text style={styles.subValueText}>Área de Mantenimiento</Text>
            </View>
            <Ionicons name="chevron-down" size={24} color="#7f8fa6" />
          </TouchableOpacity>

          {/* Tarjeta de Turno */}
          <TouchableOpacity style={styles.selectorCard}>
            <View style={[styles.iconBox, { backgroundColor: '#e5f3e7', width: isTablet ? 65 : 55, height: isTablet ? 65 : 55 }]}>
              <MaterialCommunityIcons name="calendar-month" size={isTablet ? 28 : 22} color="#27ae60" />
            </View>
            <View style={styles.selectorInfo}>
              <Text style={styles.labelText}>TURNO</Text>
              <Text style={[styles.valueText, { fontSize: isTablet ? 22 : 18 }]}>{turno}</Text>
              <Text style={styles.subValueText}>06:00 - 14:00</Text>
            </View>
            <Ionicons name="chevron-down" size={24} color="#7f8fa6" />
          </TouchableOpacity>

          {/* Botón Iniciar Jornada */}
          <TouchableOpacity 
            style={[styles.primaryButton, { paddingVertical: isTablet ? 22 : 16 }]}
            onPress={() => navigation.replace('Home')}
          >
            <View style={styles.buttonCenter}>
              <Ionicons name="play" size={isTablet ? 24 : 20} color="#fff" style={styles.playIcon} />
              <Text style={[styles.buttonText, { fontSize: isTablet ? 22 : 18 }]}>INICIAR JORNADA</Text>
            </View>
            <MaterialCommunityIcons name="tools" size={isTablet ? 50 : 40} color="rgba(255,255,255,0.15)" style={styles.bgIcon} />
          </TouchableOpacity>

          {/* Panel de Sincronización */}
          <View style={styles.statusPanel}>
            <View style={styles.statusLeft}>
              <View style={styles.dot} />
              <View>
                <Text style={styles.statusTitle}>Conexión disponible</Text>
                <Text style={styles.statusSub}>Sincronización automática</Text>
              </View>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.statusRight}>
              <Ionicons name="cloud-upload-outline" size={isTablet ? 28 : 22} color="#7f8fa6" />
              <Text style={styles.statusTextRight}>Sincronización{'\n'}activa</Text>
            </View>
          </View>

          {/* Menú Rápido Inferior */}
          <View style={[styles.quickMenu, { marginBottom: isTablet ? 80 : 40 }]}>
            <View style={styles.menuItem}>
              <Ionicons name="settings" size={isTablet ? 28 : 22} color="#4b6584" />
              <Text style={[styles.menuItemText, { fontSize: isTablet ? 10 : 8 }]}>MANTENIMIENTO{'\n'}PREVENTIVO</Text>
            </View>
            <View style={styles.menuItem}>
              <MaterialCommunityIcons name="wrench" size={isTablet ? 28 : 22} color="#4b6584" />
              <Text style={[styles.menuItemText, { fontSize: isTablet ? 10 : 8 }]}>MANTENIMIENTO{'\n'}CORRECTIVO</Text>
            </View>
            <View style={styles.menuItem}>
              <MaterialCommunityIcons name="clipboard-text" size={isTablet ? 28 : 22} color="#4b6584" />
              <Text style={[styles.menuItemText, { fontSize: isTablet ? 10 : 8 }]}>REGISTROS</Text>
            </View>
            <View style={styles.menuItem}>
              <MaterialCommunityIcons name="poll" size={isTablet ? 28 : 22} color="#4b6584" />
              <Text style={[styles.menuItemText, { fontSize: isTablet ? 10 : 8 }]}>DISPONIBILIDAD{'\n'}DE EQUIPOS</Text>
            </View>
          </View>

          <View style={{ height: isTablet ? 60 : 30 }} />

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  absoluteBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    height: '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContainer: {
    paddingTop: 30,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    borderRadius: 30,
    marginRight: 12,
  },
  brandContainer: {
    justifyContent: 'center',
  },
  brandTitle: {
    fontWeight: '900',
    color: '#0b1528',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 11,
    color: '#0fa5e9',
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  settingsBtn: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#d1d8e0',
    marginTop: 20,
    marginBottom: 10,
    opacity: 0.5,
  },
  areaText: {
    fontSize: 12,
    color: '#7f8fa6',
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 20,
  },
  welcomeSection: {},
  helloText: {
    fontSize: 16,
    color: '#0fa5e9',
    fontWeight: '800',
    letterSpacing: 1,
  },
  welcomeTitle: {
    fontWeight: '900',
    color: '#0b1528',
    marginBottom: 5,
  },
  welcomeSubtitle: {
    color: '#4b6584',
    lineHeight: 22,
  },
  selectorCard: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconBox: {
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  selectorInfo: {
    flex: 1,
  },
  labelText: {
    fontSize: 10,
    color: '#4b6584',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 2,
  },
  valueText: {
    fontWeight: 'bold',
    color: '#0b1528',
  },
  subValueText: {
    fontSize: 12,
    color: '#7f8fa6',
    marginTop: 2,
  },
  primaryButton: {
    backgroundColor: '#27ae60',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  playIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '800',
    letterSpacing: 1,
  },
  bgIcon: {
    position: 'absolute',
    right: -5,
    bottom: -5,
  },
  statusPanel: {
    backgroundColor: 'rgba(234, 244, 235, 0.95)',
    borderRadius: 12,
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    marginBottom: 25,
  },
  statusLeft: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#27ae60',
    marginRight: 10,
  },
  statusTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0b1528',
  },
  statusSub: {
    fontSize: 10,
    color: '#7f8fa6',
    marginTop: 2,
  },
  verticalDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#d1d8e0',
    marginHorizontal: 12,
  },
  statusRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusTextRight: {
    fontSize: 10,
    color: '#7f8fa6',
    marginLeft: 6,
  },
  quickMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  menuItem: {
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    color: '#4b6584',
    textAlign: 'center',
    fontWeight: '700',
    marginTop: 6,
  },
});