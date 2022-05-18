package eu.gaiax.difs.pcm;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.Settings;

import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class IntentModule extends ReactContextBaseJavaModule {
    IntentModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "IntentModule";
    }

    @RequiresApi(api = Build.VERSION_CODES.R)
    @ReactMethod
    public void sendStorageIntent() {
        if (Environment.isExternalStorageManager()) {
            //todo when permission is granted
        } else {
            //request for the permission
            Intent intent = new Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION);
            Uri uri = Uri.fromParts("package", getCurrentActivity().getPackageName(), null);
            intent.setData(uri);
            getCurrentActivity().startActivity(intent);
        }
    }
}
