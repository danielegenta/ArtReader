package com.example.daniele.artreader;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Calendar;

public class NewReview extends AppCompatActivity {

    int idArtwork;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_new_review);
        Bundle b = getIntent().getExtras();;
        idArtwork  =  b.getInt("idArtwork");
    }

    public void insertNewMobileReview(View v)
    {
        //recupero dati

        //utente

        TextView tMail = (TextView)findViewById(R.id.txtReviewMail);
        TextView tTelefono = (TextView)findViewById(R.id.txtReviewPhone);
        TextView tTitle = (TextView)findViewById(R.id.txtReviewTitle);
        TextView tReviewDescription = (TextView)findViewById(R.id.txtReviewDescription);

        //recupero data corrente
        Calendar c = Calendar.getInstance();
        SimpleDateFormat df = new SimpleDateFormat("dd-mm-yyyy");
        String dateReview = df.format(c.getTime());

        //dati di test
        String currentUsername="prova";

        if (tTitle.getText().toString().compareTo("") != 0 && tMail.getText().toString().compareTo("") != 0 && tTelefono.getText().toString().compareTo("") != 0 && tReviewDescription.getText().toString().compareTo("") != 0)
        {
            InviaRichiestaHttp request = new InviaRichiestaHttp(v, NewReview.this)
            {
            //chiamata di inserimento in db
            @Override
            protected void onPostExecute(String result) {
            if (result.contains("Exception"))
            {
                Toast.makeText(NewReview.this, result, Toast.LENGTH_SHORT).show();
            }
            else
            {
                Toast.makeText(NewReview.this, "Grazie, Recensione Inviata! E' ora in attesa di approvazione!", Toast.LENGTH_SHORT).show();
                //
                //ti manderemo una mail quando la recensione sarà pubblica!
            }
        }
        };
        String par = "?idArtwork="+idArtwork+"&Type=mobile&Approved=0&Description="+tReviewDescription.getText()+"&Username="+currentUsername+"&Phonenumber="+tTelefono.getText()+"&Email="+tMail.getText()+"&Title="+tTitle.getText()+"&DateReview="+(dateReview);
        request.execute("get", "insertFeedback", par);

            this.finish();
        }
        else
        {
            //dati errati
        }
    }
}
