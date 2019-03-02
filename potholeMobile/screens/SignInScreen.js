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


import Amplify, { Auth, API } from 'aws-amplify';

Amplify.configure({
    Auth: {    
        // REQUIRED - Amazon Cognito Region
        region: 'us-east-1',

        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: 'us-east-1_gVed8QVmM',

        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: '3dnk76pdsi401oq6807ge17scb',

        // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
        mandatorySignIn: false,

        // OPTIONAL - Configuration for cookie storage
        // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
        cookieStorage: {
        // REQUIRED - Cookie domain (only required if cookieStorage is provided)
            domain: '.yourdomain.com',
        // OPTIONAL - Cookie path
            path: '/',
        // OPTIONAL - Cookie expiration in days
            expires: 365,
        // OPTIONAL - Cookie secure flag
        // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
            secure: true
        },
    }
});

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

  signIn() {
    let form_data = {};
    const { email, password } = this.state;
    Auth.signIn(email, password)
    .then(user => {
      this.setState({ user })
      this.getData()
      .then((rv) => {
        result = rv[0];
        form_data = result.form_data;
        if (Object.keys(form_data).length !== 0) {
          console.log('successful PROF sign in!');
          this.props.navigation.navigate('Profile', { data: user });
        }
        else {
          console.log('successful HOME sign in!');
          this.props.navigation.navigate('Profile', {data: user});
        }
      })
      .catch((err) => console.log('err'));
    })
    .catch(err => {
      console.log('error signing in: ', err)
      if (err.code == 'UserNotFoundException') {
        this.setState({
          ['email_error']: 'No user with that email',
          ['email']: ''
        })
      }
      if (err.code == 'NotAuthorizedException') {
        this.setState({
          ['password_error']: 'Password and email do not match',
          ['password']: ''
        })
      }
      if (err.code == 'UserNotConfirmedException') {
        console.log('Redirected to verification!');
        this.props.navigation.navigate('Verify');
      }
    })
  }

  guestSignIn() {
    let form_data = {};
    const { email, password } = this.state;
    Auth.signIn('guest_user', '123$%^qW')
    .then(user => {
      this.setState({ user })
      this.getData()
      .then((rv) => {
        result = rv[0];
        form_data = result.form_data;
        if (Object.keys(form_data).length !== 0) {
          console.log('successful PROF sign in!');
          this.props.navigation.navigate('Profile', { data: user });
        }
        else {
          console.log('successful HOME sign in!');
          this.props.navigation.navigate('Profile', {data: user});
        }
      })
      .catch((err) => console.log('err'));
    })
    .catch(err => {
      console.log('error signing in: ', err)
      if (err.code == 'UserNotFoundException') {
        this.setState({
          ['email_error']: 'No user with that username',
          ['email']: ''
        })
      }
      if (err.code == 'NotAuthorizedException') {
        this.setState({
          ['password_error']: 'Password and username do not match',
          ['password']: ''
        })
      }
      if (err.code == 'UserNotConfirmedException') {
        console.log('Redirected to verification!');
        this.props.navigation.navigate('Verify');
      }
    })
  }

  render() {
    return (
        <KeyboardAwareScrollView enableOnAndroid={true}
         enableAutoAutomaticScroll={(Platform.OS === 'ios')}
         style={styles.container}>
            <View style={styles.logoContainer}>
              <Text style={styles.title}>Got Pot Holes?</Text>
            </View>
            <KeyboardAvoidingView style={styles.form} behavior="padding" enabled>
              <TextField
                inputContainerStyle={styles.inputContainer}
                containerStyle={styles.fieldContainer}
                labelTextStyle={styles.inputText}
                titleTextStyle={styles.inputText}
                affixTextStyle={styles.inputText}
                onChangeText={value => this.onChangeText('email', value)}
                label='Username'
                value={this.state.email}
                error={this.state.email_error}
                /*style={styles.input}*/
                secureTextEntry={false}
                blurOnSubmit={false}
                underlineColorAndroid='transparent'
                tintColor='#FF8200'
                keyboardAppearance='dark'
                /*placeholder='password'*/
                returnKeyType='next'
                onSubmitEditing={() => {
                  this.passwordInput.focus()
                  this.checkFull('email')
                }}
              />
              <TextField
                inputContainerStyle={styles.inputContainer}
                labelTextStyle={styles.inputText}
                titleTextStyle={styles.inputText}
                affixTextStyle={styles.inputText}
                onChangeText={value => this.onChangeText('password', value)}
                label='Password'
                value={this.state.password}
                error={this.state.password_error}
                title='At least one lower, upper, and symbol'
                /*style={styles.input}*/
                secureTextEntry={true}
                blurOnSubmit={false}
                tintColor='#FF8200'
                underlineColorAndroid='transparent'
                keyboardAppearance='dark'
                /*placeholder='password'*/
                returnKeyType='next'
                onSubmitEditing={() => {
                  Keyboard.dismiss()
                  this.checkFull('password')
                }}
                ref={(input) => this.passwordInput = input}
              />
            </KeyboardAvoidingView>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={styles.btnSignIn}
                onPress={this.signIn.bind(this)}>
                <Text style={styles.btnText}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={styles.btnSignIn}
                  onPress={this.guestSignIn.bind(this)}>
                  <Text style={styles.btnText}>Guest Sign In</Text>
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