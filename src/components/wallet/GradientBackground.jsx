import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient as SvgGradient, Stop, Rect } from 'react-native-svg';
import { styles } from './styles';

const GradientBackground = () => (
  <View style={styles.gradientContainer}>
    <Svg
      height="100%"
      width="100%"
      style={StyleSheet.absoluteFillObject}
    >
      <Defs>
        <SvgGradient
          id="grad"
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <Stop
            offset="0%"
            stopColor="#010923"
          />
          <Stop
            offset="50%"
            stopColor="#1B2F6D"
          />
          <Stop
            offset="100%"
            stopColor="#010923"
          />
        </SvgGradient>
      </Defs>
      <Rect
        width="100%"
        height="100%"
        fill="url(#grad)"
      />
    </Svg>
  </View>
);

export default React.memo(GradientBackground);
