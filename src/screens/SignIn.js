import React, { useState, useEffect } from 'react';
import type { Node } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {
  ImageBackground, 
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Alert
} from 'react-native';
import 'firebase/compat/auth';
import { useSelector, useDispatch } from 'react-redux';
import { setDetails, setToken, setJWT } from '../redux/actions/useractions';
// import {signIn} from './API/firebaseMethods';

// export default function SignIn() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const { details, token, jwt } = useSelector(state => state.userReducer);
//   const dispatch = useDispatch();

//   const handlePress = () => {
//     if (!email) {
//       Alert.alert('Email field is required.');
//     }

//     if (!password) {
//       Alert.alert('Password field is required.');
//     }

//     // signIn(email, password);
//     setEmail('');
//     setPassword('');
//   };

//   return (
//     <View >
//       <Text >Sign in to your account:</Text>

//     </View>
//   );
// }
const SignIn: () => Node = ({navigation}) => {
  const { details, token, jwt } = useSelector(state => state.userReducer);
  const dispatch = useDispatch();

   GoogleSignin.configure({
     webClientId: '1040528052761-t3f42v2jiccs82j283v62grsvc1l7hg3.apps.googleusercontent.com',
   });
   
   const signInWithGoogleAsync = async () => {
     // Get the users ID token
   const { idToken } = await GoogleSignin.signIn();
 
   // Create a Google credential with the token
   const googleCredential = auth.GoogleAuthProvider.credential(idToken);
 
   // Sign-in the user with the credential
   const user_sign_in = auth().signInWithCredential(googleCredential);
    
   user_sign_in.then((user)=>{
    const data = {
      name: user.additionalUserInfo.profile.name,
      email: user.additionalUserInfo.profile.email,
      firebase_token: idToken
    }
    if (idToken){
      const apiUrl = 'https://58ed-203-145-168-10.ngrok.io/';
      const SignUp = async() =>{
       
      
        try{
          const response = await fetch(`${apiUrl}/api/sign-up`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(data)
          });
       
          const result = await response.json();
          const jwt = result.data.token;
          dispatch(setJWT(jwt));
          console.log(jwt);
          }
          catch(err) {
            throw err;
            console.log(err);
          }
         
      };

      SignUp()
    }  
     const userProfile = user.additionalUserInfo.profile;
     dispatch(setDetails(userProfile));
     dispatch(setToken(idToken));
    navigation.navigate('Dashboard');

   }).catch((error)=>{
     console.log("sdgsdg",error)
  })
   }


   return (
    <ImageBackground
    style={{height:800,flex:1,justifyContent:'center',alignItems:'center'}}
    source={require('../../assets/background.jpg')}>
    <TouchableOpacity onPress={() => navigation.navigate('Sign In')}>
    <Button
         title="Sign In With 
         Google"  
         onPress={signInWithGoogleAsync}    
       />
    </TouchableOpacity>
    </ImageBackground>
     
   );
 };
 
 
 export default SignIn;