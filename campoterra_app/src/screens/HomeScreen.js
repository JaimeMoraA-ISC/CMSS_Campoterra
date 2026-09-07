import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, useWindowDimensions, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  return (
    <View style={styles.mainContainer}>
      
      {/* Nuevo fondo oscuro */}
      <Image 
        source={require('../../assets/images/fondo_home.png')} 
        style={[
          styles.absoluteBackground,
          {
            width: isTablet ? '100%' : width * 1.6,
            right: 0,
          }
        ]}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingHorizontal: isTablet ? 40 : 20 }]} showsVerticalScrollIndicator={false}>
          
          {/* Header con textos claros */}
          <View style={styles.header}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerSubtitle}>MANTENIMIENTO</Text>
              <Text style={[styles.headerTitle, { fontSize: isTablet ? 32 : 28 }]}>Panel Principal</Text>
              <Text style={styles.cursiveText}>Equipos en movimiento,</Text>
              <Text style={styles.cursiveText}>producción sin límites</Text>
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.replace('Login')}>
              <Ionicons name="log-out-outline" size={24} color="#0b1528" />
            </TouchableOpacity>
          </View>

          {/* Tarjeta Principal: Técnico y Turno */}
          <View style={styles.mainCard}>
            <View style={styles.mainCardTop}>
              <View style={styles.techInfoContainer}>
                <View style={styles.profileIconBox}>
                  <Ionicons name="person" size={24} color="#0fa5e9" />
                </View>
                <View>
                  <Text style={styles.labelText}>TÉCNICO</Text>
                  <Text style={styles.techName}>Marco Ramón</Text>
                  <Text style={styles.techRole}>Técnico de Mantenimiento</Text>
                </View>
              </View>
              <View style={styles.activeBadge}>
                <View style={styles.activeDot} />
                <Text style={styles.activeBadgeText}>Jornada activa</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.mainCardBottom}>
              <View style={styles.shiftInfo}>
                <MaterialCommunityIcons name="clock-outline" size={22} color="#4b6584" style={styles.shiftIcon} />
                <View>
                  <Text style={styles.labelText}>TURNO ACTIVO</Text>
                  <Text style={styles.shiftValue}>06:00 - 14:00</Text>
                </View>
              </View>
              <View style={styles.shiftInfo}>
                <MaterialCommunityIcons name="timer-outline" size={22} color="#4b6584" style={styles.shiftIcon} />
                <View>
                  <Text style={styles.labelText}>TIEMPO DE JORNADA</Text>
                  <Text style={styles.shiftValue}>7 h 04 min <Text style={{fontWeight: '400', color: '#7f8fa6'}}></Text></Text>
                </View>
              </View>
            </View>
          </View>

          {/* Título de sección en blanco con sombra para resaltar */}
          <Text style={styles.sectionTitle}>ACCIONES RÁPIDAS</Text>

          {/* Cuadrícula de Acciones */}
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={[styles.actionCard, { marginRight: 15 }]}>
              <View style={styles.actionCardHeader}>
                <View style={[styles.iconBox, { backgroundColor: '#eaf4eb' }]}>
                  <MaterialCommunityIcons name="clipboard-plus-outline" size={28} color="#27ae60" />
                </View>
                <View style={[styles.arrowBox, { backgroundColor: '#eaf4eb' }]}>
                  <Feather name="arrow-right" size={16} color="#27ae60" />
                </View>
              </View>
              <Text style={styles.actionTitle}>Nuevo Reporte</Text>
              <Text style={styles.actionDesc}>Registrar mantenimiento preventivo o correctivo en la planta.</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#fffbf9', borderColor: '#fce3b3' }]}>
              <View style={styles.actionCardHeader}>
                <View style={[styles.iconBox, { backgroundColor: '#fce3b3' }]}>
                  <MaterialCommunityIcons name="alert-decagram-outline" size={28} color="#e55039" />
                </View>
                <View style={[styles.arrowBox, { backgroundColor: '#fce3b3' }]}>
                  <Feather name="arrow-right" size={16} color="#e55039" />
                </View>
              </View>
              <Text style={[styles.actionTitle, { color: '#e55039' }]}>Reportar Falla Urgente</Text>
              <Text style={styles.actionDesc}>Notificar una falla que requiere atención inmediata.</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>ESTADO DE MANTENIMIENTO (HOY)</Text>

          {/* Tarjeta de Estadísticas */}
          <View style={styles.statsCard}>
            <View style={styles.statColumn}>
              <MaterialCommunityIcons name="wrench" size={28} color="#0fa5e9" />
              <View style={styles.statTextGroup}>
                <Text style={styles.statNumber}>5</Text>
                <Text style={styles.statLabel}>Completados{'\n'}hoy</Text>
              </View>
            </View>
            
            <View style={styles.verticalDivider} />
            
            <View style={styles.statColumn}>
              <MaterialCommunityIcons name="clock-time-four-outline" size={28} color="#f6b93b" />
              <View style={styles.statTextGroup}>
                <Text style={styles.statNumber}>3</Text>
                <Text style={styles.statLabel}>Pendientes</Text>
              </View>
            </View>
            
            <View style={styles.verticalDivider} />
            
            <View style={styles.statColumn}>
              <MaterialCommunityIcons name="alert-outline" size={28} color="#e55039" />
              <View style={styles.statTextGroup}>
                <Text style={styles.statNumber}>1</Text>
                <Text style={styles.statLabel}>Fallas{'\n'}abiertas</Text>
              </View>
            </View>
          </View>

          {/* Footer en tonos claros */}
          <View style={styles.footer}>
            <MaterialCommunityIcons name="leaf" size={20} color="#94a3b8" style={{ marginRight: 8 }} />
            <View>
              <Text style={styles.footerSub}>TRABAJANDO POR</Text>
              <Text style={styles.footerTitle}>UNA PRODUCCIÓN CONTINUA</Text>
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#0f172a' }, // Fondo base oscuro por si la imagen tarda en cargar
  absoluteBackground: { position: 'absolute', top: 0, bottom: 0, height: '100%' },
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  scrollContent: { paddingTop: 40, paddingBottom: 50 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 30 },
  headerTextContainer: { flex: 1 },
  headerSubtitle: { color: '#38bdf8', fontSize: 12, fontWeight: '800', letterSpacing: 1.5, marginBottom: 2 }, // Azul celeste brillante
  headerTitle: { color: '#ffffff', fontWeight: '900', marginBottom: 5 }, // Blanco puro
  cursiveText: { color: '#bae6fd', fontStyle: 'italic', fontSize: 14, fontWeight: '600' }, // Celeste claro
  logoutBtn: { backgroundColor: '#ffffff', padding: 12, borderRadius: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3 },
  
  mainCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 20, marginBottom: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5 },
  mainCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  techInfoContainer: { flexDirection: 'row', alignItems: 'center' },
  profileIconBox: { backgroundColor: '#e3f0fa', width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  labelText: { fontSize: 10, color: '#7f8fa6', fontWeight: '700', letterSpacing: 1, marginBottom: 2 },
  techName: { fontSize: 20, fontWeight: '900', color: '#0b1528' },
  techRole: { fontSize: 12, color: '#7f8fa6', marginTop: 2 },
  activeBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eaf4eb', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  activeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#27ae60', marginRight: 6 },
  activeBadgeText: { color: '#27ae60', fontSize: 11, fontWeight: '700' },
  
  divider: { height: 1, backgroundColor: '#f1f2f6', marginVertical: 18 },
  
  mainCardBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  shiftInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  shiftIcon: { marginRight: 10, backgroundColor: '#f5f7fa', padding: 8, borderRadius: 10 },
  shiftValue: { fontSize: 15, fontWeight: '800', color: '#0b1528' },
  
  // Títulos flotantes en blanco con pequeña sombra para no perderse en partes claras de la foto
  sectionTitle: { 
    fontSize: 12, 
    fontWeight: '700', 
    color: '#f8fafc', 
    letterSpacing: 1.5, 
    marginBottom: 15,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3
  },
  
  actionsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  actionCard: { flex: 1, backgroundColor: '#ffffff', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#f1f2f6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  actionCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  iconBox: { width: 50, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  arrowBox: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  actionTitle: { fontSize: 16, fontWeight: '800', color: '#0b1528', marginBottom: 6 },
  actionDesc: { fontSize: 12, color: '#7f8fa6', lineHeight: 18 },
  
  statsCard: { flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 20, paddingVertical: 20, paddingHorizontal: 10, marginBottom: 40, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  statColumn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  statTextGroup: { marginLeft: 10 },
  statNumber: { fontSize: 22, fontWeight: '900', color: '#0b1528', lineHeight: 26 },
  statLabel: { fontSize: 10, color: '#7f8fa6', fontWeight: '600' },
  verticalDivider: { width: 1, backgroundColor: '#f1f2f6', marginHorizontal: 5 },
  
  footer: { flexDirection: 'row', alignItems: 'center' },
  footerSub: { fontSize: 10, color: '#cbd5e1', letterSpacing: 1, marginBottom: 2 }, // Gris claro
  footerTitle: { fontSize: 11, color: '#ffffff', fontWeight: '800', letterSpacing: 1 } // Blanco
});