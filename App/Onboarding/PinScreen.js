import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { InteractionManager, View } from 'react-native';
import NavigationService from '../../services/NavigationService';
import * as WalletService from '../../services/WalletService';
import MutedText from '../components/MutedText';
import PinKeyboard from '../components/PinKeyboard';
import PinView from '../components/PinView';
import ConstructingWalletScreen from './ConstructingWalletScreen';

export default class PinScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pin: '',
      loading: false
    };
  }

  static get propTypes() {
    return {
      navigation: PropTypes.shape({
        getParam: PropTypes.func.isRequired,
        state: PropTypes.shape({
          params: PropTypes.shape({
            mnemonic: PropTypes.arrayOf(PropTypes.string).isRequired
          }).isRequired
        }).isRequired
      }).isRequired
    };
  }

  render() {
    if (this.state.loading) {
      return <ConstructingWalletScreen />;
    }

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ flex: 1, marginHorizontal: 50 }}>
          <View
            style={{
              flex: 1,
              alignItems: 'flex-end',
              justifyContent: 'flex-end'
            }}
          >
            <MutedText>Provide a PIN to secure your wallet.</MutedText>
          </View>
          <PinView
            value={this.state.pin}
            containerStyle={{
              flex: 3,
              alignItems: 'flex-end',
              marginBottom: 50
            }}
          />
        </View>
        <PinKeyboard
          onChange={value => this.setPin(value)}
          onSubmit={() => this.submit()}
          buttonTitle={'Import'}
        />
      </View>
    );
  }

  async setPin(value) {
    let current = this.state.pin.slice();
    if (current.length > 6) {
      this.setState({ pin: '' });
    } else {
      if (isNaN(value)) {
        if (value === 'back') {
          current = current.slice(0, -1);
        } else {
          current += value;
        }
      } else {
        current += value;
      }

      this.setState({ pin: current });

      if (current.length === 6) {
        this.state.pin = current;
        this.submit();
      }
    }
  }

  submit() {
    if (this.state.pin.length < 6) {
      return;
    }

    this.setState({ loading: true });

    const mnemonic = this.props.navigation.getParam('mnemonic');
    const { pin } = this.state;

    InteractionManager.runAfterInteractions(async () => {
      try {
        await WalletService.importMnemonics(mnemonic.join(' '), pin);
      } catch (err) {
        console.warn(err);
        return;
      } finally {
        this.setState({ loading: false });
      }
    });

    NavigationService.navigate('Initial');
  }
}
