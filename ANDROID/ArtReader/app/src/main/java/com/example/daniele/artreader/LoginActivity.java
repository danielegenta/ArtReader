package com.example.daniele.artreader;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

/**
 * A login screen that offers login via email/password.
 */
public class LoginActivity extends AppCompatActivity {

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
        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
    }

    //Richiesta di login al server Express
    public void richiestaLogin(View v)
    {
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
                        accedi(v);
                }
            }
        };
        TextView tUsername = (TextView)findViewById(R.id.txtUsernameLogin);
        TextView tPassword = (TextView)findViewById(R.id.txtPasswordLogin);
        request.execute("get", "loginmobile", tUsername.getText()+";"+tPassword.getText());
    }


}

