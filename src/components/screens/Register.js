import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  ImageBackground,
  ScrollView,
  Keyboard,
  StatusBar,
  ActivityIndicator,
  Text,
  TextInput
} from 'react-native';
import { connect } from 'react-redux';
import { Container, Icon } from 'native-base'
import { showMessage } from 'react-native-flash-message';
import Button from './..//shared/Button';
import validateForm from './../../helpers/validation';
import Wrapper from './Wrapper';
import ThemeColors from './../../styles/colors'
import AppConstants from './../../helpers/constants'
import { getRandomColor } from '../../helpers/getRandomColor';
import api from '../../api';
import { getAppConfig } from '../../lib/appConfig';

mapStateToProps = (state) => {
  const { auth } = state;
  return { auth }
}

mapDispatchToProps = (dispatch) => {
  return {
    onSignIn: (user) => { dispatch(signIn(user)) }
  }
}

class Register extends Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    email: '',
    name: '',
    password: '',
    passwordConfirmation: '',
    isLoading: false,
  };

  runValidation = () => {
    const {
      name, email, password, passwordConfirmation,
    } = this.state;

    const fields = [
      {
        value: name,
        verify: [{
          type: 'isPopulated',
          message: 'Please enter your name',
        }],
      },
      {
        value: email,
        verify: [
          {
            type: 'isPopulated',
            message: 'Please enter your email address',
          },
          {
            type: 'isEmail',
            message: 'Please format your email address correctly',
          },
        ],
      },
      {
        value: password,
        verify: [
          {
            type: 'isPopulated',
            message: 'Please enter your password',
          },
          {
            type: 'isMatched',
            matchValue: passwordConfirmation,
            message: 'Password and Confirmation must match',
          },
          {
            type: 'isGreaterThanLength',
            length: 5,
            message: 'Password must be at least six characters',
          },
        ],
      },
      {
        value: passwordConfirmation,
        verify: [{
          type: 'isPopulated',
          message: 'Please confirm your password',
        }],
      },
    ];

    const errorMessage = validateForm(fields);
    if (errorMessage) {
      showMessage({
        message: 'Check your form',
        description: errorMessage,
        type: 'danger',
      });

      return false;
    }

    return true;
  }

  onSubmitRegistration = async () => {
    const { email, password, name } = this.state;
    const isFormValid = this.runValidation();
    if (!isFormValid) {
      return;
    }
    this.setState({ isLoading: true });
    api.registerNewUser({ name, email, password }).then((res) => {
      if (res.status) {
        this.setState({ isLoading: false })
        showMessage({
          message: 'Check your form',
          description: res.message,
          type: 'success',
        });
      }
      else {
        this.setState({ isLoading: false })
        showMessage({
          message: 'Check your form',
          description: res.message,
          type: 'danger',
        });
      }
    })
      .catch(error => {
        this.setState({ isLoading: false })
        showMessage({
          message: 'Check your form',
          description: `(${error.code})\n${error.message}`,
          type: 'danger',
        });
      })

  }
  render() {
    const styles = createStyles();
    return (
      <Wrapper isLoading={this.state.isLoading} contentContainerStyle={styles.container}>
        {/* {this.state.isLoading && <ActivityIndicator size={"large"} />} */}
        <View style={{ width: '100%', paddingHorizontal: 30 }}>
          <Text style={styles.pageHeading}>REGISTER</Text>
        </View>
        <View style={[styles.textInputContainer]}>
          <Icon style={styles.icon} name='ios-person' />
          <TextInput
            style={styles.textinput}
            value={this.state.name}
            onChangeText={name => this.setState({ name })}
            placeholder="Name"
            placeholderTextColor={getAppConfig().appPrimaryColor}
            blurOnSubmit={false}
            ref={(input) => { this.nameInput = input; }}
            onSubmitEditing={() => this.emailInput.focus()}
          />
        </View>

        <View style={[styles.textInputContainer]}>
          <Icon style={styles.icon} name='ios-mail' />
          <TextInput
            style={styles.textinput}
            value={this.state.email}
            blurOnSubmit={false}
            placeholderTextColor={getAppConfig().appPrimaryColor}
            onChangeText={email => this.setState({ email })}
            ref={(input) => { this.emailInput = input; }}
            onSubmitEditing={() => this.passwordInput.focus()}
            keyboardType="email-address"
            placeholder="Email Address"
          />

        </View>
        <View style={[styles.textInputContainer]}>
          <Icon style={styles.icon} name='lock' />
          <TextInput
            style={styles.textinput}
            value={this.state.password}
            blurOnSubmit={false}
            onChangeText={password => this.setState({ password })}
            placeholder="Password"
            placeholderTextColor={getAppConfig().appPrimaryColor}
            secureTextEntry
            ref={(input) => { this.passwordInput = input; }}
            onSubmitEditing={() => this.passwordConfirmationInput.focus()}
          />
        </View>
        <View style={[styles.textInputContainer]}>
          <Icon style={styles.icon} name='lock' />
          <TextInput
            style={styles.textinput}
            blurOnSubmit={false}
            placeholderTextColor={getAppConfig().appPrimaryColor}
            value={this.state.passwordConfirmation}
            onChangeText={passwordConfirmation => this.setState({ passwordConfirmation })}
            placeholder="Confirm Password"
            secureTextEntry
            returnKeyType="go"
            ref={(input) => { this.passwordConfirmationInput = input; }}
            onSubmitEditing={() => { Keyboard.dismiss(); this.passwordConfirmationInput.blur() }}
          />
        </View>

        <View style={styles.submitButtonContainer}>
          <Button style={styles.submitButton} textStyle={styles.submitButtonText} onPress={this.onSubmitRegistration}>SUBMIT</Button>
        </View>

        <View style={styles.linksContainer}>
          <Button onPress={() => this.props.navigation.navigate('Login')} textStyle={styles.linksText} style={styles.links} >
            Login
               </Button>
          <Button onPress={() => this.props.navigation.navigate('ResetPassword')} textStyle={styles.linksText} style={styles.links}>
            Reset Password
              </Button>
        </View>
      </Wrapper>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
const createStyles = () => {
  let config = getAppConfig()
  let { appFontFamily, appFontSize, appImageSize, appLanguage, appPrimaryColor, appSecondaryColor } = config
  return StyleSheet.create({
    container: {
      backgroundColor: appSecondaryColor,
      alignItems: 'center',
      justifyContent: 'center'
    },
    ImageBackgroundStyle: {
      width: AppConstants.screenWidth,
      height: AppConstants.screenHeight / 3,
    },
    emptyView: { height: 30 },
    header: {
      backgroundColor: appPrimaryColor,
      width: AppConstants.screenWidth - 30,
      height: AppConstants.screenHeight / 3,
      resizeMode: 'center',
      borderRadius: 60, overflow: 'hidden'
    },
    pageHeading: {
      color: appPrimaryColor, marginTop: 15, fontSize: 25 * appFontSize,
      fontWeight: 'bold',
      fontFamily: appFontFamily,
      textAlign: 'center'
    },
    content: {
      borderRadius: 60, overflow: 'hidden',
      backgroundColor: appSecondaryColor ,
      alignItems: 'center',
      paddingBottom: 50
    },

    textInputContainer: {
      borderWidth: 2,
      borderColor: appPrimaryColor,
      marginTop: 15,
      width: AppConstants.screenWidth - 60,
      height: 60,
      borderBottomRightRadius: 10,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: appSecondaryColor,
      paddingHorizontal: 15
    },
    textinput: {
      flex: 1,
      backgroundColor: 'transparent',
      paddingHorizontal: 5,
      fontSize: 25*appFontSize,
      fontFamily: appFontFamily,
      fontWeight: 'bold',
      color: appPrimaryColor,
    },
    icon: {
      color: appPrimaryColor,
      paddingHorizontal: 10,
      fontSize: 30*appFontSize,
      fontFamily: appFontFamily,
      width: 40
    },
    submitButtonContainer: {
      marginTop: 15,
    },
    submitButtonText: {
      color: appSecondaryColor,
      fontSize: 25*appFontSize,
      fontFamily: appFontFamily,
      fontWeight: 'bold'
    },
    submitButton: {
      width: AppConstants.screenWidth - 60,
      borderRadius: 60,
      height: 40,
      padding: 0,
      justifyContent: 'center',
      backgroundColor: appSecondaryColor
    },
    linksContainer: {
      marginTop: 15
    },
    links: {
      backgroundColor: 'transparent',
      padding: 5
    },
    linksText: {
      color: appPrimaryColor,
    }

  })
}
