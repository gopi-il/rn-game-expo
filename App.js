import { StatusBar } from 'expo-status-bar';
//import WebView
import { WebView } from 'react-native-webview';
import HTML_FILE from './resources/index.html';
//import React in our code
import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator } from 'react-native';

//import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Button,
  Platform
} from 'react-native';

const initialHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Loading...</title>
</head>
<body>
  <h1>Loading...</h1>
</body>
</html>
`;
const generateSignedCookies = () => {
  // Replace this with your own function that retrieves the signed cookies
  // from your server or API
  const data = {
    CloudFrontPolicy: "",
    CloudFrontKeyPairId: "",
    CloudFrontSignature: ""
  };
  return data;
};

const MyWebViewComponent = () => {
  // const [webViewUrl, setWebViewUrl] = useState('');
  const webViewRef = useRef(null);
  // useEffect(() => {
  //   (async () => {
  //     const remoteHtmlUrl = `https://google.com`;
  //     setWebViewUrl(remoteHtmlUrl);
  //   })();
  // }, []);

  const onWebViewLoad = async () => {
    const signedCookies = await generateSignedCookies();
    const jsCode = setCookieJs(signedCookies);
    webViewRef.current.injectJavaScript(jsCode);
  };
  const setCookiesAndNavigate = async () => {
    // Retrieve the signed cookies using the generateSignedCookies function
    const signedCookies = await generateSignedCookies();

    // Generate the JavaScript code to set the cookies using the setCookieJs function
    const jsCode = setCookieJs(signedCookies);

    // Define the remote HTML URL you want to navigate to after setting the cookies
    // const remoteHtmlUrl = `https://story.infinitylearn.com/1679076164678/story-4334-1/WebGL/index.html`;
    const remoteHtmlUrl = 'https://google.com';

    // Inject the JavaScript code to set the cookies and navigate to the remote URL
    webViewRef.current.injectJavaScript(`${jsCode} window.location.href = '${remoteHtmlUrl}';`);
  };

  const setCookieJs = (signedCookies) => {
    const { CloudFrontPolicy, CloudFrontKeyPairId, CloudFrontSignature } = signedCookies;
    return `
      document.cookie = 'CloudFront-Policy=${CloudFrontPolicy}; path=/';
      document.cookie = 'CloudFront-Key-Pair-Id=${CloudFrontKeyPairId}; path=/';
      document.cookie = 'CloudFront-Signature=${CloudFrontSignature}; path=/';
    `;
  };
  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: initialHtml }}
        startInLoadingState
        renderLoading={() => (
          <ActivityIndicator
            color="blue"
            size="large"
            style={{ flex: 1, justifyContent: 'center' }}
          />
        )}
        //onLoadEnd={onWebViewLoad}
        onLoad={setCookiesAndNavigate}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
      />
    </View>
  );

}

export default MyWebViewComponent;