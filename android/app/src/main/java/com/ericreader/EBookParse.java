package com.ericreader;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import java.util.Map;
import java.util.HashMap;

import android.util.Log;

public class EBookParse extends ReactContextBaseJavaModule {
   EBookParse(ReactApplicationContext context) {
       super(context);
   }

   @Override
  public String getName() {
    return "EBookParse";
  }

  @ReactMethod
  public void parseEBook(String path, Promise promise) {
    try {
      WritableMap book = new WritableNativeMap();
      
      book.putString("author", path);
      book.putString("hash", "1234abcd");
      book.putString("title", "Zingzong II");

      promise.resolve(book);
    } catch (Exception e) {
      promise.reject("Could not parse ebook", e);
    }
  }
}