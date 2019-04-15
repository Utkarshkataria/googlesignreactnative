import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Image,
  AsyncStorage,
  ActivityIndicator
} from "react-native";
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import axios from 'axios';
import QRCode from 'react-native-qrcode';
 var self;

class App extends Component {
  

  constructor(props) {
    super(props)
    this.state = {
      userInfo: '',
      deviceId:'',
      qrcode:'',
      progressbar:false
    }
  
  }


  async componentDidMount() {

    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // google services are available
    } catch (err) {
      console.error('play services are not available');
    }

    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/androidmanagement'], // what API you want to access on behalf of the user, default is email and profile
      webClientId: "371035570742-rqlnfpbnsqrg9jk2ch3oujdnmjje975v.apps.googleusercontent.com", // client ID of type WEB for your server (needed to verify user ID and offline access)
      //offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      //hostedDomain: '', // specifies a hosted domain restriction
      //loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      // forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
      // accountName: '', // [Android] specifies an account name on the device that should be used
      // iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
  }

  render() {
    self = this;
    console.log("info")
    console.log(this.state.userInfo)
    return (
      <View style={styles.container}>

        <GoogleSigninButton
          style={{ width: 200, height: 48, marginTop:40 }}
          size={GoogleSigninButton.Size.Icon}
          color={GoogleSigninButton.Color.Dark}
          onPress={this.signIn}
          disabled={this.state.isSigninInProgress} />

          <TouchableHighlight 
          style={{ width: '50%',height:30,justifyContent:'center',borderWidth:2,borderColor:'black',marginBottom:20,alignItems:'center',marginTop:20 }}
          onPress={this.generateQrcode}
          underlayColor={'transparent'}
          >
            <Text> Generate QrCode </Text>
          </TouchableHighlight>
        {/* <Image
          style={{ width: 250, height: 250 }}
          source={ require('./src/assets/qrcode.png') }
        /> */}
          
        <QRCode
          value={this.state.qrcode}
          size={200}
          bgColor='purple'
          fgColor='white'/>

        {this.state.progressbar?
            <ActivityIndicator size="large" color="#0000ff" />:null}

        <TouchableHighlight style={{ width: '50%',height:30,justifyContent:'center',borderWidth:2,borderColor:'black',marginBottom:20,alignItems:'center',marginTop:40 }}
         onPress={this.addPsp}
         underlayColor={'transparent'}
        >
          <Text> run Psp </Text>
        </TouchableHighlight>

        {/* <TouchableHighlight style={{ width: '50%',height:30,justifyContent:'center',borderWidth:2,borderColor:'black',marginBottom:20,alignItems:'center' }}
         onPress={this.removePsp}
         underlayColor={'transparent'}
        >
          <Text> Remove Psp </Text>
        </TouchableHighlight> */}

        <TouchableHighlight style={{ width: '50%',height:30,justifyContent:'center',borderWidth:2,borderColor:'black',marginBottom:20,alignItems:'center' }}
         onPress={this.addDs}
         underlayColor={'transparent'}
        >
          <Text> run DS </Text>
        </TouchableHighlight>

        {/* <TouchableHighlight style={{ width: '50%',height:30,justifyContent:'center',borderWidth:2,borderColor:'black',marginBottom:20,alignItems:'center' }}
         onPress={this.removeDs}
         underlayColor={'transparent'}
        >
          <Text> Remove Ds </Text>
        </TouchableHighlight> */}

        <TouchableHighlight  style={{width:'50%',borderWidth:2,borderColor:'black',alignItems:'center',height:30,justifyContent:'center',marginBottom:20}}
                onPress={this.getDeviceId}
         underlayColor={'transparent'}
        >
          <Text>get Device Id</Text>
        </TouchableHighlight>

        <TouchableHighlight style={{width:'50%',borderWidth:2,borderColor:'black',alignItems:'center',height:30,justifyContent:'center'}}
                onPress={this.resetDevice}
         underlayColor={'transparent'}
        >
          <Text> delete and wipe Device </Text>
        </TouchableHighlight>

        

      </View>
    );
  }


  // _signIn(){
  //   console.log("working")
  signIn = async () => {
    console.log("dobne")
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({ userInfo });     
  
       AsyncStorage.setItem('accessToken',userInfo.accessToken) 
       //alert(accessToken)

      


    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("cancelled")
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("inProgress")
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log("PlayServices not availabe")
      } else {
        // some other error happened
        console.log("some other error")
        console.log(error)
      }
    }
  };
  // }

  getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      this.setState({ userInfo });
   //   console.log("acces token check")
      console.log(userInfo.accessToken)
      
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        // user has not signed in yet
        console.log("not signed yet")
      } else {
        // some other error
      }
    }
  };

  addPsp = async () => {
    this.setState({progressbar:true})
    var accessToken;
    try{
       accessToken = await AsyncStorage.getItem('accessToken') 
      //Alert.alert(useremail)
      console.log("accessToken=======")
      console.log(accessToken)
  }
  catch(error )
  {
      alert(error)
  }
  const params = {
    "name": "enterprises/LC00pquvmu/policies/policy1",
    "version": 6,
    "applications": [
     
      {
        "packageName": "com.survey.psp",
        "installType": "FORCE_INSTALLED"
      }
    ],

  // "systemUpdate": { "type": "WINDOWED", "startMinutes": 120, "endMinutes": 240 }, "addUserDisabled": true, "mountPhysicalMediaDisabled": true, "keyguardDisabled": true, "bluetoothContactSharingDisabled": true, "networkResetDisabled": true, "outgoingBeamDisabled": true, "removeUserDisabled": true, "unmuteMicrophoneDisabled": true, "locationMode": "HIGH_ACCURACY", "complianceRules": [ { "nonComplianceDetailCondition": { "settingName": "persistentPreferredActivities" }, "disableApps": true } ], "installUnknownSourcesAllowed": true, "debuggingFeaturesAllowed": true,  "funDisabled": true,
   "autoTimeRequired": true,
   "appAutoUpdatePolicy": "ALWAYS",
   "kioskCustomLauncherEnabled": true,
    "debuggingFeaturesAllowed": false, 
    "statusBarDisabled" : true
  }
  

  var authOptions = {
    method: 'PATCH',
    url: 'https://androidmanagement.googleapis.com/v1/enterprises/LC00pquvmu/policies/policy1?access_token='+accessToken,
    data: params,
    status: 200,
    headers: {
       // "Authorization" : sessionStorage.getItem('authHeader'),
        'Content-Type': 'application/json'
    },
    json: true
    };
     
  axios(authOptions)
   .then(response => {
       console.log("policy changed")
     console.log(JSON.stringify(response))
     //console.log('testing')
     this.setState({progressbar:false})
      
     if (response.status == 200) {
      //  alert(response.data.message)
         console.log('response check')
         console.log(response)
      //return response
     } else {
         throw new Error("" + response.data.message);
     }
   })
   .catch(function(error){
            console.log("policy not changed")
     console.log(JSON.stringify(error))
   //  handleError(error)
   this.setState({progressbar:false})
   });

  }

  // removePsp = async () => {
  //   var accessToken;
  //   try{
  //      accessToken = await AsyncStorage.getItem('accessToken') 
  //     //Alert.alert(useremail)
  //     console.log("accessToken=======")
  //     console.log(accessToken)
  // }
  // catch(error )
  // {
  //     alert(error)
  // }
  // const params = {
  //   "name": "enterprises/LC00pquvmu/policies/policy1",
  //   "version": 6,
  //   "applications": [
  //     {
  //       "packageName": "com.android.chrome",
  //       "installType": "FORCE_INSTALLED"
  //     }
  //   ],
  //   "debuggingFeaturesAllowed": true
  // }
  

  // var authOptions = {
  //   method: 'PATCH',
  //   url: 'https://androidmanagement.googleapis.com/v1/enterprises/LC00pquvmu/policies/policy1?access_token='+accessToken,
  //   data: params,
  //   status: 200,
  //   headers: {
  //      // "Authorization" : sessionStorage.getItem('authHeader'),
  //       'Content-Type': 'application/json'
  //   },
  //   json: true
  //   };
     
  // axios(authOptions)
  //  .then(response => {
  //      console.log("policy changed")
  //    console.log(JSON.stringify(response))
  //    //console.log('testing')
      
  //    if (response.status == 200) {
  //     //  alert(response.data.message)
  //        console.log('response check')
  //        console.log(response)
  //     //return response
  //    } else {
  //        throw new Error("" + response.data.message);
  //    }
  //  })
  //  .catch(function(error){
  //           console.log("policy not changed")
  //    console.log(JSON.stringify(error))
  //    handleError(error)
     
  //  });
  // }

  addDs = async () => {
    this.setState({progressbar:true})
    var accessToken;
    try{
       accessToken = await AsyncStorage.getItem('accessToken') 
      //Alert.alert(useremail)
      console.log("accessToken=======")
      console.log(accessToken)
  }
  catch(error )
  {
      alert(error)
  }
  const params = {
    "name": "enterprises/LC00pquvmu/policies/policy1",
    "version": 6,
    "applications": [
     
      {
        "packageName": "com.ds.psp.dsapplicationoffline",
        "installType": "FORCE_INSTALLED"
      }
    ],
  //  "systemUpdate": { "type": "WINDOWED", "startMinutes": 120, "endMinutes": 240 }, "addUserDisabled": true, "mountPhysicalMediaDisabled": true, "keyguardDisabled": true, "bluetoothContactSharingDisabled": true, "networkResetDisabled": true, "outgoingBeamDisabled": true, "removeUserDisabled": true, "unmuteMicrophoneDisabled": true, "locationMode": "HIGH_ACCURACY", "complianceRules": [ { "nonComplianceDetailCondition": { "settingName": "persistentPreferredActivities" }, "disableApps": true } ], "installUnknownSourcesAllowed": true, "debuggingFeaturesAllowed": true,  "funDisabled": true,
  "autoTimeRequired": true,
   "appAutoUpdatePolicy": "ALWAYS",
   "kioskCustomLauncherEnabled": true,
    "debuggingFeaturesAllowed": false, 
    "statusBarDisabled" : true
  }
  

  var authOptions = {
    method: 'PATCH',
    url: 'https://androidmanagement.googleapis.com/v1/enterprises/LC00pquvmu/policies/policy1?access_token='+accessToken,
    data: params,
    status: 200,
    headers: {
       // "Authorization" : sessionStorage.getItem('authHeader'),
        'Content-Type': 'application/json'
    },
    json: true
    };
     
  axios(authOptions)
   .then(response => {
       console.log("policy changed")
     console.log(JSON.stringify(response))
     //console.log('testing')
     this.setState({progressbar:false})
      
     if (response.status == 200) {
      //  alert(response.data.message)
         console.log('response check')
         console.log(response)
      //return response
     } else {
         throw new Error("" + response.data.message);
     }
   })
   .catch(function(error){
            console.log("policy not changed")
     console.log(JSON.stringify(error))
     this.setState({progressbar:false})
   //  handleError(error)
     
   });

  }


  resetDevice = async () => {
    this.setState({progressbar:true})
    var accessToken;
    try{
       accessToken = await AsyncStorage.getItem('accessToken') 
      //Alert.alert(useremail)
      console.log("accessToken=======")
      console.log(accessToken)
  }
  catch(error )
  {
      alert(error)
  }

  

  var authOptions = {
    method: 'DELETE',
    url: `https://androidmanagement.googleapis.com/v1/enterprises/LC00pquvmu/devices/${this.state.deviceId}?access_token=`+accessToken,
   
    status: 200,
    headers: {
       // "Authorization" : sessionStorage.getItem('authHeader'),
        'Content-Type': 'application/json'
    },
    json: true
    };
     
  axios(authOptions)
   .then(response => {
       console.log("policy changed")
     console.log(response)
     this.setState({progressbar:false})
     //console.log('testing')
      
     if (response.status == 200) {
      //  alert(response.data.message)
         console.log('response check')
         console.log(response)
      //return response
     } else {
       self.setState({progressbar:false})
         throw new Error("" + response.data.message);
     }
   })
   .catch(function(error){
    //this.setState({progressbar:false})
            console.log("policy not changed")
     console.log(error)
     handleError(error)
   self.setState({progressbar:false})
     
   });

  }

 
  getDeviceId = async () => {
    this.setState({progressbar:true})
    var accessToken;
    try{
       accessToken = await AsyncStorage.getItem('accessToken') 
      //Alert.alert(useremail)
      console.log("accessToken=======")
      console.log(accessToken)
  }
  catch(error )
  {
      alert(error)
  }
 
  

  var authOptions = {
    method: 'GET',
    url: 'https://androidmanagement.googleapis.com/v1/enterprises/LC00pquvmu/devices?access_token='+accessToken,
   
    status: 200,
    headers: {
       // "Authorization" : sessionStorage.getItem('authHeader'),
        'Content-Type': 'application/json'
    },
    json: true
    };
     
  axios(authOptions)
   .then(response => {
       console.log("policy changed")
     console.log(JSON.stringify(response))
     //console.log('testing')
     this.setState({progressbar:false})
     if (response.status == 200) {
      //  alert(response.data.message)
         console.log('response check')
         console.log(response)
         console.log('device id')
         if(response.data.devices){
         this.setState({deviceId:response.data.devices[0].name.substring(response.data.devices[0].name.lastIndexOf('/') + 1)})
         console.log(response.data.devices[0].name.substring(response.data.devices[0].name.lastIndexOf('/') + 1))
         }
         else{
           alert('No Device active with policy')
         }
         //return response
     } else {
         throw new Error("" + response.data.message);
     }
   })
   .catch(function(error){
            console.log("policy not changed")
     console.log(error)
     this.setState({progressbar:false})
    // handleError(error)
     
   });

  }

  
  generateQrcode = async () => {
    this.setState({progressbar:true})
    var accessToken;
    try{
       accessToken = await AsyncStorage.getItem('accessToken') 
      //Alert.alert(useremail)
      console.log("accessToken=======")
      console.log(accessToken)
  }
  catch(error )
  {
      alert(error)
  }
  const params = {
    "policyName": "policy1"
  }
  

  var authOptions = {
    method: 'POST',
    url: 'https://androidmanagement.googleapis.com/v1/enterprises/LC00pquvmu/enrollmentTokens?access_token='+accessToken,
    data: params,
    status: 200,
    headers: {
       // "Authorization" : sessionStorage.getItem('authHeader'),
        'Content-Type': 'application/json'
    },
    json: true
    };
     
  axios(authOptions)
   .then(response => {
       console.log("policy changed")
     console.log(JSON.stringify(response))
     //console.log('testing')
     this.setState({progressbar:false})
     if (response.status == 200) {
      //  alert(response.data.message)
         console.log('response check')
         console.log(response)
         console.log("qrcodecheck===")
         console.log(response.data.qrCode)
         if(response.data.qrCode){
        var str = response.data.qrCode.replace("\\","");
        console.log("checknewString")
        console.log(str)
        this.setState({qrcode:str})
         }
         else{
           alert('Qr code Empty')
         }

      //return response
     } else {
         throw new Error("" + response.data.message);
     }
   })
   .catch(function(error){
            console.log("policy not changed")
     console.log(JSON.stringify(error))
    // handleError(error)
   this.setState({progressbar:false})
     
   });

  }


  // removeDs = async () => {
  //   var accessToken;
  //   try{
  //      accessToken = await AsyncStorage.getItem('accessToken') 
  //     //Alert.alert(useremail)
  //     console.log("accessToken=======")
  //     console.log(accessToken)
  // }
  // catch(error )
  // {
  //     alert(error)
  // }
  // const params = {
  //   "name": "enterprises/LC00pquvmu/policies/policy1",
  //   "version": 6,
  //   "applications": [
  //     {
  //       "packageName": "com.android.chrome",
  //       "installType": "FORCE_INSTALLED"
  //     }
  //   ],
  //   "debuggingFeaturesAllowed": true
  // }
  

  // var authOptions = {
  //   method: 'PATCH',
  //   url: 'https://androidmanagement.googleapis.com/v1/enterprises/LC00pquvmu/policies/policy1?access_token='+accessToken,
  //   data: params,
  //   status: 200,
  //   headers: {
  //      // "Authorization" : sessionStorage.getItem('authHeader'),
  //       'Content-Type': 'application/json'
  //   },
  //   json: true
  //   };
     
  // axios(authOptions)
  //  .then(response => {
  //      console.log("policy changed")
  //    console.log(JSON.stringify(response))
  //    //console.log('testing')
      
  //    if (response.status == 200) {
  //     //  alert(response.data.message)
  //        console.log('response check')
  //        console.log(response)
  //     //return response
  //    } else {
  //        throw new Error("" + response.data.message);
  //    }
  //  })
  //  .catch(function(error){
  //           console.log("policy not changed")
  //    console.log(JSON.stringify(error))
  //    handleError(error)
     
  //  });

  // }

  

}
function handleError(error) {
  
  this.setState({
    progressbar:false
  })
  if (error.response) {
      // The request was made, but the server responded with a status code
      // that falls out of the range of 2xx
      console.log('Error DATA', error.response.data);
      console.log('Error STATUS', error.response.status);
      console.log('Error header', error.response.headers);
  } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
  }
  throw error.message
}
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
     alignItems: 'center',
    // justifyContent: 'center'
  }
});