import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, useWindowDimensions, Image, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const equipmentList = [
  { id: 1, name: 'Bandas\nTransportadoras', icon: 'minus-box-multiple-outline', area: 'Área de Producción' },
  { id: 2, name: 'Molino Chico', icon: 'cog-outline', area: 'Molienda' },
  { id: 3, name: 'Molino Grande', icon: 'cogs', area: 'Molienda' },
  { id: 4, name: 'Lavadora de Cajas', icon: 'archive-outline', area: 'Lavado' },
  { id: 5, name: 'Lavadora de Mango', icon: 'water-outline', area: 'Lavado' },
  { id: 6, name: 'Compresores', icon: 'gas-cylinder', area: 'Cuarto de Máquinas' },
  { id: 7, name: 'Cuartos de\nCongelación', icon: 'snowflake', area: 'Almacén Frío' },
  { id: 8, name: 'Líneas de Proceso', icon: 'server', area: 'Producción' },
  { id: 9, name: 'Bombas', icon: 'water-pump', area: 'Suministro' },
  { id: 10, name: 'Torres de\nEnfriamiento', icon: 'fan', area: 'Exteriores' },
  { id: 11, name: 'Subestación\nEléctrica', icon: 'flash-outline', area: 'Servicios' },
  { id: 12, name: 'Otros\nEquipo no listado', icon: 'hammer-wrench', area: 'General' },
];

// Inventario simulado para el Paso 4
const partsInventory = [
  { id: 1, name: 'Rodamiento 6205', code: 'ROD-6205', stock: 12, category: 'Mecánicos', icon: 'adjust' },
  { id: 2, name: 'Banda transportadora 1/2"', code: 'BAN-12', stock: 8, category: 'Mecánicos', icon: 'minus-box-multiple-outline' },
  { id: 3, name: 'Tornillo hexagonal 3/8" x 1 1/2"', code: 'TOR-38112', stock: 50, category: 'Mecánicos', icon: 'screw-machine-flat-top' },
  { id: 4, name: 'Aceite lubricante grado alimenticio', code: 'ACE-FOOD', stock: 20, category: 'Lubricantes', icon: 'water-outline' },
  { id: 5, name: 'Motorreductor 1 HP', code: 'MOT-1HP', stock: 3, category: 'Eléctricos', icon: 'cog-outline' },
  { id: 6, name: 'Sello mecánico', code: 'SEL-MEC', stock: 15, category: 'Mecánicos', icon: 'circle-double' },
];

const partCategories = ['Todos', 'Mecánicos', 'Eléctricos', 'Lubricantes', 'Consumibles', 'Otros'];

