import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, useWindowDimensions, Alert, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { submitUrgentAlert } from '../services/api';

export default function UrgentReportScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const [lineaDetenida, setLineaDetenida] = useState(true);
  const [prioridad, setPrioridad] = useState('Alta');
  const [descripcion, setDescripcion] = useState('');
  const [equipo, setEquipo] = useState('Banda principal'); // Equipo fijo por ahora
  const [isLoading, setIsLoading] = useState(false);

  const handleSendAlert = async () => {
    setIsLoading(true);
    
    const alertData = {
      linea_detenida: lineaDetenida,
      prioridad: prioridad,
      equipo: equipo,
      descripcion: descripcion || "Sin descripción proporcionada"
    };

    try {
      const response = await submitUrgentAlert(alertData);
      
      Alert.alert("Alerta Emitida", response.message, [
        { text: "Entendido", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert("Error", "No se pudo enviar la alerta. Verifica tu conexión.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.safeArea}>
        
        <View style={[styles.header, { paddingHorizontal: isTablet ? 40 : 20 }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <View style={styles.titleRow}>
              <MaterialCommunityIcons name="alert-decagram" size={32} color="#ef4444" style={{marginRight: 8}} />
              <Text style={styles.mainTitle}>Reportar Falla Urgente</Text>
            </View>
            <Text style={styles.subTitle}>Atención inmediata requerida</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingHorizontal: isTablet ? 40 : 20 }]} showsVerticalScrollIndicator={false}>
          
          <View style={styles.card}>
            <View style={styles.cardContentRow}>
              <View style={styles.cardHeaderLeft}>
                <MaterialCommunityIcons name="alarm-light-outline" size={24} color="#ef4444" />
                <View style={styles.cardHeaderText}>
                  <Text style={styles.cardTitle}>¿La línea de producción está detenida?</Text>
                  <Text style={styles.cardSub}>Activa esta opción si el equipo detuvo la operación.</Text>
                </View>
              </View>
              <View style={styles.toggleContainer}>
                <TouchableOpacity 
                  style={[styles.toggleBtn, lineaDetenida ? styles.toggleBtnActive : styles.toggleBtnInactive]}
                  onPress={() => setLineaDetenida(!lineaDetenida)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.toggleCircle, lineaDetenida ? styles.toggleCircleActive : styles.toggleCircleInactive]} />
                </TouchableOpacity>
                {lineaDetenida && <Text style={styles.toggleLabel}>Prioridad máxima</Text>}
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeaderLeft}>
              <MaterialCommunityIcons name="alert-box-outline" size={24} color="#ef4444" />
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardTitle}>Nivel de prioridad</Text>
                <Text style={styles.cardSub}>Selecciona el nivel de urgencia de la falla.</Text>
              </View>
            </View>

            <View style={styles.priorityRow}>
              <TouchableOpacity 
                style={[styles.priorityBtn, prioridad === 'Baja' && styles.priorityBtnActiveBaja]}
                onPress={() => setPrioridad('Baja')}
              >
                <MaterialCommunityIcons name="clock-outline" size={28} color="#64748b" />
                <View style={styles.priorityTextCol}>
                  <Text style={[styles.priorityTitle, {color: '#475569'}]}>Baja</Text>
                  <Text style={styles.prioritySub}>Puede esperar</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.priorityBtn, prioridad === 'Media' && styles.priorityBtnActiveMedia]}
                onPress={() => setPrioridad('Media')}
              >
                <MaterialCommunityIcons name="alert-outline" size={28} color="#eab308" />
                <View style={styles.priorityTextCol}>
                  <Text style={[styles.priorityTitle, {color: '#ca8a04'}]}>Media</Text>
                  <Text style={styles.prioritySub}>Afecta el rendimiento</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.priorityBtn, prioridad === 'Alta' && styles.priorityBtnActiveAlta]}
                onPress={() => setPrioridad('Alta')}
              >
                {prioridad === 'Alta' && (
                  <View style={styles.checkBadge}>
                    <Ionicons name="checkmark" size={12} color="#ffffff" />
                  </View>
                )}
                <MaterialCommunityIcons name="stop-circle" size={28} color="#ef4444" />
                <View style={styles.priorityTextCol}>
                  <Text style={[styles.priorityTitle, {color: '#b91c1c'}]}>Alta</Text>
                  <Text style={styles.prioritySub}>Detiene la producción</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeaderLeft}>
              <MaterialCommunityIcons name="cog-outline" size={24} color="#ef4444" />
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardTitle}>Equipo afectado</Text>
                <Text style={styles.cardSub}>Selecciona el equipo o área donde ocurrió la falla.</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.equipmentSelector}>
              <View style={styles.equipmentSelectorLeft}>
                <MaterialCommunityIcons name="minus-box-multiple-outline" size={24} color="#475569" />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.equipmentName}>Banda principal</Text>
                  <Text style={styles.equipmentArea}>Línea de Producción</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeaderLeft}>
              <MaterialCommunityIcons name="text-box-outline" size={24} color="#ef4444" />
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardTitle}>Descripción de la falla</Text>
                <Text style={styles.cardSub}>Describe qué pasó, ruidos extraños, humo, piezas rotas, etc.</Text>
              </View>
            </View>
            
            <View style={styles.textAreaContainer}>
              <TextInput 
                style={styles.textArea}
                placeholder="Describe la falla en detalle..."
                placeholderTextColor="#94a3b8"
                multiline={true}
                numberOfLines={4}
                value={descripcion}
                onChangeText={setDescripcion}
                textAlignVertical="top"
                maxLength={500}
              />
              <Text style={styles.charCount}>{descripcion.length}/500</Text>
            </View>
          </View>

          <View style={styles.mediaRow}>
            <View style={[styles.card, styles.mediaCard]}>
              <View style={styles.cardHeaderLeftMedia}>
                <MaterialCommunityIcons name="camera-outline" size={20} color="#ef4444" />
                <View style={styles.cardHeaderTextMedia}>
                  <Text style={styles.mediaCardTitle}>Tomar foto (obligatorio)</Text>
                  <Text style={styles.mediaCardSub}>Muestra el daño para preparar repuestos.</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.photoActionBox}>
                <MaterialCommunityIcons name="camera" size={24} color="#ef4444" />
                <Text style={styles.photoActionTitle}>Tocar para tomar foto</Text>
                <Text style={styles.photoActionSub}>o seleccionar de la galería</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.card, styles.mediaCard]}>
              <View style={styles.cardHeaderLeftMedia}>
                <MaterialCommunityIcons name="microphone-outline" size={20} color="#ef4444" />
                <View style={styles.cardHeaderTextMedia}>
                  <Text style={styles.mediaCardTitle}>Nota de voz (opcional)</Text>
                  <Text style={styles.mediaCardSub}>Describe la falla por voz.</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.audioActionBox}>
                <View style={styles.audioIconCircle}>
                  <MaterialCommunityIcons name="microphone" size={28} color="#ffffff" />
                </View>
                <View>
                  <Text style={styles.audioActionTitle}>Grabar audio</Text>
                  <Text style={styles.audioActionSub}>Máx. 1 minuto</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>

       <View style={styles.footer}>
          <TouchableOpacity style={styles.submitBtn} onPress={handleSendAlert} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <MaterialCommunityIcons name="alert" size={24} color="#ffffff" style={{marginRight: 8}} />
                <Text style={styles.submitBtnText}>EMITIR ALERTA AHORA</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#fdf2f2' },
  safeArea: { flex: 1 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, paddingBottom: 15, backgroundColor: 'transparent' },
  backBtn: { backgroundColor: '#ffffff', padding: 8, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  headerTitles: { alignItems: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  alertBadge: { backgroundColor: '#ef4444', width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 8, transform: [{ rotate: '45deg' }] },
  mainTitle: { color: '#450a0a', fontSize: 20, fontWeight: '900' },
  subTitle: { color: '#7f1d1d', fontSize: 13, marginTop: 4 },
  
  scrollContent: { paddingTop: 10, paddingBottom: 120 },
  
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 15, marginBottom: 15, shadowColor: '#ef4444', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, borderWidth: 1, borderColor: '#fee2e2' },
  
  cardContentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'flex-start', flex: 1 },
  cardHeaderText: { marginLeft: 10, flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#0f172a' },
  cardSub: { fontSize: 12, color: '#64748b', marginTop: 2, paddingRight: 10 },
  
  toggleContainer: { alignItems: 'center' },
  toggleBtn: { width: 56, height: 32, borderRadius: 16, justifyContent: 'center', padding: 3 },
  toggleBtnActive: { backgroundColor: '#ef4444' },
  toggleBtnInactive: { backgroundColor: '#e2e8f0' },
  toggleCircle: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2 },
  toggleCircleActive: { alignSelf: 'flex-end' },
  toggleCircleInactive: { alignSelf: 'flex-start' },
  toggleLabel: { fontSize: 10, color: '#ef4444', fontWeight: '700', marginTop: 6 },

  priorityRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  priorityBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', marginHorizontal: 4 },
  priorityBtnActiveBaja: { backgroundColor: '#f1f5f9', borderColor: '#94a3b8' },
  priorityBtnActiveMedia: { backgroundColor: '#fefce8', borderColor: '#fde047' },
  priorityBtnActiveAlta: { backgroundColor: '#fef2f2', borderColor: '#ef4444', borderWidth: 1.5 },
  priorityTextCol: { marginLeft: 8, flex: 1 },
  priorityTitle: { fontSize: 13, fontWeight: '800' },
  prioritySub: { fontSize: 9, color: '#64748b', marginTop: 2 },
  checkBadge: { position: 'absolute', top: -6, right: -6, backgroundColor: '#b91c1c', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center', zIndex: 2 },

  equipmentSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 12, marginTop: 15 },
  equipmentSelectorLeft: { flexDirection: 'row', alignItems: 'center' },
  equipmentName: { fontSize: 14, fontWeight: '800', color: '#0f172a' },
  equipmentArea: { fontSize: 12, color: '#64748b', marginTop: 2 },

  textAreaContainer: { marginTop: 15, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 15 },
  textArea: { fontSize: 14, color: '#0f172a', minHeight: 80 },
  charCount: { alignSelf: 'flex-end', fontSize: 11, color: '#94a3b8', marginTop: 5 },

  mediaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  mediaCard: { flex: 1, marginHorizontal: 4, padding: 12 },
  cardHeaderLeftMedia: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 15 },
  cardHeaderTextMedia: { marginLeft: 8, flex: 1 },
  mediaCardTitle: { fontSize: 12, fontWeight: '800', color: '#b91c1c' },
  mediaCardSub: { fontSize: 10, color: '#64748b', marginTop: 2 },
  
  photoActionBox: { backgroundColor: '#fef2f2', borderStyle: 'dashed', borderWidth: 1, borderColor: '#fca5a5', borderRadius: 12, padding: 15, alignItems: 'center', justifyContent: 'center' },
  photoActionTitle: { fontSize: 12, fontWeight: '800', color: '#ef4444', marginTop: 8 },
  photoActionSub: { fontSize: 10, color: '#991b1b', marginTop: 2 },

  audioActionBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 10 },
  audioIconCircle: { backgroundColor: '#ef4444', width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  audioActionTitle: { fontSize: 12, fontWeight: '800', color: '#0f172a' },
  audioActionSub: { fontSize: 10, color: '#64748b', marginTop: 2 },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#ffffff', padding: 20, borderTopWidth: 1, borderColor: '#fee2e2' },
  submitBtn: { backgroundColor: '#ef4444', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 12, paddingVertical: 16, shadowColor: '#ef4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 4 },
  submitBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  footerDisclaimer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  footerDisclaimerText: { fontSize: 11, color: '#64748b' }
});