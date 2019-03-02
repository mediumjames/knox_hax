import React from 'react';
import {
  KeyboardAvoidingView,
  TextInput,
  Button,
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Keyboard
} from 'react-native';
import {
  KeyboardAwareScrollView
} from 'react-native-keyboard-aware-scroll-view';
import { TextField } from 'react-native-material-textfield';
import MapView from 'react-native-maps'
import Amplify, { Auth, API } from 'aws-amplify';

export default class SignIn extends React.Component {

  state = {
    email: '',
    email_error: '',
    password: '',
    password_error: '',
    user: {}
  };

  static navigationOptions = {
    header: null
  }

  onChangeText(key, value) {
    console.log(key);
    this.setState({
      [key]: value,
      [key+'_error']: ''
    })
  }

  checkFull(key) {
    if (this.state[key] == '') {
      this.setState({
        [key+'_error']: 'Oops! You forgot this one'
      })
    }
  }

  async getData() {
    const get_response = await API.get('dynamoAPI', '/items/' + this.state.email);
    return get_response;
  }

  render() {
    return (
        <KeyboardAwareScrollView enableOnAndroid={true}
         enableAutoAutomaticScroll={(Platform.OS === 'ios')}
         style={styles.container}>
            <View style={styles.logoContainer}>
              <Text style={styles.title}>Got Pot Holes?</Text>
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={styles.btnSignIn}
                onPress={this.checkFull.bind(this)}>
                <Text style={styles.btnText}>Report Pothole</Text>
              </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    alignItems: 'center',
    flexGrow: 1,
    marginTop: 50
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    color: '#58595B',
    fontWeight: 'bold',
    width: '80%',
    textAlign: 'center',
    fontSize: 24
  },
  form: {
    padding: 20,
    flexGrow: 1
  },
  btnSignIn: {
    alignItems: 'center',
    backgroundColor: '#58595B',
    width: '50%',
    borderRadius: 20,
    padding: 10,
    marginTop: 20,
  },
  btnSignUp: {
    alignItems: 'center',
    backgroundColor: '#58595B',
    width: '50%',
    borderRadius: 20,
    padding: 10,
    marginTop: 20,
  },
  btnText: {
    textAlign: 'center',
    color: '#FFF',
    fontWeight: 'bold',
  },
  btnContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  signUpText: {
    marginTop: 50,
    fontSize: 18,
  },
  input: {
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: '#FF8200',
    margin: 10
  },
  inputText: {
    paddingLeft: 12,
  },
  inputContainer: {
    paddingLeft: 12,
    backgroundColor: '#F6F6F6',
  },
  fieldContainer: {
    marginBottom: 20
  }
});