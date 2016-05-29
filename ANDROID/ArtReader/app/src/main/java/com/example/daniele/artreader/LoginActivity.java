package com.example.daniele.artreader;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

/**
 * A login screen that offers login via email/password.
 */
public class LoginActivity extends AppCompatActivity {

    TextView tUsername;
    TextView tPassword;
    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

    }

    //richiamabile sia da login effettuato con credenziali che da login effettuato come guest
    //salvare nome utente-----
    public void accedi(View v)
    {
        if (v.getId() == findViewById(R.id.lblGuestAccess).getId())
        {
            SharedPreferences myPrefs = getSharedPreferences("Shared1", MODE_PRIVATE);
            SharedPreferences.Editor editor = myPrefs.edit();
            editor.putString("username", "guest");
            editor.commit();
        }
        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
    }

    //Richiesta di login al server Express
    public void richiestaLogin(View v)
    {
        tUsername = (TextView)findViewById(R.id.txtUsernameLogin);
        tPassword = (TextView)findViewById(R.id.txtPasswordLogin);

        InviaRichiestaHttp request = new InviaRichiestaHttp(v, LoginActivity.this)
        {
            @Override
            protected void onPostExecute(String result)
            {
                //login fallito
                if (result.contains("Exception"))
                    Toast.makeText(LoginActivity.this, "Accesso Fallito, controlla le credenziali inserite.", Toast.LENGTH_SHORT).show();
                //login riuscito
                else
                {
                    if (result.compareTo("success") == 0)
                    {
                        //registro chi ha effettuato l'accesso
                        SharedPreferences myPrefs = getSharedPreferences("Shared1", MODE_PRIVATE);
                        SharedPreferences.Editor editor = myPrefs.edit();
                        editor.putString("username", tUsername.getText().toString());
                        editor.commit();
                        accedi(v);
                    }
                }
            }
        };

        request.execute("get", "loginmobile", tUsername.getText()+";"+tPassword.getText());
    }


}