export default function NewReportScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  // Estados del asistente (Wizard)
  const [step, setStep] = useState(1);
  const [selectedId, setSelectedId] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [workType, setWorkType] = useState('preventivo'); 
  const [description, setDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  // Estados para el Paso 4 (Piezas)
  const [partSearch, setPartSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [cart, setCart] = useState([]); // Array de { partId, qty }

  const selectedEquipment = equipmentList.find(e => e.id === selectedId);

  // Funciones del carrito de piezas
  const getQty = (partId) => {
    const item = cart.find(c => c.partId === partId);
    return item ? item.qty : 0;
  };

  const addPart = (partId) => {
    const existing = cart.find(c => c.partId === partId);
    if (existing) {
      setCart(cart.map(c => c.partId === partId ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { partId, qty: 1 }]);
    }
  };

  const removePart = (partId) => {
    const existing = cart.find(c => c.partId === partId);
    if (existing && existing.qty > 1) {
      setCart(cart.map(c => c.partId === partId ? { ...c, qty: c.qty - 1 } : c));
    } else {
      setCart(cart.filter(c => c.partId !== partId));
    }
  };

  const deletePart = (partId) => setCart(cart.filter(c => c.partId !== partId));
  const clearCart = () => setCart([]);

  const handleSaveReport = () => {
    Alert.alert("Éxito", "El reporte de mantenimiento se ha guardado correctamente.", [
      { text: "OK", onPress: () => navigation.replace('Home') }
    ]);
  };

  const renderStep1 = () => (
    <View style={styles.whiteSheet}>
      <View style={styles.sheetHeader}>
        <View style={styles.sheetTitleContainer}>
          <Text style={styles.sheetLabel}>EQUIPO / MAQUINARIA</Text>
          <Text style={styles.sheetTitle}>Selecciona el equipo</Text>
          <Text style={styles.sheetSub}>Elige la máquina o área donde realizaste la actividad</Text>
        </View>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#7f8fa6" />
          <TextInput style={styles.searchInput} placeholder="Buscar equipo..." placeholderTextColor="#94a3b8" value={searchText} onChangeText={setSearchText} />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.gridContainer} showsVerticalScrollIndicator={false}>
        {equipmentList.map((item) => {
          const isSelected = selectedId === item.id;
          return (
            <TouchableOpacity key={item.id} style={[styles.gridItem, isSelected && styles.gridItemActive, isTablet && { width: '23%' }]} onPress={() => setSelectedId(item.id)} activeOpacity={0.7}>
              <MaterialCommunityIcons name={item.icon} size={36} color={isSelected ? '#0b437a' : '#1e293b'} style={styles.gridIcon} />
              <Text style={[styles.gridText, isSelected && styles.gridTextActive]}>{item.name}</Text>
              {isSelected && <View style={styles.checkBadge}><Ionicons name="checkmark" size={14} color="#ffffff" /></View>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={styles.bottomFooterSingle}>
        <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(2)}>
          <Text style={styles.nextBtnText}>Siguiente</Text>
          <Ionicons name="arrow-forward" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.step2Container}>
      <View style={styles.selectedEquipCard}>
        <View style={styles.equipCardLeft}>
          <View style={styles.equipCardIconBox}><MaterialCommunityIcons name={selectedEquipment.icon} size={28} color="#0b437a" /></View>
          <View>
            <Text style={styles.equipCardLabel}>EQUIPO SELECCIONADO</Text>
            <Text style={styles.equipCardName}>{selectedEquipment.name.replace('\n', ' ')}</Text>
            <Text style={styles.equipCardArea}>{selectedEquipment.area}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.changeEquipBtn} onPress={() => setStep(1)}>
          <MaterialCommunityIcons name="swap-horizontal" size={18} color="#0056d2" />
          <Text style={styles.changeEquipText}>Cambiar equipo</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.whiteSheet}>
        <View style={styles.stepHeaderIconic}>
          <View style={styles.stepHeaderIconBox}><MaterialCommunityIcons name="wrench-outline" size={32} color="#0b437a" /></View>
          <View>
            <Text style={styles.sheetTitle}>Tipo de trabajo</Text>
            <Text style={styles.sheetSub}>Selecciona el tipo de mantenimiento que realizaste</Text>
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.scrollPadding} showsVerticalScrollIndicator={false}>
          <View style={styles.cardsRow}>
            <TouchableOpacity style={[styles.workCard, workType === 'preventivo' && styles.workCardActivePrev]} onPress={() => setWorkType('preventivo')} activeOpacity={0.8}>
              <View style={[styles.cardRadio, workType === 'preventivo' && styles.cardRadioActivePrev]}>{workType === 'preventivo' && <Ionicons name="checkmark" size={16} color="#fff" />}</View>
              <View style={styles.cardIconBoxPrev}><MaterialCommunityIcons name="calendar-check" size={36} color="#fff" /></View>
              <Text style={styles.cardTitlePrev}>Preventivo / Rutina</Text>
              <Text style={styles.cardDesc}>Mantenimiento programado para mantener el equipo en condiciones óptimas.</Text>
              <View style={styles.examplesBoxPrev}>
                <Text style={styles.examplesTitlePrev}>Ejemplos:</Text>
                <Text style={styles.exampleItemPrev}>• Limpieza</Text>
                <Text style={styles.exampleItemPrev}>• Lubricación</Text>
                <Text style={styles.exampleItemPrev}>• Inspección</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.workCard, workType === 'correctivo' && styles.workCardActiveCorr]} onPress={() => setWorkType('correctivo')} activeOpacity={0.8}>
              <View style={[styles.cardRadio, workType === 'correctivo' && styles.cardRadioActiveCorr]}>{workType === 'correctivo' && <Ionicons name="checkmark" size={16} color="#fff" />}</View>
              <View style={styles.cardIconBoxCorr}><MaterialCommunityIcons name="alert-outline" size={36} color="#ef4444" /></View>
              <Text style={styles.cardTitleCorr}>Correctivo / Reparación</Text>
              <Text style={styles.cardDesc}>Atención a fallas, reparaciones o reemplazo de componentes no programados.</Text>
              <View style={styles.examplesBoxCorr}>
                <Text style={styles.examplesTitleCorr}>Ejemplos:</Text>
                <Text style={styles.exampleItemCorr}>• Fallas en el equipo</Text>
                <Text style={styles.exampleItemCorr}>• Reemplazo de piezas</Text>
                <Text style={styles.exampleItemCorr}>• Ajustes por mal funcionamiento</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.infoBox}>
            <View style={styles.infoIcon}><Text style={styles.infoIconText}>i</Text></View>
            <Text style={styles.infoText}>Selecciona el tipo de trabajo correcto para un mejor control del mantenimiento.</Text>
          </View>
        </ScrollView>
        <View style={styles.bottomFooterDouble}>
          <TouchableOpacity style={styles.prevBtn} onPress={() => setStep(1)}>
            <Ionicons name="arrow-back" size={20} color="#0f172a" />
            <Text style={styles.prevBtnText}>Anterior</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextBtnDouble} onPress={() => setStep(3)}>
            <Text style={styles.nextBtnText}>Siguiente</Text>
            <Ionicons name="arrow-forward" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.step3Container}>
      <View style={styles.summaryCard}>
        <View style={styles.summaryCol}>
          <Text style={styles.summaryLabel}>EQUIPO</Text>
          <View style={styles.summaryRow}>
            <MaterialCommunityIcons name={selectedEquipment.icon} size={22} color="#0b437a" style={{marginRight: 6}} />
            <Text style={styles.summaryValue}>{selectedEquipment.name.replace('\n', ' ')}</Text>
          </View>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryCol}>
          <Text style={styles.summaryLabel}>TIPO DE TRABAJO</Text>
          <View style={styles.summaryRow}>
            <MaterialCommunityIcons name={workType === 'preventivo' ? "calendar-check" : "alert-outline"} size={22} color="#0b437a" style={{marginRight: 6}} />
            <View>
              <Text style={styles.summaryValue}>{workType === 'preventivo' ? 'Preventivo / Rutina' : 'Correctivo / Reparación'}</Text>
              <Text style={styles.summaryBadge}>Seleccionado</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.summaryChangeBtn} onPress={() => setStep(2)}>
          <MaterialCommunityIcons name="swap-horizontal" size={18} color="#0056d2" />
          <Text style={styles.summaryChangeText}>Cambiar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.whiteSheet}>
        <View style={styles.stepHeaderIconic}>
          <View style={styles.stepHeaderIconBox}><MaterialCommunityIcons name="file-document-edit-outline" size={32} color="#0b437a" /></View>
          <View>
            <Text style={styles.sheetTitle}>Descripción de la actividad</Text>
            <Text style={styles.sheetSub}>Explica detalladamente lo que realizaste</Text>
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.scrollPadding} showsVerticalScrollIndicator={false}>
          <View style={styles.textAreaWrapper}>
            <TextInput style={styles.textArea} placeholder="Describe las tareas realizadas, ajustes hechos..." placeholderTextColor="#94a3b8" multiline={true} numberOfLines={6} value={description} onChangeText={setDescription} textAlignVertical="top" maxLength={500} />
            <Text style={styles.charCount}>{description.length}/500</Text>
          </View>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => setIsRecording(!isRecording)}>
              <View style={[styles.actionIconBox, { backgroundColor: isRecording ? '#fee2e2' : '#eff6ff' }]}><Ionicons name={isRecording ? "mic-off" : "mic"} size={24} color={isRecording ? "#ef4444" : "#2563eb"} /></View>
              <View><Text style={styles.actionBtnTitle}>{isRecording ? "Detener grabación" : "Dictar con micrófono"}</Text><Text style={styles.actionBtnSub}>{isRecording ? "Grabando..." : "Toca para grabar"}</Text></View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <View style={[styles.actionIconBox, { backgroundColor: '#f1f5f9' }]}><MaterialCommunityIcons name="text-box-plus-outline" size={24} color="#475569" /></View>
              <View style={{ flex: 1 }}><Text style={styles.actionBtnTitle}>Usar plantilla</Text><Text style={styles.actionBtnSub}>Actividades comunes</Text></View>
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
            </TouchableOpacity>
          </View>
          {isRecording && (
            <View style={styles.recordingUI}>
              <View style={styles.recordingBar}>
                <View style={styles.recMicIcon}><Ionicons name="mic" size={20} color="#fff" /></View>
                <Text style={styles.audioBars}>||||||||||||||| | ||||| || |||||||||||</Text>
                <Text style={styles.recTime}>00:12</Text>
                <TouchableOpacity><Ionicons name="trash-outline" size={20} color="#64748b" /></TouchableOpacity>
              </View>
              <View style={styles.recStatus}><View style={styles.recDot} /><Text style={styles.recStatusText}>Grabando... toca para detener</Text></View>
            </View>
          )}
          <View style={styles.templatesHeader}>
            <Text style={styles.templatesTitle}>PLANTILLAS SUGERIDAS</Text>
            <TouchableOpacity><Text style={styles.templatesViewAll}>Ver todas {'>'}</Text></TouchableOpacity>
          </View>
          <View style={styles.templatesGrid}>
            <TouchableOpacity style={styles.templatePill} onPress={() => setDescription(description + " Limpieza general del equipo.")}><MaterialCommunityIcons name="file-document-outline" size={16} color="#0056d2" style={{marginRight: 6}} /><Text style={styles.templatePillText}>Limpieza general del equipo</Text></TouchableOpacity>
            <TouchableOpacity style={styles.templatePill} onPress={() => setDescription(description + " Revisión de componentes.")}><MaterialCommunityIcons name="file-document-outline" size={16} color="#0056d2" style={{marginRight: 6}} /><Text style={styles.templatePillText}>Revisión de componentes</Text></TouchableOpacity>
            <TouchableOpacity style={styles.templatePill} onPress={() => setDescription(description + " Ajuste de bandas y tensión.")}><MaterialCommunityIcons name="file-document-outline" size={16} color="#0056d2" style={{marginRight: 6}} /><Text style={styles.templatePillText}>Ajuste de bandas y tensión</Text></TouchableOpacity>
            <TouchableOpacity style={styles.templatePill} onPress={() => setDescription(description + " Lubricación de partes móviles.")}><MaterialCommunityIcons name="file-document-outline" size={16} color="#0056d2" style={{marginRight: 6}} /><Text style={styles.templatePillText}>Lubricación de partes móviles</Text></TouchableOpacity>
          </View>
        </ScrollView>
        <View style={styles.bottomFooterDouble}>
          <TouchableOpacity style={styles.prevBtn} onPress={() => setStep(2)}>
            <Ionicons name="arrow-back" size={20} color="#0f172a" />
            <Text style={styles.prevBtnText}>Anterior</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextBtnDouble} onPress={() => setStep(4)}>
            <Text style={styles.nextBtnText}>Siguiente</Text>
            <Ionicons name="arrow-forward" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.step3Container}>
      <View style={styles.summaryCard}>
        <View style={styles.summaryCol}>
          <Text style={styles.summaryLabel}>EQUIPO</Text>
          <View style={styles.summaryRow}>
            <MaterialCommunityIcons name={selectedEquipment.icon} size={22} color="#0b437a" style={{marginRight: 6}} />
            <Text style={styles.summaryValue}>{selectedEquipment.name.replace('\n', ' ')}</Text>
          </View>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryCol}>
          <Text style={styles.summaryLabel}>TIPO DE TRABAJO</Text>
          <View style={styles.summaryRow}>
            <MaterialCommunityIcons name={workType === 'preventivo' ? "calendar-check" : "alert-outline"} size={22} color="#0b437a" style={{marginRight: 6}} />
            <View>
              <Text style={styles.summaryValue}>{workType === 'preventivo' ? 'Preventivo / Rutina' : 'Correctivo / Reparación'}</Text>
              <Text style={styles.summaryBadge}>Seleccionado</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.summaryChangeBtn} onPress={() => setStep(2)}>
          <MaterialCommunityIcons name="swap-horizontal" size={18} color="#0056d2" />
          <Text style={styles.summaryChangeText}>Cambiar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.whiteSheet}>
        <View style={styles.stepHeaderIconic}>
          <View style={styles.stepHeaderIconBox}><MaterialCommunityIcons name="package-variant-closed" size={32} color="#0b437a" /></View>
          <View>
            <Text style={styles.sheetTitle}>Piezas / Repuestos (opcional)</Text>
            <Text style={styles.sheetSub}>Agrega los materiales o piezas utilizadas en la actividad</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollPadding} showsVerticalScrollIndicator={false}>
          
          <View style={styles.searchBoxParts}>
            <Ionicons name="search" size={20} color="#7f8fa6" />
            <TextInput style={styles.searchInput} placeholder="Buscar pieza o material..." placeholderTextColor="#94a3b8" value={partSearch} onChangeText={setPartSearch} />
            <TouchableOpacity style={styles.barcodeBtn}><MaterialCommunityIcons name="barcode-scan" size={20} color="#0056d2" /></TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
            {partCategories.map(cat => (
              <TouchableOpacity key={cat} style={[styles.chip, selectedCategory === cat && styles.chipActive]} onPress={() => setSelectedCategory(cat)}>
                <Text style={[styles.chipText, selectedCategory === cat && styles.chipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.partsList}>
            {partsInventory.filter(p => selectedCategory === 'Todos' || p.category === selectedCategory).map(part => {
              const qty = getQty(part.id);
              const inCart = qty > 0;
              const isLowStock = part.stock <= 5;
              
              return (
                <View key={part.id} style={[styles.partItem, inCart && styles.partItemActive]}>
                  <View style={styles.partIconBox}><MaterialCommunityIcons name={part.icon} size={24} color="#0f172a" /></View>
                  <View style={styles.partInfo}>
                    <Text style={styles.partName}>{part.name}</Text>
                    <Text style={styles.partCode}>Código: {part.code}</Text>
                  </View>
                  <View style={styles.partStockBox}>
                    <View style={[styles.stockDot, { backgroundColor: isLowStock ? '#f59e0b' : '#10b981' }]} />
                    <Text style={styles.partStock}>{part.stock} en stock</Text>
                  </View>
                  
                  {inCart ? (
                    <View style={styles.qtyControl}>
                      <TouchableOpacity style={styles.qtyBtn} onPress={() => removePart(part.id)}><Ionicons name="remove" size={16} color="#fff" /></TouchableOpacity>
                      <Text style={styles.qtyText}>{qty}</Text>
                      <TouchableOpacity style={styles.qtyBtn} onPress={() => addPart(part.id)}><Ionicons name="add" size={16} color="#fff" /></TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.addPartBtn} onPress={() => addPart(part.id)}>
                      <Text style={styles.addPartText}>Agregar</Text>
                      <Ionicons name="add-circle" size={18} color="#2563eb" />
                    </TouchableOpacity>
                  )}
                </View>
              )
            })}
            <TouchableOpacity style={styles.viewMoreBtn}>
              <Text style={styles.viewMoreText}>Ver más</Text>
              <Ionicons name="chevron-down" size={16} color="#0056d2" />
            </TouchableOpacity>
          </View>

          {cart.length > 0 && (
            <View style={styles.cartSection}>
              <View style={styles.cartHeader}>
                <Text style={styles.cartTitle}>PIEZAS AGREGADAS</Text>
                <TouchableOpacity style={styles.clearCartBtn} onPress={clearCart}>
                  <Text style={styles.clearCartText}>Limpiar lista</Text>
                  <Ionicons name="trash-outline" size={16} color="#0056d2" />
                </TouchableOpacity>
              </View>
              
              {cart.map(item => {
                const part = partsInventory.find(p => p.id === item.partId);
                return (
                  <View key={item.partId} style={styles.cartItem}>
                    <View style={styles.partIconBox}><MaterialCommunityIcons name={part.icon} size={20} color="#0f172a" /></View>
                    <View style={styles.cartItemInfo}>
                      <Text style={styles.partName}>{part.name}</Text>
                      <Text style={styles.partCode}>Código: {part.code}</Text>
                    </View>
                    <View style={styles.qtyControlCart}>
                      <TouchableOpacity style={styles.qtyBtnOutline} onPress={() => removePart(part.id)}><Ionicons name="remove" size={16} color="#0f172a" /></TouchableOpacity>
                      <Text style={styles.qtyTextCart}>{item.qty}</Text>
                      <TouchableOpacity style={styles.qtyBtnOutline} onPress={() => addPart(part.id)}><Ionicons name="add" size={16} color="#0f172a" /></TouchableOpacity>
                      <TouchableOpacity style={styles.deleteBtnCart} onPress={() => deletePart(part.id)}><Ionicons name="trash-outline" size={18} color="#475569" /></TouchableOpacity>
                    </View>
                  </View>
                )
              })}
            </View>
          )}
        </ScrollView>

        <View style={styles.bottomFooterDouble}>
          <TouchableOpacity style={styles.prevBtn} onPress={() => setStep(3)}>
            <Ionicons name="arrow-back" size={20} color="#0f172a" />
            <Text style={styles.prevBtnText}>Anterior</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveReport}>
            <MaterialCommunityIcons name="content-save-outline" size={20} color="#ffffff" style={{marginRight: 8}} />
            <Text style={styles.nextBtnText}>Guardar Reporte</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.backgroundWrapper}>
        <Image source={require('../../assets/images/fondo_home.png')} style={styles.backgroundImage} resizeMode="cover" />
        <View style={styles.darkOverlay} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.topHeader, { paddingHorizontal: isTablet ? 40 : 20 }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color="#ffffff" /></TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.mainTitle}>Nuevo Reporte</Text>
            <Text style={styles.subTitle}>Paso {step} de 4</Text>
          </View>
          <View style={styles.logoContainer}>
            <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
            <Text style={styles.logoText}>CAMPOTERRA</Text>
            <Text style={styles.logoSubText}>CONGELADORA</Text>
          </View>
        </View>

        <View style={[styles.stepperContainer, { paddingHorizontal: isTablet ? 60 : 30 }]}>
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.stepActive]}>{step > 1 ? <Ionicons name="checkmark" size={18} color="#fff" /> : <Text style={styles.stepTextActive}>1</Text>}</View>
            <Text style={[styles.stepLabel, styles.stepLabelActive]}>Equipo</Text>
          </View>
          <View style={[styles.stepLine, step > 1 && styles.stepLineActive]} />
          
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, step >= 2 && styles.stepActive]}>{step > 2 ? <Ionicons name="checkmark" size={18} color="#fff" /> : <Text style={[styles.stepText, step >= 2 && styles.stepTextActive]}>2</Text>}</View>
            <Text style={[styles.stepLabel, step >= 2 && styles.stepLabelActive]}>Tipo de trabajo</Text>
          </View>
          <View style={[styles.stepLine, step > 2 && styles.stepLineActive]} />
          
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, step >= 3 && styles.stepActive]}>{step > 3 ? <Ionicons name="checkmark" size={18} color="#fff" /> : <Text style={[styles.stepText, step >= 3 && styles.stepTextActive]}>3</Text>}</View>
            <Text style={[styles.stepLabel, step >= 3 && styles.stepLabelActive]}>Descripción</Text>
          </View>
          <View style={[styles.stepLine, step > 3 && styles.stepLineActive]} />
          
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, step >= 4 && styles.stepActive]}>
              <Text style={[styles.stepText, step >= 4 && styles.stepTextActive]}>4</Text>
            </View>
            <Text style={[styles.stepLabel, step >= 4 && styles.stepLabelActive]}>Piezas</Text>
          </View>
        </View>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#0f172a' },
  backgroundWrapper: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  backgroundImage: { width: '100%', height: '100%' },
  darkOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(11, 21, 40, 0.7)' },
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, paddingBottom: 15 },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 10, borderRadius: 12 },
  headerTitles: { alignItems: 'center' },
  mainTitle: { color: '#ffffff', fontSize: 20, fontWeight: '800' },
  subTitle: { color: '#94a3b8', fontSize: 13, marginTop: 2 },
  logoContainer: { alignItems: 'center' },
  logo: { width: 30, height: 30, borderRadius: 15 },
  logoText: { color: '#ffffff', fontSize: 8, fontWeight: '900', marginTop: 4 },
  logoSubText: { color: '#38bdf8', fontSize: 6, fontWeight: '700' },
  stepperContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginVertical: 20 },
  stepItem: { alignItems: 'center', flex: 1 },
  stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  stepActive: { backgroundColor: '#2563eb' },
  stepText: { color: '#94a3b8', fontWeight: '700', fontSize: 14 },
  stepTextActive: { color: '#ffffff', fontWeight: '800', fontSize: 14 },
  stepLabel: { color: '#94a3b8', fontSize: 10, textAlign: 'center', width: 70 },
  stepLabelActive: { color: '#ffffff', fontWeight: '700' },
  stepLine: { flex: 1, height: 2, backgroundColor: 'rgba(255,255,255,0.2)', marginTop: 15, marginHorizontal: -10 },
  stepLineActive: { backgroundColor: '#2563eb' },
  whiteSheet: { flex: 1, backgroundColor: '#f8fafc', borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
  sheetHeader: { padding: 20, borderBottomWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#ffffff' },
  sheetTitleContainer: { marginBottom: 15 },
  sheetLabel: { fontSize: 10, color: '#94a3b8', fontWeight: '800', letterSpacing: 1, marginBottom: 4 },
  sheetTitle: { fontSize: 22, fontWeight: '900', color: '#0f172a' },
  sheetSub: { fontSize: 12, color: '#64748b', marginTop: 2 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 12, paddingHorizontal: 12, height: 45, borderWidth: 1, borderColor: '#e2e8f0' },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#0f172a' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: 15, paddingBottom: 100 },
  gridItem: { width: '31%', backgroundColor: '#ffffff', borderRadius: 12, padding: 12, alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  gridItemActive: { borderColor: '#2563eb', backgroundColor: '#eff6ff', borderWidth: 1.5 },
  gridIcon: { marginBottom: 10 },
  gridText: { fontSize: 11, color: '#475569', textAlign: 'center', fontWeight: '600' },
  gridTextActive: { color: '#0b437a', fontWeight: '800' },
  checkBadge: { position: 'absolute', top: 6, right: 6, backgroundColor: '#2563eb', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  bottomFooterSingle: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#f8fafc', padding: 20, borderTopWidth: 1, borderColor: '#e2e8f0' },
  nextBtn: { backgroundColor: '#0056d2', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, borderRadius: 12 },
  nextBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '800', marginRight: 8 },
  step2Container: { flex: 1 },
  selectedEquipCard: { backgroundColor: '#eff6ff', marginHorizontal: 15, marginBottom: 15, padding: 15, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#bfdbfe' },
  equipCardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  equipCardIconBox: { backgroundColor: '#ffffff', width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  equipCardLabel: { fontSize: 9, fontWeight: '800', color: '#64748b', letterSpacing: 1, marginBottom: 2 },
  equipCardName: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  equipCardArea: { fontSize: 11, color: '#64748b', marginTop: 2 },
  changeEquipBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#bfdbfe' },
  changeEquipText: { color: '#0056d2', fontSize: 12, fontWeight: '700', marginLeft: 4 },
  stepHeaderIconic: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#ffffff', borderBottomWidth: 1, borderColor: '#e2e8f0' },
  stepHeaderIconBox: { backgroundColor: '#eff6ff', padding: 10, borderRadius: 12, marginRight: 15 },
  scrollPadding: { padding: 15, paddingBottom: 100 },
  cardsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  workCard: { flex: 1, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 16, padding: 15, marginRight: 10 },
  workCardActivePrev: { borderColor: '#10b981', backgroundColor: '#f0fdf4', borderWidth: 2 },
  workCardActiveCorr: { borderColor: '#ef4444', backgroundColor: '#fef2f2', borderWidth: 2 },
  cardRadio: { position: 'absolute', top: 10, right: 10, width: 22, height: 22, borderRadius: 11, borderWidth: 1, borderColor: '#cbd5e1', justifyContent: 'center', alignItems: 'center' },
  cardRadioActivePrev: { backgroundColor: '#10b981', borderColor: '#10b981' },
  cardRadioActiveCorr: { backgroundColor: '#ef4444', borderColor: '#ef4444' },
  cardIconBoxPrev: { backgroundColor: '#10b981', width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  cardIconBoxCorr: { backgroundColor: '#fee2e2', width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  cardTitlePrev: { fontSize: 15, fontWeight: '800', color: '#047857', marginBottom: 6 },
  cardTitleCorr: { fontSize: 15, fontWeight: '800', color: '#b91c1c', marginBottom: 6 },
  cardDesc: { fontSize: 11, color: '#64748b', lineHeight: 16, marginBottom: 15 },
  examplesBoxPrev: { backgroundColor: '#d1fae5', padding: 12, borderRadius: 8 },
  examplesTitlePrev: { fontSize: 11, fontWeight: '800', color: '#047857', marginBottom: 6 },
  exampleItemPrev: { fontSize: 10, color: '#065f46', marginBottom: 4 },
  examplesBoxCorr: { backgroundColor: '#fee2e2', padding: 12, borderRadius: 8 },
  examplesTitleCorr: { fontSize: 11, fontWeight: '800', color: '#b91c1c', marginBottom: 6 },
  exampleItemCorr: { fontSize: 10, color: '#991b1b', marginBottom: 4 },
  infoBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eff6ff', padding: 12, borderRadius: 12, marginTop: 20 },
  infoIcon: { backgroundColor: '#3b82f6', width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  infoIconText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12, fontStyle: 'italic' },
  infoText: { flex: 1, fontSize: 11, color: '#1e3a8a' },
  bottomFooterDouble: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#f8fafc', padding: 20, borderTopWidth: 1, borderColor: '#e2e8f0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  prevBtn: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  prevBtnText: { color: '#0f172a', fontSize: 15, fontWeight: '700', marginLeft: 6 },
  nextBtnDouble: { backgroundColor: '#0056d2', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 30, borderRadius: 12 },
  step3Container: { flex: 1 },
  summaryCard: { backgroundColor: '#ffffff', marginHorizontal: 15, marginBottom: 15, padding: 15, borderRadius: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  summaryCol: { flex: 1 },
  summaryLabel: { fontSize: 9, fontWeight: '800', color: '#94a3b8', letterSpacing: 1, marginBottom: 4 },
  summaryRow: { flexDirection: 'row', alignItems: 'center' },
  summaryValue: { fontSize: 13, fontWeight: '800', color: '#0f172a' },
  summaryBadge: { fontSize: 10, color: '#10b981', fontWeight: '700', backgroundColor: '#d1fae5', alignSelf: 'flex-start', paddingHorizontal: 6, borderRadius: 4, marginTop: 2 },
  summaryDivider: { width: 1, height: 40, backgroundColor: '#e2e8f0', marginHorizontal: 10 },
  summaryChangeBtn: { flexDirection: 'row', alignItems: 'center', padding: 8, borderWidth: 1, borderColor: '#bfdbfe', borderRadius: 8, marginLeft: 10 },
  summaryChangeText: { color: '#0056d2', fontSize: 12, fontWeight: '700', marginLeft: 4 },
  textAreaWrapper: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 15, marginBottom: 15 },
  textArea: { fontSize: 15, color: '#0f172a', minHeight: 120 },
  charCount: { alignSelf: 'flex-end', fontSize: 12, color: '#94a3b8', marginTop: 10 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 12, marginRight: 10 },
  actionIconBox: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  actionBtnTitle: { fontSize: 13, fontWeight: '800', color: '#0056d2' },
  actionBtnSub: { fontSize: 11, color: '#64748b' },
  recordingUI: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 16, padding: 15, marginBottom: 20 },
  recordingBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  recMicIcon: { backgroundColor: '#2563eb', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  audioBars: { flex: 1, color: '#3b82f6', fontSize: 14, letterSpacing: 2, textAlign: 'center', opacity: 0.7 },
  recTime: { fontSize: 13, color: '#64748b', fontWeight: '700', marginRight: 12 },
  recStatus: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  recDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981', marginRight: 6 },
  recStatusText: { fontSize: 12, color: '#475569', fontWeight: '600' },
  templatesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  templatesTitle: { fontSize: 11, fontWeight: '800', color: '#94a3b8', letterSpacing: 1 },
  templatesViewAll: { fontSize: 12, color: '#64748b' },
  templatesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  templatePill: { width: '48%', flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 10, marginBottom: 10 },
  templatePillText: { fontSize: 11, color: '#0f172a', flex: 1 },

  // Estilos Paso 4
  searchBoxParts: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 12, paddingHorizontal: 12, height: 48, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 15 },
  barcodeBtn: { padding: 5, borderLeftWidth: 1, borderColor: '#e2e8f0', paddingLeft: 10 },
  chipsScroll: { marginBottom: 15 },
  chip: { backgroundColor: '#f1f5f9', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  chipActive: { backgroundColor: '#0056d2', borderColor: '#0056d2' },
  chipText: { fontSize: 12, color: '#64748b', fontWeight: '600' },
  chipTextActive: { color: '#ffffff' },
  partsList: { backgroundColor: '#ffffff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden', marginBottom: 20 },
  partItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderColor: '#f1f5f9' },
  partItemActive: { backgroundColor: '#eff6ff', borderColor: '#bfdbfe', borderBottomWidth: 1 },
  partIconBox: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  partInfo: { flex: 2 },
  partName: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
  partCode: { fontSize: 10, color: '#64748b', marginTop: 2 },
  partStockBox: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  stockDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  partStock: { fontSize: 11, color: '#64748b' },
  addPartBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  addPartText: { fontSize: 12, color: '#0056d2', fontWeight: '700', marginRight: 4 },
  qtyControl: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2563eb', borderRadius: 20, paddingHorizontal: 4, paddingVertical: 2 },
  qtyBtn: { width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  qtyText: { color: '#ffffff', fontSize: 13, fontWeight: '700', marginHorizontal: 8 },
  viewMoreBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, backgroundColor: '#f8fafc' },
  viewMoreText: { fontSize: 12, color: '#0056d2', fontWeight: '700', marginRight: 4 },
  
  cartSection: { marginBottom: 20 },
  cartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cartTitle: { fontSize: 11, fontWeight: '800', color: '#94a3b8', letterSpacing: 1 },
  clearCartBtn: { flexDirection: 'row', alignItems: 'center' },
  clearCartText: { fontSize: 12, color: '#0056d2', fontWeight: '600', marginRight: 4 },
  cartItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  cartItemInfo: { flex: 1 },
  qtyControlCart: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 4, paddingVertical: 2 },
  qtyBtnOutline: { width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  qtyTextCart: { color: '#0f172a', fontSize: 13, fontWeight: '700', marginHorizontal: 8 },
  deleteBtnCart: { marginLeft: 8, paddingLeft: 8, borderLeftWidth: 1, borderColor: '#e2e8f0', paddingVertical: 2 },
  saveBtn: { backgroundColor: '#0056d2', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 30, borderRadius: 12 }
});