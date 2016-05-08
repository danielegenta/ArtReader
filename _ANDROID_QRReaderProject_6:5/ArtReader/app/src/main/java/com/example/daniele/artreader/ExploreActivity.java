package com.example.daniele.artreader;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.maps.model.LatLng;

import java.util.List;



public class ExploreActivity extends AppCompatActivity implements GoogleApiClient.ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener {

    protected static final String TAG = "ExploreActivity";
    /**
     * Provides the entry point to Google Play services.
     */
    protected GoogleApiClient mGoogleApiClient;

    /**
     * Represents a geographical location.
     */
    protected Location mLastLocation;

    double myLat = -1, myLon = -1;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
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

        //current position


        String permission = "anderoid.permission.ACCESS_COARSE_LOCATION";
        int res = getApplicationContext().checkCallingOrSelfPermission(permission);
        if (res != PackageManager.PERMISSION_GRANTED);
        ActivityCompat.requestPermissions(ExploreActivity.this, new String[]{Manifest.permission.ACCESS_COARSE_LOCATION}, 1);

        buildGoogleApiClient();
        getCurrentPosition();
        loadInfo();
    }


    public void closeExploreActivity(View v) {
        this.finish();
    }

    private void getCurrentPosition()
    {
        myLat = 45.4262;
        myLon = 9.6103;
        if (myLat != -1 && myLon != -1)
        {
            //prendo tutti i musei tramite api e li metto in un vettore di stringhe così composto: nomeMuseo;Indirizzo
            getDistanceUserMuseum();
        }
        else
        {
            //non son riuscito a trovare posizione corrente, metto i musei in ordine alfabetico
        }
    }

    protected synchronized void buildGoogleApiClient() {
        mGoogleApiClient = new GoogleApiClient.Builder(this)
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .addApi(LocationServices.API)
                .build();
    }

    //calcola distanza in km fra due punti
    private  double calculateDiscance(double lat1,  double lon1,double lat2, double lon2)
    {
        //test distanza
        Location locationA = new Location("point A");

        locationA.setLatitude(lat1);
        locationA.setLongitude(lon1);

        Location locationB = new Location("point B");

        locationB.setLatitude(lat2);
        locationB.setLongitude(lon2);

        double distance = locationA.distanceTo(locationB);
        distance /= 1000;
        return distance;
    }

    //dato indirizzo restituisce coordinate
    public LatLng getLocationFromAddress(Context context,String strAddress) {

        Geocoder coder = new Geocoder(context);
        List<Address> address;
        LatLng p1 = null;

        try {
            address = coder.getFromLocationName(strAddress, 5);
            if (address == null) {
                return null;
            }
            Address location = address.get(0);
            location.getLatitude();
            location.getLongitude();

            p1 = new LatLng(location.getLatitude(), location.getLongitude() );

        } catch (Exception ex) {

            ex.printStackTrace();
        }

        return p1;
    }

    private void getDistanceUserMuseum()
    {
        String [] testAdresses = new String[3];
        testAdresses[0] = "Louvre;rue de Rivoli, 75001 Paris";
        testAdresses[1] = "Van Gogh Museum;Museumplein 6, 1071 DJ Amsterdam";
        testAdresses[2] = "Tate Modern; Bankside, London SE1 9TG";

        String [] vectNameDistanceMuseum = new String[testAdresses.length];
        for (int i = 0; i < testAdresses.length; i++)
        {
            String [] aux = testAdresses[i].split(";");

            String nameMuseum = aux[0];
            String addressMuseum = aux[1];

            LatLng coordinatesMuseum = getLocationFromAddress(getApplicationContext(), addressMuseum);
            double distance = calculateDiscance(myLat, myLon, coordinatesMuseum.latitude, coordinatesMuseum.longitude);
            vectNameDistanceMuseum[i] = nameMuseum + ";" + distance;
        }
        sortVectDistance(vectNameDistanceMuseum);
    }


    //order the vector by distance user-museum
    private void sortVectDistance(String [] vResults)
    {
        for (int i = 0; i < vResults.length - 1; i++)
        {
            for (int j = i + 1; j < vResults.length; j++)
            {
                String auxVect1[] = vResults[i].split(";");
                String auxVect2[] = vResults[j].split(";");

                double distance1 = Double.parseDouble(auxVect1[1]);
                double  distance2 = Double.parseDouble(auxVect2[1]);

                String tmp;
                if (distance1 > distance2)
                {
                    tmp = vResults[i];
                    vResults[i] = vResults[j];
                    vResults[j] = tmp;
                }

            }
        }

        loadInfo();
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
    public void openMapExplore(View v) {
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

    public void openTelephoneExplore(View v) {
        switch (v.getId()) {
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

    private void startTelephone(int sender) {
        String fakePhone = "";
        if (sender == 1) {
            fakePhone = "111-333-222-4";
        }

        String uri = "tel:" + fakePhone.trim();
        Intent intent = new Intent(Intent.ACTION_DIAL);
        intent.setData(Uri.parse(uri));
        startActivity(intent);
    }

    public void openWebsiteExplore(View v) {
        switch (v.getId()) {
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

    private void startWebsite(int sender) {
        String fakeWebsite = "";
        if (sender == 1) {
            //http obbligatorio!!!!!!!!!
            fakeWebsite = "http://www.google.it";
            if (!fakeWebsite.startsWith("http://") && !fakeWebsite.startsWith("https://"))
                fakeWebsite = "http://" + fakeWebsite;
        }

        Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(fakeWebsite));
        startActivity(browserIntent);
    }

    @Override
    public void onConnected(Bundle bundle) {
        // Provides a simple way of getting a device's location and is well suited for
        // applications that do not require a fine-grained location and that do not need location
        // updates. Gets the best and most recent location currently available, which may be null
        // in rare cases when a location is not available.
        String permission = "anderoid.permission.ACCESS_COARSE_LOCATION";
        int res = getApplicationContext().checkCallingOrSelfPermission(permission);
        if (res == PackageManager.PERMISSION_GRANTED);
            mLastLocation = LocationServices.FusedLocationApi.getLastLocation(mGoogleApiClient);
        if (mLastLocation != null)
        {
                   myLat =  mLastLocation.getLatitude();
                   myLon =  mLastLocation.getLongitude();
        }
        else
        {
            Toast.makeText(this, "no location detected", Toast.LENGTH_LONG).show();
        }
    }

    @Override
    public void onConnectionSuspended(int i) {
// The connection to Google Play services was lost for some reason. We call connect() to
        // attempt to re-establish the connection.
        Log.i(TAG, "Connection suspended");
        mGoogleApiClient.connect();
    }

    @Override
    public void onConnectionFailed(ConnectionResult connectionResult) {
        // Refer to the javadoc for ConnectionResult to see what error codes might be returned in
        // onConnectionFailed.;
        Log.i(TAG, "Connection failed: ConnectionResult.getErrorCode() = ");//+ result.getErrorCode());
    }

    @Override
    protected void onStart()
    {
        super.onStart();
        mGoogleApiClient.connect();
    }

    @Override
    protected void onStop()
    {
        super.onStop();
        if (mGoogleApiClient.isConnected()) {
            mGoogleApiClient.disconnect();
        }
    }
}