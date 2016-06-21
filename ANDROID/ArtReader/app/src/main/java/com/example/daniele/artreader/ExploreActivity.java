package com.example.daniele.artreader;

import android.content.Context;
import android.content.Intent;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.net.Uri;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.maps.model.LatLng;
import com.squareup.picasso.Picasso;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

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
    boolean positionAcquired = false;
    String retVal = "";

    String auxHistory, auxFavourites;
    Boolean privateSession;

    //da cambiare ogni volta (come invia richiesta http)
    String myIp = "http://192.168.1.101:8080/";

    /**
     * DOCUMENTAZIONE RAPIDA
     *
     * -Ogni opera ha associato ID come tag (per andare a vedere dettagli)
     * -Ogni museo ha associato ID MUSEO come tag (eventuale schermata museo)
     * -I numeri di telefono, siti web e indirizzi per mappa sono globali
     *
     * **/

    String nomeMuseo1 ="",nomeMuseo2 ="", nomeMuseo3 ="";
    String telefonoMuseo1 ="",telefonoMuseo2 ="", telefonoMuseo3 ="";
    String indirizzoMuseo1 ="",indirizzoMuseo2 ="", indirizzoMuseo3 ="";
    String sitoMuseo1 ="",sitoMuseo2 ="", sitoMuseo3 ="";

    String vectMuseums [];


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

        Bundle b = getIntent().getExtras();
        auxHistory=  b.getString("jsonHistory");
        auxFavourites  =  b.getString("jsonFavourites");
        privateSession = b.getBoolean("privateSession");

        //current position
        buildGoogleApiClient();
        getCurrentPosition();

    }


    public void closeExploreActivity(View v)
    {
        this.finish();
    }

    private void getCurrentPosition()
    {


        if (myLat != -1 && myLon != -1)
        {
            positionAcquired = true;
            getMuseumsInfo();
        }
        else
        {
            positionAcquired = false;
            myLon = 45.04; myLat = 7.42;
            getMuseumsInfo();

            //non son riuscito a trovare posizione corrente, metto i musei in ordine alfabetico
        }
    }

    private void getMuseumsInfo()
    {
        View v = findViewById(android.R.id.content);
        retVal = "nok";
        InviaRichiestaHttp request = new InviaRichiestaHttp(v, ExploreActivity.this)
        {
            @Override
            protected void onPostExecute(String result) {
                if (result.contains("Exception"))
                    Toast.makeText(ExploreActivity.this, result, Toast.LENGTH_SHORT).show();
                else
                {
                    retVal = String.valueOf(result);
                    //prendo tutti i musei tramite api e li metto in un vettore di stringhe così composto: nomeMuseo;Indirizzo
                    try
                    {
                        JSONArray jsonArray = new JSONArray(retVal);
                        vectMuseums = new String[jsonArray.length()];
                        JSONObject obj = null; int i = 0;
                        for (i = 0; i < jsonArray.length(); i++)
                        {
                            obj = jsonArray.getJSONObject(i);
                            vectMuseums[i] = obj.optString("name");
                            vectMuseums[i] += ";" + obj.optString("address");
                            vectMuseums[i] += ";" + obj.optString("id");
                            vectMuseums[i] += ";" + obj.optString("pictureUrl");
                            vectMuseums[i] += ";" + obj.optString("telephone");
                            vectMuseums[i] += ";" + obj.optString("website");
                        }
                        getDistanceUserMuseum();
                    }
                    catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
        };

        String par= null;
        request.execute("get", "getLocations", par);
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
        distance /= 10000;
        return Math.round(distance);
    }

    //dato indirizzo restituisce coordinate
    public LatLng getLocationFromAddress(Context context,String strAddress) {

        Geocoder coder = new Geocoder(context);
        List<Address> address;
        LatLng p1 = null;

        try {
            address = coder.getFromLocationName(strAddress, 5);
            if (address == null)
            {
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
        //chiamata per avere tutti i musei (prendo nome ed indirizzo)


        String [] vectNameDistanceMuseum = new String[vectMuseums.length];
        for (int i = 0; i < vectMuseums.length; i++)
        {
            String [] aux = vectMuseums[i].split(";");

            String nameMuseum = aux[0];
            String addressMuseum = aux[1];
            String idMuseum = aux[2];
            String imgMuseum = aux[3];
            String telephoneMuseum = aux[4];
            String websiteMuseum = aux[5];

            double distance=0.0;
            LatLng coordinatesMuseum = getLocationFromAddress(getApplicationContext(), addressMuseum);

                distance = calculateDiscance(myLat, myLon, Math.round(coordinatesMuseum.latitude), Math.round(coordinatesMuseum.longitude));
                vectNameDistanceMuseum[i] = nameMuseum + "; " + distance + ";" +addressMuseum+";" + idMuseum + ";" + imgMuseum + ";" + telephoneMuseum + ";"+websiteMuseum;
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
        loadInfo(vResults);
    }



    private void loadInfo(String [] vMuseumsFinal)
    {
        for (int i = 0; i < vMuseumsFinal.length; i++)
        {
            String[] aux = vMuseumsFinal[i].split(";");
            String nameMuseum = aux[0];
            String distanceMuseum = aux[1];
            String addressMuseum = aux[2];
            String idMuseum = aux[3];
            String imgMuseum = aux[4];
            String telephoneMuseum = aux[5];
            String websiteMuseum = aux[6];

            if (i == 0)
            {
                TextView tMuseumName = (TextView)findViewById(R.id.lblFirstAdvice);
                ImageView imageMuseum = (ImageView)findViewById(R.id.imgFirstAdvice);

                tMuseumName.setText(nameMuseum + "-" +  distanceMuseum + "Km");
                Picasso.with(getApplicationContext()).load(myIp +"img/parallax/"+imgMuseum).into(imageMuseum);

                telefonoMuseo1 = telephoneMuseum;
                sitoMuseo1 = websiteMuseum;
                indirizzoMuseo1 = addressMuseum;

                imageMuseum.setTag(idMuseum);
            }
            else if (i == 1)
            {
                TextView tMuseumName = (TextView)findViewById(R.id.lblSecondAdvice);
                ImageView imageMuseum = (ImageView)findViewById(R.id.imgSecondAdvice);

                tMuseumName.setText(nameMuseum + "-" + distanceMuseum+ "Km");
                Picasso.with(getApplicationContext()).load(myIp +"img/parallax/"+imgMuseum).into(imageMuseum);

                telefonoMuseo2 = telephoneMuseum;
                sitoMuseo2 = websiteMuseum;
                indirizzoMuseo2 = addressMuseum;

                imageMuseum.setTag(idMuseum);
            }

            else if (i == 2)
            {
                TextView tMuseumName = (TextView)findViewById(R.id.lblThirdAdvice);
                ImageView imageMuseum = (ImageView)findViewById(R.id.imgThirdAdvice);

                tMuseumName.setText(nameMuseum + "-" + distanceMuseum+ "Km");
                Picasso.with(getApplicationContext()).load(myIp +"img/parallax/"+imgMuseum).into(imageMuseum);

                telefonoMuseo3 = telephoneMuseum;
                sitoMuseo3 = websiteMuseum;
                indirizzoMuseo3 = addressMuseum;

                imageMuseum.setTag(idMuseum);
            }
            //prendo solo i primi 3
            if (i<3)
                getArtworksMuseum(i, idMuseum);
        }
    }

    private void getArtworksMuseum(final int index, String idMuseum)
    {
        retVal = "nok";
        View v = findViewById(android.R.id.content);
        InviaRichiestaHttp request = new InviaRichiestaHttp(v, ExploreActivity.this)
        {
            @Override
            protected void onPostExecute(String result) {
                if (result.contains("Exception"))
                    Toast.makeText(ExploreActivity.this, result, Toast.LENGTH_SHORT).show();
                else
                {
                    retVal = String.valueOf(result);
                    //prendo tutti i musei tramite api e li metto in un vettore di stringhe così composto: nomeMuseo;Indirizzo
                    try
                    {
                        JSONArray jsonArray = new JSONArray(retVal);
                        JSONObject obj = null; int i = 0;
                        for (i = 0; i < jsonArray.length(); i++)
                        {
                            obj = jsonArray.getJSONObject(i);
                            printArtworkExplore(obj, i, index);
                        }
                    }
                    catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
        };

        String par= "?location="+idMuseum;
        request.execute("get", "getArtworksFromLocation", par);
    }

    private void printArtworkExplore(JSONObject obj, int i, int index)
    {
        TextView txt = null; ImageView img = null;
        if (i == 0)
        {
            if (index == 0)
            {
                img = (ImageView) findViewById(R.id.imgArtwork1FirstAdvice);
                txt = (TextView) findViewById(R.id.txtArtwork1FirstAdvice);
            }
            if (index == 1)
            {
                img = (ImageView) findViewById(R.id.imgArtwork1SecondAdvice);
                txt = (TextView) findViewById(R.id.txtArtwork1SecondAdvice);
            }
            if (index == 2)
            {
                img = (ImageView) findViewById(R.id.imgArtwork1ThirdAdvice);
                txt = (TextView) findViewById(R.id.txtArtwork1ThirdAdvice);
            }

        }
        else if (i == 1)
        {
            if (index == 0)
            {
                img = (ImageView) findViewById(R.id.imgArtwork2FirstAdvice);
                txt = (TextView) findViewById(R.id.txtArtwork2FirstAdvice);
            }
            if (index == 1)
            {
                img = (ImageView) findViewById(R.id.imgArtwork2SecondAdvice);
                txt = (TextView) findViewById(R.id.txtArtwork2SecondAdvice);
            }
            if (index == 2)
            {
                img = (ImageView) findViewById(R.id.imgArtwork2ThirdAdvice);
                txt = (TextView) findViewById(R.id.txtArtwork2ThirdAdvice);
            }
        }
        else if (i == 2)
        {
            if (index == 0)
            {
                 img = (ImageView) findViewById(R.id.imgArtwork3FirstAdvice);
                 txt = (TextView) findViewById(R.id.txtArtwork3FirstAdvice);
            }
            if (index == 1)
            {
                img = (ImageView) findViewById(R.id.imgArtwork3SecondAdvice);
                 txt = (TextView) findViewById(R.id.txtArtwork3SecondAdvice);
            }
            if (index == 2)
            {
                 img = (ImageView) findViewById(R.id.imgArtwork3ThirdAdvice);
                 txt = (TextView) findViewById(R.id.txtArtwork3ThirdAdvice);
            }
        }
        else if (i == 3)
        {
            if (index == 0)
            {
                 img = (ImageView) findViewById(R.id.imgArtwork4FirstAdvice);
                 txt = (TextView) findViewById(R.id.txtArtwork4FirstAdvice);
            }
            if (index == 1)
            {
                 img= (ImageView) findViewById(R.id.imgArtwork4SecondAdvice);
                 txt = (TextView) findViewById(R.id.txtArtwork4SecondAdvice);
            }
            if (index == 2)
            {
                 img = (ImageView) findViewById(R.id.imgArtwork4ThirdAdvice);
                 txt = (TextView) findViewById(R.id.txtArtwork4ThirdAdvice);
            }
        }
        else if (i == 4)
        {
            if (index == 0)
            {
                 img= (ImageView) findViewById(R.id.imgArtwork5FirstAdvice);
                 txt = (TextView) findViewById(R.id.txtArtwork5FirstAdvice);
            }
            if (index == 1)
            {
                 img = (ImageView) findViewById(R.id.imgArtwork5SecondAdvice);
                txt = (TextView) findViewById(R.id.txtArtwork5SecondAdvice);
            }
            if (index == 2)
            {
                img = (ImageView) findViewById(R.id.imgArtwork5ThirdAdvice);
                txt = (TextView) findViewById(R.id.txtArtwork5ThirdAdvice);
            }
        }
        img.setVisibility(View.VISIBLE);
        txt.setVisibility(View.VISIBLE);
        txt.setText(obj.optString("title"));
        Picasso.with(getApplicationContext()).load(myIp +"img/immagini/"+ obj.optString("pictureUrl")).into(img);
        img.setTag(obj.optString("id"));
    }

    /*
    * * Gestisco buttons
    * */
    public void openMapExplore(View v) {
        switch (v.getId()) {
            case R.id.btnOpenMapFirstAdvice:
                startMap(1);
                break;
            case R.id.btnOpenMapSecondAdvice:
                startMap(2);
                break;
            case R.id.btnOpenMapThirdAdvice:
                startMap(3);
                break;
        }
    }

    private void startMap(int sender)
    {
        String address = "";
        if (sender == 1)
            address = indirizzoMuseo1;
        else if (sender == 2)
            address = indirizzoMuseo2;
        else if (sender == 3)
            address = indirizzoMuseo3;
        Intent intent = new Intent(this, MapsActivity.class);
        intent.putExtra("address", address);
        startActivity(intent);
    }

    public void openTelephoneExplore(View v)
    {
        switch (v.getId())
        {
            case R.id.btnOpenPhoneFirstAdvice:
                startTelephone(1);
                break;
            case R.id.btnOpenPhoneSecondAdvice:
                startTelephone(2);
                break;
            case R.id.btnOpenPhoneThirdAdvice:
                startTelephone(3);
                break;
        }
    }

    private void startTelephone(int sender) {
        String phoneNumber = "";
        if (sender == 1)
            phoneNumber = telefonoMuseo1;
        else if (sender == 2)
            phoneNumber = telefonoMuseo2;
        else if (sender == 3)
            phoneNumber = telefonoMuseo3;

        String uri = "tel:" + phoneNumber.trim();
        Intent intent = new Intent(Intent.ACTION_DIAL);
        intent.setData(Uri.parse(uri));
        startActivity(intent);
    }

    public void openWebsiteExplore(View v) {
        switch (v.getId())
        {
            case R.id.btnOpenWebsiteFirstAdvice:
                startWebsite(1);
                break;
            case R.id.btnOpenWebsiteSecondAdvice:
                startWebsite(2);
                break;
            case R.id.btnOpenWebsiteThirdAdvice:
                startWebsite(3);
                break;
        }
    }

    private void startWebsite(int sender)
    {
        String website = "";
        if (sender == 1)
            website = sitoMuseo1;
        else if (sender == 2)
            website = sitoMuseo2;
        else if (sender == 3)
            website = sitoMuseo3;


        if (!website.startsWith("http://") && !website.startsWith("https://"))
            website = "http://" + website;

        Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(website));
        startActivity(browserIntent);
    }



    /*
    *** RECUPERO POSIZIONE CORRENTE
     */

    @Override
    public void onConnected(Bundle bundle)
    {
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
    public void onConnectionSuspended(int i)
    {
        Log.i(TAG, "Connection suspended");
        mGoogleApiClient.connect();
    }

    @Override
    public void onConnectionFailed(ConnectionResult connectionResult) {
        Log.i(TAG, "Connection failed: ConnectionResult.getErrorCode() = ");
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


    protected synchronized void buildGoogleApiClient() {
        mGoogleApiClient = new GoogleApiClient.Builder(this)
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .addApi(LocationServices.API)
                .build();
    }

    public void exploreShowArtwork(View v)
    {
        String idArtwork = v.getTag().toString();

        InviaRichiestaHttp request = new InviaRichiestaHttp(v, ExploreActivity.this)
        {
            @Override
            protected void onPostExecute(String result) {
                if (result.contains("Exception"))
                    Toast.makeText(ExploreActivity.this, result, Toast.LENGTH_SHORT).show();
                else
                {

                    Intent intent1 = new Intent(getApplicationContext(), ScrollingActivity.class);
                    intent1.putExtra("jsonArtwork", result);
                    intent1.putExtra("jsonHistory", auxHistory);
                    intent1.putExtra("jsonFavourites", auxFavourites);
                    intent1.putExtra("privateSession", privateSession);
                    startActivity(intent1);
                }
            }
        };
        request.execute("get", "oneArtworkMobile", idArtwork);
    }
}