package com.example.daniele.artreader;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;

public class ExploreActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_explore);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();
            }
        });

        loadInfo();
    }

    public void closeExploreActivity(View v)
    {
        this.finish();
    }

    private void loadInfo()
    {
        //dati di test museo 1

       //chiamare api per btn (da creare)

        //chiamare api per museo (foto e immagini)

        //chiamare api artworks
    }

    /*
    * * Gestisco buttons
    * */
    public void openMapExplore(View v)
    {
        switch (v.getId()) {
            case R.id.btnOpenMapExplore1:
                startMap(1);
                break;
            case R.id.btnOpenMapExplore2:
                startMap(2);
                break;
            case R.id.btnOpenMapExplore3:
                startMap(3);
                break;
        }
    }

    private void startMap(int sender)
    {
        String fakeAddress = "";
        if (sender == 1)
            fakeAddress = "Via Cavour 3, Castiglione Falletto 12060 Italia";
        Intent intent = new Intent(this, MapsActivity.class);
        intent.putExtra("address", fakeAddress);
        startActivity(intent);
    }

    public void openTelephoneExplore(View v)
    {
        switch (v.getId())
        {
            case R.id.btnOpenTelephoneExplore1:
                startTelephone(1);
                break;
            case R.id.btnOpenTelephoneExplore2:
                startTelephone(2);
                break;
            case R.id.btnOpenTelephoneExplore3:
                startTelephone(3);
                break;
        }
    }

    private void startTelephone(int sender)
    {
        String fakePhone = "";
        if (sender == 1)
        {
            fakePhone = "111-333-222-4";
        }

        String uri = "tel:" + fakePhone.trim();
        Intent intent = new Intent(Intent.ACTION_DIAL);
        intent.setData(Uri.parse(uri));
        startActivity(intent);
    }

    public void openWebsiteExplore(View v)
    {
        switch (v.getId())
        {
            case R.id.btnOpenWebsiteExplore1:
                startWebsite(1);
                break;
            case R.id.btnOpenWebsiteExplore2:
                startWebsite(2);
                break;
            case R.id.btnOpenWebsiteExplore3:
                startWebsite(3);
                break;
        }
    }

    private void startWebsite(int sender)
    {
        String fakeWebsite = "";
        if (sender == 1)
        {
            //http obbligatorio!!!!!!!!!
            fakeWebsite = "http://www.google.it";
            if (!fakeWebsite.startsWith("http://") && !fakeWebsite.startsWith("https://"))
                fakeWebsite = "http://" + fakeWebsite;
        }

        Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(fakeWebsite));
        startActivity(browserIntent);
    }
}
