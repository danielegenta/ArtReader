package com.example.daniele.artreader;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

public class NewReview extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_new_review);
    }

    public void insertNewMobileReview(View v)
    {
        //recupero dati

        //utente

        TextView tMail = (TextView)findViewById(R.id.txtReviewMail);
        TextView tTelefono = (TextView)findViewById(R.id.txtReviewPhone);
        TextView tReviewDescription = (TextView)findViewById(R.id.txtReviewDescription);

        if (tMail.getText().toString().compareTo("") != 0 && tTelefono.getText().toString().compareTo("") != 0 && tReviewDescription.getText().toString().compareTo("") != 0)
        {
            //chiamata di inserimento in db

            //
            //ti manderemo una mail quando la recensione sarà pubblica!
            this.finish();
        }
        else
        {
            //dati errati
        }
    }
}
