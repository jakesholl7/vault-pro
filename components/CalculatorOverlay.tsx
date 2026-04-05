import React, { useEffect, useState } from 'react';
import { BackHandler, StyleSheet, Text, TouchableOpacity, View, Animated, Dimensions } from 'react-native';
import { useVault } from '../contexts/VaultContext';

const CalculatorOverlay: React.FC = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const { isCalculatorVisible, hideCalculator, unlockWallet, unlockWatchOnly, isUnlocked } = useVault();
  const slideAnim = useState(new Animated.Value(-Dimensions.get('window').height))[0];

  useEffect(() => {
    if (isCalculatorVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -Dimensions.get('window').height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isCalculatorVisible, slideAnim]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isCalculatorVisible) {
        hideCalculator();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [isCalculatorVisible, hideCalculator]);

  const handlePress = (value: string) => {
    if (value === '=') {
      if (expression === '777+123') {
        unlockWallet();
        return;
      }
      if (expression === '000') {
        unlockWatchOnly();
        return;
      }
      try {
        const calcResult = eval(expression);
        setResult(calcResult.toString());
      } catch {
        setResult('Error');
      }
    } else if (value === 'C') {
      setExpression('');
      setResult('');
    } else {
      setExpression(expression + value);
    }
  };

  const handleLongPress = () => {
    unlockWallet();
  };

  if (!isCalculatorVisible) return null;

  const buttons = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '%', '+'],
    ['C', '=']
  ];

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.display}>
          <Text style={styles.expression}>{expression}</Text>
          <Text style={styles.result}>{result}</Text>
        </View>
        <View style={styles.buttons}>
          {buttons.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((btn) => (
                <TouchableOpacity
                  key={btn}
                  style={styles.button}
                  onPress={() => handlePress(btn)}
                  onLongPress={btn === '%' ? handleLongPress : undefined}
                  delayLongPress={3000}
                >
                  <Text style={styles.buttonText}>{btn}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
        {isUnlocked && (
          <TouchableOpacity style={styles.closeButton} onPress={hideCalculator}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    backgroundColor: '#000',
    width: '90%',
    maxWidth: 300,
    borderRadius: 10,
    padding: 20,
  },
  display: {
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  expression: {
    fontSize: 18,
    color: '#fff',
  },
  result: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#333',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    margin: 5,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CalculatorOverlay;