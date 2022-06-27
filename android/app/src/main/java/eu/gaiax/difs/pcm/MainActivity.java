package eu.gaiax.difs.pcm;
import android.os.Bundle;
import android.system.ErrnoException;
import android.system.Os;
import java.io.File;

import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    SplashScreen.show(this);
    try {
      Os.setenv("EXTERNAL_STORAGE", getExternalFilesDir(null).getAbsolutePath(), true);
      System.loadLibrary("indy");
    } catch (ErrnoException e) {
      e.printStackTrace();
    }
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "PersonalCredentialManager";
  }
}
