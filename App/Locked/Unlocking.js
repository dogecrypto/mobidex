import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { colors } from '../../styles';
import BigCenter from '../components/BigCenter';
import Padding from '../components/Padding';

export default class UnlockingScreen extends Component {
  render() {
    return (
      <BigCenter>
        <FontAwesome name="unlock" color={colors.yellow0} size={100} />
        <Padding size={25} />
        <Text>Unlocking Mobidex...</Text>
      </BigCenter>
    );
  }
}
